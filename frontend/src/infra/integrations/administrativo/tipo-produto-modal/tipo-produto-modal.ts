import { AxiosError } from 'axios'
import { LoginResponse } from '@/infra/integrations/login.ts'
import RemoteAccessClient from '@/infra/api/axios-s-managed'
import { TipoProdutoModal, TipoProdutoModalProps } from './types'

export const TipoProdutoModalModalAPI = {
	onList: async (user: LoginResponse, page: number): Promise<TipoProdutoModalProps> => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const { data } = await api({
				url: `tipo-pacote/`,
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
	onSave: async (user: LoginResponse, body: TipoProdutoModal) => {
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
	onUpdate: async (user: LoginResponse, body: TipoProdutoModal, id: number) => {
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
				url: `tipo-pacote/${id}/`,
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
