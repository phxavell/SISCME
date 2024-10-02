import RemoteAccessClient from "@/infra/api/axios-s-managed"
import { LoginResponse } from "../login"
import { RespostaAPI } from "../types"
import { erroProps, IEsterilizacao } from "./types"
import { AxiosError } from "axios"
import { EtiquetaEsterilizacaoResponse } from "./types"

export namespace NEsterilizacao {
	export enum MethodsEsterilizacao {
		Get = `processo/esterilizacao/caixas-pendentes/`,
	}

	export enum MethodsEsterilizacaoPesquisa {
		Get = `processo/esterilizacao/acompanhamento/`,
	}
}

export const mapErrosBackendToUseForm = (e: any) => {
	const errors: any[] = []
	// eslint-disable-next-line no-unsafe-optional-chaining
	const { data } = e.error ?? e?.response?.data?.error
	if (data) {
		Object.entries(data).map(([key, value]: any[]) => {

			if (key === `itens`) {
				errors.push({
					keyName: key,
					type: `manual`,
					message: value[0]
				})
			} else {
				errors.push({
					keyName: key,
					type: `manual`,
					message: value[0]
				})
			}
		})
		throw errors
	}
	//alertError(`Erro não mapeado.`)//TODO checar
	throw [{
		type: `manual`,
		message: `Erro não mapeado.`
	}]
}

export const EsterilizacaoAPI = {
	listarEsterilizacao: async (user: LoginResponse, page: number): Promise<RespostaAPI<IEsterilizacao> | undefined> => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const { data } = await api({
				url: `processo/esterilizacao/caixas-pendentes/`,
				method: `GET`,
				params: {
					page: page + 1
				}
			})
			return data
		} catch (error) {

			if (error instanceof AxiosError) {
				const customError: erroProps = {
					message: error.response?.data.error.message,
					code: error.response?.status
				}
				throw customError
			}
		}
	},

	enviarEsterilizacao: async (user: LoginResponse, body: any) => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const [data, error] = await api({
				url: `processo/esterilizacao/`,
				data: body,
				method: `POST`
			}).then(({ data }) => {
				return [data, null]
			}).catch((e) => {
				return [undefined, e.response.data]
			})
			if (data) {
				return true
			} else {
				throw error
			}
		} catch (error) {

			return mapErrosBackendToUseForm(error)

		}
	},

	listarCaixas: async (user: LoginResponse): Promise<RespostaAPI<IEsterilizacao> | undefined> => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const { data } = await api({
				url: `processo/esterilizacao/acompanhamento/`,
				method: `GET`
			})
			return data
		} catch (error) {
			if (error instanceof AxiosError) {
				const customError: erroProps = {
					message: error.response?.data.error.message,
					code: error.response?.status
				}
				throw customError
			}
		}
	},
	listarCaixasFiltro: async (user: LoginResponse, params: any): Promise<RespostaAPI<IEsterilizacao> | undefined> => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const { data } = await api({
				url: `processo/esterilizacao/acompanhamento/`,
				method: `GET`,
				params: params
			})
			return data
		} catch (error) {
			if (error instanceof AxiosError) {
				const customError: erroProps = {
					message: error.response?.data.error.message,
					code: error.response?.status
				}
				throw customError
			}
		}
	},

	listarStatus: async (user: LoginResponse): Promise<any | undefined> => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const { data } = await api({
				url: `processo/esterilizacao/form-options/`,
				method: `GET`
			})
			return data
		} catch (error) {
			if (error instanceof AxiosError) {
				const customError: erroProps = {
					message: error.response?.data.error.message,
					code: error.response?.status
				}
				throw customError
			}
		}
	},

	view: async (user: LoginResponse, id: number): Promise<IEsterilizacao | undefined> => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const { data } = await api({
				url: `processo/esterilizacao/${id}/`,
				method: `GET`
			})
			return data
		} catch (error) {
			if (error instanceof AxiosError) {
				const customError: erroProps = {
					message: error.response?.data.error.message,
					code: error.response?.status
				}
				throw customError
			}
		}
	},
	buscarDadosPdf: async (user: LoginResponse, id: number): Promise<IEsterilizacao> => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const { data } = await api({
				url: `processo/esterilizacao/${id}/dados-report/`,
				method: `GET`
			})
			if (data) {
				return data
			}
			throw `Error`
		} catch (error) {
			if (error instanceof AxiosError) {
				const customError: erroProps = {
					message: error.response?.data.error.message,
					code: error.response?.status
				}
				throw customError.message
			}
			throw `Erro ao buscar dados do relatório. Tente mais tarde;`
		}
	},


	abortar: async (user: LoginResponse, id: number): Promise<any | undefined> => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const { data } = await api({
				url: `processo/esterilizacao/${id}/abortar/`,
				method: `POST`
			})
			return data
		} catch (error: any) {

			if (error?.response?.status === 500) {
				throw `Não foi possível realizar a operação. Contate o suporte.`
			} else if (error instanceof AxiosError) {
				const customError: erroProps = {
					message: error.response?.data?.error?.message,
					code: error.response?.status
				}
				throw customError.message
			} else {
				throw `Não foi possível realizar a operação. Contate o suporte.`
			}
		}
	},

	finalizar: async (user: LoginResponse, id: number): Promise<any | undefined> => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const { data } = await api({
				url: `processo/esterilizacao/${id}/finalizar/`,
				method: `POST`
			})
			return data
		} catch (error) {
			if (error instanceof AxiosError) {
				const customError: erroProps = {
					message: error.response?.data.error.message,
					code: error.response?.status
				}
				throw customError
			}
		}
	},
	buscarDadosEtiquetaPdf: async (user: LoginResponse, id: number): Promise<EtiquetaEsterilizacaoResponse> => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const {data} = await api({
				url: `processo/esterilizacao/${id}/dados-report/`,
				method: `GET`
			})
			if (data) {
				return data
			}
			throw `Error`
		} catch (error) {
			if (error instanceof AxiosError) {
				const customError: erroProps = {
					message: error.response?.data.error.message,
					code: error.response?.status
				}
				throw customError.message
			}
			throw `Erro ao buscar dados do relatório. Tente mais tarde;`
		}
	},
	iniciarEsterilizacaoTeste: async (user: LoginResponse, payload: any): Promise<any | undefined> => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const { data } = await api({
				url: `processo/esterilizacao/teste/`,
				data: payload,
				method: `POST`
			})
			return data
		} catch (error) {
			if (error instanceof AxiosError) {
				const customError: erroProps = {
					message: error.response?.data.error.message,
					code: error.response?.status
				}
				throw customError
			}
		}
	},

}
