export const caixaMockModalDetail = {
	caixa: {
		id: 1,
		codigo_modelo: `CT`,
		descricao: `teste`,
		instrucoes_uso: `teste`,
		prioridade: 1,
		situacao: 1,
		criticidade: 1,
		embalagem: 1,
		itens: [
			{
				id: 2,
				produto: 4,
				criticidade: 1,
				quantidade: 1,
				caixa: 1
			},
			{
				id: 1,
				produto: 9,
				criticidade: 1,
				quantidade: 1,
				caixa: 1
			}
		],
		criado_por: `Mestre dos Magos`,
		atualizado_por: `Mestre dos Magos`,
		criado_em: `27/12/2023 15:44:11`,
		atualizado_em: `06/02/2024 10:22:09`,
		total_itens: 29,
		nome: `CICA TESTE`,
		validade: 1,
		temperatura: `121`,
		imagem: null,
		categoria_uso: 3,
		cliente: 2,
		tipo_caixa: 1
	},
	serial: [
		{
			serial: `CT001`,
			descricao: `CICA TESTE`,
			cliente: `Hospital 28 de Agosto`,
			situacao: `Em termodesinfecção`
		},
		{
			serial: `CT002`,
			descricao: `CICA TESTE`,
			cliente: `Hospital 28 de Agosto`,
			situacao: `Em termodesinfecção`
		},
		{
			serial: `CT003`,
			descricao: `CICA TESTE`,
			cliente: `Hospital 28 de Agosto`,
			situacao: `Em termodesinfecção`
		},
	],
	cliente: {
		idcli: 2,
		inscricaoestadualcli: ``,
		inscricaomunicipalcli: ``,
		cnpjcli: `09.628.825/0001-20`,
		cepcli: ``,
		emailcli: ``,
		telefonecli: ``,
		criado_por: {
			id: 1,
			username: `ADMIN`,
			nome: `Mestre dos Magos`
		},
		atualizado_por: {
			id: 1,
			username: `ADMIN`,
			nome: `Mestre dos Magos`
		},
		criado_em: `2023-12-27T15:27:30.260083-04:00`,
		atualizado_em: `2024-01-12T14:36:03.566912-04:00`,
		bairrocli: ``,
		cidadecli: ``,
		codigocli: ``,
		contatocli: ``,
		datacadastrocli: `2023-12-27`,
		horacadastrocli: `15:27:30.259921`,
		nomeabreviado: `HPA`,
		nomecli: `Hospital e Pronto Socorro 28 de Agosto`,
		nomefantasiacli: `Hospital 28 de Agosto`,
		numerocli: ``,
		ruacli: ``,
		ufcli: ``,
		ativo: true,
		foto: null
	}

}
