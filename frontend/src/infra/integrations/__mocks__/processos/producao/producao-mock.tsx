export const ProducaoMock ={
	cenario1: {
		data: [
			{
				ciclo: `2323`,
				cliente: `Hospital Santo Alber`,
				nome_caixa: `RHOSS KIT PARA LAPAROTOMIA ABDOMINAL`,
				serial: `RKPLA004`,
				ultimo_registro: null,
			},
			{
				ciclo: `2323`,
				cliente: `Hospital Santo Alberto`,
				nome_caixa: `RHOSS KIT PARA LAPAROTOMIA ABDOMINAL`,
				serial: `RKPLA003`,
				ultimo_registro: null,
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
	},
	cenario2: [],
	cenario3: undefined,
	cenario4: {
		data: [
			{
				ciclo: `2323`,
				cliente: `Hospital Santo Alber`,
				nome_caixa: `RHOSS KIT PARA LAPAROTOMIA ABDOMINAL`,
				serial: `RKPLA004`,
				ultimo_registro: null,
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
	},
	cenario5: {
		serial: `RKPLA004`,
		cliente: `Hospital Santo Alber`,
		solicitacao_esterilizacao: null,
		descricao_caixa: `RHOSS KIT PARA LAPAROTOMIA ABDOMINAL`,
		codigo_caixa: `CT`,
		produtos: [
			{
				id: 1,
				produto: `Cabo de Bisturi N. 3`,
				quantidade: 1,
				quantidade_checada: 1,
				conforme: true
			},
			{
				id: 2,
				produto: `Afastador Farabeuf 20 x 180 mm`,
				quantidade: 1,
				quantidade_checada: 1,
				conforme: true
			},

		],
		total_itens: 2,
		cautela: ``
	}
}
export const ModalProducaoMock = {
	cenario1: {
		data: {
			serial: `BAN1004`,
			cliente: `HPS 28 DE AGOSTO`,
			solicitacao_esterilizacao: null,
			descricao_caixa: `BANDEJA ANTISSEPSIA`,
			codigo_caixa: `BAN1`,
			produtos: [
				{
					id: 1,
					produto: `CUBA REDONDA INOX 10CM`,
					quantidade: 1
				},
				{
					id: 2,
					produto: `PINÇA FOERSTER RETA 24CM`,
					quantidade: 1
				},
				{
					id: 719,
					produto: `BANDEJA INOX 33,5X31,5X2,5`,
					quantidade: 1
				}
			],
			total_itens: 3
		}
	},
	cenario2: {
		file:[{
			objectURL:`blob:http://localhost:8081/bf26652b-af10-4630-beb6-b4a62f4e3c60`,
			lastModified: 1708096277361,
			name:`BG PORTAL GB 2.png`,
			size: 6152413,
			type:`image/png`
		}]
	},
	cenario3: {
		data: {
			id: 91,
			serial: `BAN1004`,
			cliente: `HPS 28 DE AGOSTO`,
			caixa: `BANDEJA ANTISSEPSIA`,
			quantidade: 3,
			temperatura: `134`,
			data_validade: `27/03/2024`,
			data_preparo: `27/02/2024 11:25`,
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
		}
	}
}
