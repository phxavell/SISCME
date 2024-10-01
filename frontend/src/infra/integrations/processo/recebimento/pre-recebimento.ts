import RemoteAccessClient from '../../../api/axios-s-managed.ts'
import {LoginResponse} from '@infra/integrations/login.ts'
import {
	BoxWithProducts,
	ErrosPreRecebiomento,
	NPreRecebiomento,
	ProdutoRecebimento
} from "@infra/integrations/processo/recebimento/types-recebimento.ts"
import {
	makeBodyPreRecebimentoPost,
	sortAlfabetico
} from "@infra/integrations/processo/recebimento/helper-recebimento.ts"


export const PreRecebimentoAPI = {
	listGeral: async (user: LoginResponse, page: number): Promise<any> => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const {data} = await api({
				url: `logistica/recebimentos-aguardando-conferencia/`,
				method: `GET`,
				params: {page: page ?? 1}
			})
			return data
		} catch (e) {
			throw ErrosPreRecebiomento.Get
		}
	},

	finalizarChecagem: async (
		user: LoginResponse,
		caixaPura: BoxWithProducts,
		caixasVerificadas: ProdutoRecebimento[],
	) => {
		if (!Array.isArray(caixasVerificadas)) {
			throw NPreRecebiomento.ErrosExcetion.ArrayNotValid
		}


		const body = makeBodyPreRecebimentoPost(caixaPura, caixasVerificadas)
		try {
			const api = RemoteAccessClient.getInstance(user)
			const response = await api({
				url: NPreRecebiomento.Methods.Post,
				method: `POST`,
				headers: {
					'Content-Type': `multipart/form-data`,
				},
				data: body
			})
			return response
		} catch (e) {
			// @ts-ignore
			throw e.response?.data?.error?.message || NPreRecebiomento.ErrosExcetion.Post
		}
	},
	bipBox: async (user: LoginResponse, sequencial: string): Promise<BoxWithProducts> => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const {data} = await api({
				url: `caixa/${sequencial}`,
				method: `GET`
			})
			return {
				...data.data,
				produtos: data.data.produtos?.map((item: any) => (
					{
						...item,
						quantidadeB: item.quantidade,
						check: true
					})).sort(sortAlfabetico)
			}
		} catch (e: any) {
			if (e.response?.data?.error?.message) {
				throw e.response?.data?.error?.message
			}
			throw NPreRecebiomento.ErrosExcetion.GetBy
		}
	},

}
