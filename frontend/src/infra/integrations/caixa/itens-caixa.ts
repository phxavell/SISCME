import {CaixaAPI} from '@infra/integrations/caixa/caixa.ts'

const mapItemToGetProduto = (user: any) => (item: { produto: number; }) => {
	return CaixaAPI.produtoById(user, item?.produto).then((data) => data).catch(err => err)
}

const mapItensComDescricaoDeProdutos = (produtos: any[]) => (item: any, index: number) => {
	let produto
	if (produtos[index]?.id === item.produto) {
		produto = produtos[index]
	} else {
		produto = produtos.find((p: any) => p?.id === item.produto)
	}
	return {
		item: {
			id: produto?.id,
			valor: produto?.valor,
			idIndex: produto?.id,
		},
		id: item.id,
		quantidade: item.quantidade,
		criticidade: item.criticidade,
		valor: item.valor
	}
}

const resolveAllSetted = (resulst: any) => {
	return resulst.map((result: any) => result.value)
}

const compareItensCaixa = (a: any, b: any) => {
	return a.produto - b.produto
}

export const ItensCaixaAPI = {
	itensComDescricaoDeProduto: async (user: any, itensCaixa: any[]) => {
		const itens = itensCaixa.sort(compareItensCaixa)
		const gets = itens.map(mapItemToGetProduto(user))
		const produtos = await Promise.allSettled(gets).then(resolveAllSetted)
		return itens.map(mapItensComDescricaoDeProdutos(produtos))
	}
}
