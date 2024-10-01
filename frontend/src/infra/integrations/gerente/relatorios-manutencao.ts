import RemoteAccessClient from "@/infra/api/axios-s-managed"
import { LoginResponse } from "../login"

export const RelatorioManutencoesAPI = {
	listarRelatoriosManutencoes: async (user: LoginResponse, params: {
        data_de: string,
        data_ate: string,
    }) => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const { data } = await api({
				url: `relatorios/registro-manutencoes/`,
				method: `GET`,
				params: params
			})

			return data
		} catch (e: any) {
			throw e.response?.data?.error?.message ?? `Erro ao buscar dados.`
		}
	},
}
