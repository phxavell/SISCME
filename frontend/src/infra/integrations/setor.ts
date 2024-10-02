import { AxiosError } from 'axios'
import RemoteAccessClient from '../api/axios-s-managed'
import { LoginResponse } from '@/infra/integrations/login.ts'

export type Setor = {
    id?: number,
    descricao: string,
}

export type SetoresProps = {
    data: Array<Setor>,
    meta: {
        currentPage: number
        itemsPerPage: number,
        totalItems: number
        totalPages: number
        firstItem: number
        lastItem: number
    }
}

export const SetorAPI = {
	listar: async (user: LoginResponse, page: number): Promise<SetoresProps | undefined> => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const { data } = await api.get(`setores/`, {
				params: { page }
			})
			return data
		} catch (error) {
			if (error instanceof AxiosError) {
				throw {
					code: error.status,
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
	filtrar: async (user: LoginResponse, params:any): Promise<SetoresProps | undefined> => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const { data } = await api.get(`setores`, {
				params
			})
			return data
		} catch (error) {
			if (error instanceof AxiosError) {
				throw {
					code: error.status,
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
	onSave: async (user: LoginResponse, body: Setor) => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const { data } = await api({
				url: `setores/`,
				method: `POST`,
				data: body
			})
			return data
		} catch (error) {
			if (error instanceof AxiosError) {
				throw {
					code: error.response?.status,
					message: error.response?.data,
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
	onUpdate: async (user: LoginResponse, body: Setor, id: number) => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const { data } = await api({
				url: `setores/${id}/`,
				method: `PUT`,
				data: body
			})
			return data
		} catch (error) {
			if (error instanceof AxiosError) {
				throw {
					code: error.response?.status,
					message: error.response?.data,
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
			await api({
				url: `/setores/${id}/`,
				method: `DELETE`,
			})
		} catch (error) {
			if (error instanceof AxiosError) {
				throw {
					code: error.response?.status,
					message: error.response?.data?.error?.message,
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
