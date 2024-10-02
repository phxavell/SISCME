export interface EquipamentosResponse {
    idequipamento?: any
    numero_serie?: string,
    descricao?: string
    data_fabricacao?: string
    registro_anvisa?: string
    ultimo_registro_manutencao?: any
    capacidade?: string
    fabricante?: string
    disponivel?: boolean;
    fornecedor?: string
    status_equipamento?: string
    ativo?: boolean | string
    tipo: {
        id?: string
        valor?: string
    }
}
export interface ManutencaoResponse {
    id: number;
    data_hora_inicio: string;
    data_hora_fim: string;
    tipo_manutencao: string;
    descricao: string | null;
    usuario: {
        id: number;
        nome: string;
    };
    equipamento: {
        id: number;
        descricao: string;
    };
}

export interface Manutencao {
    status: string
    data: ManutencaoResponse[]
    meta: metaPages
}

export interface metaPages {
    currentPage: number
    itemsPerPage: number,
    totalItems: number
    totalPages: number
    firstItem: number
    lastItem: number

}

export interface Equipamentos {
    status: string
    data: EquipamentosResponse[]
    meta: metaPages
}
export interface DataComplemento {
    id: number
    criado_por: string | null
    atualizado_por: string | null
    criado_em: string
    atualizado_em: string
    descricao: string
    status: string
}

export interface ComplementoResponse {
    status: string
    data: DataComplemento[]
    meta: metaPages
}
export interface ComplementoProps {
    id: number
    descricao: string
}
