import { LoginResponse } from "@infra/integrations/login.ts"
import RemoteAccessClient from "@infra/api/axios-s-managed.ts"
import { Embalagem, IOptionToSelect } from "@infra/integrations/caixa/types.ts"
import { mapMakeOptionList } from "@infra/integrations/caixa/caixa.ts"
import { AxiosError } from "axios"

interface bodyEmbalgem {
    descricao: string
    valorcaixa: string
}

interface bodyEmbalgemEdit {
    id: number
    descricao: string
    valorcaixa: string
}

export const EmbalagemAPI = {
	listar: async (user: LoginResponse): Promise<IOptionToSelect[]> => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const { data } = await api({
				url: `embalagens/`,
				method: `GET`
			})
			if (data && Array.isArray(data.data)) {
				return data.data.map(mapMakeOptionList)
			}
			return []
		} catch (e: any) {
			throw `Erro ao buscar embalagens.`
		}
	},
	listarGeral: async (user: LoginResponse): Promise<Embalagem[]> => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const { data } = await api({
				url: `embalagens/`,
				method: `GET`
			})
			if (data && Array.isArray(data.data)) {
				return data.data
			}
			return []
		} catch (e: any) {
			throw `Erro ao buscar embalagens.`
		}
	},
	buscarPor: async (user: LoginResponse, pesquisa: string): Promise<IOptionToSelect[]> => {
		try {
			const api = RemoteAccessClient.getInstance(user)

			const { data } = await api({
				url: `embalagens/` + pesquisa + `/`,
				method: `GET`,
			}).catch(() => {
				return { data: undefined }
			})
			if (data && Array.isArray(data.data)) {
				return data.data.map(mapMakeOptionList)
			}
			return []
		} catch (e: any) {
			throw `Erro ao deletar embalagens.`
		}
	},
	salvar: async (user: LoginResponse, body: bodyEmbalgem): Promise<number> => {
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
	alterar: async (user: LoginResponse, body: bodyEmbalgemEdit): Promise<void> => {
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
	deletar: async (user: LoginResponse, body: IOptionToSelect): Promise<void> => {
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
