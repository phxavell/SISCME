import { AxiosError } from 'axios'
import RemoteAccessClient from '../api/axios-s-managed'
import { LoginResponse } from '@/infra/integrations/login.ts'

export type Profissao = {
    id?: number,
    descricao: string,
}
export type ProfissoesProps = {
    data: Array<Profissao>,
    meta: {
        currentPage: number
        itemsPerPage: number,
        totalItems: number
        totalPages: number
        firstItem: number
        lastItem: number
    }
}
export const ProfissaoAPI = {
	onList: async (user: LoginResponse, page: number): Promise<ProfissoesProps | undefined> => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const { data } = await api.get(`profissoes/`, {
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
	onSave: async (user: LoginResponse, body: Profissao) => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const { data } = await api({
				url: `profissoes/`,
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
	onUpdate: async (user: LoginResponse, body: Profissao, id: number) => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const { data } = await api({
				url: `profissoes/${id}/`,
				method: `PUT`,
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
	onDelete: async (user: LoginResponse, id: number) => {
		try {
			const api = RemoteAccessClient.getInstance(user)

			const { data } = await api({
				url: `profissoes/${id}/`,
				method: `DELETE`,
			})
			return data
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
