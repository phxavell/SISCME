from abc import ABC, abstractmethod
from datetime import datetime

from django.contrib.auth import get_user_model
from django.db import transaction
from django.db.models import Prefetch, Sum

from common import helpers
from common.models import (
    Autoclavagem,
    AutoclavagemItem,
    Caixa,
    Evento,
    IndicadoresEsterilizacao,
    Itemcaixa,
    Itemproducao,
    Itenstermodesinfeccao,
    Midia,
)
from common.models import Producao as Preparo
from common.models import Sequenciaetiqueta, Termodesinfeccao
from rest_framework.exceptions import APIException


User = get_user_model()


class EtapaEsterilizacaoBase(ABC):
    @abstractmethod
    def validar_etapa(self):
        pass

    @abstractmethod
    def processar_etapa(self, payload, fotos):
        pass


class EtapaPreparo(EtapaEsterilizacaoBase):
    def __init__(self, serial, usuario):
        self.serial = serial
        self.usuario = usuario
        self.sequenciaetiqueta = None
        self.cautela = None
        self.indicador = None

    def validar_etapa(self):
        ultimo_evento = Evento.objects.ultimo_evento(self.serial)

        if ultimo_evento and ultimo_evento.status in ["TERMO_FIM", "ABORTADO"]:
            return True

        return False

    def _validar_itens(self, itens):
        for item in itens:
            itemcaixa = Itemcaixa.objects.get(id=item["id"])
            if itemcaixa.caixa != self.sequenciaetiqueta.idcaixa:
                raise APIException(
                    detail=f"Item '{item['produto']}' não pertence "
                    "à caixa '{self.sequenciaetiqueta.idcaixa}'.",
                    code="itemcaixa_invalido",
                )

    def _criar_preparo(self, cautela, itens, indicador, request):
        preparo = Preparo.objects.create(
            dataproducao=helpers.datahora_local_atual(),
            datavalidade=self.sequenciaetiqueta.validade_calculada,
            idusu=self.usuario.usuario_legado,
            cautela=cautela,
            indicador=indicador,
        )

        fotos = any(key.startswith("foto") for key in request.keys())
        if fotos:
            self.salvar_fotos(request, preparo)

        for item in itens:
            item_producao = Itemproducao(
                idsequenciaetiqueta=self.sequenciaetiqueta,
                idproducao=preparo,
                quantidade=item["quantidade_checada"],
                iditemcaixa=Itemcaixa.objects.get(id=item["id"]),
            )
            item_producao.save()

        return preparo

    def salvar_fotos(self, request, preparo):
        for i in range(1, 10):
            chave_foto = f"foto{i}"

            if chave_foto in request:
                nome_arquivo = request[chave_foto]
                self.renomear_arquivo(nome_arquivo, preparo)

    def renomear_arquivo(self, nome_arquivo, preparo):
        nome_antigo = nome_arquivo.name
        data_atual = datetime.now().strftime("%Y-%m-%d")
        nome_arquivo.name = f"preparo_{preparo.id}_{data_atual}.jpg"
        Midia.objects.create(
            foto=nome_arquivo, producao=preparo, nome=nome_antigo
        )

    @transaction.atomic
    def processar_etapa(self, payload, fotos):
        try:
            self.sequenciaetiqueta = Sequenciaetiqueta.objects.get(
                idsequenciaetiqueta=self.serial
            )

            itens_payload = payload.get("produtos", [])

            indicador = None
            if payload.get("indicador"):
                indicador = IndicadoresEsterilizacao.objects.get(
                    id=payload.get("indicador")
                )
            self._validar_itens(itens_payload)
            preparo = self._criar_preparo(
                payload.get("cautela", None), itens_payload, indicador, fotos
            )

            if not Evento.objects.registra_preparo(
                self.sequenciaetiqueta,
                self.usuario,
                preparo,
            ):
                raise APIException(
                    detail="Não foi possível registrar o evento de preparo "
                    f"para o serial {self.sequenciaetiqueta}.",
                    code="falha_registro_evento",
                )

            if not self.sequenciaetiqueta.alterar_situacao_para_preparado():
                raise APIException(
                    detail="Não foi possível alterar a situação do "
                    f"serial {self.sequenciaetiqueta} para 'PREPARADO'.",
                    code="falha_alteracao_situacao",
                )

            return (
                Preparo.objects.prefetch_related(
                    Prefetch(
                        "itens",
                        queryset=Itemproducao.objects.select_related(
                            "iditemcaixa__produto",
                            "idsequenciaetiqueta__idcaixa__embalagem",
                            "idsequenciaetiqueta__idcaixa__cliente",
                        ),
                    )
                )
                .annotate(quantidade=Sum("itens__quantidade"))
                .get(pk=preparo.pk)
            )

        except User.DoesNotExist as exc:
            raise APIException(
                detail="Usuário não encontrado.", code="usuario_nao_encontrado"
            ) from exc
        except Sequenciaetiqueta.DoesNotExist as exc:
            raise APIException(
                detail="Etiqueta de sequência não encontrada.",
                code="sequencia_nao_encontrada",
            ) from exc
        except Caixa.DoesNotExist as exc:
            raise APIException(
                detail="Caixa não encontrada.", code="caixa_nao_encontrada"
            ) from exc
        except Itemcaixa.DoesNotExist as exc:
            raise APIException(
                detail="Item de caixa não encontrado.",
                code="itemcaixa_nao_encontrado",
            ) from exc
        except Preparo.DoesNotExist as exc:
            raise APIException(
                detail="Preparo não encontrada.",
                code="preparo_nao_encontrada",
            ) from exc


class EtapaAutoclavagem(EtapaEsterilizacaoBase):
    def __init__(self, lista_seriais, usuario, acao, autoclavagem=None):
        self.autoclavagem = autoclavagem
        self.lista_seriais = lista_seriais
        self.usuario = usuario
        self.acao = acao

    def _validar_iniciar(self):
        for item in self.lista_seriais:
            serial = item["serial"]
            ultimo_evento = Evento.objects.ultimo_evento(
                serial.idsequenciaetiqueta
            )
            if ultimo_evento and ultimo_evento.status == "EMBALADO":
                continue

            if (
                ultimo_evento
                and ultimo_evento.status == Autoclavagem.Status.ABORTADO
                and ultimo_evento.idautoclavagem
            ):
                continue

            raise APIException(
                detail=f"Serial {serial} não pode ser iniciado. "
                "Checar situação do serial. "
                f"Última situacao: {serial.get_ultima_situacao_display()}",
                code="serial_situacao_invalida",
            )
        return True

    def _validar_finalizar_ou_abortar(self):
        ato = "finalizado" if self.acao == "finalizar" else "abortado"
        for item in self.lista_seriais:
            ultimo_evento = Evento.objects.ultimo_evento(item.serial)
            if (
                ultimo_evento
                and ultimo_evento.status == Autoclavagem.Status.INICIADO
            ):
                continue

            raise APIException(
                detail=f"Serial {item.serial} não pode ser {ato}. "
                "Checar situação do serial. "
                f"Última situacao: {ultimo_evento.status}",
                code="serial_situacao_invalida",
            )
            # TODO: Futuramente usar o item.serial.get_ultima_situacao_display()

        return True

    def validar_etapa(self):
        # TODO: futuramente, usar o campo de status do sequenciaetiqueta

        if self.acao == "iniciar":
            return self._validar_iniciar()

        if self.acao in ["finalizar", "abortar"]:
            return self._validar_finalizar_ou_abortar()

        return False

    def _criar_itens_autoclavagem(self):
        for item in self.lista_seriais:
            serial = item["serial"]
            Evento.objects.registra_esterilizacao_inicio(
                serial, self.usuario, self.autoclavagem
            )

            if serial.esta_preparado:
                serial.alterar_situacao_para_em_esterilizacao()
            # TODO: Futuramente, adicionar else para jogar exceção caso não esteja preparado

            AutoclavagemItem.objects.create(
                autoclavagem=self.autoclavagem, serial=serial
            )

    @transaction.atomic
    def processar_etapa(self, payload, fotos):
        if self.acao == "iniciar":
            try:
                autoclavagem_data = {
                    "idusu": self.usuario.usuario_legado,
                    "datainicio": helpers.datahora_local_atual(),
                    "statusinicio": Autoclavagem.Status.INICIADO,
                    "ciclo": payload.get("ciclo"),
                    "programacao": payload.get("programacao"),
                    "equipamento": payload.get("equipamento"),
                }

                self.autoclavagem = Autoclavagem.objects.create(
                    **autoclavagem_data
                )

                self._criar_itens_autoclavagem()
            except Sequenciaetiqueta.DoesNotExist as exc:
                raise APIException(
                    detail="Serial não encontrado.",
                    code="serial_nao_encontrado",
                ) from exc
            except Exception as exc:
                raise APIException(
                    detail="Erro ao iniciar esterilização.",
                    code="erro_esterilizacao_iniciar",
                ) from exc

        elif self.acao == "finalizar":
            # TODO: Usar manager
            self.autoclavagem.datafim = helpers.datahora_local_atual()
            self.autoclavagem.statusfim = Autoclavagem.Status.FINALIZADO
            self.autoclavagem.save()

            for item in self.autoclavagem.itens.all():
                Evento.objects.registra_esterilizacao_fim(
                    item.serial, self.usuario, self.autoclavagem
                )
                item.serial.alterar_situacao_para_esterilizado()

        elif self.acao == "abortar":
            self.autoclavagem.dataabortado = helpers.datahora_local_atual()
            self.autoclavagem.statusabortado = Autoclavagem.Status.ABORTADO
            self.autoclavagem.save()

            for item in self.autoclavagem.itens.all():
                Evento.objects.registra_processo_abortado(
                    item.serial, self.usuario, self.autoclavagem
                )
                item.serial.alterar_situacao_para_abortado_esterilizacao()
        else:
            raise APIException("Ação inválida.", code="acao_invalida")

        return self.autoclavagem


class EtapaAutoclavagemTeste(EtapaEsterilizacaoBase):
    def __init__(self, usuario, acao, autoclavagem=None):
        self.autoclavagem = autoclavagem
        self.usuario = usuario
        self.acao = acao

    def validar_etapa(self):
        return True

    @transaction.atomic
    def processar_etapa(self, payload, fotos):
        if self.acao == "iniciar":
            try:
                autoclavagem_data = {
                    "idusu": self.usuario.usuario_legado,
                    "datainicio": helpers.datahora_local_atual(),
                    "statusinicio": Autoclavagem.Status.INICIADO,
                    "ciclo": payload.get("ciclo"),
                    "programacao": payload.get("programacao"),
                    "equipamento": payload.get("equipamento"),
                    "indicador": payload.get("indicador"),
                }

                self.autoclavagem = Autoclavagem.objects.create(
                    **autoclavagem_data
                )
                Evento.objects.registra_esterilizacao_teste_inicio(
                    self.usuario, self.autoclavagem
                )
            except Exception as exc:
                raise APIException(
                    detail=f"Erro ao iniciar esterilização de teste: {exc}",
                    code="erro_esterilizacao_test_iniciar",
                ) from exc

        elif self.acao == "finalizar":
            # TODO: Usar manager
            self.autoclavagem.datafim = helpers.datahora_local_atual()
            self.autoclavagem.statusfim = Autoclavagem.Status.FINALIZADO
            self.autoclavagem.save()

            Evento.objects.registra_esterilizacao_teste_fim(
                self.usuario, self.autoclavagem
            )

        elif self.acao == "abortar":
            self.autoclavagem.dataabortado = helpers.datahora_local_atual()
            self.autoclavagem.statusabortado = Autoclavagem.Status.ABORTADO
            self.autoclavagem.save()

            Evento.objects.registra_processo_teste_abortado(
                self.usuario, self.autoclavagem
            )
        else:
            raise APIException("Ação inválida.", code="acao_invalida")

        return self.autoclavagem


class EtapaTermodesinfeccao(EtapaEsterilizacaoBase):
    def __init__(self, lista_seriais, usuario, acao, termodesinfeccao=None):
        self.termodesinfeccao = termodesinfeccao
        self.lista_seriais = lista_seriais
        self.usuario = usuario
        self.acao = acao

    def _validar_iniciar(self):
        for item in self.lista_seriais:
            serial = item["serial"]
            ultimo_evento = Evento.objects.ultimo_evento(
                serial.idsequenciaetiqueta
            )
            if ultimo_evento and ultimo_evento.status == "RECEBIDO":
                continue

            if (
                ultimo_evento
                and ultimo_evento.status == Termodesinfeccao.Status.ABORTADO
                and ultimo_evento.idtermodesinfeccao
            ):
                continue

            raise APIException(
                detail=f"Serial {serial} não pode ser iniciado. "
                "Checar situação do serial. "
                f"Última situacao: {serial.get_ultima_situacao_display()}",
                code="serial_situacao_invalida",
            )
        return True

    def _validar_finalizar_ou_abortar(self):
        ato = "finalizado" if self.acao == "finalizar" else "abortado"
        for item in self.lista_seriais:
            ultimo_evento = Evento.objects.ultimo_evento(item.serial)
            if (
                ultimo_evento
                and ultimo_evento.status == Termodesinfeccao.Status.INICIADO
            ):
                continue

            raise APIException(
                detail=f"Serial {item.serial} não pode ser {ato}. "
                "Checar situação do serial. "
                f"Última situacao: {ultimo_evento.status}",
                code="serial_situacao_invalida",
            )
            # TODO: Futuramente usar o item.serial.get_ultima_situacao_display()

        return True

    def validar_etapa(self):
        # TODO: futuramente, usar o campo de status do sequenciaetiqueta

        if self.acao == "iniciar":
            return self._validar_iniciar()

        if self.acao in ["finalizar", "abortar"]:
            return self._validar_finalizar_ou_abortar()

        return False

    def _criar_itens_termodesinfeccao(self):
        for item in self.lista_seriais:
            serial = item["serial"]
            Evento.objects.registra_termodesinfeccao_inicio(
                serial, self.usuario, self.termodesinfeccao
            )

            if serial.esta_recebido:
                serial.alterar_situacao_para_em_termodesinfeccao()
            # TODO: Futuramente, adicionar else para jogar exceção caso não esteja preparado

            Itenstermodesinfeccao.objects.create(
                termodesinfeccao=self.termodesinfeccao, serial=serial
            )

    @transaction.atomic
    def processar_etapa(self, payload, fotos):
        if self.acao == "iniciar":
            try:
                termodesinfeccao_data = {
                    "idusu": self.usuario.usuario_legado,
                    "datainicio": helpers.datahora_local_atual(),
                    "statusinicio": Termodesinfeccao.Status.INICIADO,
                    "ciclo": payload.get("ciclo"),
                    "programacao": payload.get("programacao"),
                    "equipamento": payload.get("equipamento"),
                }

                self.termodesinfeccao = Termodesinfeccao.objects.create(
                    **termodesinfeccao_data
                )

                self._criar_itens_termodesinfeccao()
            except Sequenciaetiqueta.DoesNotExist as exc:
                raise APIException(
                    detail="Serial não encontrado.",
                    code="serial_nao_encontrado",
                ) from exc
            except Exception as exc:
                raise APIException(
                    detail=f"Erro ao iniciar termodesinfecção: {exc}",
                    code="erro_termodesinfeccao_iniciar",
                ) from exc

        elif self.acao == "finalizar":
            # TODO: Usar manager
            self.termodesinfeccao.datafim = helpers.datahora_local_atual()
            self.termodesinfeccao.statusfim = (
                Termodesinfeccao.Status.FINALIZADO
            )

            del self.termodesinfeccao.datainicio
            self.termodesinfeccao.save()

            for item in self.termodesinfeccao.itens.all():
                Evento.objects.registra_termodesinfeccao_fim(
                    item.serial, self.usuario, self.termodesinfeccao
                )
                item.serial.alterar_situacao_para_termodesinfectado()

        elif self.acao == "abortar":
            self.termodesinfeccao.dataabortado = helpers.datahora_local_atual()
            self.termodesinfeccao.statusabortado = (
                Termodesinfeccao.Status.ABORTADO
            )

            del self.termodesinfeccao.datainicio
            self.termodesinfeccao.save()

            for item in self.termodesinfeccao.itens.all():
                Evento.objects.registra_processo_abortado(
                    item.serial, self.usuario, self.termodesinfeccao
                )
                item.serial.alterar_situacao_para_abortado_termodesinfeccao()
        else:
            raise APIException("Ação inválida.", code="acao_invalida")

        return self.termodesinfeccao


class RastreabilidadeService:
    def __init__(self, etapa: EtapaEsterilizacaoBase):
        self.etapa = etapa

    def processar(self, payload=None, fotos=None):
        if not self.etapa.validar_etapa():
            raise APIException(
                detail="A etapa anterior não foi concluída ou é inválida. ",
                code="falha_etapa_anterior",
            )
        return self.etapa.processar_etapa(payload, fotos)
