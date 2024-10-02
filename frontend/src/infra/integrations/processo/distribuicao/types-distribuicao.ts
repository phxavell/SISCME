export interface EstoqueDistribuicao {
    cliente_id: number
    nome:string
    estoque: EstoqueInfo
}

export interface EstoqueInfo {
    total_disponivel: number
    total_critico: number
    caixas_criticas: CaixasCritica[]
}

export interface CaixasCritica {
    id: number
    modelo: string
    descricao: string
    produzido_em: string
    sequencial: string
    dias_parados: number
}
