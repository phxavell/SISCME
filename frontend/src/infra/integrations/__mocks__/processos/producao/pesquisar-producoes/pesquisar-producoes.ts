export const PesquisarProducoesMock ={
	cenario1: {
		data: [
			{
				id: 90,
				serial: `BAN1011`,
				nome_caixa: `BANDEJA ANTISSEPSIA`,
				data_preparo: `21/02/2024 10:26`,
				data_validade: `21/03/2024`,
				cliente: `HPS 28 DE AGOSTO`
			},
			{
				id: 89,
				serial: `CR001`,
				nome_caixa: `CUBA RIM`,
				data_preparo: `21/02/2024 10:17`,
				data_validade: `21/03/2024`,
				cliente: `HPS 28 DE AGOSTO`
			},
			{
				id: 88,
				serial: `CVBN002`,
				nome_caixa: `CAIXA VIAS BILIARES 94`,
				data_preparo: `21/02/2024 10:09`,
				data_validade: `21/03/2024`,
				cliente: `HPS 28 DE AGOSTO`
			},
			{
				id: 87,
				serial: `BAN1006`,
				nome_caixa: `BANDEJA ANTISSEPSIA`,
				data_preparo: `21/02/2024 08:41`,
				data_validade: `21/03/2024`,
				cliente: `HPS 28 DE AGOSTO`
			},
		],
		meta: {
			currentPage: 1,
			totalItems: 11,
			itemsPerPage: 10,
			totalPages: 2,
			next: `http://localhost:8000/api/processo/preparo/itens-preparados/?page=2`,
			previous: null
		}
	},
	cenario2: {
		id: 90,
		serial: `BAN1011`,
		cliente: `HPS 28 DE AGOSTO`,
		caixa: `BANDEJA ANTISSEPSIA`,
		quantidade: 3,
		temperatura: `134`,
		data_validade: `21/03/2024`,
		data_preparo: `21/02/2024 10:26`,
		cautela: null,
		usuario_preparo: `Mestre dos Magos`,
		usuario_preparo_coren: ``,
		responsavel_tecnico_nome: `JEANE RODRIGUES SERRÃO`,
		responsavel_tecnico_coren: `451290`,
		embalagem: `GRAU 300X100`,
		itens: [
			{
				descricao: `BANDEJA INOX 33,5X31,5X2,5`,
				quantidade: 1
			},
			{
				descricao: `PINÇA FOERSTER RETA 24CM`,
				quantidade: 1
			},
			{
				descricao: `CUBA REDONDA INOX 10CM`,
				quantidade: 1
			}
		],
		ciclo_termodesinfeccao: 654
	},
	cenario3: {
		id: 90,
		serial: `BAN1011`,
		nome_caixa: `BANDEJA ANTISSEPSIA`,
		data_preparo: `21/02/2024 10:26`,
		data_validade: `21/03/2024`,
		cliente: `HPS 28 DE AGOSTO`
	},
}
