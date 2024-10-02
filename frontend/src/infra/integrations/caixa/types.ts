export interface IOptionToSelect {
    id: number
    valor: string
}

export interface ICaixaOptionsResponse {
    categorias_uso: IOptionToSelect[],
    criticidades: IOptionToSelect[]
    embalagens: IOptionToSelect[],
    prioridades: IOptionToSelect[],
    situacoes: IOptionToSelect[],
    temperaturas: IOptionToSelect[],
    tipos_caixa: IOptionToSelect[],
}

export interface ICaixaTermoOptionsResponse {
    ciclo: IOptionToSelect[],
    equipamento: IOptionToSelect[],
    programacao: IOptionToSelect[],
}


export interface IOptionResponse {
    id: number
    descricao: string
}

export const getEmbalagens_mock = [
	{
		'id': 9,
		'descricao': `P`,
		'valorcaixa': `50.25`
	},
	{
		'id': 1,
		'descricao': `M`,
		'valorcaixa': `93.42`
	},
	{
		'id': 7,
		'descricao': `G`,
		'valorcaixa': `146.42`
	}
] as Embalagem[]

export interface Embalagem {
    id: number
    descricao: string
    valorcaixa: string
}

export const response_mock = {
	'nome': `CAIXA CIRURGICA GGAAAAAAAAAAAG 11`,
	'temperatura': 121,
	'criticidade': 1,
	'validade': 2,
	'embalagem': 1,
	'cliente': 5,
	'tipo_caixa': 1,
	'descricao': `Descrição da Caixa`,
	'instrucoes_uso': `Instruções detalhadas aqui...`,
	'situacao': 1,
	'prioridade': 1,
	'categoria_uso': 1,
	'itens': [
		{
			'criticidade': 1,
			'quantidade': 10,
			'produto': 2
		},
		{
			'criticidade': 2,
			'quantidade': 10,
			'produto': 1
		}
	]
}

interface metaPages {
    currentPage: number
    totalItems: number
    itemsPerPage: number
    totalPages: number
}

export interface ListResponse<T> {
    status: string
    data: T[]
    meta: metaPages
}
