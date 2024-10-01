import {BoxWithProducts, ProdutoRecebimento} from "@infra/integrations/processo/recebimento/types-recebimento.ts"

export const mockBoxWithProducts = {
	'serial':`CXVASV-HGP002`,
	'descricao_caixa':`CAIXA VASCULAR VENOSA I II`,
	'codigo_caixa':`CXVASV-HGP`,
	'produtos':[
		{
			'id':3244,
			'produto':`CAIXA.`,
			'quantidade':1
		},
		{
			'id':3255,
			'produto':`AFASTADOR FARABEUF PEQUENO`,
			'quantidade':2
		},
		{
			'id':2484,
			'produto':`AFASTADOR FARABEUF MEDIO `,
			'quantidade':2
		},
		{
			'id':3260,
			'produto':`PINÇA DO FLEBOESTRATORES`,
			'quantidade':4
		},
		{
			'id':181,
			'produto':`CABO DE BISTURI N°07 LONGO`,
			'quantidade':1
		},
		{
			'id':2546,
			'produto':`CABO DE BISTURI Nº 03`,
			'quantidade':1
		},
		{
			'id':3259,
			'produto':`TESOURA METZEMBAUN RETA 14,5 CM`,
			'quantidade':1
		},
		{
			'id':3258,
			'produto':`TESOURA METZEMBAUN CURVA 14,5 CM`,
			'quantidade':1
		},
		{
			'id':2793,
			'produto':`PORTA AGULHA DELICADO `,
			'quantidade':1
		},
		{
			'id':723,
			'produto':`PINÇA CHERON`,
			'quantidade':1
		},
		{
			'id':2421,
			'produto':`PINÇA MOSQUITO CURVA`,
			'quantidade':6
		},
		{
			'id':3257,
			'produto':`PINÇA DE DISSECÇÃO ANATÔMICA`,
			'quantidade':2
		},
		{
			'id':3256,
			'produto':`PINÇA DE DISSECÇÃO DENTE DE RATO `,
			'quantidade':2
		},
		{
			'id':447,
			'produto':`PINÇA BACKAUS 13 CM`,
			'quantidade':5
		},
		{
			'id':1704,
			'produto':`CUBA REDONDA`,
			'quantidade':1
		}
	] as Array<ProdutoRecebimento>,
}

export const PreRecebimentoMock = {
	list: [
		{
			serial: `CXVASV-HGP002`,
			descricao_caixa: `CAIXA VASCULAR VENOSA I II`,
			codigo_caixa: `CXVASV-HGP`,
			solicitacao_esterilizacao: {
				id: 1,
				recebimento_id: 1,
				cliente:`HAM`,
				situacao: `AGUARDANDO CONFERÊNCIA`
			},
			produtos: [
				{
					id: 3244,
					produto: `CAIXA.`,
					quantidade: 1,
					quantidadeB: 1,
					check: true
				},
				{
					id: 3255,
					produto: `AFASTADOR FARABEUF PEQUENO`,
					quantidade: 2,
					quantidadeB: 1,
					check: true
				}
			]
		}
	] as BoxWithProducts[]
}
export const bodyConfirmationExemple = {
	serial: `BJPCIR-HGP002`,
	recebimento_id: 38461,
	caixa_completa: true,
	produtos: [
		{
			id: 1052,
			produto: `BANDEJA INOX PEQUENA/ AVULSA`,
			quantidade: 1
		},
		{
			id: 1720,
			produto: `PINÇA HALSTEAD MOSQUITO CURVA 12CM`,
			quantidade: 1
		},
		{
			id: 1727,
			produto: `PINÇA HALSTEAD MOSQUITO RETA 12CM`,
			quantidade: 2
		}
	]
}
