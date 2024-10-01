import { AxiosError } from 'axios'
import { LoginResponse } from '@/infra/integrations/login.ts'
import RemoteAccessClient from '@/infra/api/axios-s-managed'
import { SubTipoProdutoModal, SubTipoProdutoModalProps } from './types'

export const SubTipoProdutoModalAPI = {
	onList: async (user: LoginResponse, page: number): Promise<SubTipoProdutoModalProps> => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const { data } = await api({
				url: `subtipoproduto/`,
				method: `GET`,
				params: {page}
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
	onSave: async (user: LoginResponse, body: SubTipoProdutoModal) => {
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
	onUpdate: async (user: LoginResponse, body: SubTipoProdutoModal, id: number) => {
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
		} catch (error: any) {
			if (error instanceof AxiosError) {
				if(error.code === `ERR_NETWORK`){
					throw {
						code: error.code,
						messsage: error.message
					}
				} else {
					throw {
						code: error.code,
						message: error.message,
						data: error.response?.data.error.data
					}
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
