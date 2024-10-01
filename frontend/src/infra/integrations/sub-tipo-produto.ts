import { AxiosError } from 'axios'
import RemoteAccessClient from '../api/axios-s-managed'
import { LoginResponse } from '@/infra/integrations/login.ts'

export interface SubTipoProdutoProps {
    id?: number,
    descricao: string,
}


export const SubTipoProdutoAPI = {
	onList: async (user: LoginResponse): Promise<SubTipoProdutoProps[] | undefined> => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const { data } = await api.get(`subtipoproduto/`)
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
				url: `subtipoproduto/?search=` + busca,
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
	onSave: async (user: LoginResponse, body: SubTipoProdutoProps) => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const { data } = await api({
				url: `subtipoproduto/`,
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
	onUpdate: async (user: LoginResponse, body: SubTipoProdutoProps, id: number) => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const { data } = await api({
				url: `subtipoproduto/${id}/`,
				method: `PATCH`,
				data: body
			})
			return data
		} catch (error) {
			if (error instanceof AxiosError) {
				throw {
					code: error.code,
					message: error.message,
					data: error.response?.data.error.data
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
				url: `subtipoproduto/${id}/`,
				method: `DELETE`,
			})
			return data
		} catch (error) {
			if (error instanceof AxiosError) {
				throw {
					code: error.code,
					message: error.message,
					data: error.response?.data.error.data
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
