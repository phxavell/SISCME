import RemoteAccessClient from '../api/axios-s-managed'
import { LoginResponse } from '@/infra/integrations/login.ts'
import { AxiosError } from 'axios'
import {errorProps} from "@infra/integrations/plantao.ts"

export interface Box {
    modelo_caixa: string
    serial: string
    situacao: string
}

export interface CaixaDoCliente {
    idsequenciaetiqueta: string
}

export interface EsterelizacaoBody {
    observacao: string
    caixas: Box[]
}
export interface Historico {
    situacao: string
    data_atualizacao: string
}
interface Coleta {
    created_at: string
    idcoleta: number
}
export interface SolicitacaoDoCliente {
    id: number
    situacao: string
    cliente: string | number
    observacao: string | null
    data_criacao: string
    data_atualizacao: string
    historico: Historico[]
    criado_por: string | number | null
    atualizado_por: string | null
    solicitacao: number
    retorno: boolean,
    coleta: Coleta
    caixas: string[]
    quantidade: number
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

export const ClienteSolicitacoes = {
	getBoxFromClient: async (user: LoginResponse): Promise<Box[]> => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const { data } = await api({
				url: `cliente/lista-de-caixas/`,
				method: `GET`
			})
			if (Array.isArray(data.data)) {
				return data.data
			} else {
				return []
			}
		} catch (error: any) {
			if (error instanceof AxiosError) {
				throw {
					code: error.response?.status,
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
	list: async (user: LoginResponse): Promise<SolicitacaoDoCliente[]> => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const { data } = await api({
				url: `cliente/solicitacoes/`,
				method: `GET`,

			})
			if (Array.isArray(data.data)) {
				return data.data
			} else {
				return []
			}
		} catch (e: any) {
			throw {
				message: e.response.data.error.message
			}
		}
	},

	save: async (user: LoginResponse, payload: any): Promise<string> => {
		try {
			const body: EsterelizacaoBody = {
				caixas: payload.boxes,
				observacao: payload.note
			}
			const api = RemoteAccessClient.getInstance(user)
			const { data } = await api({
				url: `solicitacoes/`,
				method: `POST`,
				data: body
			})
			return data.message
		} catch (e: any) {
			throw getMensagemDeErro(e, `Caixa já vinculada à uma solicitação.`)
		}
	},
	atualizarStatusFinalizarColeta: async (user: LoginResponse, id: number): Promise<void> => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const { data } = await api({
				url: `logistica/finalizar-coleta/${id}/`,
				method: `PATCH`
			})

			return data.data
		} catch (error) {
			throw getMensagemDeErro(error, `Erro ao finalizar entrga.`)
		}
	},
}
