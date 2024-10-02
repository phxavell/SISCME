import RemoteAccessClient from "@/infra/api/axios-s-managed"
import { LoginResponse } from "../login"
import { RespostaAPI } from "../types"

export const RelatoriosGerenciaisAPI = {
	listarOcorrencias: async (user: LoginResponse, params: any): Promise<RespostaAPI<any>> => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const { data } = await api({
				url: `relatorios/tipos-ocorrencia/`,
				method: `GET`,
				params: params
			})

			return data.data
		} catch (e: any) {
			console.log(e)
			throw e.response?.data?.error?.message ?? `Erro ao buscar clientes.`
		}
	},
}
