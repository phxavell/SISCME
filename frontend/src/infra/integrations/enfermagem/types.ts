interface CriadoPor {
    id: number;
    username: string;
    nome: string;
}

interface Cliente {
    id: number;
    nome: string;
}

interface Setor {
    id: number;
    nome: string;
}

interface Usuario {
    id: number;
    nome: string;
}

interface Indicador {
    id: number;
    nome: string;
}

export interface OcorrenciaResponse {
    id: number;
    criado_por: CriadoPor;
    atualizado_por: CriadoPor;
    criado_em: string;
    atualizado_em: string;
    arquivo: null;
    dataabertura: string | null;
    datafechamento: string | null;
    dataretroativa: string | null;
    descricao: string;
    acao: string | null;
    horaabertura: string | null;
    horafechamento: string | null;
    horaretroativa: string | null;
    status: string;
    statusdiariodeocorrencia: string;
    tipodediariodeocorrencia: string;
    nome_profissional_responsavel: string;
    uuid: null;
    profissional_responsavel: number | null;
    cliente: Cliente;
    setor: Setor;
    usuario: Usuario;
    indicador: Indicador;
}

export interface OptionOcorrencia {
    id: number;
    value: string;
}

export interface OcorrenciaOpcoes {
    tipo_de_ocorrencia: OptionOcorrencia[];
    setores: OptionOcorrencia[];
    indicadores: OptionOcorrencia[];
    users: OptionOcorrencia[];
}


export interface OcorrenciaBody {
    arquivo: null | any;
    dataretroativa: string;
    descricao: string;
    acao: string;
    horaretroativa: string;
    tipodediariodeocorrencia: string;
    profissional_responsavel: number;
    idcli: number;
    idsetor: number;
    idindicador: number;
}

interface Meta {
    currentPage: number
    itemsPerPage: number,
    totalItems: number
    totalPages: number
}

export interface RespostaAPI<T> {
    status: string;
    data: Array<T>;
    meta: Meta;
}
