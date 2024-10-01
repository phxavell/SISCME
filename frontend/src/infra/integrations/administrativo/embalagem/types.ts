export interface EmbalagemProps {
    data:   Embalagem[];
    meta:   Meta;
   }

export interface Embalagem {
    descricao:  string;
    id:         number;
    valorcaixa: string;
   }

export interface Meta {
    currentPage: number
    itemsPerPage: number,
    totalItems: number
    totalPages: number
    firstItem: number
    lastItem: number
   }
export type EmbalagemObjProps = {
    id: number,
    descricao: string,
    valorcaixa: string;
    criado_por: {
        id: number,
        username: string,
        nome: string,
    }
    criado_em: string,
    atualizado_em: string,
    atualizado_por: {
        id: number,
        username: string,
        nome: string,
    }
}
