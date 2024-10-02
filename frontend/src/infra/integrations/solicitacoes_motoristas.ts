import { AxiosError } from 'axios'
import RemoteAccessClient from '../api/axios-s-managed'
import { LoginResponse } from '@/infra/integrations/login.ts'

export interface entregasProps {
    id: number
    data_criacao: Date
    solicitacao_esterilizacao: {
        cliente: string,
        situacao: string,
        observacao: string
    }
}
export interface coletasProps {
    id: number
    data_criacao: Date
    solicitacao_esterilizacao: {
        cliente: string,
        situacao: string,
        observacao: string
    }
}

export interface solicitacoesMotoristas {
    entregas?: entregasProps[]
    coletas?: coletasProps[]
}
interface erroProps {
    code: number | undefined,
    message: string | undefined
}
export const SolicitacoesMotoristasAPI = {


	list: async (user: LoginResponse): Promise<solicitacoesMotoristas | undefined> => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const { data } = await api({
				url: `logistica/minhas-demandas/`,
				method: `GET`
			})
			return data.data
		} catch (error) {
			if (error instanceof AxiosError) {
				const customError: erroProps = {
					message: error.response?.statusText,
					code: error.response?.status
				}
				throw customError
			}
		}
	},
	atualizarStatusFinalizarEntrega: async (user: LoginResponse, id: number): Promise<solicitacoesMotoristas | undefined> => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const { data } = await api({
				url: `logistica/finalizar-coleta/${id}/`,
				method: `PATCH`
			})

			return data.data
		} catch (error) {
			if (error instanceof AxiosError) {
				const customError: erroProps = {
					message: error.response?.statusText,
					code: error.response?.status
				}
				throw customError
			}
		}
	},
	atualizarStatusFinalizarColeta: async (user: LoginResponse, id: number): Promise<solicitacoesMotoristas | undefined> => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const { data } = await api({
				url: `logistica/entregar-coleta/${id}/`,
				method: `PATCH`
			})

			return data.data
		} catch (error) {
			if (error instanceof AxiosError) {
				const customError: erroProps = {
					message: error.response?.statusText,
					code: error.response?.status
				}
				throw customError
			}
		}
	},
	atualizarStatusIniciarColetar: async (user: LoginResponse, id: number): Promise<solicitacoesMotoristas | undefined> => {
		try {

			const api = RemoteAccessClient.getInstance(user)

			const { data } = await api({

				url: `logistica/iniciar-coleta/${id}/`,
				method: `PATCH`
			})

			return data.data
		} catch (error) {
			if (error instanceof AxiosError) {
				const customError: erroProps = {
					message: error.response?.statusText,
					code: error.response?.status
				}
				throw customError
			}
		}
	},

}
