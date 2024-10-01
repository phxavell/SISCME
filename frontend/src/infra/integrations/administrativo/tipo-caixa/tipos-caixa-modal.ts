import { LoginResponse } from "@infra/integrations/login.ts"
import RemoteAccessClient from "@infra/api/axios-s-managed.ts"
import { AxiosError } from "axios"
import { TipoCaixaModal, TipoCaixaModalProps } from "./types"


export const TiposCaixaModalAPI = {
	listar: async (user: LoginResponse, page?: number): Promise<TipoCaixaModalProps> => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const { data } = await api({
				url: `tipos-caixa/`,
				method: `GET`,
				params: {page}
			})
			return data
		} catch (e: any) {
			throw `Erro ao buscar tipos de caixas.`
		}
	},
	salvar: async (user: LoginResponse, body: TipoCaixaModal): Promise<number> => {
		try {
			const api = RemoteAccessClient.getInstance(user)

			const { data } = await api({
				url: `tipos-caixa/`,
				method: `POST`,
				data: body
			})
			return data
		} catch (error: any) {
			if (error instanceof AxiosError) {
				throw {
					code: error.response?.status,
					message: error.response?.data?.error?.message,
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
	alterar: async (user: LoginResponse, body: TipoCaixaModal): Promise<void> => {
		try {
			const api = RemoteAccessClient.getInstance(user)

			const { data } = await api({
				url: `tipos-caixa/` + body.id + `/`,
				method: `PUT`,
				data: body
			})
			return data
		} catch (error: any) {
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
	},
	deletar: async (user: LoginResponse, body: TipoCaixaModal): Promise<void> => {
		try {
			const api = RemoteAccessClient.getInstance(user)

			await api({
				url: `tipos-caixa/` + body.id + `/`,
				method: `DELETE`,
			})

		} catch (error: any) {
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
