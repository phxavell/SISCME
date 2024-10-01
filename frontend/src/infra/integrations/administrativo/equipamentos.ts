import RemoteAccessClient from '../../api/axios-s-managed.ts'
import {LoginResponse} from '../login.ts'
import {EquipamentosFormSchemaType} from '@pages/por-grupo/administrativo/cruds/equipamento/schemas.ts'
import {AxiosError} from 'axios'
import { EquipamentosResponse} from "@infra/integrations/administrativo/types-equipamentos.ts"
import moment from 'moment'

const montarPayload = (body:any)=> {
	return {
		numero_serie: body.numero_serie,
		descricao: body.descricao,
		data_fabricacao: body.data_fabricacao ? moment(body.data_fabricacao).format(`YYYY-MM-DD`) : ``,
		registro_anvisa: body.registro_anvisa,
		capacidade: body.capacidade,
		fabricante: body.fabricante,
		fornecedor: body.fornecedor,
		ativo: body.ativo,
		tipo: body.tipo
	}
}

export const EquipamentosAPI = {
	listar: async (user: LoginResponse, page?: number): Promise<any> => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const { data } = await api({
				url: `equipamentos/`,
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
	formOptions: async (user: LoginResponse): Promise<any> => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const { data } = await api({
				url: `equipamentos/form-options/`,
				method: `GET`,
			})

			return data.data
		} catch (e: any) {
			if (e instanceof AxiosError) {
				throw `Erro ao buscar opções de tipo de equipamento`
			}
		}
	},

	save: async (user: LoginResponse, body: EquipamentosFormSchemaType) => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const payload = montarPayload(body)
			const {data} = await api({
				url: `equipamentos/`,
				method: `POST`,
				data: payload
			})
			return data
		} catch (error) {
			//TODO tratar
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

	atualizar: async (user: LoginResponse, body: any) => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const payload = montarPayload(body)
			const { data } = await api({
				url: `equipamentos/${body.idequipamento}/`,
				method: `PUT`,
				data: payload
			})
			return data
		} catch (error: any) {
			//TODO tratar
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

	excluir: async (user: LoginResponse, body: EquipamentosResponse) => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const { data } = await api({
				url: `equipamentos/${body.idequipamento}/`,
				method: `DELETE`,
				data: body
			})
			return data
		} catch (e: any) {
			if (e instanceof AxiosError) {
				throw {
					status: e.response?.status,
					message: e.response?.data?.error?.message,
					data: undefined
				}

			}
		}
	},

	buscar: async (user: LoginResponse, id:number) => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const { data } = await api({
				url: `equipamentos/${id}/`,
				method: `GET`,
			})
			return data
		} catch (e: any) {
			//TODO tratar
			throw {
				status: e.response?.status,
				message: e.response?.data?.error?.message,
				data: undefined
			}
		}
	},
	listEquipamentoUuid: async (user: LoginResponse, uuid:string, params: string) => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const { data } = await api({
				url: `equipamentos/uuid/${uuid}/`,
				method: `GET`,
				params: {tipo: params}
			})
			if(Array.isArray(data.data)){
				const equipamento = data.data.map((equi: any) =>  ({
					id: equi.idequipamento,
				    value: equi.descricao,
					uuid: equi.uuid,
					tipo: equi.tipo,
				}))
				return equipamento
			}

			return []
		} catch (e: any) {
			throw {
				status: e.response?.status,
				message: e.response?.data?.error?.message,
				data: undefined
			}
		}
	},

	listarManutencoesPorEquipamento: async (user: LoginResponse, id:number) => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const { data } = await api({
				url: `equipamentos/registro-manutencao/?equipamento=${id}`,
				method: `GET`,
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

	listarManutencoesPlanejadasPorEquipamento: async (user: LoginResponse, equipamento: any) => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const { data } = await api({
				url: `equipamentos/registro-manutencao/manutencoes-planejadas-equipamento/`,
				method: `GET`,
				params: { equipamento }
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

	planejarManutencoesPorEquipamento: async (user: LoginResponse, body: any) => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const { data } = await api({
				url: `equipamentos/registro-manutencao/planejar-manutencao/`,
				method: `POST`,
				data: body
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

	iniciarManutencoesPorEquipamento: async (user: LoginResponse, body: any) => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const { data } = await api({
				url: `equipamentos/registro-manutencao/`,
				method: `POST`,
				data: body
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

	iniciarManutencoesPorEquipamentoPlanejado: async (user: LoginResponse, body: any) => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const { data } = await api({
				url: `equipamentos/registro-manutencao/iniciar-manutencao/`,
				method: `PATCH`,
				data: body
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
	finalizarManutencoesPorEquipamento: async (user: LoginResponse, idequipamento:number) => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const { data } = await api({
				url: `equipamentos/registro-manutencao/${idequipamento}/finalizar-manutencao/`,
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
	}
}
