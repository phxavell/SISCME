
export const TermoMock = {
	cenario1: {
		data: [
			{
				serial: `CR031`,
				nome_caixa: `CUBA RIM`,
				recebimento: 120,
				data_recebimento: `30/01/2024 10:48`,
				status: `RECEBIDO`,
				cliente: `Hospital Israelita Albert Einstein`,
				ultimo_registro: `30/01/2024 10:48`,
				ultima_situacao: `RECEBIDO`
			},
			{
				serial: `CR030`,
				nome_caixa: `CUBA RIM 2`,
				recebimento: 118,
				data_recebimento: `30/01/2024 10:41`,
				status: `RECEBIDO`,
				cliente: `Hospital Israelita Albert Einstein`,
				ultimo_registro: `30/01/2024 10:41`,
				ultima_situacao: `RECEBIDO`
			},
		],
		meta: {
			currentPage: 1,
			totalItems: 11,
			itemsPerPage: 10,
			totalPages: 2,
			next: `http://10.0.1.27:8000/api/caixas-recebidas?page=2`,
			previous: null
		}
	},
	cenario2: [],
	cenario3: undefined,
}
