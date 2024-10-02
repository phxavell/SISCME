import RemoteAccessClient from "@/infra/api/axios-s-managed"
import { LoginResponse } from "../../login"
import { AxiosError } from "axios"

export const IndicadoresAPI = {
	listar: async (user: LoginResponse, page?: number): Promise<any> => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const { data } = await api({
				url: `indicadores`,
				method: `GET`,
				params: { page }
			})

			return data
		} catch (e: any) {
			if (e instanceof AxiosError) {
				const erroGet = (error: any) => {
					if (error.response?.status == 404) {
						return error.response?.data
					} else {
						return error.response?.data.error.data
					}
				}
				throw {
					message: erroGet(e),
					status: e.response?.status,
					data: undefined
				}
			}
		}
	},
	buscarIndicadores: async (user: LoginResponse, search?: string): Promise<any> => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const { data } = await api({
				url: `indicadores`,
				method: `GET`,
				params: { search }
			})

			return data
		} catch (e: any) {
			if (e instanceof AxiosError) {
				const erroGet = (error: any) => {
					if (error.response?.status == 404) {
						return error.response?.data
					} else {
						return error.response?.data.error.data
					}
				}
				throw {
					message: erroGet(e),
					status: e.response?.status,
					data: undefined
				}
			}
		}
	},
	save: async (user: LoginResponse, body: any, onSave: any, onError: any) => {
		try {
			const data1 = {
				...body,
				foto: body.foto !== undefined ? body.foto[0].files[0] : ``,
			}
			const api = RemoteAccessClient.getInstance(user)
			const { data } = await api({
				url: `indicadores/`,
				headers: {
					'Content-Type': `multipart/form-data`
				},
				method: `POST`,
				data: data1
			})
			onSave(data?.message)
			return data
		} catch (error) {
			let newError = {}
			if (error instanceof AxiosError) {
				if(error?.response){
					 newError ={
						code: error.response?.data?.error.code,
						message:error.response?.data?.error
					}
					onError(newError)
				} else {
					 newError ={
						code: error.code,
						message:error.message
					}
					onError(newError)
				}
			} else {
				newError = {
					message:`Erro não mapeado`
				}
				onError(newError)
			}
		}
	},
	editar: async (user: LoginResponse, body: any, id: number, onEdit: any, onError: any) => {
		try {
			const fotoValidacao = () => {
				if (body.foto[0].files[0]?.length > 0 || body.foto[0].files[0] !== undefined) {
					return body.foto[0].files[0]
				} else {
					return ``
				}
			}
			const data1 = {
				...body,
				foto: fotoValidacao()
			}
			const api = RemoteAccessClient.getInstance(user)
			const { data } = await api({
				url: `indicadores/${id}/`,
				headers: {
					'Content-Type': `multipart/form-data`
				},
				method: `PUT`,
				data: data1
			})
			onEdit(data?.message)
			return data
		} catch (error) {
			let newError = {}
			if (error instanceof AxiosError) {
				if(error?.response){
					 newError ={
						code: error.response?.data?.error.code,
						message:error.response?.data?.error
					}
					onError(newError)
				} else {
					 newError ={
						code: error.code,
						message:error.message
					}
					onError(newError)
				}
			} else {
				newError = {
					message:`Erro não mapeado`
				}
				onError(newError)
			}
		}
	},
	excluir: async (user: LoginResponse, id: number) => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const { data } = await api({
				url: `indicadores/${id}/`,
				method: `DELETE`,
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

	gerarMovimentacao: async (user: LoginResponse, body: any, idIndicador: any, idLote: any) => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const { data } = await api({
				url: `indicadores/${idIndicador}/lotes/${idLote}/movimentacao/`,
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

	formOptions: async (user: LoginResponse, search?: string) => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const { data } = await api({
				url: `indicadores/form-options`,
				method: `GET`,
				params: {search}
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

	buscarLotes: async (user: LoginResponse, codigo?: string, id?: number, page?: number): Promise<any> => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const { data } = await api({
				url: `indicadores/${id}/lotes/`,
				method: `GET`,
				params: { codigo, page }
			})

			return data
		} catch (e: any) {
			if (e instanceof AxiosError) {
				const erroGet = (error: any) => {
					if (error.response?.status == 404) {
						return error.response?.data
					} else {
						return error.response?.data.error.data
					}
				}
				throw {
					message: erroGet(e),
					status: e.response?.status,
					data: undefined
				}
			}
		}
	},
	saveLote: async (user: LoginResponse, body: any) => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const { data } = await api({
				url: `indicadores/${body?.indicador}/lotes/`,
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
	editarLote: async (user: LoginResponse, body: any, idLote: any) => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const { data } = await api({
				url: `indicadores/${body?.indicador}/lotes/${idLote}/`,
				method: `PUT`,
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
	excluirLote: async (user: LoginResponse, idIndicador: number, idLote: number) => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const { data } = await api({
				url: `indicadores/${idIndicador}/lotes/${idLote}/`,
				method: `DELETE`,
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
}
