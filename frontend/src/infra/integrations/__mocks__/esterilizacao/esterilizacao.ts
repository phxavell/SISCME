
export const EsterilizacaoMock = {
	cenario1: {
		data:[
			{
				serial: `CT009`,
				nome_caixa: `CICA TESTE`,
				ciclo: `Ciclo não informado`,
				cliente: `Hospital 28 de Agosto`,
				ultimo_registro: `31/01/2024 14:11`,
				ultima_situacao: `EMBALADO`
			},
			{
				serial: `CT008`,
				nome_caixa: `CICA TESTE I`,
				ciclo: `Ciclo não informado`,
				cliente: `Hospital 28 de Agosto`,
				ultimo_registro: `31/01/2024 14:11`,
				ultima_situacao: `EMBALADO`
			}
		],
		meta: {
			currentPage: 1,
			totalItems: 2,
			itemsPerPage: 10,
			totalPages: 1,
			next: null,
			previous: null
		}
	},
	cenario2: [],
	cenario3: undefined,
}
export const ModalViewMock = {

	dadosView1: {
		data: {
			id: 16,
			ciclo: 1770,
			data_inicio: `19/02/2024 16:33`,
			data_fim: `19/02/2024 18:08`,
			situacao_atual: `ESTERILIZACAO_FIM`,
			equipamento: `AUTOCLAVE 01`,
			programacao: `P1`,
			criado_em: `19/02/2024 16:33`,
			atualizado_em: `19/02/2024 18:08`,
			itens: [
				{
					id: 79,
					serial: `CAGFP3001`,
					nome_caixa: `CAIXA APOIO GF PRETO 33 B MEDICAL`,
					cliente: `HPS 28 DE AGOSTO`
				},
				{
					id: 80,
					serial: `CC1003`,
					nome_caixa: `CAIXA COLECISTECTOMIA 66`,
					cliente: `HPS 28 DE AGOSTO`
				},
				{
					id: 81,
					serial: `BAN1010`,
					nome_caixa: `BANDEJA ANTISSEPSIA`,
					cliente: `HPS 28 DE AGOSTO`
				},
				{
					id: 82,
					serial: `BAN1014`,
					nome_caixa: `BANDEJA ANTISSEPSIA`,
					cliente: `HPS 28 DE AGOSTO`
				},
				{
					id: 83,
					serial: `BAN1015`,
					nome_caixa: `BANDEJA ANTISSEPSIA`,
					cliente: `HPS 28 DE AGOSTO`
				}
			]
		}
	},
	dadosView2: {
		data: {
			id: 16,
			ciclo: 1770,
			data_inicio: `19/02/2024 16:33`,
			data_fim: `19/02/2024 18:08`,
			situacao_atual: `ESTERILIZACAO_FIM`,
			equipamento: `AUTOCLAVE 01`,
			programacao: `P1`,
			criado_em: `19/02/2024 16:33`,
			atualizado_em: `19/02/2024 18:08`,
			itens: [

			]
		}
	},
	dadosView3: {
		data: {
			id: 16,
			ciclo: 1770,
			data_inicio: `19/02/2024 16:33`,
			data_fim: null,
			situacao_atual: `ESTERILIZACAO_INICIO`,
			equipamento: `AUTOCLAVE 01`,
			programacao: `P1`,
			criado_em: `19/02/2024 16:33`,
			atualizado_em: `19/02/2024 18:08`,
			itens: [
				{
					id: 79,
					serial: `CAGFP3001`,
					nome_caixa: `CAIXA APOIO GF PRETO 33 B MEDICAL`,
					cliente: `HPS 28 DE AGOSTO`
				},
				{
					id: 80,
					serial: `CC1003`,
					nome_caixa: `CAIXA COLECISTECTOMIA 66`,
					cliente: `HPS 28 DE AGOSTO`
				},
				{
					id: 81,
					serial: `BAN1010`,
					nome_caixa: `BANDEJA ANTISSEPSIA`,
					cliente: `HPS 28 DE AGOSTO`
				},
				{
					id: 82,
					serial: `BAN1014`,
					nome_caixa: `BANDEJA ANTISSEPSIA`,
					cliente: `HPS 28 DE AGOSTO`
				},
				{
					id: 83,
					serial: `BAN1015`,
					nome_caixa: `BANDEJA ANTISSEPSIA`,
					cliente: `HPS 28 DE AGOSTO`
				}
			]
		}
	},
}
