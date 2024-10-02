# pylint: disable=too-many-lines
import logging
from datetime import date, datetime

from django.core.files.base import ContentFile
from django.core.paginator import Paginator
from django.db import transaction
from django.db.models import Prefetch, Q
from django.http import Http404
from django.shortcuts import get_object_or_404

from common import helpers
from common.enums import (
    SerialSituacaoEnum,
    TipoEquipamentoEnum,
    TipoOcorrenciaEnum,
)
from common.filters import (
    CaixaFilter,
    DiarioFilter,
    LoteIndicadorEsterilizacaoFilter,
    ProdutoFilter,
)
from common.mixins.mixins import HasRelationMixin, TrackUserMixin
from common.models import (
    Autoclavagem,
    Caixa,
    Caixavalor,
    Cliente,
    Coleta,
    Complemento,
    Diario,
    Entrega,
    Equipamento,
    Etiqueta,
    Evento,
    IndicadoresEsterilizacao,
    Itemcaixa,
    Lote,
    Plantao,
    Produto,
    Profissao,
    RegistroManutencao,
    Sequenciaetiqueta,
    Setor,
    Subtipoproduto,
    Termodesinfeccao,
    Tipocaixa,
    TipoOcorrencia,
    Tipopacote,
    Veiculo,
)
from common.permissions import GroupPermission
from common.responses import (
    ErrorResponse,
    MethodNotAllowedResponse,
    SuccessNoContentResponse,
    SuccessResponse,
    SucessfullyCrudResponse,
)
from common.serializers import (
    AlocarMotoristaSerializer,
    AutoclavagemReportSerializer,
    CaixaSerializer,
    CaixaSerializerReport,
    CicloEsterilizacaoResponseSerializer,
    CicloTermodesinfeccaoResponseSerializer,
    ComplementoSerializer,
    DiarioSerializer,
    EmbalagemSerializer,
    EquipamentoSerializer,
    EtiquetaSerializer,
    EventoSerializerReduzido,
    IndicadorEsterilizacaoSerializer,
    LoteIndicadorEsterilizacaoSerializer,
    MovimentacaoLoteSerializer,
    PlantaoSerializer,
    ProdutoSerializer,
    ProfissaoSerializer,
    RegistroManutencaoSerializer,
    SerialDetalhadoSerializer,
    SerialSerializer,
    SetorSerializer,
    SubTipoProdutoSerializer,
    TermodesinfeccaoReportSerializer,
    TipoDeCaixaSerializer,
    TipoOcorrenciaSerializer,
    TipoPacoteSerializer,
    VeiculoSerializer,
)
from common.services import (
    EstoqueService,
    EtapaAutoclavagem,
    EtapaAutoclavagemTeste,
    EtapaTermodesinfeccao,
    RastreabilidadeService,
)
from common.services.movimentacao_indicadores_service import (
    MovimentacaoIndicadoresService,
)
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, status, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import (
    MethodNotAllowed,
    NotFound,
    PermissionDenied,
    ValidationError,
)
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from siscme.settings import base
from users.models import Motorista


logger = logging.getLogger(__name__)


# pylint: disable=too-many-ancestors
class CustomModelViewSet(
    TrackUserMixin, viewsets.ModelViewSet, HasRelationMixin
):
    filter_backends = [filters.SearchFilter]
    ordering = ["created_at"]

    def format_response(self, data, request):
        default_items_per_page = getattr(
            base, "PAGE_SIZE", PageNumberPagination.page_size
        )
        if "results" in data:
            current_page = int(request.query_params.get("page", 1))
            items_per_page = len(data["results"])
            first_item = (current_page - 1) * default_items_per_page + 1
            last_item = first_item + items_per_page - 1
            return {
                "status": "success",
                "data": data["results"],
                "meta": {
                    "currentPage": current_page,
                    "totalItems": data["count"],
                    "firstItem": first_item,
                    "lastItem": last_item,
                    "itemsPerPage": items_per_page,
                    "totalPages": -(-data["count"] // default_items_per_page),
                    "next": data["next"],
                    "previous": data["previous"],
                },
            }
        return {
            "status": "success",
            "data": data,
        }

    def get_queryset(self):
        if hasattr(self.queryset.model, "descricao"):
            descricao = self.request.query_params.get("descricao", None)
            if descricao:
                return self.queryset.filter(descricao__icontains=descricao)

        return self.queryset

    def format_create_update_response(self, data):
        return {"status": "success", "data": data}

    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)
        response.data = self.format_response(response.data, request)
        return response

    def retrieve(self, request, *args, **kwargs):
        response = super().retrieve(request, *args, **kwargs)
        response.data = self.format_response(response.data, request)
        return response

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        response.data = self.format_create_update_response(response.data)
        return response

    def update(self, request, *args, **kwargs):
        response = super().update(request, *args, **kwargs)
        response.data = self.format_create_update_response(response.data)
        return response

    def partial_update(self, request, *args, **kwargs):
        response = super().partial_update(request, *args, **kwargs)
        return response

    def destroy(self, request, *args, **kwargs):
        self.check_relations(self.get_object())
        return super().destroy(request, *args, **kwargs)


# pylint: disable=too-many-ancestors
class EmbalagemViewSet(CustomModelViewSet):
    """Endpoint para listar e criar embalagens,
    que são usadas para agrupar caixas."""

    queryset = Caixavalor.objects.all()
    serializer_class = EmbalagemSerializer
    search_fields = [
        "descricao",
    ]


# pylint: disable=too-many-ancestors
class TipoDeCaixaViewSet(CustomModelViewSet):
    """Endpoint para listar e criar tipos de caixa,
    que são usados para agrupar caixas."""

    queryset = Tipocaixa.objects.all()
    serializer_class = TipoDeCaixaSerializer
    search_fields = [
        "descricao",
    ]


# pylint: disable=too-many-ancestors
class CaixaViewSet(CustomModelViewSet):
    """Endpoint para listar e criar modelos de caixa.
    Os modelos de caixa são usados para
    criar caixas (sequenciais com código único).
    """

    queryset = (
        Caixa.objects.prefetch_related(
            Prefetch("itens", queryset=Itemcaixa.objects.order_by("id"))
        )
        .order_by("id")
        .all()
    )
    serializer_class = CaixaSerializer
    search_fields = ["codigo_modelo", "nome"]
    relations_to_delete = [
        Itemcaixa,
    ]
    filter_backends = [DjangoFilterBackend]
    filterset_class = CaixaFilter

    @transaction.atomic
    @action(
        detail=True,
        methods=["post"],
        url_path="gerar-seriais",
        url_name="gerar_seriais",
    )
    def gerar_seriais(self, request, *args, **kwargs):
        try:
            caixa = self.get_object()
            quantidade = request.data.get("quantidade")
            if quantidade is None:
                raise ValidationError(
                    "A quantidade de seriais não pode ser nula."
                )
            if quantidade <= 0:
                raise ValidationError(
                    "A quantidade de seriais não pode ser menor ou igual a zero."
                )
            seriais = caixa.gerar_seriais(quantidade)
            return SuccessResponse(
                SerialSerializer(seriais, many=True).data,
                status.HTTP_201_CREATED,
            )
        except Caixa.DoesNotExist as exc:
            raise NotFound("Caixa não encontrada.") from exc
        except Exception as exc:
            raise ValidationError(
                f"Falha ao gerar seriais. Contate o suporte. {str(exc)}"
            ) from exc

    @action(
        detail=True,
        methods=["get"],
        url_path="lista-seriais",
        url_name="lista_seriais",
    )
    def lista_seriais(self, request, *args, **kwargs):
        try:
            caixa = self.get_object()
            seriais = caixa.lista_de_caixas
            return SuccessResponse(
                SerialSerializer(seriais, many=True).data,
                status.HTTP_200_OK,
            )
        except Caixa.DoesNotExist as exc:
            raise NotFound("Caixa não encontrada.") from exc
        except Exception as exc:
            raise ValidationError(
                f"Falha ao listar seriais. Contate o suporte. {str(exc)}"
            ) from exc

    def relatorio_seriais(self, request, *args, **kwargs):
        """
        Endpoint para retornar dados para o relatório das caixa com base no serial.
        """
        try:
            serial = Sequenciaetiqueta.objects.get(
                idsequenciaetiqueta=kwargs.get("serial")
            )
            serializer = CaixaSerializerReport(serial.idcaixa)
            response = {
                "serial": serial.idsequenciaetiqueta,
                "codigo-modelo": serial.idcaixa.codigo_modelo,
                "cliente": serial.idcaixa.cliente.nome_exibicao,
                "caixa": serial.idcaixa.nome,
                "tipo": serial.idcaixa.tipo_caixa.descricao,
                "embalagem": serial.idcaixa.embalagem.descricao,
                "validade": serial.idcaixa.validade,
                "quantidade-itens": serial.idcaixa.quantidade_itens,
                "itens": serializer.data["itens"],
            }
            return Response(
                {
                    "status": "success",
                    "data": response,
                },
                status=status.HTTP_200_OK,
            )
        except Sequenciaetiqueta.DoesNotExist as exc:
            raise NotFound("Serial não encontrado.") from exc
        except Exception as exc:
            logger.error("Erro inesperado ao buscar serial: %s", exc)
            raise ValidationError(
                "Ocorreu um erro inesperado. Por favor, contate o suporte."
            ) from exc


# pylint: disable=too-many-ancestors
class SetorViewSet(CustomModelViewSet):
    """Lista e cadastra os setores, com paginação."""

    queryset = Setor.objects.all()
    serializer_class = SetorSerializer


# pylint: disable=too-many-ancestors
class ProfissaoViewSet(CustomModelViewSet):
    """Lista e cadastra as profissões, com paginação."""

    queryset = Profissao.objects.all()
    serializer_class = ProfissaoSerializer


# pylint: disable=too-many-ancestors
class VeiculoViewSet(CustomModelViewSet):
    """Lista e cadastra os veiculos, com paginação."""

    queryset = Veiculo.objects.all()
    serializer_class = VeiculoSerializer

    def perform_destroy(self, instance):
        """
        Overriding do metodo 'perform_destroy' para deletar a foto do veiculo
        """
        try:
            if instance.foto:
                instance.foto.delete()
        except FileNotFoundError:
            pass

        instance.delete()

    @transaction.atomic
    @action(
        detail=True,
        methods=["patch"],
        url_path="desalocar-motorista",
        url_name="desalocar_motorista",
    )
    # pylint: disable=unused-argument
    def desalocar_motorista(self, request, pk=None):
        """Desaloca o motorista do veículo."""
        veiculo = self.get_object()

        if Coleta.objects.filter(veiculo=veiculo).em_andamento().exists():
            raise ValidationError(
                detail="Não é possível desalocar motorista enquanto houver coletas em andamento.",
                code="veiculo_coleta_andamento",
            )

        if Entrega.objects.filter(veiculo=veiculo).em_andamento().exists():
            raise ValidationError(
                detail="Não é possível desalocar motorista enquanto houver entregas em andamento.",
                code="veiculo_entrega_andamento",
            )

        Coleta.objects.filter(veiculo=veiculo).nao_iniciado().update(
            motorista=None, veiculo=None
        )

        Entrega.objects.filter(veiculo=veiculo).nao_iniciado().update(
            motorista=None, veiculo=None
        )

        veiculo.desalocar()
        return Response(
            {"status": "success", "data": VeiculoSerializer(veiculo).data}
        )

    @transaction.atomic
    @action(
        detail=True,
        methods=["patch"],
        url_path="alocar-motorista",
        url_name="alocar_motorista",
        serializer_class=AlocarMotoristaSerializer,
    )
    # pylint: disable=unused-argument
    def alocar_motorista(self, request, pk=None):
        """Aloca o motorista ao veículo."""
        veiculo = self.get_object()

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        motorista_id = request.data.get("motorista_id")

        if veiculo.motorista_atual:
            raise ValidationError(
                detail="Veículo já está alocado ao "
                f"motorista {veiculo.motorista_atual.nome}.",
                code="veiculo_ja_alocado",
            )

        motorista = Motorista.objects.get(id=motorista_id)

        if Coleta.objects.filter(motorista=motorista).em_andamento().exists():
            raise ValidationError(
                detail="Não é possível alocar motorista enquanto houver "
                "coletas em andamento para ele.",
                code="motorista_coleta_andamento",
            )

        if Entrega.objects.filter(motorista=motorista).em_andamento().exists():
            raise ValidationError(
                detail="Não é possível alocar motorista enquanto houver "
                "entregas em andamento para ele.",
                code="motorista_entrega_andamento",
            )

        Coleta.objects.filter(motorista=motorista).nao_iniciado().update(
            motorista=motorista, veiculo=veiculo
        )

        Entrega.objects.filter(motorista=motorista).nao_iniciado().update(
            motorista=motorista, veiculo=veiculo
        )

        if motorista.esta_disponivel_para(veiculo=veiculo):
            veiculo.alocar(motorista)

        return Response(
            {"status": "success", "data": VeiculoSerializer(veiculo).data}
        )


class PlantaoViewSet(CustomModelViewSet):
    """Endpoint para listar e criar plantoes, que são usados para registro."""

    queryset = Plantao.objects.all().order_by("-idplantao")
    serializer_class = PlantaoSerializer
    http_method_names = ["get", "post", "put", "patch"]
    search_fields = ["status", "idprofissional__nome"]

    def get_queryset(self):
        data_inicial = self.request.query_params.get("data_inicial", "")
        data_final = self.request.query_params.get("data_final", "")
        situacao = self.request.query_params.get("status", None)
        profissional = self.request.query_params.get("profissional", None)

        if data_inicial == "":
            data_inicial = date(2000, 1, 1)
        else:
            data_inicial = datetime.strptime(data_inicial, "%Y-%m-%d").date()

        if data_final == "":
            data_final = date.today()
        else:
            data_final = datetime.strptime(data_final, "%Y-%m-%d").date()

        if data_inicial > data_final:
            raise ValidationError(
                "A data inicial não pode ser maior que a data final."
            )
        self.queryset = self.queryset.filter(
            datacadastro__range=[data_inicial, data_final]
        )

        if situacao is not None and situacao != "":
            self.queryset = self.queryset.filter(status=situacao)

        if profissional is not None and profissional != "":
            self.queryset = self.queryset.filter(
                idprofissional__nome__icontains=profissional
            )

        return self.queryset

    def update(self, request, *args, **kwargs):
        instance = self.get_object()

        if instance.status == "FECHADO":
            raise PermissionDenied(
                "O plantão já está fechado, não pode ser editado."
            )

        return super().update(request, *args, **kwargs)

    @transaction.atomic
    def fechamento(self, request, *args, **kwargs):
        try:
            plantao = Plantao.objects.get(idplantao=kwargs.get("pk"))
            descricaofechamento = request.data.get("descricaofechamento")
            if descricaofechamento is None:
                raise ValidationError(
                    "A descrição do fechamento não pode ser nula."
                )

            plantao.descricaofechamento = descricaofechamento
            plantao.datafechamento = helpers.data_local_atual()
            plantao.horafechamento = helpers.hora_local_atual()
            plantao.status = "FECHADO"

            data_hora_inicio = datetime.combine(
                plantao.datacadastro, plantao.horacadastro
            )
            data_hora_fim = datetime.combine(
                plantao.datafechamento, plantao.horafechamento
            )

            plantao.duracao = data_hora_fim - data_hora_inicio
            plantao.save()
            return Response("Plantão fechado com suceso!")
        except Plantao.DoesNotExist as exc:
            raise NotFound("Plantão não encontrado") from exc

    def list(self, request, *args, **kwargs):
        try:
            user = request.user
            queryset = self.get_queryset()

            if (
                user.groups.count() == 1
                and user.groups.filter(
                    name__in=["MOTORISTA", "ENFERMAGEM"]
                ).exists()
            ):
                queryset = self.queryset.filter(
                    idprofissional=user.idprofissional
                )

            serializer = self.serializer_class(queryset, many=True)
            page = self.paginate_queryset(queryset)
            if page is not None:
                serializer = self.get_serializer(page, many=True)
                response = self.get_paginated_response(serializer.data)

            return Response(
                self.format_response(data=response.data, request=request)
            )

        except Exception as e:
            raise ValidationError(str(e)) from e


class EtiquetaViewSet(CustomModelViewSet):
    """Endpoint para listar e criar etiquetas."""

    queryset = Etiqueta.objects.all()
    serializer_class = EtiquetaSerializer
    search_fields = ["id"]

    def get_queryset(self):
        queryset = super().get_queryset().order_by("-id")

        data_inicial = self.request.query_params.get("data_inicial", "")
        data_final = self.request.query_params.get("data_final", "")
        codigo = self.request.query_params.get("codigo", "")

        if data_inicial == "":
            data_inicial = date(2000, 1, 1)
        else:
            data_inicial = datetime.strptime(data_inicial, "%Y-%m-%d").date()

        if data_final == "":
            data_final = date.today()
        else:
            data_final = datetime.strptime(data_final, "%Y-%m-%d").date()

        if data_inicial > data_final:
            raise ValidationError(
                "A data inicial não pode ser maior que a data final."
            )
        queryset = queryset.filter(
            datalancamento__range=[data_inicial, data_final]
        )

        if codigo is not None and codigo != "":
            queryset = queryset.filter(id=codigo)

        return queryset

    def list(self, request, *args, **kwargs):
        try:
            queryset = self.get_queryset()

            serializer = self.serializer_class(queryset, many=True)
            page = self.paginate_queryset(queryset)
            if page is not None:
                serializer = self.get_serializer(page, many=True)
                response = self.get_paginated_response(serializer.data)

            return Response(
                self.format_response(data=response.data, request=request)
            )

        except Exception as e:
            raise ValidationError(str(e)) from e

    @transaction.atomic
    def update(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            serializer = self.get_serializer(
                instance, data=request.data, partial=True
            )
            serializer.is_valid(raise_exception=True)
            serializer.save()

            return Response({"status": "success", "data": serializer.data})
        except Http404 as exc:
            raise NotFound(
                code="etiqueta_nao_encontrada",
                detail="Etiqueta não encontrada.",
            ) from exc
        except Exception as e:
            raise ValidationError(str(e)) from e

    def destroy(self, request, *args, **kwargs):
        self.check_relations(self.get_object())
        return super().destroy(request, *args, **kwargs)


class ComplementoViewSet(CustomModelViewSet):
    """Endpoint para listar e criar complementos"""

    queryset = Complemento.objects.all()
    serializer_class = ComplementoSerializer
    http_method_names = ["get", "post", "patch", "delete"]
    search_fields = ["descricao"]
    permission_classes = [
        GroupPermission(
            ["ENFERMAGEM", "SUPERVISAOENFERMAGEM", "TECNICOENFERMAGEM"]
        )
    ]

    def get_queryset(self):
        queryset = super().get_queryset().order_by("-id")

        descricao = self.request.query_params.get("descricao", "")
        status_complemento = self.request.query_params.get("status", None)

        if status_complemento:
            status_mapping = {
                "ativo": Complemento.objects.complementos_ativos(),
                "inativo": Complemento.objects.complementos_inativos(),
            }

            queryset = status_mapping.get(
                status_complemento.lower(),
                Complemento.objects.todos_complementos(),
            )

        if descricao is not None and descricao != "":
            queryset = queryset.filter(descricao__icontains=descricao)

        return queryset

    def list(self, request, *args, **kwargs):
        try:
            queryset = self.get_queryset()

            serializer = self.serializer_class(queryset, many=True)
            page = self.paginate_queryset(queryset)
            if page is not None:
                serializer = self.get_serializer(page, many=True)
                response = self.get_paginated_response(serializer.data)

            return Response(
                self.format_response(data=response.data, request=request)
            )

        except Exception as e:
            raise ValidationError(str(e)) from e

    def destroy(self, request, *args, **kwargs):
        self.check_relations(self.get_object())
        return super().destroy(request, *args, **kwargs)


class DiarioViewSet(CustomModelViewSet):
    queryset = Diario.objects.all().order_by("-id")
    serializer_class = DiarioSerializer
    http_method_names = ["get", "list", "put", "post", "delete"]
    filter_backends = [DjangoFilterBackend]
    filterset_class = DiarioFilter

    @transaction.atomic
    @action(detail=True, methods=["post"], url_path="fechamento")
    def fechamento(self, request, *args, **kwargs):
        try:
            diario = Diario.objects.get(id=kwargs.get("pk"))
            acao = request.data.get("acao")
            if acao is None:
                raise ValidationError(
                    "A descrição do fechamento da ocorrência não pode ser nula."
                )

            diario.acao = acao
            diario.datafechamento = helpers.data_local_atual()
            diario.horafechamento = helpers.hora_local_atual()
            diario.status = "FECHADO"
            diario.statusdiariodeocorrencia = "FECHADO"
            diario.save()
            return Response("Ocorrência fechada com suceso!")
        except Diario.DoesNotExist as exc:
            raise NotFound("Diário não encontrado") from exc

    @action(detail=True, methods=["delete"], url_path="remover-arquivo")
    def remover_arquivo(self, request, *args, **kwargs):
        try:
            diario = Diario.objects.get(id=kwargs.get("pk"))

            if diario.arquivo:
                diario.arquivo.delete()

            return Response(
                {"message": "Arquivo removido com sucesso"},
                status=status.HTTP_204_NO_CONTENT,
            )

        except Diario.DoesNotExist as exc:
            raise NotFound("Diário não encontrado") from exc

    def destroy(self, request, *args, **kwargs):
        raise MethodNotAllowed(
            "DELETE", "A exclusão do diário não é permitida."
        )

    @action(detail=True, methods=["post"], url_path="inserir-arquivo")
    def inserir_arquivo(self, request, pk):
        try:
            diario = Diario.objects.get(id=pk)

            arquivo = request.data.get("arquivo")

            if not arquivo:
                raise ValidationError("O arquivo não foi fornecido.")

            if diario.arquivo:
                diario.arquivo.delete()

            arquivo_str = f"{str(diario.id)}-{str(arquivo)}"
            diario.arquivo.upload_to = f"ocorrencias/{arquivo_str}"

            diario.arquivo.save(arquivo_str, ContentFile(arquivo.read()))

            return Response(
                {"message": "Arquivo inserido com sucesso!"},
                status=status.HTTP_201_CREATED,
            )

        except Diario.DoesNotExist as exc:
            raise NotFound("Diário não encontrado.") from exc


class TipoOcorrenciaViewSet(CustomModelViewSet):
    """Endpoint para listar e criar Tipos de Ocorrências"""

    queryset = TipoOcorrencia.objects.all()
    serializer_class = TipoOcorrenciaSerializer
    http_method_names = ["get", "post", "delete", "patch"]
    search_fields = ["id"]

    def get_queryset(self):
        queryset = super().get_queryset().order_by("-id")

        descricao = self.request.query_params.get("descricao", "")

        if descricao is not None and descricao != "":
            queryset = queryset.filter(descricao__icontains=descricao)

        return queryset

    def list(self, request, *args, **kwargs):
        try:
            queryset = self.get_queryset()

            serializer = self.serializer_class(queryset, many=True)
            page = self.paginate_queryset(queryset)
            if page is not None:
                serializer = self.get_serializer(page, many=True)
                response = self.get_paginated_response(serializer.data)

            return Response(
                self.format_response(data=response.data, request=request)
            )

        except Exception as e:
            raise ValidationError(str(e)) from e

    @action(detail=False, methods=["get"], url_path="get-options")
    def get_options(self, request, *args, **kwargs):
        queryset = TipoOcorrencia.objects.all()
        serializer = TipoOcorrenciaSerializer(queryset, many=True)
        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        self.check_relations(self.get_object())

        instance = self.get_object()
        if instance.descricao in TipoOcorrenciaEnum.labels:
            raise ValidationError(
                "Não é possível excluir um tipo de ocorrência padrão."
            )

        super().destroy(request, *args, **kwargs)
        return Response(
            {
                "status": "success",
                "message": "Tipo de Ocorrência deletado com sucesso!",
            }
        )


class ProcessoEsterilizacaoViewSet(CustomModelViewSet):
    serializer_class = CicloEsterilizacaoResponseSerializer

    def get_queryset(self):
        if "pk" in self.kwargs:
            if self.action == "retrieve":
                return Autoclavagem.objects.todos_ciclos()

            if self.action == "dados_report":
                return Autoclavagem.objects.ciclos_finalizados()

        return Autoclavagem.objects.ciclos_em_andamento()

    @action(detail=True, methods=["post"], url_path="finalizar")
    @transaction.atomic
    def finalizar(self, request, pk=None):  # pylint: disable=unused-argument
        """Finaliza o ciclo de esterilização."""
        try:
            autoclavagem = self.get_object()
            autoclavagem.duracao = helpers.diff_dates(autoclavagem.datainicio)
            autoclavagem.save()

            equipamento = Equipamento.objects.get(
                pk=autoclavagem.equipamento.pk
            )
            equipamento.desalocar()
            equipamento.save()

            if autoclavagem.indicador:
                rastreabilidade_service = RastreabilidadeService(
                    etapa=EtapaAutoclavagemTeste(
                        request.user,
                        "finalizar",
                        autoclavagem,
                    ),
                )
                rastreabilidade_service.processar()
            else:
                rastreabilidade_service = RastreabilidadeService(
                    etapa=EtapaAutoclavagem(
                        autoclavagem.itens.all(),
                        request.user,
                        "finalizar",
                        autoclavagem,
                    ),
                )
                rastreabilidade_service.processar()
                estoque_service = EstoqueService()
                seriais = [
                    item.serial.idsequenciaetiqueta
                    for item in autoclavagem.itens.all()
                ]
                estoque_service.adicionar_ao_estoque(seriais)

            return SuccessNoContentResponse()
        except Http404 as exc:
            raise ValidationError(
                "Ciclo de esterilização inválido para esta ação.",
                "finalizar_ciclo_invalido",
            ) from exc

    @action(detail=True, methods=["post"], url_path="abortar")
    def abortar(self, request, pk=None):  # pylint: disable=unused-argument
        """Aborta o ciclo de esterilização."""
        try:
            autoclavagem = self.get_object()
            equipamento = Equipamento.objects.get(
                pk=autoclavagem.equipamento.pk
            )
            equipamento.desalocar()
            equipamento.save()
            rastreabilidade_service = RastreabilidadeService(
                etapa=EtapaAutoclavagem(
                    autoclavagem.itens.all(),
                    request.user,
                    "abortar",
                    autoclavagem,
                ),
            )

            rastreabilidade_service.processar()
            return SuccessNoContentResponse()
        except Http404 as exc:
            raise ValidationError(
                "Ciclo de esterilização inválido para esta ação.",
                "abortar_ciclo_invalido",
            ) from exc

    @action(detail=True, methods=["get"], url_path="dados-report")
    def dados_report(self, request, pk=None):
        """Retorna os dados do ciclo de esterilização para o report (PDF)
        Somente funciona para ciclos finalizados."""
        try:
            autoclavagem = self.get_object()
            serializer = AutoclavagemReportSerializer(autoclavagem)
            return Response(serializer.data)
        except Http404 as exc:
            raise ValidationError(
                f"Ciclo de esterilização {pk} inválido para esta ação.",
                "dadosreport_ciclo_invalido",
            ) from exc

    def destroy(self, request, *args, **kwargs):
        return MethodNotAllowedResponse()

    def update(self, request, *args, **kwargs):
        return MethodNotAllowedResponse()

    def partial_update(self, request, *args, **kwargs):
        return MethodNotAllowedResponse()

    def create(self, request, *args, **kwargs):
        return MethodNotAllowedResponse()


class SerialViewSet(CustomModelViewSet):
    """Viewset para visualizar os seriais"""

    queryset = Sequenciaetiqueta.objects.order_by("idsequenciaetiqueta").all()
    serializer_class = SerialDetalhadoSerializer
    http_method_names = ["get", "list"]
    search_fields = ["idsequenciaetiqueta"]

    @action(
        detail=False, methods=["get"], url_path="disponiveis-termodesinfeccao"
    )
    def disponiveis_para_termodesinfeccao(self, request):
        queryset = self.get_queryset().filter(
            Q(ultima_situacao=SerialSituacaoEnum.RECEBIDO.value)
            | Q(ultima_situacao=SerialSituacaoEnum.ABORTADO_TERMO.value)
        )
        serializer = self.get_serializer(queryset, many=True)
        return SuccessResponse(serializer.data)

    @action(
        detail=False, methods=["get"], url_path="disponiveis-esterilizacao"
    )
    def disponiveis_para_esterilizacao(self, request):
        queryset = self.get_queryset().filter(
            Q(ultima_situacao=SerialSituacaoEnum.EMBALADO.value)
        )
        serializer = self.get_serializer(queryset, many=True)
        return SuccessResponse(serializer.data)

    @action(
        detail=False,
        methods=["get"],
        url_path="disponiveis-distribuicao/(?P<pk_cliente>[^/.]+)",
        name="distribuicao-por-cliente",
    )
    def disponiveis_para_distribuicao(self, request, pk_cliente=None):
        try:
            cliente = Cliente.objects.get(pk=pk_cliente)
            queryset = self.get_queryset().filter(
                ultima_situacao=SerialSituacaoEnum.ESTOQUE.value,
                idcaixa__cliente=cliente,
            )
            serializer = self.get_serializer(queryset, many=True)
            return SuccessResponse(serializer.data)
        except Cliente.DoesNotExist as exc:
            raise NotFound(
                "Cliente não encontado.", "cliente_nao_encontado"
            ) from exc
        except Exception as exc:
            raise NotFound(f"Erro ao buscar a caixa. {str(exc)}") from exc


class ProdutoViewSet(CustomModelViewSet):
    """
    ViewSet para listar, criar, atualizar e deletar produtos
    """

    queryset = Produto.objects.exclude(tipo__isnull=False).order_by("-id")
    serializer_class = ProdutoSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = ProdutoFilter


class IndicadorViewSet(CustomModelViewSet):
    """
    ViewSet para listar, criar, atualizar e deletar indicadores de esterilização
    """

    queryset = IndicadoresEsterilizacao.objects.exclude(
        tipo__isnull=True
    ).order_by("-id")
    serializer_class = IndicadorEsterilizacaoSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = ProdutoFilter

    def create(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save()

            return SucessfullyCrudResponse(
                data=serializer.data,
                nome_entidade="Indicador",
                is_creation=True,
                campo_um=serializer.validated_data["codigo"],
                campo_dois=serializer.validated_data["descricao"],
                campo_tres=serializer.validated_data["tipo"],
            )
        except ValueError:
            return ErrorResponse(
                error_code="erro_validacao_dados",
                error_message="Erro de validação dos dados.",
                error_data=serializer.errors,
                status_code=status.HTTP_400_BAD_REQUEST,
            )

    def update(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            serializer = self.get_serializer(
                instance, data=request.data, partial=True
            )
            serializer.is_valid(raise_exception=True)
            serializer.save()

            return SucessfullyCrudResponse(
                data=serializer.data,
                nome_entidade="Indicador",
                is_creation=False,
                campo_um=serializer.validated_data["codigo"],
                campo_dois=serializer.validated_data["descricao"],
                campo_tres=serializer.validated_data["tipo"],
            )
        except ValueError:
            return ErrorResponse(
                error_code="erro_validacao_dados",
                error_message="Erro de validação dos dados.",
                error_data=serializer.errors,
                status_code=status.HTTP_400_BAD_REQUEST,
            )

    def destroy(self, request, *args, **kwargs):
        indicador = self.get_object()
        lotes = Lote.objects.filter(indicador=indicador)
        lotes_usados = []
        for lote in lotes:
            if lote.is_usado:
                lotes_usados.append(lote.codigo)
        if lotes_usados:
            raise PermissionDenied(
                f"Não é possível excluir indicador com lotes usados: {', '.join(lotes_usados)}."
            )
        lotes.delete()
        indicador.delete()
        return SuccessNoContentResponse()


class LoteViewSet(CustomModelViewSet):
    serializer_class = LoteIndicadorEsterilizacaoSerializer
    queryset = Lote.objects.all().order_by("-id")
    filter_backends = [DjangoFilterBackend]
    filterset_class = LoteIndicadorEsterilizacaoFilter

    def get_queryset(self):
        indicador_id = self.kwargs.get("indicador_id")
        return self.queryset.filter(indicador__id=indicador_id)

    def get_lote(self):
        queryset = self.get_queryset()
        pk = self.kwargs.get("pk")
        obj = get_object_or_404(queryset, pk=pk)
        return obj

    def perform_create(self, serializer):
        indicador_id = self.kwargs.get("indicador_id")
        indicador = get_object_or_404(
            IndicadoresEsterilizacao, pk=indicador_id
        )
        serializer.save(indicador=indicador)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(
            instance, data=request.data, partial=True
        )
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        lote = self.get_lote()
        if lote.is_usado:
            raise PermissionDenied("Lote usado não pode ser excluído.")
        lote.delete()
        return SuccessNoContentResponse()

    @transaction.atomic()
    @action(detail=True, methods=["post"], url_path="movimentacao")
    def registrar_movimentacao_lote(
        self, request, indicador_id=None, pk=None
    ):  # pylint: disable=unused-argument
        try:
            lote = self.get_object()
            serializer = MovimentacaoLoteSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)

            movimentacao_service = MovimentacaoIndicadoresService(
                lote=lote,
                operacao=serializer.validated_data["operacao"],
                quantidade=serializer.validated_data["quantidade"],
                user=request.user,
            )
            movimentacao = movimentacao_service.main()

            movimentacao_serializer = MovimentacaoLoteSerializer(movimentacao)
            return Response(
                movimentacao_serializer.data, status=status.HTTP_201_CREATED
            )
        except ValueError:
            return ErrorResponse(
                error_code="erro_validacao_dados",
                error_message="Erro de validação dos dados.",
                error_data=serializer.errors,
                status_code=status.HTTP_400_BAD_REQUEST,
            )


class ProcessoTermodesinfeccaoViewSet(CustomModelViewSet):
    serializer_class = CicloTermodesinfeccaoResponseSerializer

    def get_queryset(self):
        if "pk" in self.kwargs:
            if self.action == "retrieve":
                return Termodesinfeccao.objects.todos_ciclos()

            if self.action == "dados_report":
                return Termodesinfeccao.objects.ciclos_finalizados()

        return Termodesinfeccao.objects.ciclos_em_andamento()

    @action(detail=True, methods=["post"], url_path="finalizar")
    @transaction.atomic
    def finalizar(self, request, pk=None):  # pylint: disable=unused-argument
        """Finaliza o ciclo de termodesinfeccao."""
        try:
            termodesinfeccao = self.get_object()
            termodesinfeccao.duracao = helpers.diff_dates(
                termodesinfeccao.datainicio
            )
            termodesinfeccao.save()

            equipamento = Equipamento.objects.get(
                pk=termodesinfeccao.equipamento.pk
            )
            equipamento.desalocar()
            equipamento.save()
            rastreabilidade_service = RastreabilidadeService(
                etapa=EtapaTermodesinfeccao(
                    termodesinfeccao.itens.all(),
                    request.user,
                    "finalizar",
                    termodesinfeccao,
                ),
            )

            rastreabilidade_service.processar()

            return SuccessNoContentResponse()
        except Http404 as exc:
            raise ValidationError(
                "Ciclo de termodesinfeccao inválido para esta ação.",
                "finalizar_ciclo_invalido",
            ) from exc

    @action(detail=True, methods=["post"], url_path="abortar")
    def abortar(self, request, pk=None):  # pylint: disable=unused-argument
        """Aborta o ciclo de termodesinfeccao."""
        try:
            termodesinfeccao = self.get_object()
            equipamento = Equipamento.objects.get(
                pk=termodesinfeccao.equipamento.pk
            )
            equipamento.desalocar()
            equipamento.save()
            rastreabilidade_service = RastreabilidadeService(
                etapa=EtapaTermodesinfeccao(
                    termodesinfeccao.itens.all(),
                    request.user,
                    "abortar",
                    termodesinfeccao,
                ),
            )

            rastreabilidade_service.processar()
            return SuccessNoContentResponse()
        except Http404 as exc:
            raise ValidationError(
                "Ciclo de termodesinfeccao inválido para esta ação.",
                "abortar_ciclo_invalido",
            ) from exc

    @action(detail=True, methods=["get"], url_path="dados-report")
    def dados_report(self, request, pk=None):
        """Retorna os dados do ciclo de termodesinfeccao para o report (PDF)
        Somente funciona para ciclos finalizados."""
        try:
            termodesinfeccao = self.get_object()
            serializer = TermodesinfeccaoReportSerializer(termodesinfeccao)
            return Response(serializer.data)
        except Http404 as exc:
            raise ValidationError(
                f"Ciclo de termodesinfeccao {pk} inválido para esta ação.",
                "dadosreport_ciclo_invalido",
            ) from exc

    def retrieve(self, request, *args, **kwargs):
        dados_retrieve = super().retrieve(request, *args, **kwargs)
        dados_retrieve.data["data"]["total_itens"] = len(
            dados_retrieve.data["data"]["itens"]
        )

        return dados_retrieve

    def destroy(self, request, *args, **kwargs):
        return MethodNotAllowedResponse()

    def update(self, request, *args, **kwargs):
        return MethodNotAllowedResponse()

    def partial_update(self, request, *args, **kwargs):
        return MethodNotAllowedResponse()

    def create(self, request, *args, **kwargs):
        return MethodNotAllowedResponse()


class TipoPacoteViewSet(CustomModelViewSet):
    """
    ViewSet para listar, criar, atualizar e deletar tipos de produtos
    """

    queryset = Tipopacote.objects.order_by("-idtipopacote").all()
    serializer_class = TipoPacoteSerializer


class SubTipoProdutoViewSet(CustomModelViewSet):
    """
    ViewSet para listar, criar, atualizar e deletar subtipo
    """

    queryset = Subtipoproduto.objects.order_by("idsubtipoproduto").all()
    serializer_class = SubTipoProdutoSerializer


class EquipamentoViewSet(CustomModelViewSet):
    """
    ViewSet para listar, criar, atualizar e deletar equipamentos
    """

    queryset = Equipamento.objects.order_by("-idequipamento").all()
    serializer_class = EquipamentoSerializer

    @action(
        detail=False,
        methods=["get"],
        url_path="uuid/(?P<uuid>[^/.]+)",
        url_name="uuid",
    )
    def uuid(self, request, uuid=None):
        """Retorna o uuid do equipamento"""
        try:
            uuid = helpers.validate_uuid(uuid)
            queryset = self.get_queryset()
            equipamento = queryset.get(uuid=uuid)
            tipo = request.query_params.get("tipo", None)

            if tipo and equipamento.tipo != tipo:
                raise ValidationError(
                    f"Equipamento {equipamento.descricao} é do tipo"
                    f"{TipoEquipamentoEnum(equipamento.tipo).label}. "
                    f"Tipo esperado: {TipoEquipamentoEnum(tipo).label}.",
                )
            return Response(
                self.format_response(
                    data=[EquipamentoSerializer(equipamento).data],
                    request=request,
                )
            )

        except Http404 as exc:
            raise ValidationError(
                f"Equipamento {uuid} inválido para esta ação.",
                "uuid_equipamento_invalido",
            ) from exc
        except ValidationError as exc:
            raise exc
        except Exception as exc:
            raise ValidationError(
                f"Erro ao buscar equipamento. {str(exc)}"
            ) from exc

    def create(self, request, *args, **kwargs):
        try:
            if request.data.get("data_fabricacao") == "":
                request.data["data_fabricacao"] = None
            return super().create(request, *args, **kwargs)
        except Exception as e:
            raise ValidationError(str(e)) from e

    def update(self, request, *args, **kwargs):
        try:
            if request.data.get("data_fabricacao") == "":
                request.data["data_fabricacao"] = None
            return super().update(request, *args, **kwargs)
        except Exception as e:
            raise ValidationError(str(e)) from e

    def retrieve(self, request, *args, **kwargs):
        try:
            ultima_manutencao = RegistroManutencao.objects.filter(
                equipamento=self.get_object()
            ).latest("equipamento_id")

            response = super().retrieve(request, *args, **kwargs)

            if ultima_manutencao:
                response.data["data"][
                    "ultima_manutencao"
                ] = RegistroManutencaoSerializer(ultima_manutencao).data

            return response
        except RegistroManutencao.DoesNotExist:
            return super().retrieve(request, *args, **kwargs)


class RegistroManutencaoViewSet(CustomModelViewSet):
    """
    ViewSet para listar, criar, atualizar e deletar registros de manutenção
    """

    queryset = RegistroManutencao.objects.order_by("-id").all()
    serializer_class = RegistroManutencaoSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["equipamento"]
    search_fields = ["equipamento__observacao"]
    http_method_names = ["get", "patch", "post"]

    def get_queryset(self):
        queryset = super().get_queryset()
        idequipamento = self.request.query_params.get("equipamento", None)
        if idequipamento is not None:
            queryset = queryset.filter(equipamento=idequipamento)
        return queryset

    @action(
        detail=True,
        methods=["patch"],
        url_path="finalizar-manutencao",
        url_name="finalizar_manutencao",
    )
    def finalizar_manutencao(self, request, *args, **kwargs):
        try:
            registro = self.get_object()
            registro.fim = datetime.now()
            registro.equipamento.disponivel = True
            registro.equipamento.save()
            registro.save()

            Equipamento.objects.filter(
                idequipamento=registro.equipamento_id
            ).update(
                ultima_manutencao=datetime.now().date(),
                proxima_manutencao=None,
            )

            return Response(
                {"message": "Manutenção finalizada e equipamento liberado."},
                status=status.HTTP_200_OK,
            )
        except RegistroManutencao.DoesNotExist:
            return Response(
                {"error": "Registro de manutenção não encontrado."},
                status=status.HTTP_404_NOT_FOUND,
            )

    @action(
        detail=False,
        methods=["get"],
        url_path="manutencoes-planejadas-equipamento",
        url_name="manutencoes_planejadas_equipamento",
    )
    def manutencoes_planejadas_equipamento(self, request):
        try:
            equipamento = request.query_params.get("equipamento", None)
            if equipamento is None:
                raise ValidationError("Equipamento não informado.")

            queryset = self.get_queryset().filter(
                equipamento=equipamento,
                fim_planejado__isnull=False,
                inicio_planejado__isnull=False,
                inicio__isnull=True,
            )
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)
        except ValidationError as e:
            raise e

    @action(
        detail=False,
        methods=["post"],
        url_path="planejar-manutencao",
        url_name="planejar_manutencao",
    )
    def planejar_manutencao(self, request, *args, **kwargs):
        try:
            request.data["usuario"] = request.user.id
            if (
                request.data.get("inicio_planejado") == ""
                and request.data.get("fim_planejado") == ""
            ):
                raise ValidationError(
                    "As datas de início e fim da manutenção não podem ser nulas."
                )
            Equipamento.objects.filter(
                idequipamento=request.data["equipamento"]
            ).update(proxima_manutencao=datetime.now().date())

            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return SuccessResponse(serializer.data, status.HTTP_201_CREATED)
        except ValidationError as e:
            raise e
        except Exception as e:
            raise ValidationError(str(e)) from e

    @action(
        detail=False,
        methods=["patch"],
        url_path="iniciar-manutencao",
        url_name="iniciar_manutencao",
    )
    def iniciar_manutencao(self, request, *args, **kwargs):
        try:
            registro = RegistroManutencao.objects.get(id=request.data["id"])
            if registro.inicio:
                raise ValidationError("Manutenção já foi iniciada.")

            Equipamento.objects.filter(
                idequipamento=registro.equipamento_id
            ).update(disponivel=False)

            registro.inicio = datetime.now()
            registro.descricao = request.data["descricao"]
            registro.save()
            return Response(
                {"message": "Manutenção iniciada com sucesso."},
                status=status.HTTP_200_OK,
            )
        except RegistroManutencao.DoesNotExist:
            return Response(
                {"error": "Registro de manutenção não encontrado."},
                status=status.HTTP_404_NOT_FOUND,
            )
        except Exception as e:
            raise e

    def create(self, request, *args, **kwargs):
        try:
            request.data["inicio"] = datetime.now()
            request.data["usuario"] = request.user.id
            request.data["tipo"] = "CR"
            if RegistroManutencao.objects.filter(
                equipamento_id=request.data["equipamento"],
                fim__isnull=True,
                inicio__isnull=False,
            ).exists():
                raise ValidationError("Equipamento já está em manutenção.")

            novo_registro = super().create(request, *args, **kwargs)

            Equipamento.objects.filter(
                idequipamento=request.data["equipamento"]
            ).update(
                disponivel=False,
            )

            return novo_registro

        except ValidationError as e:
            raise e
        except Exception as e:
            raise ValidationError(str(e)) from e

    def list(self, request, *args, **kwargs):
        try:
            queryset = self.get_queryset()

            serializer = self.serializer_class(queryset, many=True)
            page = self.paginate_queryset(queryset)
            if page is not None:
                serializer = self.get_serializer(page, many=True)
                response = self.get_paginated_response(serializer.data)

            return Response(
                self.format_response(data=response.data, request=request)
            )

        except Exception as e:
            raise ValidationError(str(e)) from e


class RegistroHistoricoCaixaViewSet(CustomModelViewSet):
    queryset = Evento.objects.order_by("-idevento").all()
    serializer_class = EventoSerializerReduzido
    http_method_names = ["get"]

    def paginate_ciclos(self, ciclos, request):
        page_size = request.query_params.get("page_size", 10)
        paginator = Paginator(ciclos, page_size)
        page_number = request.query_params.get("page", 1)
        page_obj = paginator.get_page(page_number)

        return page_obj

    def get_queryset(self):
        serial = self.request.query_params.get("serial", None)

        if not serial:
            raise ValidationError("Serial não informado.")

        queryset = self.queryset.filter(idsequenciaetiqueta=serial)

        if self.request.query_params.get("data_inicial", None):
            data_inicial = datetime.strptime(
                self.request.query_params.get("data_inicial"), "%d/%m/%Y"
            )
            queryset = queryset.filter(created_at__gte=data_inicial)

        if self.request.query_params.get("data_final", None):
            data_final = datetime.strptime(
                self.request.query_params.get("data_final"), "%d/%m/%Y"
            )
            queryset = queryset.filter(created_at__lte=data_final)

        return queryset

    def list(self, request, *args, **kwargs):
        try:
            ciclos = []
            ciclo_atual = []

            queryset = self.get_queryset()

            for evento in queryset:
                if evento.status == "DISTRIBUIDO":
                    ciclo_atual = []
                    ciclo_atual.append(evento)
                elif evento.status == "RECEBIDO":
                    ciclo_atual.append(evento)
                    ciclos.append(ciclo_atual)
                    ciclo_atual = []
                else:
                    ciclo_atual.append(evento)

            if ciclo_atual:
                ciclos.append(ciclo_atual)

            if queryset.count() == 0:
                raise ValidationError("Nenhum registro encontrado.")

            page = self.paginate_ciclos(ciclos, request)
            serialized_data = [
                self.serializer_class(ciclo, many=True).data for ciclo in page
            ]

            meta = {
                "currentPage": page.number,
                "totalItems": page.paginator.count,
                "firstItem": page.start_index(),
                "lastItem": page.end_index(),
                "itemsPerPage": page.paginator.per_page,
                "totalPages": page.paginator.num_pages,
                "next": page.next_page_number() if page.has_next() else None,
                "previous": (
                    page.previous_page_number()
                    if page.has_previous()
                    else None
                ),
            }

            response_data = {
                "status": "success",
                "data": serialized_data,
                "meta": meta,
            }

            return Response(response_data)

        except Exception as e:
            raise e

    @action(
        detail=False,
        methods=["get"],
        url_path="historico-pdf",
        url_name="historico_pdf",
    )
    def historico_pdf(self, request, *args, **kwargs):
        try:
            ciclos = []
            ciclo_atual = []

            queryset = self.get_queryset()

            for evento in queryset:
                if evento.status == "DISTRIBUIDO":
                    ciclo_atual = []
                    ciclo_atual.append(evento)
                elif evento.status == "RECEBIDO":
                    ciclo_atual.append(evento)
                    ciclos.append(ciclo_atual)
                    ciclo_atual = []
                else:
                    ciclo_atual.append(evento)

            if ciclo_atual:
                ciclos.append(ciclo_atual)

            if queryset.count() == 0:
                raise ValidationError("Nenhum registro encontrado.")

            serialized_data = [
                self.serializer_class(ciclo, many=True).data
                for ciclo in ciclos
            ]

            response_data = {
                "status": "success",
                "data": serialized_data,
            }

            return Response(response_data)

        except Exception as e:
            raise e
