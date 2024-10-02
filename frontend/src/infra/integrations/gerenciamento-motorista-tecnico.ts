import { AxiosError } from 'axios'
import RemoteAccessClient from '../api/axios-s-managed'
import { LoginResponse } from '@/infra/integrations/login.ts'

interface erroProps {
    code: number | undefined,
    message: string | undefined
}
export interface ColetaProps {
    id_coleta: number,
    id_solicitacao: number,
    situacao: string,
    cliente: string,
    observacao: string,
    data_criacao: string
    profissional: {
        id: number,
        nome: string
    }
}

export interface EntregaPros {
    id_coleta: number,
    id_solicitacao: number
    situacao: string,
    cliente: string,
    observacao: string,
    data_criacao: string,
    profissional: {
        id: number,
        nome: string
    }
}

export interface Profissional {
    id: number,
    nome: string
}
export interface SolicitacaoProps {
    profissional: Profissional,
    coletas: Array<ColetaProps>,
    entregas: Array<EntregaPros>

}
export const GereciamentoMotoristaTecnicoAPI = {
	listGereciamentoTecnico: async (user: LoginResponse): Promise<SolicitacaoProps[] | undefined> => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const { data } = await api({
				url: `logistica/gerenciamento-demandas-motorista/`,
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
	atualizarStatusFinalizarEntrega: async (user: LoginResponse, id: number): Promise<SolicitacaoProps | undefined> => {
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
	atualizarStatusFinalizarColeta: async (user: LoginResponse, id: number): Promise<SolicitacaoProps | undefined> => {
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
	atualizarStatusIniciarColetar: async (user: LoginResponse, id: number): Promise<SolicitacaoProps | undefined> => {
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
