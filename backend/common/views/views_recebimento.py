import json
from datetime import datetime

from django.db import transaction

from common import helpers, models
from common.enums import RecebimentoEnum, RecebimentoItemEnum
from common.exceptions import Conflict
from common.models import Evento, Recebimento, Sequenciaetiqueta
from common.serializers import RecebimentoConferenciaSerializer
from drf_spectacular.utils import extend_schema
from rest_framework import status, viewsets
from rest_framework.exceptions import APIException, NotFound, ValidationError
from rest_framework.response import Response


def create_response_data(
    results, paginator, request
):  # pylint: disable=unused-argument
    return {
        "status": "success",
        "data": results,
        "meta": {
            "currentPage": request.query_params.get("page", 1),
            "totalItems": 0,
            "itemsPerPage": 0,
            "totalPages": 0,
        },
    }


class ListaRecebimentoAguardandoConferenciaViewSet(viewsets.ViewSet):
    def list(self, request, *args, **kwargs):
        results = []
        sequencias_adicionados = set()
        for caixa in Sequenciaetiqueta.objects.caixas_aguardando_conferencia():
            sequencia_etiqueta = caixa.idsequenciaetiqueta

            if sequencia_etiqueta not in sequencias_adicionados:
                sequencias_adicionados.add(sequencia_etiqueta)
                caixa_descricao = caixa.idcaixa.nome
                empresa_id = caixa.cliente.idcli
                empresa_nome_abreviado = caixa.cliente.nomeabreviado
                empresa_nome = caixa.cliente.nome_exibicao

                data = {
                    "sequencial": sequencia_etiqueta,
                    "caixa_descricao": caixa_descricao,
                    "id_solicitacao": 0,
                    "status_caixa": caixa.get_ultima_situacao_display(),
                    "empresa_id": empresa_id,
                    "empresa_nome_abreviado": empresa_nome_abreviado,
                    "empresa_nome": empresa_nome,
                    "ultimo_registro": helpers.datahora_formato_br(
                        caixa.data_ultima_situacao
                    ),
                }

                results.append(data)

        response_data = create_response_data(results, None, request)
        return Response(response_data, status=status.HTTP_200_OK)


class CriaItensRecebimentoVinculadoSolicitacao(viewsets.ViewSet):
    def get_serializer_class(self):
        return RecebimentoConferenciaSerializer

    def processar_produtos(self, produtos, caixa_sequencial, recebimento):
        for produto in produtos:
            item_caixa = models.Itemcaixa.objects.get(id=produto["id"])
            quantidade = produto["quantidadeB"]
            self.registrar_item_recebido(
                quantidade, caixa_sequencial, recebimento, item_caixa
            )

    @extend_schema(
        request=RecebimentoConferenciaSerializer,
    )
    @transaction.atomic
    def create(self, request, *args, **kwargs):
        """Função para receber as caixas e vincular itens recebidos.

        Args:
            request (_type_): Dados da requisição.

        Raises:
            NotFound: Quando serial ou recebimento_id não foram encontrador.
            Conflict: Quando serial já tenha sido recebido.
            APIException: Qualquer outra exceçãop:134.

        Returns:
            Response: HTTP_201_CREATED.
        """
        try:
            serial = request.data["serial"]
            serial = serial.strip('"')

            caixa_sequencial = self.get_caixa_sequencial(serial)

            recebimento = self.get_or_create_recebimento(
                request.data, caixa_sequencial
            )
            if not Sequenciaetiqueta.objects.caixas_aguardando_conferencia().filter(
                idsequenciaetiqueta=serial
            ):
                raise ValidationError(
                    code="caixa_em_processo",
                    detail="Caixa não faz parte da lista de caixas aguardando conferência.",
                )
            produtos = request.data["produtos"]
            lista_produtos = json.loads(produtos)

            ultimo_evento = Evento.objects.ultimo_evento(serial)

            self.check_evento(serial, ultimo_evento)

            self.registrar_produtos(
                lista_produtos, caixa_sequencial, recebimento
            )

            caixas_solicitacao = recebimento.recebimento_seriais.values_list(
                "serial", flat=True
            )

            if all(
                models.Itemrecebimento.objects.filter(
                    idrecebimento=recebimento.idrecebimento,
                    idsequenciaetiqueta=item,
                ).exists()
                for item in caixas_solicitacao
            ):
                recebimento.statusrecebimento = RecebimentoEnum.RECEBIDO.value
                recebimento.save()

            caixa_sequencial.alterar_situacao_para_recebido()

            item_recebimento = models.RecebimentoItem.objects.filter(
                serial=caixa_sequencial, recebimento=recebimento
            ).first()

            if item_recebimento:
                item_recebimento.situacao = RecebimentoItemEnum.RECEBIDO.value
                item_recebimento.save()

            self.registrar_evento(caixa_sequencial, recebimento)

        except models.Sequenciaetiqueta.DoesNotExist as exc:
            raise NotFound(
                f"Caixa com número de série {serial} não encontrada.",
                "caixa_nao_encontrada",
            ) from exc
        except Conflict as e:
            raise Conflict(e.detail) from e
        except ValidationError as e:
            raise ValidationError(e.detail) from e
        except Exception as e:
            raise APIException(str(e)) from e

        response_data = {
            "status": "success",
            "message": f"Caixa {serial} recebida com sucesso.",
        }
        return Response(response_data, status=status.HTTP_201_CREATED)

    def registrar_produtos(
        self, lista_produtos, caixa_sequencial, recebimento
    ):
        for produto in lista_produtos:
            item_caixa = models.Itemcaixa.objects.get(id=produto["id"])
            quantidade = produto["quantidadeB"]

            self.registrar_item_recebido(
                quantidade, caixa_sequencial, recebimento, item_caixa
            )

    def get_or_create_recebimento(self, request_data, caixa_sequencial):
        recebimento_pendente = caixa_sequencial.recebimento_pendente
        if recebimento_pendente:
            recebimento_pendente.idusu = self.request.user.usuario_legado
            return recebimento_pendente

        recebimento = Recebimento.objects.create(
            statusrecebimento=RecebimentoEnum.RECEBIDO.value,
            datarecebimento=helpers.datahora_local_atual(),
            idusu=self.request.user.usuario_legado,
        )

        fotos = any(key.startswith("foto") for key in request_data.keys())
        if fotos:
            self.salvar_foto(request_data, recebimento)
        return recebimento

    def check_evento(self, serial, ultimo_evento):
        if ultimo_evento and ultimo_evento.status == "RECEBIDO":
            raise Conflict(
                f"Caixa com número de série {serial} já foi recebida."
            )

    def get_caixa_sequencial(self, serial):
        return models.Sequenciaetiqueta.objects.get(idsequenciaetiqueta=serial)

    def salvar_foto(self, request_data, recebimento):
        for chave, valor in request_data.items():
            if chave.startswith("foto"):
                nome_arquivo = valor
                self.renomear_arquivo(nome_arquivo, recebimento)

    def renomear_arquivo(self, nome_arquivo, recebimento):
        nome_antigo = nome_arquivo.name
        data_atual = datetime.now().strftime("%Y-%m-%d")
        nome_arquivo.name = (
            f"recebimento_{recebimento.idrecebimento}_{data_atual}.jpg"
        )
        models.Midia.objects.create(
            foto=nome_arquivo, recebimento=recebimento, nome=nome_antigo
        )

    def registrar_item_recebido(
        self, quantidade, caixa_sequencial, recebimento, item_caixa
    ):
        models.Itemrecebimento(
            quantidade=quantidade,
            iditemcaixa=item_caixa,
            idrecebimento=recebimento,
            idsequenciaetiqueta=caixa_sequencial,
        ).save()

    def registrar_evento(self, caixa, recebimento):
        usuario = models.Usuario.objects.get(
            idprofissional=self.request.user.idprofissional
        )

        # TODO: Usar manager do Evento
        models.Evento(
            descricaocaixa=caixa.idcaixa.nome,
            idsequenciaetiqueta=caixa.idsequenciaetiqueta,
            nomecliente=caixa.idcaixa.cliente.nome_exibicao,
            cliente=caixa.idcaixa.cliente,
            idrecebimento=recebimento,
            idusu=usuario,
            apelidousuarioprimario=usuario.apelidousu,
            status=RecebimentoEnum.RECEBIDO.value,
            dataevento=helpers.data_local_atual(),
            datarecebimento=helpers.datahora_local_atual(),
            horaevento=helpers.hora_local_atual(),
        ).save()
