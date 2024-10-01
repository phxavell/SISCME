import RemoteAccessClient from "../../api/axios-s-managed"
import { LoginResponse } from "@/infra/integrations/login.ts"
import { AxiosError } from "axios"
import { EtiquetaFormSchemaType } from "@/pages/por-grupo/tecnico-cme/cruds/etiquetas/schemas"
import { EtiquetaResponse, DataEtiqueta } from "./types-etiquetas"
import {errorProps} from "@infra/integrations/plantao.ts"

const getMensagemDeErro = (e: any, messageDefault = `Erro não mapeado`) => {
	if (e instanceof AxiosError) {

		if (e.code === `ERR_NETWORK`) {
			return `Erro de conexão com internet.`
		}

		const customError: errorProps = {
			message: e?.response?.statusText ?? messageDefault,
			code: e?.response?.status,
			data: e?.response?.data
		}

		if (customError.data) {
			// TODO ajustar padrão de retorno do backend
			// TODO após ajuste atualizar a lógica abaixo, possível só remover;
			Object.keys(customError.data).map((key) => {
				customError.message = customError.data[key][0]
			})
		}
		if (customError.message) {
			return customError.message
		}
	}
	return messageDefault
}

export const EtiquetaAPI = {
	getOptions: async (user: LoginResponse, page: number): Promise<EtiquetaResponse> => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const { data } = await api({
				url: `etiquetas/`,
				method: `GET`,
				params: { page }
			})
			return data
		} catch (e) {
			throw getMensagemDeErro(e, `Erro ao buscar dados de Etiqueta.`)
		}
	},
	formOptions: async (user: LoginResponse): Promise<any> => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const { data } = await api({
				url: `etiquetas/form-options/`,
				method: `GET`,
			})
			return data.data
		} catch (e) {
			throw getMensagemDeErro(e, `Erro ao buscar dados de Etiqueta.`)
		}
	},
	buscaEtiquetaFiltro: async (user: LoginResponse, page: number, data_inicial?: string, data_final?: string, codigo?: string): Promise<EtiquetaResponse> => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const { data } = await api({
				url: `etiquetas/`,
				method: `GET`,
				params: { data_inicial, data_final, codigo, page }
			})
			return data
		} catch (error) {
			if (error instanceof AxiosError) {

				throw {
					code: error.code,
					message: error.message,
					data: error.response?.data.error.message
				}
			} else {
				throw getMensagemDeErro(error, `Erro ao buscar dados de Etiqueta.`)

			}
		}
	},
	save: async (user: LoginResponse, body: EtiquetaFormSchemaType): Promise<DataEtiqueta> => {
		try {
			// const payload = {
			// 	descricaoaberto: body,
			// }
			const api = RemoteAccessClient.getInstance(user)
			const { data } = await api({
				url: `etiquetas/`,
				method: `POST`,
				data: body
			})
			return data.data
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
	atualizarEtiqueta: async (user: LoginResponse, body: EtiquetaFormSchemaType, id: number) => {
		try {

			const api = RemoteAccessClient.getInstance(user)
			const { data } = await api({
				url: `etiquetas/${id}/`,
				method: `PUT`,
				data: body
			})
			return data.data
		} catch (error: any) {
			if (error instanceof AxiosError) {

				throw {
					code: error.code,
					message: error.message,
					data: error.response?.data.error.message
				}
			} else {
				throw {
					// @ts-ignore
					status: error.response.status, statusText: `Erro não mapeado.`
				}
			}
		}
	},

	atualizar: async (user: LoginResponse, body: string, id: number) => {
		try {
			const payload = {
				descricaoaberto: body,
			}
			const api = RemoteAccessClient.getInstance(user)
			const { data } = await api({
				url: `plantoes/${id}/`,
				method: `PUT`,
				data: payload
			})
			return data
		} catch (error: any) {
			if (error instanceof AxiosError) {

				throw {
					code: error.code,
					message: error.message,
					data: error.response?.data.error.message
				}
			} else {
				throw {
					// @ts-ignore
					status: error.response.status, statusText: `Erro não mapeado.`
				}
			}
		}
	},
	excluir: async (user: LoginResponse, id: number) => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			await api({
				url: `etiquetas/${id}/`,
				method: `DELETE`,
			})
		} catch (error: any) {
			if (error instanceof AxiosError) {

				throw {
					code: error.code,
					message: error.message,
					data: error.response?.data.error.message
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
