import RemoteAccessClient from '../api/axios-s-managed.ts'
import {LoginResponse} from '@/infra/integrations/login.ts'

export interface SolicitarColetaPayload {
    solicitacao: string
    motorista: number
    veiculo: number
}

export interface SolicitarColetaBody {
    solicitacao_esterilizacao: string
    motorista: number
    veiculo: number
}

export type DemandasDataType = {
    id_cliente: number,
    nome_cliente: string,
    quantidade_pendente: number,
    quantidade_andamento: number,
    quantidade_finalizado: number
}

export type DemandasType = {
    status: string
    responseCode: number
    data: DemandasDataType[]
}

export const DemandsAPI = {
	getOptions: async (user: LoginResponse): Promise<DemandasDataType[]> => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const {data} = await api({
				url: `solicitacoes/clientes/resumo/`,
				method: `GET`
			})
			if (Array.isArray(data.data)) {
				return data.data
			} else {
				return []
			}
		} catch (e: any) {
			throw {message: e}
		}
	},

	solicitarColeta: async (user: LoginResponse, payload: SolicitarColetaPayload) => {
		try {
			const body: SolicitarColetaBody = {
				solicitacao_esterilizacao: payload.solicitacao,
				motorista: payload.motorista,
				veiculo: payload.veiculo
			}
			const api = RemoteAccessClient.getInstance(user)
			const {data} = await api({
				url: `coletas/`,
				method: `POST`,
				data: body
			})
			return data
		} catch (e: any) {
			throw {
				status: e.response?.status,
				message: `Erro ao atribuir motorista e veículo na solicitação`,
				data: undefined
			}
		}
	},
}
