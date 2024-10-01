import RemoteAccessClient from "@/infra/api/axios-s-managed"
import { LoginResponse } from "../login"

export const RelatorioProcessosAPI = {
	listarRelatorios: async (user: LoginResponse, params: {
        data_de: string,
        data_ate: string,
        cliente: string
    }) => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const { data } = await api({
				url: `relatorios/produtividade`,
				method: `GET`,
				params: params
			})

			return data
		} catch (e: any) {
			throw e.response?.data?.error?.message ?? `Erro ao buscar dados.`
		}
	},
}
