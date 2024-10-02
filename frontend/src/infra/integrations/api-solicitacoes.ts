import RemoteAccessClient from '../api/axios-s-managed'
import {LoginResponse} from '@/infra/integrations/login.ts'

export interface SolicitacaoDoCliente {
    id: number
    situacao: string
    cliente: string | number
    observacao: string | null
    data_criacao: string
    data_atualizacao: string
    criado_por: string | number | null
    atualizado_por: string | null
    solicitacao: number
    caixas: string[]
    quantidade: number
}

export const ApiSolicitacoes = {

	list: async (user: LoginResponse, id: number): Promise<SolicitacaoDoCliente> => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const {data} = await api({
				url: `/solicitacoes/${id}/`,
				method: `GET`
			})
			return data.data

		} catch (e: any) {
			throw {
				message: e.response.data.error.message
			}
		}
	},

}
