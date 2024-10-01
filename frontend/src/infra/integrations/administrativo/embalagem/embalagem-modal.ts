import { LoginResponse } from "@infra/integrations/login.ts"
import RemoteAccessClient from "@infra/api/axios-s-managed.ts"
import { AxiosError } from "axios"
import { Embalagem, EmbalagemProps } from "./types"


export const EmbalagemModalAPI = {
	listar: async (user: LoginResponse, page: number): Promise<EmbalagemProps> => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const { data } = await api({
				url: `embalagens/`,
				method: `GET`,
				params: {page}
			})
			return data
		} catch (e: any) {
			throw `Erro ao buscar embalagens.`
		}
	},

	salvar: async (user: LoginResponse, body: any): Promise<number> => {
		try {
			const api = RemoteAccessClient.getInstance(user)

			const { data } = await api({
				url: `embalagens/`,
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
	alterar: async (user: LoginResponse, body: Embalagem): Promise<void> => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			await api({
				url: `embalagens/` + body.id + `/`,
				method: `PUT`,
				data: body
			})
		} catch (error: any) {
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
	deletar: async (user: LoginResponse, body: Embalagem): Promise<void> => {
		try {
			const api = RemoteAccessClient.getInstance(user)

			await api({
				url: `embalagens/` + body.id + `/`,
				method: `DELETE`,
			})
		} catch (error: any) {
			if (error instanceof AxiosError) {
				throw {
					code: error.code,
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

}
