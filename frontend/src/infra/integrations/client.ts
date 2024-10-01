import RemoteAccessClient from '../api/axios-s-managed'
import {LoginResponse} from '@/infra/integrations/login.ts'
import {NewClientFormInputs} from './usuario-cliente/types'
import { ClienteResponse, StatusCliente} from "@infra/integrations/types-client.ts"


export const ClientAPI = {
	listar: async (user: LoginResponse, page: number, status?: StatusCliente): Promise<ClienteResponse> => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const {data} = await api({
				url: `clientes/`,
				method: `GET`,
				params: {page, status: status ?? StatusCliente.Ambos}
			})

			return data
		} catch (e: any) {
			throw e.response?.data?.error?.message ?? `Erro ao buscar clientes.`
		}
	},
	listarAll: async (user: LoginResponse): Promise<any[]> => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const {data} = await api({
				url: `clientes/`,
				method: `GET`,
			})

			return data.data
		} catch (e: any) {
			throw e.response?.data?.error?.message ?? `Erro ao buscar clientes.`
		}
	},
	buscarClientePorId: async (user: LoginResponse, id: number): Promise<ClienteResponse> => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const {data} = await api({
				url: `clientes/${id}/`,
				method: `GET`,
			})
			return data.data
		} catch (e: any) {
			throw e.response?.data?.error?.message ?? `Erro ao buscar clientes.`
		}
	},

	buscarCliente: async (user: LoginResponse, search: string, statusClientes: StatusCliente): Promise<ClienteResponse> => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const {data} = await api({
				url: `clientes/`,
				method: `GET`,
				params: {search, status: statusClientes}
			})
			return data
		} catch (e: any) {
			throw e.response?.data?.error?.message ?? `Erro ao buscar clientes.`
		}
	},

	optionsCliente: async (user: LoginResponse): Promise<any[]> => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const {data} = await api({
				url: `clientes/`,
				method: `OPTIONS`,
			})
			return data.actions.POST
		} catch (e: any) {
			throw e.response?.data?.error?.message ?? `Erro ao buscar clientes.`
		}
	},

	save: async (user: LoginResponse, body: NewClientFormInputs) => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const {data} = await api({
				url: `clientes/`,
				method: `POST`,
				data: body
			})
			return data
		} catch (error: any) {
			throw error.response?.data?.error ?? `Erro ao salvar cliente.`
		}
	},

	atualizar: async (user: LoginResponse, body: NewClientFormInputs) => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const {data} = await api({
				url: `clientes/${body.idcli}/`,
				method: `PUT`,
				data: body
			})
			return data
		} catch (error: any) {
			throw error.response?.data?.error?.data ?? `Erro ao atualizar cliente.`
		}
	},

	excluir: async (user: LoginResponse, body: any) => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const {data} = await api({
				url: `clientes/${body.idcli}/`,
				method: `DELETE`,
				data: body
			})
			return data
		} catch (e: any) {
			throw e.response?.data?.error?.message ?? `Erro ao excluir cliente.`
		}
	},

	desativarCliente: async (user: LoginResponse, id: number | undefined) => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const {data} = await api({
				url: `clientes/${id}/desativar/`,
				method: `PATCH`,
			})
			return data
		} catch (e: any) {
			throw e.response?.data?.error?.message ?? `Erro ao desativar cliente.`
		}
	},

	ativarCliente: async (user: LoginResponse, id: number | undefined) => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const {data} = await api({
				url: `clientes/${id}/ativar/`,
				method: `PATCH`,
			})
			return data
		} catch (e: any) {
			throw e.response?.data?.error?.message ?? `Erro ao ativar cliente.`
		}
	},
}
