export const pesquisarMockResponseEsterilizacao: any = {
	status: `success`,
	data: [
		{
			serial: `CM001`,
			nome_caixa: `CAIXA MADEIRA`,
			ciclo: `Ciclo não informado`,
			cliente: `MATERNIDADE Dº REGINA`,
			ultimo_registro: `04/12/2023 15:10`,
			ultima_situacao: `EMBALADO`
		}
	],
	meta: {
		currentPage: 1,
		totalItems: 1,
		itemsPerPage: 10,
		totalPages: 1,
		next: null,
		previous: null
	}
}

export const pesquisarMockResponseEsterilizacaoPesquisar: any = {
	status: `success`,
	data: [
		{
			id: 1,
			ciclo: 1,
			data_inicio: `04/12/2023 15:59`,
			data_fim: null,
			situacao_atual: `ESTERILIZACAO_INICIO`,
			equipamento: {
				id: 2,
				descricao: `AUTOCLAVE`
			}
		}
	],
	meta: {
		currentPage: 1,
		totalItems: 1,
		itemsPerPage: 10,
		totalPages: 1,
		next: null,
		previous: null
	}
}

export const caixaTermo = [
	{
		user: `User1`,
		maquina: `TERMO01`,
		ciclo: `1`,
		progamacao: `1`,
		data_inicio: `10/09/2023 15:42`,
		data_fim: `10/09/2023 15:42`,
		lote: `1`,
		itens: [
			{
				cliente: `Cliente1`,
				sequencial: `1`,
				caixa: `BANDEJA1`,
			},
			{
				cliente: `Cliente2`,
				sequencial: `2`,
				caixa: `BANDEJA2`,
			},
			{
				cliente: `Cliente3`,
				sequencial: `3`,
				caixa: `BANDEJA3`,
			},
		]
	}
]

export const caixasTermo = [
	{
		user: `User1`,
		maquina: `TERMO01`,
		ciclo: `1`,
		progamacao: `1`,
		data_inicio: `10/09/2023 15:42`,
		data_fim: `10/09/2023 15:42`,
		lote: `1`,
		sequencial: `CPC-ND039`,
		caixa: `CAIXA MASTECTOMIA CECON`,
		itens: [
			{
				cliente: `Cliente1`,
				sequencial: `1`,
				caixa: `BANDEJA1`,
			},
			{
				cliente: `Cliente2`,
				sequencial: `2`,
				caixa: `BANDEJA2`,
			},
			{
				cliente: `Cliente3`,
				sequencial: `3`,
				caixa: `BANDEJA3`,
			},
		]
	},
	{
		user: `User1`,
		maquina: `TERMO01`,
		ciclo: `1`,
		progamacao: `1`,
		data_inicio: `10/09/2023 15:42`,
		data_fim: `10/09/2023 15:42`,
		lote: `1`,
		sequencial: `CPC-ND039`,
		caixa: `CAIXA MASTECTOMIA CECON`,
		itens: [
			{
				cliente: `Cliente1`,
				sequencial: `1`,
				caixa: `BANDEJA1`,
			},
			{
				cliente: `Cliente2`,
				sequencial: `2`,
				caixa: `BANDEJA2`,
			},
			{
				cliente: `Cliente3`,
				sequencial: `3`,
				caixa: `BANDEJA3`,
			},
		]
	},
]

export const caixasTermoSemItens = [
	{
		id: `1`,
		user: `User1`,
		maquina: `TERMO01`,
		ciclo: `1`,
		progamacao: `1`,
		data_inicio: `10/09/2023 15:42`,
		data_fim: `10/09/2023 15:42`,
		lote: `1`,
		sequencial: `CPC-ND031`,
		caixa: `CAIXA MASTECTOMIA CECON`,
		itens: [
		]
	},
	{
		id: `2`,
		user: `User1`,
		maquina: `TERMO01`,
		ciclo: `1`,
		progamacao: `1`,
		data_inicio: `10/09/2023 15:42`,
		data_fim: `10/09/2023 15:42`,
		lote: `1`,
		sequencial: `CPC-ND032`,
		caixa: `CAIXA MASTECTOMIA CECON`,
		itens: [
		]
	},
	{
		id: `3`,
		user: `User1`,
		maquina: `TERMO01`,
		ciclo: `1`,
		progamacao: `1`,
		data_inicio: `10/09/2023 15:42`,
		data_fim: `10/09/2023 15:42`,
		lote: `1`,
		sequencial: `CPC-ND033`,
		caixa: `CAIXA MASTECTOMIA CECON`,
		itens: [
		]
	},
	{
		id: `4`,
		user: `User1`,
		maquina: `TERMO01`,
		ciclo: `1`,
		progamacao: `1`,
		data_inicio: `10/09/2023 15:42`,
		data_fim: `10/09/2023 15:42`,
		lote: `1`,
		sequencial: `CPC-ND034`,
		caixa: `CAIXA MASTECTOMIA CECON`,
		itens: [
		]
	},
	{
		id: `5`,
		user: `User1`,
		maquina: `TERMO01`,
		ciclo: `1`,
		progamacao: `1`,
		data_inicio: `10/09/2023 15:42`,
		data_fim: `10/09/2023 15:42`,
		lote: `1`,
		sequencial: `CPC-ND035`,
		caixa: `CAIXA MASTECTOMIA CECON`,
		itens: [
		]
	},
	{
		id: `6`,
		user: `User1`,
		maquina: `TERMO01`,
		ciclo: `1`,
		progamacao: `1`,
		data_inicio: `10/09/2023 15:42`,
		data_fim: `10/09/2023 15:42`,
		lote: `1`,
		sequencial: `CPC-ND036`,
		caixa: `CAIXA MASTECTOMIA CECON`,
		itens: [
		]
	},
	{
		id: `7`,
		user: `User1`,
		maquina: `TERMO01`,
		ciclo: `1`,
		progamacao: `1`,
		data_inicio: `10/09/2023 15:42`,
		data_fim: `10/09/2023 15:42`,
		lote: `1`,
		sequencial: `CPC-ND037`,
		caixa: `CAIXA MASTECTOMIA CECON`,
		itens: [
		]
	},
	{
		id: `8`,
		user: `User1`,
		maquina: `TERMO01`,
		ciclo: `1`,
		progamacao: `1`,
		data_inicio: `10/09/2023 15:42`,
		data_fim: `10/09/2023 15:42`,
		lote: `1`,
		sequencial: `CPC-ND038`,
		caixa: `CAIXA MASTECTOMIA CECON`,
		itens: [
		]
	},
	{
		id: `9`,
		user: `User1`,
		maquina: `TERMO01`,
		ciclo: `1`,
		progamacao: `1`,
		data_inicio: `10/09/2023 15:42`,
		data_fim: `10/09/2023 15:42`,
		lote: `1`,
		sequencial: `CPC-ND039`,
		caixa: `CAIXA MASTECTOMIA CECON`,
		itens: [
		]
	},
	{
		id: `10`,
		user: `User1`,
		maquina: `TERMO01`,
		ciclo: `1`,
		progamacao: `1`,
		data_inicio: `10/09/2023 15:42`,
		data_fim: `10/09/2023 15:42`,
		lote: `1`,
		sequencial: `CPC-ND040`,
		caixa: `CAIXA MASTECTOMIA CECON`,
		itens: [
		]
	}
]





export const equipamentosEsterilizacao = [
	{
		id: `1`,
		valor: `TERMO01`,
	},
	{
		id: `2`,
		valor: `TERMO02`,
	},
	{
		id: `3`,
		valor: `TERMO03`,
	},
]

export const progamacaoEsterilizacao = [
	{
		id: `1`,
		valor: `PROGAMACAO01`,
	},
	{
		id: `2`,
		valor: `PROGAMACAO02`,
	},
	{
		id: `3`,
		valor: `PROGAMACAO03`,
	},
]
