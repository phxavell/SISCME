import RemoteAccessClient from "@/infra/api/axios-s-managed"
import { LoginResponse } from "../login"

export const RelatorioMateriaisAPI = {
	listarRelatorios: async (user: LoginResponse, params: {
        data_de: string,
        data_ate: string,
        cliente: string
    }) => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const { data } = await api({
				url: `relatorios/classificacao-material`,
				method: `GET`,
				params: params
			})

			return data
		} catch (e: any) {
			throw e.response?.data?.error?.message ?? `Erro ao buscar dados.`
		}
	},
}
