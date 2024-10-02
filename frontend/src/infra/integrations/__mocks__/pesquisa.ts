
export const recebimentosData = [
	{
		cliente: `Cliente1`,
		caixa: {
			tipo: `Tipo1`,
			codigo: `422164`,
			sequencial: `BSN15-AJ001`,
			temperatura: `Ambient`,
			medida: `30x30x30`,
			status: `RECEBIDO`
		},
		data_recebimento: `10/09/2023 15:42`,
		sequencial: `1`,
		user: `User1`,
		itens: [
			{
				id: `1`,
				descricao: `Item 1`,
				quantidade: `5`
			},
			{
				id: `2`,
				descricao: `Item 1`,
				quantidade: `5`
			},

		]
	},
	{
		cliente: `Cliente2`,
		caixa: {
			tipo: `Tipo2`,
			codigo: `422164`,
			sequencial: `BSN15-AJ002`,
			temperatura: `Ambient`,
			medida: `30x30x30`,
			status: `RECEBIDO`
		},
		data_recebimento: `10/08/2023 15:42`,
		sequencial: `2`,
		user: `User2`,
		itens: [
			{
				id: `2`,
				descricao: `Item 2`,
				quantidade: `5`
			}
		]
	},
	{
		cliente: `Cliente3`,
		caixa: {
			tipo: `Tipo3`,
			codigo: `422164`,
			sequencial: `BSN15-AJ003`,
			temperatura: `Ambient`,
			medida: `30x30x30`,
			status: `RECEBIDO`
		},
		data_recebimento: `10/07/2023 15:42`,
		sequencial: `3`,
		user: `User3`,
		itens: [
			{
				id: `3`,
				descricao: `Item 3`,
				quantidade: `5`
			}
		]
	},
	{
		cliente: `Cliente4`,
		caixa: {
			tipo: `Tipo4`,
			codigo: `422164`,
			sequencial: `BSN15-AJ004`,
			temperatura: `Ambient`,
			medida: `30x30x30`,
			status: `RECEBIDO`
		},
		data_recebimento: `10/06/2023 15:42`,
		sequencial: `4`,
		user: `User4`,
		itens: [
			{
				id: `4`,
				descricao: `Item 4`,
				quantidade: `5`
			}
		]
	},
]

export const pesquisarMockResponse: any = {
	data: [
		{
			"caixa": {
				"id": 2,
				"cliente": {
					"id": 5,
					"nome": `ALA PEDIATRICA -HGP`
				},
				"descricao": `CAIXA DE PEQUENA CIRURGIA`,
				"tipo": `CAIXA`,
				"codigo": `CXPC-HIP`,
				"sequencial": `CXPC-HIP001`,
				"temperatura": `134`,
				"itens": [
					{
						"id": 2,
						"descricao": `PINÇA DENTE DE RATO DELICADA 16 CM`,
						"embalagem": `SMS`,
						"quantidade": `1`,
						"idproduto": 855
					},
					{
						"id": 3,
						"descricao": `PINÇA ALLYS 16 CM`,
						"embalagem": `SMS`,
						"quantidade": `1`,
						"idproduto": 690
					},
					{
						"id": 4,
						"descricao": `CABO DE BISTURI N°03 LONGO`,
						"embalagem": `SACOLA PLASTICA`,
						"quantidade": `1`,
						"idproduto": 167
					},
					{
						"id": 5,
						"descricao": `CUPULA PEQUENA`,
						"embalagem": `SMS`,
						"quantidade": `1`,
						"idproduto": 1715
					},
					{
						"id": 6,
						"descricao": `TESOURA METZEMBAUM RETA 17CM`,
						"embalagem": `SMS`,
						"quantidade": `INATIVO`,
						"idproduto": 1512
					},
					{
						"id": 7,
						"descricao": `TESOURA METZEMBAUM CURVA 17 CM`,
						"embalagem": `SMS`,
						"quantidade": `1`,
						"idproduto": 1730
					},
					{
						"id": 8,
						"descricao": `PORTA AGULHA COM VIDEA 16CM`,
						"embalagem": `SMS`,
						"quantidade": `1`,
						"idproduto": 1576
					},
					{
						"id": 9,
						"descricao": `PINÇA PEAN 16 CM`,
						"embalagem": `SMS`,
						"quantidade": `1`,
						"idproduto": 626
					},
					{
						"id": 10,
						"descricao": `PINÇA KELLY RETA 16 CM`,
						"embalagem": `SMS`,
						"quantidade": `1`,
						"idproduto": 568
					},
					{
						"id": 11,
						"descricao": `PINÇA KELLY CURVA 16 CM`,
						"embalagem": `SMS`,
						"quantidade": `1`,
						"idproduto": 566
					},
					{
						"id": 12,
						"descricao": `PINÇA HALSTEAD MOSQUITO RETA 12CM`,
						"embalagem": `SMS`,
						"quantidade": `1`,
						"idproduto": 1727
					},
					{
						"id": 13,
						"descricao": `PINÇA HALSTEAD MOSQUITO CURVA 12CM`,
						"embalagem": `SMS`,
						"quantidade": `1`,
						"idproduto": 1720
					},
					{
						"id": 14,
						"descricao": `PINÇA BACKAUS 10 CM`,
						"embalagem": `SMS`,
						"quantidade": `1`,
						"idproduto": 448
					},
					{
						"id": 15,
						"descricao": `PINÇA ANATOMICA 16CM`,
						"embalagem": `SMS`,
						"quantidade": `1`,
						"idproduto": 1719
					},
					{
						"id": 16,
						"descricao": `AFASTADOR FARABEUF DELICADO 10 CM`,
						"embalagem": `SMS`,
						"quantidade": `1`,
						"idproduto": 133
					}
				]
			},
			"recebimento": {
				"id": 38441,
				"status": `AGUARDANDO_CONFERENCIA`,
				"data_recebimento": `16-10-2023`,
				"data_hora": `03:00:00`,
				"usuario": {
					"id": 1,
					"nome": `ADMIN`
				},
				"solicitacao": {
					"id": 5,
					"situacao": `PROCESSANDO`
				}
			}
		},
		{
			"caixa": {
				"id": 7,
				"cliente": {
					"id": 5,
					"nome": `ALA PEDIATRICA -HGP`
				},
				"descricao": `CAIXA OTORRINO`,
				"tipo": `CAIXA`,
				"codigo": `CXOT-HIP`,
				"sequencial": `CXOT-HIP002`,
				"temperatura": `134`,
				"itens": [
					{
						"id": 116,
						"descricao": `CABO DE BISTURI N°03 14CM`,
						"embalagem": `SMS`,
						"quantidade": `1`,
						"idproduto": 156
					},
					{
						"id": 117,
						"descricao": `PORTA AGULHA Nº16 18CM`,
						"embalagem": `SMS`,
						"quantidade": `1`,
						"idproduto": 1061
					},
					{
						"id": 118,
						"descricao": `TESOURA METZEMBAUM  RETA 15 CM`,
						"embalagem": `SMS`,
						"quantidade": `1`,
						"idproduto": 976
					},
					{
						"id": 119,
						"descricao": `PINÇA KELLY CURVA 14 CM`,
						"embalagem": `SMS`,
						"quantidade": `1`,
						"idproduto": 565
					},
					{
						"id": 120,
						"descricao": `PINÇA MIXTER 14 CM`,
						"embalagem": `SMS`,
						"quantidade": `1`,
						"idproduto": 586
					},
					{
						"id": 121,
						"descricao": `DESCOLADOR HURD 22CM`,
						"embalagem": `SMS`,
						"quantidade": `1`,
						"idproduto": 1423
					},
					{
						"id": 122,
						"descricao": `ABAIXADOR DE LÍNGUA 19CM`,
						"embalagem": `SMS`,
						"quantidade": `1`,
						"idproduto": 1538
					},
					{
						"id": 123,
						"descricao": `ABRIDOR DE BOCA`,
						"embalagem": `GRAU`,
						"quantidade": `1`,
						"idproduto": 1251
					},
					{
						"id": 124,
						"descricao": `BICO DE ASPIRADOR 10COM`,
						"embalagem": `SMS`,
						"quantidade": `1`,
						"idproduto": 1747
					},
					{
						"id": 125,
						"descricao": `CUBA REDONDA`,
						"embalagem": `SMS`,
						"quantidade": `1`,
						"idproduto": 1704
					},
					{
						"id": 141,
						"descricao": `RUGINA KOEMING`,
						"embalagem": `SMS`,
						"quantidade": `1`,
						"idproduto": 1762
					},
					{
						"id": 142,
						"descricao": `PINÇA GARRA TYDING`,
						"embalagem": `SMS`,
						"quantidade": `1`,
						"idproduto": 1763
					}
				]
			},
			"recebimento": {
				"id": 38440,
				"status": `RECEBIDO`,
				"data_recebimento": `06-10-2023`,
				"data_hora": `15:00:00`,
				"usuario": {
					"id": 1,
					"nome": `ADMIN`
				},
				"solicitacao": {
					"id": 2,
					"situacao": `PROCESSANDO`
				}
			}
		},
		{
			"caixa": {
				"id": 7,
				"cliente": {
					"id": 5,
					"nome": `ALA PEDIATRICA -HGP`
				},
				"descricao": `CAIXA OTORRINO`,
				"tipo": `CAIXA`,
				"codigo": `CXOT-HIP`,
				"sequencial": `CXOT-HIP001`,
				"temperatura": `134`,
				"itens": [
					{
						"id": 116,
						"descricao": `CABO DE BISTURI N°03 14CM`,
						"embalagem": `SMS`,
						"quantidade": `1`,
						"idproduto": 156
					},
					{
						"id": 117,
						"descricao": `PORTA AGULHA Nº16 18CM`,
						"embalagem": `SMS`,
						"quantidade": `1`,
						"idproduto": 1061
					},
					{
						"id": 118,
						"descricao": `TESOURA METZEMBAUM  RETA 15 CM`,
						"embalagem": `SMS`,
						"quantidade": `1`,
						"idproduto": 976
					},
					{
						"id": 119,
						"descricao": `PINÇA KELLY CURVA 14 CM`,
						"embalagem": `SMS`,
						"quantidade": `1`,
						"idproduto": 565
					},
					{
						"id": 120,
						"descricao": `PINÇA MIXTER 14 CM`,
						"embalagem": `SMS`,
						"quantidade": `1`,
						"idproduto": 586
					},
					{
						"id": 121,
						"descricao": `DESCOLADOR HURD 22CM`,
						"embalagem": `SMS`,
						"quantidade": `1`,
						"idproduto": 1423
					},
					{
						"id": 122,
						"descricao": `ABAIXADOR DE LÍNGUA 19CM`,
						"embalagem": `SMS`,
						"quantidade": `1`,
						"idproduto": 1538
					},
					{
						"id": 123,
						"descricao": `ABRIDOR DE BOCA`,
						"embalagem": `GRAU`,
						"quantidade": `1`,
						"idproduto": 1251
					},
					{
						"id": 124,
						"descricao": `BICO DE ASPIRADOR 10COM`,
						"embalagem": `SMS`,
						"quantidade": `1`,
						"idproduto": 1747
					},
					{
						"id": 125,
						"descricao": `CUBA REDONDA`,
						"embalagem": `SMS`,
						"quantidade": `1`,
						"idproduto": 1704
					},
					{
						"id": 141,
						"descricao": `RUGINA KOEMING`,
						"embalagem": `SMS`,
						"quantidade": `1`,
						"idproduto": 1762
					},
					{
						"id": 142,
						"descricao": `PINÇA GARRA TYDING`,
						"embalagem": `SMS`,
						"quantidade": `1`,
						"idproduto": 1763
					}
				]
			},
			"recebimento": {
				"id": 38440,
				"status": `RECEBIDO`,
				"data_recebimento": `06-10-2023`,
				"data_hora": `15:00:00`,
				"usuario": {
					"id": 1,
					"nome": `ADMIN`
				},
				"solicitacao": {
					"id": 2,
					"situacao": `PROCESSANDO`
				}
			}
		}
	],
	meta: {
		"totalItems": 2,
		"totalPages": 1,
		"currentPage": 1,
		"itemsPerPage": 10
	}
}


export const pesquisarMockResponseUsuarios: any = {
	"status": `success`,
	"data": [
	   {
		  "idprofissional": 18,
		  "iduser": 15,
		  "matricula": ``,
		  "cpf": `123.123.131-27`,
		  "contato": ``,
		  "email": `potado@mailinator.com`,
		  "atrelado": ``,
		  "coren": ``,
		  "dtadmissao": `2023-11-01`,
		  "dtcadastro": `2023-11-28`,
		  "dtdesligamento": null,
		  "dtnascimento": `2023-11-01T00:00:00-04:00`,
		  "nome": `Aut deserunt aut ea`,
		  "rt": ``,
		  "sexo": `M`,
		  "status": `ADMITIDO`,
		  "cliente": null,
		  "profissao": {
			 "id": 1,
			 "descricao": `ANALISTA DE SISTEMAS`
		  }
	   },
	   {
		  "idprofissional": 17,
		  "iduser": 14,
		  "matricula": `12319`,
		  "cpf": `123.213.712-89`,
		  "contato": ``,
		  "email": `joao@bringel.com`,
		  "atrelado": ``,
		  "coren": ``,
		  "dtadmissao": `2023-11-01`,
		  "dtcadastro": `2023-11-28`,
		  "dtdesligamento": null,
		  "dtnascimento": `2023-11-01T00:00:00-04:00`,
		  "nome": `Joao Almeida`,
		  "rt": ``,
		  "sexo": `M`,
		  "status": `ADMITIDO`,
		  "cliente": null,
		  "profissao": {
			 "id": 1,
			 "descricao": `ANALISTA DE SISTEMAS`
		  }
	   },
	   {
		  "idprofissional": 16,
		  "iduser": 13,
		  "matricula": `000329`,
		  "cpf": `154.154.122-90`,
		  "contato": `(92)98607-0793`,
		  "email": `nigunepi150@gmail.com`,
		  "atrelado": ``,
		  "coren": `12213`,
		  "dtadmissao": `2023-11-01`,
		  "dtcadastro": `2023-11-28`,
		  "dtdesligamento": null,
		  "dtnascimento": `2023-11-01T00:00:00-04:00`,
		  "nome": `NICOLAS GUSTAVO NEVES PINTO`,
		  "rt": ``,
		  "sexo": `M`,
		  "status": `ADMITIDO`,
		  "cliente": null,
		  "profissao": {
			 "id": 1,
			 "descricao": `ANALISTA DE SISTEMAS`
		  }
	   },
	   {
		  "idprofissional": 11,
		  "iduser": 9,
		  "matricula": ``,
		  "cpf": `023.426.682-13`,
		  "contato": `(92)98607-0793`,
		  "email": `nigunepi150@gmail.com`,
		  "atrelado": ``,
		  "coren": `12213`,
		  "dtadmissao": `2023-11-01`,
		  "dtcadastro": `2023-11-28`,
		  "dtdesligamento": null,
		  "dtnascimento": `2023-11-01T00:00:00-04:00`,
		  "nome": `NICOLAS GUSTAVO NEVES PINTO`,
		  "rt": ``,
		  "sexo": `M`,
		  "status": `ADMITIDO`,
		  "cliente": null,
		  "profissao": {
			 "id": 2,
			 "descricao": `TECNICO ENFERMAGEM`
		  }
	   },
	   {
		  "idprofissional": 8,
		  "iduser": 8,
		  "matricula": `000329`,
		  "cpf": `023.426.682-11`,
		  "contato": `(92)98607-0793`,
		  "email": `nigunepi150@gmail.com`,
		  "atrelado": ``,
		  "coren": ``,
		  "dtadmissao": `2023-11-01`,
		  "dtcadastro": `2023-11-28`,
		  "dtdesligamento": null,
		  "dtnascimento": `2023-11-01T00:00:00-04:00`,
		  "nome": `NICOLAS GUSTAVO NEVES PINTO`,
		  "rt": ``,
		  "sexo": `M`,
		  "status": ``,
		  "cliente": null,
		  "profissao": {
			 "id": 2,
			 "descricao": `TECNICO ENFERMAGEM`
		  }
	   },
	   {
		  "idprofissional": 7,
		  "iduser": 7,
		  "matricula": `213678`,
		  "cpf": `129.798.372-97`,
		  "contato": `(21)89372-1897`,
		  "email": `matheus@bringel.com`,
		  "atrelado": `S`,
		  "coren": null,
		  "dtadmissao": `2023-11-27`,
		  "dtcadastro": `2023-11-27`,
		  "dtdesligamento": null,
		  "dtnascimento": `2000-02-15T00:00:00-04:00`,
		  "nome": `Matheus Silva`,
		  "rt": `N`,
		  "sexo": `M`,
		  "status": `DESATIVADO`,
		  "cliente": {
			 "id": 5,
			 "nome": `ALA PEDIATRICA -HGP`
		  },
		  "profissao": {
			 "id": 1,
			 "descricao": `ANALISTA DE SISTEMAS`
		  }
	   },
	   {
		  "idprofissional": 5,
		  "iduser": 6,
		  "matricula": `99801`,
		  "cpf": `785.461.234-56`,
		  "contato": ``,
		  "email": `kauan@bringel.com`,
		  "atrelado": ``,
		  "coren": ``,
		  "dtadmissao": `2023-01-11`,
		  "dtcadastro": `2023-11-27`,
		  "dtdesligamento": null,
		  "dtnascimento": `2023-03-11T00:00:00-04:00`,
		  "nome": `Kauan Lopes Ferreira`,
		  "rt": ``,
		  "sexo": `M`,
		  "status": `ADMITIDO`,
		  "cliente": null,
		  "profissao": {
			 "id": 4,
			 "descricao": `ADMINISTRATIVO`
		  }
	   },
	   {
		  "idprofissional": 4,
		  "iduser": 5,
		  "matricula": `99002`,
		  "cpf": `090.986.746-30`,
		  "contato": ``,
		  "email": `matheus@bringel.com`,
		  "atrelado": ``,
		  "coren": ``,
		  "dtadmissao": `2023-11-04`,
		  "dtcadastro": `2023-11-27`,
		  "dtdesligamento": null,
		  "dtnascimento": `2023-11-01T00:00:00-04:00`,
		  "nome": `Matheus Silva`,
		  "rt": ``,
		  "sexo": `M`,
		  "status": `DESATIVADO`,
		  "cliente": null,
		  "profissao": {
			 "id": 2,
			 "descricao": `TECNICO ENFERMAGEM`
		  }
	   },
	   {
		  "idprofissional": 3,
		  "iduser": 4,
		  "matricula": `000329`,
		  "cpf": `957.544.902-91`,
		  "contato": `(31)23211-2332`,
		  "email": `maria@bringel.com`,
		  "atrelado": ``,
		  "coren": `123123`,
		  "dtadmissao": `2023-11-01`,
		  "dtcadastro": `2023-11-27`,
		  "dtdesligamento": null,
		  "dtnascimento": `2000-03-02T00:00:00-04:00`,
		  "nome": `Maria Menezes dos Santos`,
		  "rt": ``,
		  "sexo": `F`,
		  "status": `ADMITIDO`,
		  "cliente": null,
		  "profissao": {
			 "id": 3,
			 "descricao": `ENFERMEIRA`
		  }
	   },
	   {
		  "idprofissional": 2,
		  "iduser": 3,
		  "matricula": `21850699`,
		  "cpf": `023.426.682-10`,
		  "contato": `(92)98607-0793`,
		  "email": `nigunepi150@gmail.com`,
		  "atrelado": ``,
		  "coren": `00001`,
		  "dtadmissao": `2023-11-27`,
		  "dtcadastro": `2023-11-27`,
		  "dtdesligamento": null,
		  "dtnascimento": `2023-11-27T00:00:00-04:00`,
		  "nome": `Nicolas Gustavo Neves Pinto`,
		  "rt": ``,
		  "sexo": `M`,
		  "status": `ADMITIDO`,
		  "cliente": null,
		  "profissao": {
			 "id": 1,
			 "descricao": `ANALISTA DE SISTEMAS`
		  }
	   }
	],
	"meta": {
	   "currentPage": `1`,
	   "totalItems": 11,
	   "itemsPerPage": 10,
	   "totalPages": 2
	}
}

export const pesquisarMockProducao = {
	id: 31888,
	serial: `BDVI-HGP001`,
	nome_caixa: `BANDEJA DISSECÇAO VENOSA INFANTIL`,
	data_preparo: `04/12/2023 20:12`,
	data_validade: `04/03/2024`,
	cliente: `ALA PEDIATRICA -HGP`
}
