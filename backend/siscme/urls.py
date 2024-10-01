from django.conf import settings
from django.conf.urls import include
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, re_path

from common.routes import routes as common_routes
from common.views import (
    CaixaDetailRetrieve,
    CaixasComSeriaisPorClienteView,
    CaixasDistribuidasView,
    CaixasPorCliente,
    CaixasRecebidas,
    CaixaViewSet,
    ClientesPorEstoqueView,
    ClienteViewSet,
    CriarDistribuicaoView,
    CustomTokenObtainPairView,
    DistribuicaoRelatorioView,
    EmbalagemViewSet,
    EquipamentoFormOptionsView,
    EsterilizacaoFormOptionsView,
    EstoquePorClientesView,
    FormOptionsDiarioView,
    FormOptionsEtiquetaView,
    FormOptionsGruposView,
    FormOptionsView,
    HistoricoEtiquetasAPIView,
    InvalidURLView,
    ItensAPrepararView,
    ItensEsterilizacaoAcompanhamentoView,
    ItensPreparadosView,
    ItensTermoAcompanhamentoView,
    LoteViewSet,
    MotoristaViewSet,
    PlantaoMensalReportView,
    PlantaoViewSet,
    PreparoDadosReportView,
    ProcessoAutoclavagemTesteView,
    ProcessoAutoclavagemView,
    ProcessoEsterilizacaoPendentesView,
    ProcessoPreparoView,
    ProcessoTermodesinfeccaoView,
    ProdutoFormOptionsView,
    RecebimentoAguardandoConferencia,
    RecebimentoDadosReportView,
    RegistroHistoricoCaixaViewSet,
    RegistroManutencaoViewSet,
    RelClassificacaoMaterialAPIView,
    RelEficienciaAutoclaveAPIView,
    RelEficienciaTermoDesinfeccaoAPIView,
    RelProducaoMensalPreparoAPIView,
    RelProdutividadeAPIView,
    RelRegistroManutencoesAPIView,
    RelTiposOcorrenciaAPIView,
    SeriaisPorClientesView,
    SolicitacaoViewSet,
    TermodesinfeccaoFormOptionsView,
    TipoDeCaixaViewSet,
    UsuarioClienteViewSet,
    UsuarioViewSet,
    VeiculoBuscaPorParametroPlacaViewSet,
    views_motorista,
)
from common.views.api_views import IndicadoresPorLoteFormOptions
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularRedocView,
    SpectacularSwaggerView,
)
from rest_framework import routers
from rest_framework_simplejwt.views import TokenRefreshView


router = routers.DefaultRouter()
routes = common_routes
for route in routes:
    router.register(
        route["regex"], route["viewset"], basename=route["basename"]
    )

router.register(
    r"logistica/minhas-demandas",
    views_motorista.RotasViewSet,
    basename="ColetaEntrega",
)
router.register(
    r"logistica/gerenciamento-demandas-motorista",
    views_motorista.RotasSupervisaoMotoristaViewSet,
    basename="ColetaEntrega",
)

router.register(r"embalagens", EmbalagemViewSet)
router.register(r"tipos-caixa", TipoDeCaixaViewSet)
router.register(r"caixas", CaixaViewSet)


urlpatterns = [
    path("", include("common.urls"), name="common"),
    path(
        "api-auth/", include("rest_framework.urls", namespace="rest_framework")
    ),
    path("admin/", admin.site.urls, name="admin"),
    # OpenApi 3
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path(
        "api/swagger/",
        SpectacularSwaggerView.as_view(url_name="schema"),
        name="swagger-ui",
    ),
    path(
        "api/redoc/",
        SpectacularRedocView.as_view(url_name="schema"),
        name="redoc",
    ),
    # Autenticacao
    path(
        "api/token/",
        CustomTokenObtainPairView.as_view(),
        name="token_obtain_pair",
    ),
    path(
        "api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"
    ),
    path(
        "api/veiculos/placa/<str:placa>/",
        VeiculoBuscaPorParametroPlacaViewSet.as_view(
            {"get": "busca_por_placa"}
        ),
        name="busca_por_placa",
    ),
    path(
        "api/motoristas/<int:pk>/resetar-senha/",
        MotoristaViewSet.as_view({"put": "resetar_senha"}),
        name="resetar_senha",
    ),
    path(
        "api/cliente/solicitacoes/",
        SolicitacaoViewSet.as_view({"get": "client_list_request"}),
        name="Solicitacoes_Cliente",
    ),
    path(
        "api/indicadores/<int:indicador_id>lotes/<int:lote_id>/movimentacao",
        LoteViewSet.as_view({"post": "create"}),
        name="Movimentacao_lotes",
    ),
    path(
        "api/clientes/<int:cliente_id>/ativar/",
        ClienteViewSet.as_view({"patch": "ativar"}),
        name="cliente_ativar",
    ),
    path(
        "api/usuario/me/",
        UsuarioViewSet.as_view({"get": "retrieve"}),
        name="retrieve",
    ),
    path(
        "api/usuario/me/edit/",
        UsuarioViewSet.as_view({"put": "update"}),
        name="update",
    ),
    path(
        "api/usuario/me/alterar-senha/",
        UsuarioViewSet.as_view({"patch": "alterar_senha"}),
        name="alterar_senha",
    ),
    path(
        "api/clientes/<int:cliente_id>/desativar/",
        ClienteViewSet.as_view({"patch": "desativar"}),
        name="cliente_desativar",
    ),
    path(
        "api/plantoes/<int:pk>/fechamento/",
        PlantaoViewSet.as_view({"put": "fechamento"}),
        name="fechamento",
    ),
    path(
        "api/plantoes/<int:pk>/excluir/",
        PlantaoViewSet.as_view({"DELETE": "delete"}),
        name="delete",
    ),
    path(
        "api/caixa/<str:serial>/",
        CaixaDetailRetrieve.as_view(),
        name="caixa_detail",
    ),
    path(
        "api/caixa/<str:serial>/relatorio/",
        CaixaViewSet.as_view({"get": "relatorio_seriais"}),
        name="relatorio_seriais",
    ),
    path(
        "api/caixas/form-options/",
        FormOptionsView.as_view(),
        name="form_options",
    ),
    path(
        "api/processo/termodesinfeccao/form-options/",
        TermodesinfeccaoFormOptionsView.as_view(),
        name="termo_form_options",
    ),
    path(
        "api/processo/termodesinfeccao/acompanhamento/",
        ItensTermoAcompanhamentoView.as_view(),
        name="processo_termodesinfeccao",
    ),
    path(
        "api/processo/termodesinfeccao/",
        ProcessoTermodesinfeccaoView.as_view(),
        name="processo_termodesinfeccao",
    ),
    path(
        "api/processo/esterilizacao/form-options/",
        EsterilizacaoFormOptionsView.as_view(),
        name="esterilizacao_form_options",
    ),
    path(
        "api/etiquetas/form-options/",
        FormOptionsEtiquetaView.as_view(),
        name="form_options",
    ),
    path(
        "api/etiquetas/historico/",
        HistoricoEtiquetasAPIView.as_view(),
        name="historico_etiquetas",
    ),
    path(
        "api/produtos/form-options/",
        ProdutoFormOptionsView.as_view(),
        name="form_options",
    ),
    path(
        "api/grupos/form-options/",
        FormOptionsGruposView.as_view(),
        name="grupos_form_options",
    ),
    path(
        "api/caixas-recebidas",
        CaixasRecebidas.as_view(),
        name="caixa_recebidas",
    ),
    path(
        r"api/clientes/<int:pk>/usuarios/",
        UsuarioClienteViewSet.as_view({"get": "retrieve", "post": "create"}),
        name="usuarios_cliente",
    ),
    re_path(
        r"api/cliente/solicitacoes/(?P<cliente_id>\d+)/",
        SolicitacaoViewSet.as_view({"get": "client_list_request"}),
        name="Solicitacoes_Cliente_ClienteID",
    ),
    path(
        "api/cliente/lista-de-caixas/",
        CaixasPorCliente.as_view(),
        name="caixas_por_cliente",
    ),
    path(
        "api/processo/preparo/itens-a-preparar/",
        ItensAPrepararView.as_view(),
        name="itens_a_preparar",
    ),
    path(
        "api/processo/preparo/",
        ProcessoPreparoView.as_view(),
        name="processo_preparo",
    ),
    path(
        "api/processo/preparo/itens-preparados/",
        ItensPreparadosView.as_view(),
        name="itens_preparados",
    ),
    path(
        "api/processo/preparo/dados-report/<int:pk>/",
        PreparoDadosReportView.as_view(),
    ),
    path(
        "api/processo/esterilizacao/caixas-pendentes/",
        ProcessoEsterilizacaoPendentesView.as_view(),
        name="itens_a_preparar",
    ),
    path(
        "api/processo/esterilizacao/acompanhamento/",
        ItensEsterilizacaoAcompanhamentoView.as_view(),
        name="itens_esterilizacao_acompanhamento",
    ),
    path(
        "api/processo/esterilizacao/",
        ProcessoAutoclavagemView.as_view(),
        name="processo_esterilizacao",
    ),
    path(
        "api/processo/esterilizacao/teste/",
        ProcessoAutoclavagemTesteView.as_view(),
        name="processo_esterilizacao_teste",
    ),
    path(
        "api/plantoes/relatorio-mensal/",
        PlantaoMensalReportView.as_view({"get": "list"}),
        name="relatorio_mensal_plantoes",
    ),
    path(
        "api/processo/distribuicao/",
        CaixasDistribuidasView.as_view(),
        name="distribuicao",
    ),
    path(
        "api/processo/distribuicao/criar/",
        CriarDistribuicaoView.as_view(),
        name="criar_distribuicao",
    ),
    path(
        "api/processo/distribuicao/estoque-por-modelo",
        EstoquePorClientesView.as_view(),
        name="distribuicao",
    ),
    path(
        "api/processo/distribuicao/caixas-com-seriais",
        CaixasComSeriaisPorClienteView.as_view(),
        name="distribuicao_listar_caixas_seriais",
    ),
    path(
        "api/processo/distribuicao/estoque-clientes",
        ClientesPorEstoqueView.as_view(),
        name="distribuicao_clientes_estoque",
    ),
    path(
        "api/processo/distribuicao/sequenciais-por-cliente",
        SeriaisPorClientesView.as_view(),
        name="distribuicao",
    ),
    path(
        "api/processo/distribuicao/dados-report",
        DistribuicaoRelatorioView.as_view(),
        name="distribuicao",
    ),
    path(
        "api/diarios/form-options/",
        FormOptionsDiarioView.as_view(),
        name="form_options_diarios",
    ),
    path(
        "api/equipamentos/form-options/",
        EquipamentoFormOptionsView.as_view(),
        name="equipamento_form_options",
    ),
    path(
        "api/equipamentos/registro-manutencao/",
        RegistroManutencaoViewSet.as_view({"post": "create", "get": "list"}),
        name="registro_manutencao",
    ),
    path(
        "api/caixas-recebidas/<int:pk>/",
        RecebimentoDadosReportView.as_view(),
    ),
    path(
        "api/indicadores/form-options/",
        IndicadoresPorLoteFormOptions.as_view(),
    ),
    path(
        "api/relatorios/tipos-ocorrencia/",
        RelTiposOcorrenciaAPIView.as_view(),
        name="relatorio_tipos_ocorrencia",
    ),
    path(
        "api/relatorios/produtividade",
        RelProdutividadeAPIView.as_view(),
        name="relatorio-produtividade",
    ),
    path(
        "api/relatorios/eficiencia-autoclave/",
        RelEficienciaAutoclaveAPIView.as_view(),
        name="relatorio-eficiencia-autoclave",
    ),
    path(
        "api/relatorios/eficiencia-termodesinfeccao/",
        RelEficienciaTermoDesinfeccaoAPIView.as_view(),
        name="relatorio-eficiencia-termodesinfeccao",
    ),
    path(
        "api/relatorios/registro-manutencoes/",
        RelRegistroManutencoesAPIView.as_view(),
        name="relatorio-registro-manutencoes",
    ),
    path(
        "api/relatorios/classificacao-material/",
        RelClassificacaoMaterialAPIView.as_view(),
        name="relatorio-classificacao-material",
    ),
    path(
        "api/relatorios/producao-mensal/",
        RelProducaoMensalPreparoAPIView.as_view(),
        name="relatorio-roducao-mensal",
    ),
    path(
        "api/seriais/historico/",
        RegistroHistoricoCaixaViewSet.as_view({"get": "list"}),
        name="relatorio-historico",
    ),
    path(
        "api/logistica/recebimentos-aguardando-conferencia/",
        RecebimentoAguardandoConferencia.as_view(),
    ),
    path("api/", include(router.urls), name="api"),
    re_path(r"^health/", include("health_check.urls")),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

urlpatterns += [
    path(
        "api/<path:invalid_path>/",
        InvalidURLView.as_view(),
        name="URL Inválida",
    )
]
