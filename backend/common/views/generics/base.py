from django.db.models import IntegerField, OuterRef, Prefetch, Subquery, Sum
from django.http import Http404

from common import helpers
from common.filters import (
    AutoclavagemFilter,
    DistribuicaoFilter,
    EventoFilter,
    ModelosPorClienteFilter,
    RecebimentoFilter,
    TermodesinfeccaoFilter,
)
from common.models import (
    Autoclavagem,
    Distribuicao,
    Estoque,
    Evento,
    Itemdistribuicao,
    Itemproducao,
    Itemrecebimento,
)
from common.models import Producao as Preparo
from common.models import Recebimento, Sequenciaetiqueta, Termodesinfeccao
from common.permissions import ClientePermission, GroupPermission
from common.responses import SuccessResponse
from common.serializers import (
    CaixaComSeriaisPorClienteSerializer,
    CaixaDetailSerializer,
    CaixaSerialSerializer,
    CaixasRecebidasSerializer,
    CiclosEsterilizacaoSerializer,
    CiclosTermodesinfeccaoSerializer,
    ClientePorEstoqueSerializer,
    DistribuicaoSerializer,
    EstoqueFiltradoPorClienteSerializer,
    EstoquePorClienteSerializer,
    EtiquetaEmbalagemPreparoSerializer,
    ItensAPrepararSerializer,
    ItensDistribuidosSerializer,
    ItensPreparadosSerializer,
    ProcessoEsterilizacaoItensPendentesSerializer,
    RecebimentoReportSerializer,
    RecebimentosPendentesResumoSerializer,
    RecebimentosPendentesSerializer,
)
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import status
from rest_framework.exceptions import APIException, NotFound, ValidationError
from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response


class CustomPagination(PageNumberPagination):
    def get_paginated_response(self, data):
        paginator = self.page.paginator

        meta_data = {
            "currentPage": int(self.request.query_params.get("page", 1)),
            "totalItems": paginator.count,
            "itemsPerPage": paginator.per_page,
            "totalPages": paginator.num_pages,
            "next": self.get_next_link(),
            "previous": self.get_previous_link(),
        }

        return Response(
            {"status": "success", "data": data, "meta": meta_data},
            status=status.HTTP_200_OK,
        )


class NoPaginationListAPIView(ListAPIView):
    pagination_class = None

    def list(self, request, *args, **kwargs):
        list_response = super().list(request, *args, **kwargs)
        return Response({"status": "success", "data": list_response.data})


class CaixaDetailRetrieve(RetrieveAPIView):
    """
    Recupera detalhes de uma "Caixa" específica pelo seu número de série.

    Este endpoint fornece informações detalhadas sobre uma "Caixa"
    quando fornecido seu número de série.
    """

    permission_classes = permission_classes = [
        GroupPermission(
            ["ENFERMAGEM", "SUPERVISAOENFERMAGEM", "TECNICORECEBIMENTO"]
        )
    ]
    queryset = Sequenciaetiqueta.objects.all()
    serializer_class = CaixaDetailSerializer
    lookup_field = "idsequenciaetiqueta"
    lookup_url_kwarg = "serial"

    def retrieve(self, request, *args, **kwargs):
        try:
            instance = self.get_object()

            serializer = self.get_serializer(instance)
        except Http404 as exc:
            serial = kwargs["serial"]
            raise NotFound(
                detail=f"Caixa {serial} não encontrada.",
                code="caixa_nao_encontrada",
            ) from exc
        except Exception as e:
            raise APIException(
                f"Erro ao recuperar detalhes da caixa. Erro: {e}"
            ) from e

        return Response({"status": "success", "data": serializer.data})


class CaixasPorCliente(NoPaginationListAPIView):
    """
    Recupera todas as "Caixas" de um cliente.

    Este endpoint fornece informações sobre todas as "Caixas" de um cliente.
    """

    permission_classes = [GroupPermission("CLIENTE"), ClientePermission]
    serializer_class = CaixaSerialSerializer

    def get_queryset(self):
        cliente = self.request.user.idprofissional.cliente
        caixas = cliente.modelos_caixa
        sequencias = Sequenciaetiqueta.objects.filter(
            idcaixa__in=caixas
        ).order_by("idsequenciaetiqueta")
        return sequencias


class ItensAPrepararView(ListAPIView):
    """Lista os itens que estão pendentes de preparo."""

    serializer_class = ItensAPrepararSerializer
    pagination_class = CustomPagination

    def get_queryset(self):
        return Evento.objects.com_status_termo_fim_ou_abortado()


class ItensPreparadosView(ListAPIView):
    """Lista os itens cuja última etapa foi o preparo."""

    serializer_class = ItensPreparadosSerializer
    pagination_class = CustomPagination
    filter_backends = [DjangoFilterBackend]
    filterset_class = EventoFilter

    def get_queryset(self):
        return Evento.objects.com_status_embalado()


class PreparoDadosReportView(RetrieveAPIView):
    """Endpoint que retorna os dados necessários para
    impressão da etiqueta de embalagem."""

    serializer_class = EtiquetaEmbalagemPreparoSerializer
    lookup_field = "pk"

    def get_queryset(self):
        return Preparo.objects.prefetch_related(
            Prefetch(
                "itens",
                queryset=Itemproducao.objects.select_related(
                    "iditemcaixa__produto",
                    "idsequenciaetiqueta__idcaixa__embalagem",
                    "idsequenciaetiqueta__idcaixa__cliente",
                ),
            )
        ).annotate(quantidade=Sum("itens__quantidade"))


class ProcessoEsterilizacaoPendentesView(ListAPIView):
    """Lista os itens que estão pendentes de esterilização (auto-clavagem)."""

    serializer_class = ProcessoEsterilizacaoItensPendentesSerializer
    pagination_class = CustomPagination

    def get_queryset(self):
        return Evento.objects.com_status_embalado()


class ItensEsterilizacaoAcompanhamentoView(ListAPIView):
    """Lista os ciclos cuja última etapa foi a autoclavagem,
    seja iniciada ou ja finalizada."""

    serializer_class = CiclosEsterilizacaoSerializer
    pagination_class = CustomPagination
    filter_backends = [DjangoFilterBackend]
    filterset_class = AutoclavagemFilter

    def get_queryset(self):
        if self.request.query_params:
            return Autoclavagem.objects.todos_ciclos()
        return Autoclavagem.objects.ciclos_em_andamento()


class EstoquePorClientesView(ListAPIView):
    """Lista o estoque de cada cliente,agrupando por modelos de caixa."""

    serializer_class = EstoquePorClienteSerializer
    pagination_class = CustomPagination
    filter_backends = (DjangoFilterBackend,)
    filterset_class = ModelosPorClienteFilter

    def get_queryset(self):
        if not self.request.query_params.get("cliente"):
            raise ValidationError("É necessário informar o id do cliente")

        cliente = self.request.query_params.get("cliente")
        return Estoque.objects.modelos_por_cliente(cliente)

    def list(self, request, *args, **kwargs):
        try:
            return super().list(request, *args, **kwargs)
        except Exception as exc:
            raise ValidationError(
                detail=f"Erro ao buscar estoque de modelos: {exc}",
                code="erro_buscar_modelos",
            ) from exc


class ClientesPorEstoqueView(ListAPIView):
    """
    Lista clientes ativos com caixas em armazenamento junto a um dicionario
    com informações gerais sobre seu estoque
    """

    serializer_class = ClientePorEstoqueSerializer
    pagination_class = CustomPagination

    def get_queryset(self):
        clientes = self.request.query_params.getlist("clientes[]", [])

        if not all(i.isdigit() for i in clientes):
            raise ValidationError(
                "A lista de clientes deve conter apenas números inteiros."
            )

        return Estoque.objects.get_clientes_com_caixas_em_distribuicao(
            clientes
        )

    def list(self, request, *args, **kwargs):
        try:
            return super().list(request, *args, **kwargs)
        except Exception as exc:
            raise ValidationError(
                detail=f"Erro ao recuperar estoque de clientes. Erro: {exc.detail[0]}",
                code="erro_buscar_clientes",
            ) from exc


class CaixasComSeriaisPorClienteView(ListAPIView):
    serializer_class = CaixaComSeriaisPorClienteSerializer
    pagination_class = CustomPagination

    def get_queryset(self):
        if not self.request.query_params.get("cliente_id"):
            raise ValidationError("Informe o id do cliente")

        cliente_id = self.request.query_params.get("cliente_id")
        search = self.request.query_params.get("search", None)
        return Estoque.objects.get_caixas_by_cliente_and_group_sequenciais(
            cliente_id, search
        )

    def list(self, request, *args, **kwargs):
        try:
            return super().list(request, *args, **kwargs)
        except Exception as exc:
            raise ValidationError(
                detail=f"Erro ao buscar estoque de sequenciais: {exc}",
                code="erro_buscar_modelos",
            ) from exc


class SeriaisPorClientesView(NoPaginationListAPIView):
    """Lista os sequenciais que estao no estoque para cada cliente,
    agrupando por modelos de caixa."""

    serializer_class = EstoqueFiltradoPorClienteSerializer

    def get_queryset(self):
        cliente = self.request.query_params.get("cliente")
        modelo = self.request.query_params.get("modelo")
        return Estoque.objects.sequenciais_por_cliente(cliente, modelo)

    def list(self, request, *args, **kwargs):
        try:
            queryset = self.get_queryset()
            serialized_data = EstoqueFiltradoPorClienteSerializer(
                queryset, many=True
            ).data
            return SuccessResponse(data=serialized_data[0])
        except Exception as exc:
            raise APIException(
                detail=f"Erro ao buscar caixas: {exc}",
                code="erro_buscar_caixa",
            ) from exc


class CaixasDistribuidasView(ListAPIView):
    """Lista os itens cuja última etapa foi o preparo."""

    serializer_class = ItensDistribuidosSerializer
    pagination_class = CustomPagination
    filter_backends = [DjangoFilterBackend]
    filterset_class = DistribuicaoFilter

    def get_queryset(self):
        return Evento.objects.com_status_distribuido()


class DistribuicaoRelatorioView(ListAPIView):
    """
    Recupera todas as "Caixas" que ja estao na etapa de distribuicao.
    Este endpoint fornece informações sobre todas as "Caixas" de todos os clientes.
    """

    def __init__(self):
        self.page = None

    permission_classes = [GroupPermission("TECNICORECEBIMENTO")]
    serializer_class = DistribuicaoSerializer
    pagination_class = CustomPagination

    def get_queryset(self):
        distribuicao_id = self.request.query_params.get("id")
        if not distribuicao_id:
            raise NotFound(detail="Não existem dados para essa distribuicao")

        distribuicao = Distribuicao.objects.get(iddistribuicao=distribuicao_id)
        caixa_distribuida = Itemdistribuicao.objects.filter(
            iddistribuicao=distribuicao
        )
        if not caixa_distribuida:
            raise NotFound(detail="Não existem dados para essa distribuicao")

        return caixa_distribuida

    # TODO: refatorar para remover lógica negócio da view
    def amounted_return(self):
        returns = []

        for box in self.get_queryset():
            instance_box = Sequenciaetiqueta.objects.get(
                idsequenciaetiqueta=box.idsequenciaetiqueta
            )

            delivered_info = Distribuicao.objects.get(
                iddistribuicao=box.iddistribuicao.iddistribuicao
            )

            result = {
                "status": delivered_info.status,
                "cliente": {
                    "id": instance_box.cliente.idcli,
                    "nome": instance_box.cliente.nome_exibicao,
                },
                "data_distribuicao": helpers.date_format(
                    delivered_info.datadistribuicao, "F"
                ),
                "setor": box.iddistribuicao.setor.descricao
                if box.iddistribuicao.setor
                else None,
                "usuario": delivered_info.idusu.idprofissional.nome,
                "codigo_distribuicao": delivered_info.iddistribuicao,
                "caixas": [
                    {
                        "serial": box.idsequenciaetiqueta.idsequenciaetiqueta,
                        "nome_caixa": box.idsequenciaetiqueta.idcaixa.nome,
                    }
                    for box in self.get_queryset()
                ],
            }

            returns.append(result)
            break
        return returns

    def list(self, request, *args, **kwargs):
        try:
            return Response(
                {"status": "success", "data": self.amounted_return()},
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            raise ValidationError(
                detail=f"Erro ao recuperar estoque de clientes. Erro: {e}",
                code="erro_buscar_clientes",
            ) from e


class CaixasRecebidas(ListAPIView):
    """Lista as caixas que passaram pelo recebimento"""

    serializer_class = CaixasRecebidasSerializer
    pagination_class = CustomPagination
    filter_backends = [DjangoFilterBackend]
    filterset_class = RecebimentoFilter

    def get_queryset(self):
        if self.request.query_params.get("abortadas"):
            return Evento.objects.com_status_recebido_ou_abortado()
        return Evento.objects.com_status_recebido()


class RecebimentoDadosReportView(RetrieveAPIView):
    """Endpoint que retorna os dados necessários para
    gerar dados para PDF dos itens do recebimento."""

    serializer_class = RecebimentoReportSerializer
    lookup_field = "pk"

    def get_queryset(self):
        serial = self.request.query_params.get("sequencial")
        queryset_item = Itemrecebimento.objects.filter(
            idsequenciaetiqueta=serial
        )
        if not queryset_item:
            raise APIException("Serial inválido")

        queryset = Recebimento.objects.prefetch_related(
            Prefetch(
                "itens",
                queryset=queryset_item.select_related(
                    "idrecebimento",
                    "idsequenciaetiqueta__idcaixa__embalagem",
                    "idsequenciaetiqueta__idcaixa__cliente",
                ),
            )
        ).annotate(
            quantidade=Subquery(
                queryset_item.filter(idrecebimento=OuterRef("idrecebimento"))
                .values("idrecebimento")
                .annotate(total_quantidade=Sum("quantidade"))
                .values("total_quantidade"),
                output_field=IntegerField(),
            )
        )

        return queryset


class ItensTermoAcompanhamentoView(ListAPIView):
    """Lista os ciclos cuja última etapa foi a termodesinfeccao,
    seja iniciada ou ja finalizada."""

    serializer_class = CiclosTermodesinfeccaoSerializer
    pagination_class = CustomPagination
    filter_backends = [DjangoFilterBackend]
    filterset_class = TermodesinfeccaoFilter

    def get_queryset(self):
        if self.request.query_params:
            return Termodesinfeccao.objects.todos_ciclos()
        return Termodesinfeccao.objects.ciclos_em_andamento()


class RecebimentoAguardandoConferencia(ListAPIView):
    """Lista as caixas a serem recebidas."""

    serializer_class = RecebimentosPendentesSerializer
    pagination_class = CustomPagination

    def get_queryset(self):
        return Sequenciaetiqueta.objects.caixas_aguardando_conferencia()

    def list(self, request, *args, **kwargs):
        response_data = super().list(request, *args, **kwargs)
        response_data.data["data"] = {"paginated": response_data.data["data"]}

        queryset_element = self.get_queryset().first()
        if queryset_element:
            summerized_data = RecebimentosPendentesResumoSerializer(
                queryset_element
            ).data
            response_data.data["data"]["summarized"] = summerized_data

            summerized_data["por_cliente"] = sorted(
                summerized_data["por_cliente"],
                key=lambda x: x["quantidade"],
                reverse=True,
            )

            response_data.data["data"]["summarized"] = summerized_data

        paginated_data = response_data.data
        return Response(paginated_data)
