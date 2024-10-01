export interface OpcoesUsoIndicador {
    id: number;
    valor: string;
    indicador_id: number;
}

export interface MovimentacaoLotePayload {
    lote: number;
    operacao: string;
    quantidade: number;
}
