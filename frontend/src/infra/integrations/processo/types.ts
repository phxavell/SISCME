import {metaPages} from "@infra/integrations/administrativo/types-equipamentos.ts"

export interface EsterilizacaoPreparoProps {
    data:   Array<ItemPreparoProps>;
    meta:   Meta;
    status: string;
   }

export interface ItemPreparoProps {
    id: number,
    cliente:       string;
    data_preparo:  string;
    data_validade: Date;
    nome_caixa:    string;
    serial:        string;
}
export interface Meta {
    currentPage:  number;
    itemsPerPage: number;
    totalItems:   number;
    totalPages:   number;
   }
export interface ProdutoPreparo {
    id: number
    produto: string
    quantidade: number
    quantidade_checada: number
    conforme: boolean
}
export interface CaixaProdutoPreparo {
    cautela?: number
    serial: string
    produtos: ProdutoPreparo[]
    quantidade: number
    quantidade_checada: number
    check: boolean
    nome_caixa: string
}
export interface erroProps {
    code: number | undefined,
    message: string | undefined
}
export interface filtrarPreparoProps {
    data_ate: string,
    data_de: string,
    page: number,
    serial: string,
}
export type PreparoReport= {
    id: number
    caixa: string
    cautela: string
    cliente: string
    data_preparo: string
    data_validade: string
    embalagem: string
    itens: Array<{
        descricao: string,
        quantidade: number,
    }>
    quantidade: number
    responsavel_tecnico_coren: string
    responsavel_tecnico_nome: string
    serial: string
    temperatura: string
    usuario_preparo: string
}

export interface IEsterilizacao {
	id: number,
	ciclo: string,
	data_de: string,
	data_ate: string,
	situacao_atual: string,
    serial: string,
}

export interface IFEsterilizacao {
	data_de: string,
	data_ate: string,
	ciclo: string,
	situacao_atual: string,
	serial: string,
}

export interface IFLEsterilizacao {
    id: number,
    ciclo: number,
    data_inicio: string,
    data_fim: string,
    situacao_atual: string,
    equipamento: {
        id: number,
        descricao: string,
    }
}

type Caixa = {
	id: number;
	modelo: string;
	descricao: string;
	estoque: string;
};
type DistribuicaoData = {
	id: number;
	nome: string;
	estoque_de_caixas: Caixa[];
};

export interface DistribuicaoResponse {
	status: string
	data: DistribuicaoData[]
	meta: metaPages
}

export interface EtiquetaEsterilizacaoResponse {
	lote: string;
	usuario: string;
	equipamento: string;
	programacao: string;
	ciclo: string;
	data_hora_inicio: string;
	data_hora_fim: string;
	itens_por_cliente: Array<{
        cliente: string,
        itens: Array<{
            serial: string,
            caixa: string,
        }>
    }>
}
