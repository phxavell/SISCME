import { AxiosError } from 'axios'
import RemoteAccessClient from '../api/axios-s-managed'
import { LoginResponse } from '@/infra/integrations/login.ts'

export type TipoProdutoProps = {
    id?: number,
    descricao: string,
}
export const TipoProdutoAPI = {
	onList: async (user: LoginResponse): Promise<TipoProdutoProps[] | undefined> => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const { data } = await api.get(`tipo-pacote/`)
			if (Array.isArray(data.data)) {
				return data.data
			} else {
				return []
			}
		} catch (error) {
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
	onSearch: async (user: LoginResponse, busca: string): Promise<any[]> => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const { data } = await api({
				url: `tipo-pacote/?search=` + busca,
				method: `GET`
			}).catch(() => {
				return { data: undefined }
			})
			if (data && Array.isArray(data.data)) {
				return data.data
			}

			return []
		} catch (e: any) {
			throw `Erro ao buscar produtos.`
		}
	},
	onSave: async (user: LoginResponse, body: TipoProdutoProps) => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const { data } = await api({
				url: `tipo-pacote/`,
				method: `POST`,
				data: body
			})
			return data
		} catch (error) {
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
	onUpdate: async (user: LoginResponse, body: TipoProdutoProps, id: number) => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const { data } = await api({
				url: `tipo-pacote/${id}/`,
				method: `PATCH`,
				data: body
			})
			return data
		} catch (error) {
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
	onDelete: async (user: LoginResponse, id: number) => {
		try {
			const api = RemoteAccessClient.getInstance(user)

			const { data } = await api({
				url: `tipo-pacote/${id}/`,
				method: `DELETE`,
			})
			return data
		} catch (error) {
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
	}
}
