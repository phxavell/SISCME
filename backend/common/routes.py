from common import views


routes = [
    {"regex": r"rest", "viewset": views.RestViewSet, "basename": "Rest"},
    {
        "regex": r"produtos",
        "viewset": views.ProdutoViewSet,
        "basename": "Produto",
    },
    {
        "regex": r"indicadores",
        "viewset": views.IndicadorViewSet,
        "basename": "Indicador",
    },
    {
        "regex": r"indicadores/(?P<indicador_id>\d+)/lotes",
        "viewset": views.LoteViewSet,
        "basename": "Lote",
    },
    {
        "regex": r"subtipoproduto",
        "viewset": views.SubTipoProdutoViewSet,
        "basename": "Subtipoproduto",
    },
    {
        "regex": r"tipo-pacote",
        "viewset": views.TipoPacoteViewSet,
        "basename": "Tipopacote",
    },
    {
        "regex": r"equipamentos",
        "viewset": views.EquipamentoViewSet,
        "basename": "Equipamento",
    },
    {
        "regex": r"clientes",
        "viewset": views.ClienteViewSet,
        "basename": "clientes",
    },
    {
        "regex": r"cadastro/usuarios",
        "viewset": views.CadastroUsuarioProfissionalViewSet,
        "basename": "Cadastro",
    },
    {
        "regex": r"usuarios",
        "viewset": views.UsuarioViewSet,
        "basename": "Usuario",
    },
    {
        "regex": r"profissoes",
        "viewset": views.ProfissaoViewSet,
        "basename": "Profissao",
    },
    {
        "regex": r"veiculos",
        "viewset": views.VeiculoViewSet,
        "basename": "veiculo",
    },
    {
        "regex": r"motoristas",
        "viewset": views.MotoristaViewSet,
        "basename": "motorista",
    },
    {
        "regex": r"solicitacoes",
        "viewset": views.SolicitacaoViewSet,
        "basename": "Solicitacao",
    },
    {
        "regex": r"solicitacoes/clientes/resumo",
        "viewset": views.SolicitacaoStatusProdutividadeViewSet,
        "basename": "resumo",
    },
    {
        "regex": r"solicitacaoitem",
        "viewset": views.SolicitacaoItemViewSet,
        "basename": "Solicitacaoitem",
    },
    {
        "regex": r"caixas-cliente",
        "viewset": views.BuscaClientePorCaixaVinculadaViewSet,
        "basename": "caixasCliente",
    },
    {
        "regex": r"coletas",
        "viewset": views.ColetaEntregaViewSet,
        "basename": "coleta",
    },
    {
        "regex": r"logistica/entregar-coleta",
        "viewset": views.RotaMotoristaEntregaColetaExpurgoViewSet,
        "basename": "logistica",
    },
    {
        "regex": r"logistica/iniciar-coleta",
        "viewset": views.RotaMotoristaIniciaColetaClienteViewSet,
        "basename": "logistica",
    },
    {
        "regex": r"logistica/finalizar-coleta",
        "viewset": views.RotaMotoristaEntregaColetaClienteViewSet,
        "basename": "logistica",
    },
    {
        "regex": r"logistica/recebimento-aguardando-conferencia",
        "viewset": views.ListaRecebimentoAguardandoConferenciaViewSet,
        "basename": "logistica",
    },
    {
        "regex": r"logistica/caixa-conferencia",
        "viewset": views.CriaItensRecebimentoVinculadoSolicitacao,
        "basename": "logistica",
    },
    {
        "regex": r"equipamentos/registro-manutencao",
        "viewset": views.RegistroManutencaoViewSet,
        "basename": "Registro",
    },
    {
        "regex": r"processo/termodesinfeccao",
        "viewset": views.ProcessoTermodesinfeccaoViewSet,
        "basename": "termodesinfeccao",
    },
    {
        "regex": r"processo/esterilizacao",
        "viewset": views.ProcessoEsterilizacaoViewSet,
        "basename": "esterilizacao",
    },
    {"regex": r"setores", "viewset": views.SetorViewSet, "basename": "setor"},
    {
        "regex": r"plantoes",
        "viewset": views.PlantaoViewSet,
        "basename": "plantao",
    },
    {
        "regex": r"etiquetas",
        "viewset": views.EtiquetaViewSet,
        "basename": "etiqueta",
    },
    {
        "regex": r"complementos",
        "viewset": views.ComplementoViewSet,
        "basename": "complementos",
    },
    {
        "regex": r"diarios",
        "viewset": views.DiarioViewSet,
        "basename": "diario",
    },
    {
        "regex": r"tipo-ocorrencia",
        "viewset": views.TipoOcorrenciaViewSet,
        "basename": "TipoOcorrencia",
    },
    {
        "regex": r"seriais",
        "viewset": views.SerialViewSet,
        "basename": "serial",
    },
    {
        "regex": r"seriais/historico",
        "viewset": views.RegistroHistoricoCaixaViewSet,
        "basename": "serial",
    },
]
