import RemoteAccessClient from "../api/axios-s-managed"
import { LoginResponse } from "@/infra/integrations/login.ts"
import { AxiosError } from "axios"

import {metaPages} from "@infra/integrations/administrativo/types-equipamentos.ts"

export interface DataPlantao {
    idplantao: number;
    created_at: string;
    updated_at: string;
    datacadastro: string;
    datafechamento: string;
    descricaoaberto: string;
    descricaofechamento: string;
    grupousuario: string;
    horacadastro: string;
    horafechamento: string;
    status: string;
    created_by: number;
    updated_by: number;
    profissional: {
		id: number
		nome: string
	};
}

export interface PlantaoResponse {
    status: string
    data: DataPlantao[]
    meta: metaPages
}

export interface errorProps {
    code: number | undefined
    message: string | undefined
    data: any | undefined
}

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

export const PlantaoAPI = {
	getOptions: async (user: LoginResponse, page: number): Promise<PlantaoResponse> => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const { data } = await api({
				url: `plantoes/`,
				method: `GET`,
				params: { page }
			})
			return data
		} catch (e) {
			throw getMensagemDeErro(e, `Erro ao buscar dados de Plantão.`)
		}
	},
	buscaPlantaoFiltro: async (user: LoginResponse, page: number, data_inicial?: string, data_final?: string, status?: string, profissional?: string): Promise<PlantaoResponse> => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const { data } = await api({
				url: `plantoes/`,
				method: `GET`,
				params: { data_inicial, data_final, status, profissional, page }
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
				throw getMensagemDeErro(error, `Erro ao buscar dados de Plantão.`)

			}
		}
	},
	save: async (user: LoginResponse, body: string) => {
		try {
			const payload = {
				descricaoaberto: body,
			}
			const api = RemoteAccessClient.getInstance(user)
			const { data } = await api({
				url: `plantoes/`,
				method: `POST`,
				data: payload
			})
			if (Array.isArray(data)) {
				return data
			} else {
				return []
			}
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

	fecharPlantao: async (user: LoginResponse, body: string, id: number) => {
		try {
			const payload = {
				descricaofechamento: body,
			}
			const api = RemoteAccessClient.getInstance(user)
			const { data } = await api({
				url: `plantoes/${id}/fechamento/`,
				method: `PUT`,
				data: payload
			})
			if (Array.isArray(data)) {
				return data
			} else {
				return []
			}
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
