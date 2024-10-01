export const debounceTime = 300

export interface CaixaComSerialDistribuicao {
    caixa_id: number
    modelo: string
    nome: string
    serial: string
    validade: string
    produzido_em: string
}

export enum TipoVisualizacao {
    Modelo,
    Sequenciais,
    Ambos
}
