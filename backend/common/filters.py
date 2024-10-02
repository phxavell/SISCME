from django.db.models import Q

import django_filters

from .models import (
    Autoclavagem,
    Caixa,
    Cliente,
    Diario,
    Estoque,
    Evento,
    Lote,
    Produto,
    Termodesinfeccao,
)


class EventoFilter(django_filters.FilterSet):
    data_de = django_filters.IsoDateTimeFilter(
        field_name="dataproducao", lookup_expr="gte"
    )
    data_ate = django_filters.IsoDateTimeFilter(
        field_name="dataproducao", lookup_expr="lte"
    )
    serial = django_filters.CharFilter(field_name="idsequenciaetiqueta")

    class Meta:
        model = Evento
        fields = ["data_de", "data_ate", "serial"]


class DiarioFilter(django_filters.FilterSet):
    data_de = django_filters.IsoDateTimeFilter(
        field_name="dataabertura", lookup_expr="gte"
    )
    data_ate = django_filters.IsoDateTimeFilter(
        field_name="dataabertura", lookup_expr="lte"
    )
    status = django_filters.CharFilter(
        field_name="status", lookup_expr="icontains"
    )
    setor = django_filters.CharFilter(
        field_name="idsetor__descricao", lookup_expr="icontains"
    )
    cliente = django_filters.CharFilter(
        field_name="idcli__nomecli", lookup_expr="icontains"
    )

    class Meta:
        model = Diario
        fields = ["data_de", "data_ate", "status", "setor", "cliente"]


class AutoclavagemFilter(django_filters.FilterSet):
    data_de = django_filters.IsoDateTimeFilter(
        field_name="datainicio", lookup_expr="gte"
    )
    data_ate = django_filters.IsoDateTimeFilter(
        field_name="datainicio", lookup_expr="lte"
    )
    situacao_atual = django_filters.CharFilter(method="filtra_por_status")
    ciclo = django_filters.NumberFilter(field_name="ciclo")
    serial = django_filters.CharFilter(method="filtra_por_serial")
    indicador = django_filters.CharFilter(method="filter_indicador")

    def filter_indicador(
        self, queryset, name, value
    ):  # pylint: disable=unused-argument
        return queryset.exclude(indicador__isnull=True)

    def filtra_por_serial(
        self, queryset, name, value
    ):  # pylint: disable=unused-argument
        return queryset.filter(itens__serial=value)

    def filtra_por_status(
        self, queryset, name, value
    ):  # pylint: disable=unused-argument
        if value == Autoclavagem.Status.INICIADO:
            return queryset.filter(
                statusinicio=value,
                statusfim__isnull=True,
                statusabortado__isnull=True,
            )

        if value == Autoclavagem.Status.FINALIZADO:
            return queryset.filter(statusfim=value)

        if value == Autoclavagem.Status.ABORTADO:
            return queryset.filter(statusabortado=value)

        return queryset

    class Meta:
        model = Autoclavagem
        fields = ["data_de", "data_ate", "ciclo", "situacao_atual"]


class TermodesinfeccaoFilter(django_filters.FilterSet):
    data_de = django_filters.IsoDateTimeFilter(
        field_name="datainicio", lookup_expr="gte"
    )
    data_ate = django_filters.IsoDateTimeFilter(
        field_name="datainicio", lookup_expr="lte"
    )
    situacao_atual = django_filters.CharFilter(method="filtra_por_status")
    ciclo = django_filters.NumberFilter(field_name="ciclo")
    serial = django_filters.CharFilter(method="filtra_por_serial")

    def filtra_por_serial(
        self, queryset, name, value
    ):  # pylint: disable=unused-argument
        return queryset.filter(itens__serial=value)

    def filtra_por_status(
        self, queryset, name, value
    ):  # pylint: disable=unused-argument
        if value == Termodesinfeccao.Status.INICIADO:
            return queryset.filter(
                statusinicio=value,
                statusfim__isnull=True,
                statusabortado__isnull=True,
            )

        if value == Termodesinfeccao.Status.FINALIZADO:
            return queryset.filter(statusfim=value)

        if value == Termodesinfeccao.Status.ABORTADO:
            return queryset.filter(statusabortado=value)

        return queryset

    class Meta:
        model = Termodesinfeccao
        fields = ["data_de", "data_ate", "ciclo", "situacao_atual"]


class DistribuicaoFilter(django_filters.FilterSet):
    # TODO Verificar pq datadistribuicao nao e inserida na tabela
    # TODO Como acessar a distribuicao apartir do evento
    data_de = django_filters.IsoDateTimeFilter(
        field_name="dataevento", lookup_expr="gte"
    )
    data_ate = django_filters.IsoDateTimeFilter(
        field_name="dataevento", lookup_expr="lte"
    )
    cliente = django_filters.CharFilter(method="filtra_por_cliente")
    serial = django_filters.CharFilter(method="filtra_por_serial")
    setor = django_filters.CharFilter(
        field_name="iddistribuicao__setor__descricao",
        lookup_expr="icontains",
    )

    def filtra_por_serial(
        self, queryset, name, value
    ):  # pylint: disable=unused-argument
        return queryset.filter(idsequenciaetiqueta=value)

    def filtra_por_cliente(
        self, queryset, name, value
    ):  # pylint: disable=unused-argument
        return queryset.filter(nomecliente__icontains=value)

    class Meta:
        model = Evento
        fields = ["cliente", "serial", "data_de", "data_ate", "setor"]


class RecebimentoFilter(django_filters.FilterSet):
    # TODO Verificar pq datadistribuicao nao e inserida na tabela
    # TODO Como acessar a distribuicao apartir do evento
    data_de = django_filters.IsoDateTimeFilter(
        field_name="datarecebimento", lookup_expr="gte"
    )
    data_ate = django_filters.IsoDateTimeFilter(
        field_name="datarecebimento", lookup_expr="lte"
    )
    serial = django_filters.CharFilter(
        field_name="idsequenciaetiqueta", lookup_expr="icontains"
    )

    class Meta:
        model = Evento
        fields = ["serial", "data_de", "data_ate"]


class CaixaFilter(django_filters.FilterSet):
    data_de = django_filters.IsoDateTimeFilter(
        field_name="created_at", lookup_expr="gte"
    )
    data_ate = django_filters.IsoDateTimeFilter(
        field_name="created_at", lookup_expr="lte"
    )
    codigo_ou_nome = django_filters.CharFilter(
        method="filtra_por_codigo_ou_nome"
    )

    def filtra_por_codigo_ou_nome(
        self, queryset, name, value
    ):  # pylint: disable=unused-argument
        return queryset.filter(
            Q(codigo_modelo__icontains=value) | Q(nome__icontains=value)
        )

    class Meta:
        model = Caixa
        fields = ["data_de", "data_ate", "codigo_ou_nome"]


class ProdutoFilter(django_filters.FilterSet):
    descricao = django_filters.CharFilter(
        field_name="descricao", lookup_expr="icontains"
    )
    embalagem = django_filters.CharFilter(
        field_name="embalagem", lookup_expr="iexact"
    )
    subtipo = django_filters.CharFilter(
        field_name="idsubtipoproduto__descricao", lookup_expr="icontains"
    )
    tipo = django_filters.CharFilter(
        field_name="idtipopacote__descricao", lookup_expr="icontains"
    )

    class Meta:
        model = Produto
        fields = ["embalagem", "tipo", "subtipo", "descricao"]


class LoteIndicadorEsterilizacaoFilter(django_filters.FilterSet):
    codigo = django_filters.CharFilter(
        field_name="codigo", lookup_expr="icontains"
    )

    class Meta:
        model = Lote
        fields = ["codigo"]


class ClienteFilter(django_filters.FilterSet):
    nome = django_filters.CharFilter(
        field_name="nomecli", lookup_expr="icontains"
    )
    nomeabreviado = django_filters.CharFilter(
        field_name="nomeabreviado", lookup_expr="icontains"
    )
    nomefantasia = django_filters.CharFilter(
        field_name="nomefantasiacli", lookup_expr="icontains"
    )
    cnpj = django_filters.CharFilter(
        field_name="cnpjcli", lookup_expr="icontains"
    )

    class Meta:
        model = Cliente
        fields = ["nome", "nomeabreviado", "nomefantasia", "cnpj"]


class RelatorioFilter(django_filters.FilterSet):
    data_de = django_filters.IsoDateTimeFilter(
        field_name="created_at", lookup_expr="gte"
    )

    data_ate = django_filters.IsoDateTimeFilter(
        field_name="created_at", lookup_expr="lte"
    )

    class Meta:
        model = None
        fields = ["data_de", "data_ate"]


class RelatorioOcorrenciaFilter(RelatorioFilter):
    cliente = django_filters.CharFilter(
        field_name="idcli__idcli", lookup_expr="iexact"
    )

    tipo = django_filters.CharFilter(
        field_name="idindicador__id", lookup_expr="iexact"
    )

    class Meta:
        model = Diario
        fields = ["data_de", "data_ate", "cliente"]

    def filter_queryset(self, queryset):
        queryset = super().filter_queryset(queryset)

        cliente_filters = Q()
        for key, value in self.request.GET.items():
            if key.startswith("cliente_"):
                cliente_filters |= Q(idcli__idcli=value)

        if cliente_filters:
            queryset = queryset.filter(cliente_filters)

        return queryset


class RelatorioEficienciaAutoclavagemFilter(RelatorioFilter):
    equipamento = django_filters.CharFilter(
        field_name="idequipamento", lookup_expr="icontains"
    )

    class Meta:
        model = Autoclavagem
        fields = ["data_de", "data_ate", "equipamento"]

    def filter_queryset(self, queryset):
        queryset = super().filter_queryset(queryset)

        equipamento_filters = Q()
        for key, value in self.request.GET.items():
            if key.startswith("equipamento_"):
                equipamento_filters |= Q(equipamento=value)

        if equipamento_filters:
            queryset = queryset.filter(equipamento_filters)

        return queryset


class RelatorioEficienciaTermodesinfeccaoFilter(RelatorioFilter):
    equipamento = django_filters.CharFilter(
        field_name="idequipamento", lookup_expr="icontains"
    )

    class Meta:
        model = Termodesinfeccao
        fields = ["data_de", "data_ate", "equipamento"]

    def filter_queryset(self, queryset):
        queryset = super().filter_queryset(queryset)

        equipamento_filters = Q()
        for key, value in self.request.GET.items():
            if key.startswith("equipamento_"):
                equipamento_filters |= Q(equipamento=value)

        if equipamento_filters:
            queryset = queryset.filter(equipamento_filters)

        return queryset


class RelatorioProdutividadeFilter(RelatorioFilter):
    cliente = django_filters.CharFilter(
        field_name="cliente__idcli", lookup_expr="iexact"
    )

    class Meta:
        model = Evento
        fields = ["data_de", "data_ate", "cliente"]

    def filter_queryset(self, queryset):
        queryset = super().filter_queryset(queryset)

        cliente_filters = Q()
        for key, value in self.request.GET.items():
            if key.startswith("cliente_"):
                cliente_filters |= Q(cliente__idcli=value)

        if cliente_filters:
            queryset = queryset.filter(cliente_filters)

        return queryset


class RelatorioRegistroManutencoesFilter(RelatorioFilter):
    equipamento = django_filters.CharFilter(
        field_name="idequipamento", lookup_expr="icontains"
    )

    def filter_queryset(self, queryset):
        queryset = super().filter_queryset(queryset)

        equipamento_filters = Q()
        for key, value in self.request.GET.items():
            if key.startswith("equipamento_"):
                equipamento_filters |= Q(equipamento=value)

        if equipamento_filters:
            queryset = queryset.filter(equipamento_filters)

        return queryset

    class Meta:
        model = None
        fields = ["data_de", "data_ate", "equipamento"]


class RelatorioClassificacaoMaterialFilter(RelatorioFilter):
    produto = django_filters.CharFilter(
        field_name="idproduto", lookup_expr="icontains"
    )

    def filter_queryset(self, queryset):
        queryset = super().filter_queryset(queryset)

        produto_filters = Q()
        for key, value in self.request.GET.items():
            if key.startswith("tipomaterial_"):
                produto_filters |= Q(idproduto=value)

        if produto_filters:
            queryset = queryset.filter(produto_filters)

        return queryset


class ModelosPorClienteFilter(django_filters.FilterSet):
    search = django_filters.CharFilter(method="filtro_por_modelo_ou_descricao")

    def filtro_por_modelo_ou_descricao(
        self, queryset, name, value
    ):  # pylint: disable=unused-argument
        return queryset.filter(
            Q(serial__idcaixa__codigo_modelo__icontains=value)
            | Q(serial__idsequenciaetiqueta__icontains=value)
            | Q(serial__idcaixa__nome__icontains=value)
        )

    class Meta:
        model = Estoque
        fields = ["search"]


class LoteFilter(django_filters.FilterSet):
    search = django_filters.CharFilter(method="filtra_por_indicador_lote")

    def filtra_por_indicador_lote(
        self, queryset, name, value
    ):  # pylint: disable=unused-argument
        return queryset.filter(
            Q(codigo__icontains=value)
            | Q(indicador__codigo__icontains=value)
            | Q(indicador__descricao__icontains=value)
            | Q(indicador__tipo__icontains=value)
        )

    class Meta:
        model = Lote
        fields = ["search"]
