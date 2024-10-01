import RemoteAccessClient from "@/infra/api/axios-s-managed"
import { LoginResponse } from "../login"

export const RelatorioEficienciaAPI = {
	listarRelatoriosAutoclave: async (user: LoginResponse, params: {
        data_de: string,
        data_ate: string,
        cliente: string
    }) => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const { data } = await api({
				url: `relatorios/eficiencia-autoclave/`,
				method: `GET`,
				params: params
			})

			return data
		} catch (e: any) {
			throw e.response?.data?.error?.message ?? `Erro ao buscar dados.`
		}
	},

	listarRelatoriosTermo: async (user: LoginResponse, params: {
        data_de: string,
        data_ate: string,
        cliente: string
    }) => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const { data } = await api({
				url: `relatorios/eficiencia-termodesinfeccao/`,
				method: `GET`,
				params: params
			})

			return data
		} catch (e: any) {
			throw e.response?.data?.error?.message ?? `Erro ao buscar dados.`
		}
	},
}
