import RemoteAccessClient from "../../api/axios-s-managed"
import { LoginResponse } from "@/infra/integrations/login.ts"
import {ClientMock} from "@infra/integrations/__mocks__/client-mock.ts"
import { UsuarioClienteFormSchemaType } from "@/pages/por-grupo/administrativo/cruds/cliente/novo-cliente/UsuarioCliente/schemas"
import { AxiosError } from "axios"
import moment from "moment"
import { UsuarioClienteResponse } from "./interfaces"

export const UsuarioClienteAPI = {
	getOptions: async (user: LoginResponse, idcli: number): Promise<UsuarioClienteResponse[]> => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const { data } = await api({
				url: `clientes/${idcli}/usuarios/`,
				method: `GET`
			})

			if ( data && Array.isArray(data.data) ){
				return data.data
			} else {
				return []
			}

		} catch (e) {
			throw {
				// @ts-ignore
				status: e.response.status,
				statusText: `Erro ao buscar clientes.`,
				data: ClientMock.options
			}
		}
	},

	save: async (user: LoginResponse, body: UsuarioClienteFormSchemaType) => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const payload = {
				...body,
				dtnascimento: moment(body?.dtnascimento).format(`YYYY-MM-DD`)
			}
			const {data} = await api({
				url: `clientes/${body.cliente}/usuarios/`,
				method: `POST`,
				data: payload
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

	atualizar: async (user: LoginResponse, body: UsuarioClienteResponse) => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const { data } = await api({
				url: `clientes/`,
				method: `PUT`,
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

	desativarUsuarioCliente: async (user: LoginResponse, id: number | undefined) => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const { data } = await api({
				url: `cadastro/usuarios/${id}/desativar/`,
				method: `PATCH`,
			})
			return data
		} catch (e: any) {
			throw {
				status: e.response?.status,
				statusText: e.response?.data?.error?.message,
				data: undefined
			}
		}
	},

	ativarUsuarioCliente: async (user: LoginResponse, id: number | undefined) => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const { data } = await api({
				url: `cadastro/usuarios/${id}/ativar/`,
				method: `PATCH`,
			})
			return data
		} catch (e: any) {
			throw {
				status: e.response?.status,
				message: e.response?.data?.error?.message,
				data: undefined
			}
		}
	},
}
