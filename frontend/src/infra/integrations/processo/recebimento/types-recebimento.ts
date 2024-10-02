export interface IItemRecebimento {
    serial: string
    nome_caixa: string
    recebimento: number
    data_recebimento: string
    status: string
    cliente: string
    ultimo_registro: string
    ultima_situacao: string
    foto: any[]
}

export interface ProdutoRecebimento {
    id: number
    produto: string
    quantidade: number
    quantidadeB: number
    check: boolean
}

export interface SolicitacaoRecebimento {
    id: number
    cliente: string
    situacao: string
    recebimento_id: number
}

export interface BoxWithProducts {
    files: any
    fotos: any
    serial: string
    descricao_caixa: string
    codigo_caixa: string
    produtos: ProdutoRecebimento[]
    solicitacao_esterilizacao: SolicitacaoRecebimento
    /// TODO analizar codigo acima
    caixa_descricao: string

    empresa_id: number
    empresa_nome: string

    empresa_nome_abreviado: string
    id_solicitacao: number
    sequencial: string
    status_caixa: string
    total_itens: number
    cliente: string
}

export interface ProdutoRecebimentoPost {
    id: number
    produto: string
    quantidade: number
}

export enum ErrosPreRecebiomento {
    Get = `Erro ao buscar caixas em aguardando conferência.`,
    ArrayNotValid = `Não foi possível confirmar o recebimento da caixa, array de caixas verificadas inválido.`,
    Post = `Não foi possível confirmar o recebimento da caixa.`,
    GetBy = `Erro ao buscar dados da caixa.`
}

export namespace NPreRecebiomento {
    export enum Methods {
        Get = `logistica/recebimento-aguardando-conferencia/`,
        Post = `logistica/caixa-conferencia/`,
    }

    export enum ErrosExcetion {
        Get = `Erro ao buscar caixas em aguardando conferência.`,
        ArrayNotValid = `Não foi possível confirmar o recebimento da caixa, array de caixas verificadas inválido.`,
        Post = `Não foi possível confirmar o recebimento da caixa.`,
        GetBy = `Erro ao buscar dados da caixa.`
    }

    export type TMapItemCaixa = (
        itemCaixa: ProdutoRecebimento
    ) => ProdutoRecebimentoPost

    export interface BodyPreRecebimentoPost {
        serial: string
        recebimento_id?: any
        caixa_completa: boolean
        produtos: ProdutoRecebimentoPost[]
    }

    export type TMakeBody = (
        caixaPura: BoxWithProducts,
        itensVerificados: ProdutoRecebimento[]
    ) => BodyPreRecebimentoPost
}
