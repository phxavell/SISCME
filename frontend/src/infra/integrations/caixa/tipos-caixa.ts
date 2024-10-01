import { LoginResponse } from "@infra/integrations/login.ts"
import RemoteAccessClient from "@infra/api/axios-s-managed.ts"
import { IOptionResponse, IOptionToSelect } from "@infra/integrations/caixa/types.ts"
import { mapMakeOptionList } from "@infra/integrations/caixa/caixa.ts"
import { AxiosError } from "axios"

interface TiposCaixaBody {
    descricao: string
}

export const TiposCaixaAPI = {
	listar: async (user: LoginResponse, page?: number) => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const { data } = await api({
				url: `tipos-caixa/`,
				method: `GET`,
				params: { page }
			}).catch(() => {
				return { data: undefined }
			})
			if (data && Array.isArray(data.data)) {
				return data
			}
		} catch (e: any) {
			throw `Erro ao buscar tipos de caixas.`
		}
	},
	buscarPor: async (user: LoginResponse, pesquisa: string): Promise<IOptionToSelect[]> => {
		try {
			const api = RemoteAccessClient.getInstance(user)

			const { data } = await api({
				url: `tipos-caixa/` + pesquisa + `/`,
				method: `GET`,
			}).catch(() => {
				return { data: undefined }
			})
			if (data && Array.isArray(data.data)) {
				return data.data.map(mapMakeOptionList)
			}
			return []
		} catch (e: any) {
			throw `Erro ao deletar tipos de caixas.`
		}
	},
	salvar: async (user: LoginResponse, body: TiposCaixaBody): Promise<number> => {
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
	alterar: async (user: LoginResponse, body: IOptionResponse): Promise<void> => {
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
	deletar: async (user: LoginResponse, body: IOptionToSelect): Promise<void> => {
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
