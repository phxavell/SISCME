export interface TipoCaixaModalProps {
    data:   TipoCaixaModal[];
    meta:   Meta;
   }

export interface TipoCaixaModal {
    descricao: string;
    id?:        number;
   }

export interface Meta {
    currentPage: number
    itemsPerPage: number,
    totalItems: number
    totalPages: number
    firstItem: number
    lastItem: number
   }
