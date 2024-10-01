import {LoginResponse} from "@infra/integrations/login.ts"
import RemoteAccessClient from "@infra/api/axios-s-managed.ts"
import {getMensagemDeErroDistribuicao} from "@infra/integrations/processo/distribuicao/helper_distribuicao.ts"

export const DistribuicaoPesquisaAPI = {
	DadosParaPDF: async (user: LoginResponse, id: number): Promise<any> => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const {data} = await api({
				url: `processo/distribuicao/dados-report?id=${id}`,
				method: `GET`,
			})
			return data.data
		} catch (e) {
			throw getMensagemDeErroDistribuicao(e, `Erro ao buscar dados de Distribuição.`)
		}
	},
	listarDistribuicao: async (user: LoginResponse, params: any): Promise<any> => {
		try {

			const api = RemoteAccessClient.getInstance(user)
			const {data} = await api({
				url: `processo/distribuicao`,
				method: `GET`,
				params
			})
			return data
		} catch (e) {
			throw getMensagemDeErroDistribuicao(e, `Erro ao buscar dados de Distribuição.`)
		}
	}
}
