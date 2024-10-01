import RemoteAccessClient from '../../api/axios-s-managed.ts'

import {getMensagemDeErroDistribuicao} from "@infra/integrations/processo/distribuicao/helper_distribuicao.ts"

export enum EProcesso {
    Esterilizacao,
    TermoDesinfeccao
}
export const ProcessoAPI = {
	listarSeriaisTermo: async (auth: any, params: any) => {
		const {user} = auth
		try {
			const api = RemoteAccessClient.getInstance(user)
			const {data} = await api({
				url: `seriais/disponiveis-termodesinfeccao/`,
				method: `GET`,
				params: params
			})
			if(Array.isArray(data?.data)){
				return data.data
			}
			return []
		} catch (e) {
			throw getMensagemDeErroDistribuicao(e, `Erro ao buscar dados de Distribuição.`)
		}
	},
	seriaisDisponiveis: async (auth: any, type: EProcesso) => {
		const {user} = auth
		try {
			const api = RemoteAccessClient.getInstance(user)

			let config  ={
				url: `seriais/disponiveis-termodesinfeccao/`,
				method: `GET`,
			}
			if(type === EProcesso.Esterilizacao){
				config  ={
					url: `seriais/disponiveis-esterilizacao/`,
					method: `GET`,
				}
			}
			const {data} = await api(config)
			if(Array.isArray(data?.data)){
				return data.data
			}
			return []
		} catch (e) {
			throw getMensagemDeErroDistribuicao(e, `Erro ao buscar dados de Distribuição.`)
		}
	},

}
