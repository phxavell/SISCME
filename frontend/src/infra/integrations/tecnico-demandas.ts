/* eslint-disable @typescript-eslint/no-explicit-any */
import RemoteAccessClient from '../api/axios-s-managed'
import { LoginResponse } from '@/infra/integrations/login.ts'
import { Box } from '@/infra/integrations/cliente-solicitacoes.ts'
import { TecnicoDemandasMock } from 'src/infra/integrations/__mocks__'

export interface Caixa {
    id: string | number
    solicitacao_esterilizacao: string | number
    caixa: string
}
export interface Motorista {
    id: number
    nome: string
}
export interface Veiculo {
    id: number
    placa: string
    modelo: string
}
export interface Coleta {
    idcoleta: number
    motorista: Motorista,
    veiculo: Veiculo
}

export interface Solicitacoes {
    id: number
    data_criacao: string
    data_atualizacao: string
    criado_por: string | null
    atualizado_por: string | null
    solicitacao: number
    observacao: string | null
    situacao: string
    cliente: string | number
    coleta: Coleta
    caixas: Box[]
    quantidade: number
}

export interface ClientResponse {
    data: Box[]
}


export const SterilizationAPI = {

	list: async (user: LoginResponse): Promise<Solicitacoes[]> => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const { data } = await api({
				url: `cliente/solicitacoes/`,
				method: `GET`
			})

			return data.data
		} catch (e) {
			throw {
				// @ts-ignore
				status: e.response?.status,
				statusText: `Erro ao buscar dados de etiqueta.`,
				data: TecnicoDemandasMock.list
			}
		}
	},

	listForClient: async (user: LoginResponse, id: number, status: string): Promise<Solicitacoes[]> => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const { data } = await api({
				url: `cliente/solicitacoes/${id}/`,
				method: `GET`,
				params: {
					status: status
				}
			})
			if (Array.isArray(data.data)) {
				return data.data
			} else {
				return []
			}

		} catch (e: any) {
			throw {
				status: e.response?.status,
				message: `Erro ao buscar solicitações`,
				data: TecnicoDemandasMock.listForClient
			}
		}
	},
}
