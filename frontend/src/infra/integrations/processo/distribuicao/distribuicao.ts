import RemoteAccessClient from "../../../api/axios-s-managed.ts"
import { LoginResponse } from "@infra/integrations/login.ts"
import { DistribuicaoResponse } from "@infra/integrations/processo/types.ts"
import {
	getErrosDistribuicao,
	getMensagemDeErroDistribuicao,
} from "@infra/integrations/processo/distribuicao/helper_distribuicao.ts"

export const DistribuicaoAPI = {
	estoques: async (user: LoginResponse, params: any): Promise<any> => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const { data } = await api({
				url: `processo/distribuicao/estoque-clientes`,
				method: `GET`,
				params: params,
			})

			if(Array.isArray(data.data)){
				return data
			}
			throw `Formato de dados da API inválido`

		} catch (e) {
			throw getMensagemDeErroDistribuicao(
				e,
				`Erro ao buscar dados de Distribuição.`,
			)
		}
	},
	seriaisEmEstoque: async (
		user: LoginResponse,
		params: any,
	): Promise<any> => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const { data } = await api({
				url: `processo/distribuicao/caixas-com-seriais`,
				method: `GET`,
				params: params,
			})
			return data
		} catch (e) {
			throw getMensagemDeErroDistribuicao(
				e,
				`Erro ao buscar dados de Distribuição.`,
			)
		}
	},

	listarPorModelo: async (
		user: LoginResponse,
		params: {
            page:number,
            cliente: number,
            search: string
        },
	): Promise<DistribuicaoResponse> => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const { data } = await api({
				url: `processo/distribuicao/estoque-por-modelo`,
				method: `GET`,
				params: params,
			})
			return data
		} catch (e) {
			throw getMensagemDeErroDistribuicao(
				e,
				`Erro ao buscar dados de Distribuição.`,
			)
		}
	},

	distribuir: async (
		user: LoginResponse,
		params: any,
		showError: any,
		setError: any,clearErrors:any,
		successCallback: any,
	) => {
		try {
			const api = RemoteAccessClient.getInstance(user)

			const { data } = await api({
				url: `processo/distribuicao/criar/`,
				method: `POST`,
				data: params,
			})
			if (data) {
				successCallback()
			}
		} catch (error) {
			getErrosDistribuicao(error, showError, setError, clearErrors)
		}
	},
	seriaisDisponiveis: async (
		user: LoginResponse,
		cliente_id: number,
	): Promise<any[]> => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const { data } = await api({
				url: `seriais/disponiveis-distribuicao/${cliente_id}/`,
				method: `GET`,
			})
			if (Array.isArray(data.data)) {
				return data.data
			}
			return []
		} catch (e) {
			throw getMensagemDeErroDistribuicao(
				e,
				`Erro ao buscar dados de Distribuição.`,
			)
		}
	},
}
