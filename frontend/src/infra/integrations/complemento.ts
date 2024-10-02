import RemoteAccessClient from '../api/axios-s-managed'
import {LoginResponse} from '@/infra/integrations/login.ts'
import { AxiosError } from 'axios'
import { ComplementoResponse, ComplementoProps } from './administrativo/types-equipamentos'
import {errorProps} from "@infra/integrations/plantao.ts"

const getMensagemDeErro = (e: any, messageDefault = `Erro não mapeado`) => {
	if (e instanceof AxiosError) {

		if (e.code === `ERR_NETWORK`) {
			return `Erro de conexão com internet.`
		}
		// @ts-ignore
		const msgerro=e?.response?.error?.message
		if(msgerro){
			return msgerro
		}

		const body_error = e?.response?.data?.error?.message
		if(body_error){
			return body_error
		}

		const customError: errorProps = {
			// @ts-ignore
			message: e?.response?.message ?? messageDefault,
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

export const ComplementoAPI = {
	listar: async (user: LoginResponse, page: number, status?: string): Promise<ComplementoResponse> => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const { data } = await api({
				url: `complementos/`,
				method: `GET`,
				params: { page, status }
			})
			return data
		} catch (e) {
			throw getMensagemDeErro(e, `Erro ao buscar dados de Complemento.`)
		}
	},
	listarComplementosAtivos: async (user: LoginResponse): Promise<ComplementoProps[]> => {
		try {
			const status = `ativo`
			const api = RemoteAccessClient.getInstance(user)
			const { data } = await api({
				url: `complementos/`,
				method: `GET`,
				params: { status }
			})
			return data?.data
		} catch (e) {
			throw getMensagemDeErro(e, `Erro ao buscar dados de Complemento.`)
		}
	},
	buscaPorDescricao: async (user: LoginResponse, page: number, descricao: string, status: string): Promise<ComplementoResponse> => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const { data } = await api({
				url: `complementos/`,
				method: `GET`,
				params: { descricao, page, status }
			})
			return data
		} catch (e) {
			throw getMensagemDeErro(e, `Erro ao buscar dados de Complemento.`)
		}
	},
	buscarComplementos: async (user: LoginResponse, descricao: string): Promise<ComplementoProps[]> => {
		try {
			const status = `ativo`
			const api = RemoteAccessClient.getInstance(user)
			const { data } = await api({
				url: `complementos/`,
				method: `GET`,
				params: { descricao, status }
			})
			return data?.data
		} catch (e) {
			throw getMensagemDeErro(e, `Erro ao buscar dados de Complemento.`)
		}
	},
	save: async (user: LoginResponse, body: any, onSave?: any, onError?: any): Promise<any> => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const {data} = await api({
				url: `complementos/`,
				method: `POST`,
				data: body
			})
			if(onSave){
				onSave(`Complemento salvo com sucesso!`)
			}
			if(data.data){
				return  data.data
			}
		} catch (error) {
			let newError = {}
			if (error instanceof AxiosError) {
				if(error?.response){
					 newError ={
						code: error.response?.data?.error.code,
						message:error.response?.data?.error
					}
					if(onError){
						onError(newError)
					}

				} else {
					 newError ={
						code: error.code,
						message:error.message
					}
					if(onError){
						onError(newError)
					}
				}
			} else {
				newError = {
					message:`Erro não mapeado`
				}
				if(onError){
					onError(newError)
				}
			}
		}
	},

	editar: async (user: LoginResponse, body: any): Promise<ComplementoResponse> => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const { data } = await api({
				url: `complementos/${body.id}/`,
				method: `PATCH`,
				data: body
			})
			return data
		} catch (e) {
			throw getMensagemDeErro(e, `Erro ao buscar dados de Complemento.`)
		}
	},

	delete: async (user: LoginResponse, id: any): Promise<ComplementoResponse> => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const { data } = await api({
				url: `complementos/${id}/`,
				method: `DELETE`,
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
				throw {
					// @ts-ignore
					status: error.response.status, statusText: `Erro não mapeado.`
				}
			}
		}
	},
}
