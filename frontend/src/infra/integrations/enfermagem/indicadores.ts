import RemoteAccessClient from '@/infra/api/axios-s-managed'
import {LoginResponse} from '@/infra/integrations/login.ts'
import {AxiosError} from 'axios'

export const IndicadoresAPI = {
	listar: async (user: LoginResponse, page: number): Promise<any> => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const { data } = await api({
				url: `tipo-ocorrencia/`,
				method: `GET`,
				params: { page }
			})

			return data
		} catch (e: any) {
			throw {
				status: e.response?.status ?? 400,
				statusText: `Erro ao buscar clientes.`,
			}
		}
	},

	getOptions: async (user: LoginResponse, page: number): Promise<any> => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const { data } = await api({
				url: `tipo-ocorrencia/get-options/`,
				method: `GET`,
				params: { page }
			})

			return data
		} catch (e: any) {
			throw {
				status: e.response?.status ?? 400,
				statusText: `Erro ao buscar clientes.`,
			}
		}
	},

	pesquisarIndicador: async (user: LoginResponse, page: number, descricao: string): Promise<any> => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const { data } = await api({
				url: `tipo-ocorrencia/`,
				method: `GET`,
				params: { page, descricao }
			})

			return data
		} catch (e: any) {
			throw {
				status: e.response?.status ?? 400,
				statusText: `Erro ao buscar clientes.`,
			}
		}
	},

	save: async (user: LoginResponse, body: any) => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const {data} = await api({
				url: `tipo-ocorrencia/`,
				method: `POST`,
				data: body
			})
			return data
		} catch (error: any) {
			if (error instanceof AxiosError) {

				throw {
					code: error.code,
					message: error.message,
					data: error.response?.data
				}
			} else {
				throw {
					// @ts-ignore
					status: error.response.status, statusText: `Erro não mapeado.`
				}
			}
		}
	},

	atualizar: async (user: LoginResponse, body: any, id: number) => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const { data } = await api({
				url: `tipo-ocorrencia/${id}/`,
				method: `PATCH`,
				data: body
			})
			return data
		} catch (error: any) {
			if (error instanceof AxiosError) {

				throw {
					code: error.code,
					message: error.message,
					data: error.response?.data
				}
			} else {
				throw {
					// @ts-ignore
					status: error.response.status, statusText: `Erro não mapeado.`
				}
			}
		}
	},

	excluir: async (user: LoginResponse, id: number) => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const { data } = await api({
				url: `tipo-ocorrencia/${id}/`,
				method: `DELETE`,
			})
			return data
		} catch (e: any) {
			throw {
				status: e.response?.status,
				message: e.response?.data?.error?.message,
				data: undefined
			}
		}
	},

}
