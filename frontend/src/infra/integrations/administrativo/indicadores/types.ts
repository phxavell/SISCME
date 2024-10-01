import { metaPages } from "../types-equipamentos"

export interface IndicadoresResponse {
    id: number;
    codigo: string;
    descricao: string;
    fabricante: string;
    tipo: string;
    situacao: boolean;
    saldo: number;
    lotes: any
    foto: any;
    criado_por: {
        id: number;
        username: string;
        nome: string;
    };
    criado_em: string;
    atualizado_por: {
        id: number;
        username: string;
        nome: string;
    };
    atualizado_em: string;
}

export interface Indicadores {
    status: number
    data: IndicadoresResponse[]
    meta: metaPages
}

export interface Lotes {
    status: number
    data: any[]
    meta: metaPages
}
