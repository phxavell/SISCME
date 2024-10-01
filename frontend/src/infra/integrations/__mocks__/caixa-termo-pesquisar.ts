export const caixaTermoPesquisar =

{
	data: [
		{
			id: 1,
			user: `Nicolas Teste`,
			maquina: `TERMO01`,
			ciclo: `14985`,
			programacao: `P1`,
			data_inicio: `10/09/2023 15:42`,
			data_fim: `10/09/2023 16:42`,
			caixas: [
				{
					cliente: `Cliente 1`,
					sequencial: `BR-BM027`,
					caixa: `CAIXA MASTECTOMIA CECON`,
				},
				{
					cliente: `Cliente 2`,
					sequencial: `BR-BM028`,
					caixa: `CAIXA MASTECTOMIA CECON`,
				},
				{
					cliente: `Cliente 3`,
					sequencial: `BR-BM029`,
					caixa: `CAIXA MASTECTOMIA CECON`,
				},
				{
					cliente: `Cliente 4`,
					sequencial: `BR-BM030`,
					caixa: `CAIXA MASTECTOMIA CECON`,
				},
			],
			lote: `85308`,
			codigo: `85308`,
			status_inicio: `TERMO_INICIO`,
			status_fim: ``,
			status: `TERMO_INICIO`,
			status_abortado: ``,
			data_abortado: ``,
			processo: `TERMO`,
			situacao: `EM ABERTO`,
		},
		{
			id: 2,
			user: `Kauan Teste`,
			maquina: `TERMO02`,
			ciclo: `14986`,
			programacao: `P2`,
			data_inicio: `10/09/2023 16:42`,
			data_fim: ``,
			caixas: [
				{
					cliente: `Cliente 5`,
					sequencial: `BR-BM031`,
					caixa: `CAIXA MASTECTOMIA CECON`,
				},
				{
					cliente: `Cliente 6`,
					sequencial: `BR-BM032`,
					caixa: `CAIXA MASTECTOMIA CECON`,
				},
				{
					cliente: `Cliente 7`,
					sequencial: `BR-BM033`,
					caixa: `CAIXA MASTECTOMIA CECON`,
				},
				{
					cliente: `Cliente 8`,
					sequencial: `BR-BM034`,
					caixa: `CAIXA MASTECTOMIA CECON`,
				},
			],
			lote: `85309`,
			codigo: `85309`,
			status_inicio: `TERMO_INICIO`,
			status_fim: ``,
			status: `ABORTADO`,
			status_abortado: `ABORTADO`,
			data_abortado: `10/09/2023 16:42`,
			processo: `TERMO`,
		},
		{
			id: 3,
			user: `Kauan Teste`,
			maquina: `TERMO03`,
			ciclo: `14987`,
			programacao: `P2`,
			data_inicio: `10/10/2023 16:42`,
			data_fim: `10/10/2023 17:42`,
			caixas: [
				{
					cliente: `Cliente 5`,
					sequencial: `BR-BM031`,
					caixa: `CAIXA MASTECTOMIA CECON`,
				},
				{
					cliente: `Cliente 6`,
					sequencial: `BR-BM032`,
					caixa: `CAIXA MASTECTOMIA CECON`,
				},
				{
					cliente: `Cliente 7`,
					sequencial: `BR-BM033`,
					caixa: `CAIXA MASTECTOMIA CECON`,
				},
				{
					cliente: `Cliente 8`,
					sequencial: `BR-BM034`,
					caixa: `CAIXA MASTECTOMIA CECON`,
				},
			],
			lote: `85309`,
			codigo: `85309`,
			status_inicio: `TERMO_INICIO`,
			status_fim: `TERMO_FIM`,
			status: `TERMO_FIM`,
			status_abortado: ``,
			data_abortado: ``,
			processo: `TERMO`,
		},
	],
	meta: {
		currentPage: 1,
		itemsPerPage: 2,
		totalItems: 2,
		totalPages: 1,
	},
}
