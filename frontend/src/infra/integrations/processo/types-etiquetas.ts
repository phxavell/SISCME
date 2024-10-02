import { metaPages } from "../administrativo/types-equipamentos"

export interface DataEtiqueta {
    id: number;
    turno: null | string;
    autoclave: {
        id: number;
        descricao: string;
    };
    biologico: string;
    ciclo: number;
    datafabricacao: string;
    datalancamento: string;
    datavalidade: string;
    horalancamento: string;
    cautela: number;
    numerofaltante: number;
    obs: null | string;
    peso: string;
    qtd: number;
    qtdimpressao: number;
    seladora: string;
    termodesinfectora: {
        id: number;
        descricao: string;
    };
    status: string;
    temperatura: number;
    ciclo_termodesinfectora: number;
    ciclo_autoclave: number;
    tipoetiqueta: string;
    totalenvelopado: number;
    responsavel_tecnico_nome: string;
    responsavel_tecnico_coren: string;
    cliente: {
        id: number;
        nome: string;
    };
    complemento: {
        id: number;
        descricao: string;
    };
    setor: {
        id: number;
        descricao: string;
    };
    produto: {
        id: number;
        descricao: string;
        tipoproduto: string;
    };
    profissional: {
        id: number;
        nome: string;
        coren: string;
    };
}

export interface EtiquetaResponse {
    status: string;
    data: DataEtiqueta[];
    meta: metaPages;
}
