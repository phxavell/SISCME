export enum RoutersPathName {
    Login = `/login`,
    Home = `/home`,

    /* Cliente */
    Solicitacoes = `/solicitacoes`,
    SolicitacoesHome = `/home-solicitacoes`,

    /* Tecnico CME Gerencimaneto de demandas */
    DemandasCliente = `/demandas-por-cliente`,
    DemandasPendentes = `/demandas-pendentes`,
    DemandasEmAndamento = `/demandas-em-andamento`,
    DemandasEntregues = `/demandas-entregues`,

    /* Motorista Gerencimaneto de demandas */
    SolicitacoesEntregaColeta = `/solicitacoes-de-entrega-e-coleta`,

    /* Gerenciar Coleta ou Entrega por Motorista */
    GerenciarSolicitacoesEntregaColeta = `/gerenciamento-de-entrega-e-coleta`,

    /* processo interno */
    Recebimento = `/processo/recepcao`,
    PesquisarRecebimentos = `/pesquisar-caixas-em-recebimento`,
    Termo = `/caixas-em-termodesinfeccao`,
    PesquisarTermos = `/pesquisar-caixas-em-termodesinfeccao`,
    Producao = `/caixas-em-producao`,
    PesquisarProducoes = `/pesquisar-caixas-em-producao`,
    Esterilizacao = `/caixas-em-esterilizacao`,
    PesquisarEsterilizacoes = `/pesquisar-caixas-em-esterilizacao`,
    PesquisarTestes = `/pesquisar-testes-bowie-dick`,
    Distribuicao = `/caixas-em-distribuicao`,
    PesquisarDistribuicao= `/pesquisar-caixas-em-distribuicao`,

    /* crud processo interno patrimonio */
    Produto = `/produtos`,
    Caixa = `/caixas`,
    Equipamentos = `/equipamentos`,
    Seriais = `/seriais`,
    HistoricoSeriais = `/seriais/:serial?/historico`,
    NovoVeiculo = `/veiculos`,
    Indicadores = `/indicadores`,


    /* crud processo interno especificações */
    SubTipoDeProduto = `/subtipos-de-produto`,
    TipoDeProduto = `/tipos-de-produto`,
    Embalagens = `/embalagens`,
    Setor = `/setores`,
    Profissao = `/profissoes`,
    TipoDeCaixa = `/tipos-de-caixa`,

    /* crud de parceiros */
    NovoCliente = `/clientes`,
    NovoUsuarioCliente = `/usuarios-do-cliente`,
    NovoMotorista = `/motoristas`,
    NovoUsuario = `/usuarios`,

    // Configurações
    GestaoInformacoesPessoais = `/dados-pessoais`,
    GestaoInformacoesPessoaisConta = `/dados-pessoais/conta`,
    GestaoInformacoesPessoaisAlterarSenha = `/dados-pessoais/alterar-senha`,

    // Gestão de plantões
    Plantao = `/meus-plantoes`,
    PlantaoSupervisor = `/gerenciamento-de-plantoes`,
    RelatoriosPlantao = `/relatorios-de-plantoes`,
    DiarioDeOcorrencias = `/diario-de-ocorrencias`,
    Etiquetas = `/etiquetas`,
    Complementos = `/complementos`,
    TipoDeOcorrencia = `/tipos-de-ocorrencia`,

    // Gereneciamento de relatorios
    RelatorioTipoOcorrencia = `/relatorios-de-ocorrencia`,
    RelatorioIndicadoresDeProdutividade = `/indicadores-de-produtividade`,
    RelatorioMateriais = `/relatorios-de-materiail`,
    RelatorioEficiencia = `/relatorios-de-eficiencia`,
    RelatorioManutencao = `/relatorios-de-manutencao`,
    RelatorioProducaoMensal = `/relatorios-de-producao-mensal`,

}
