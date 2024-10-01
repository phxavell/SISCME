/* eslint-disable @typescript-eslint/no-explicit-any */
import RemoteAccessClient from '../api/axios-s-managed.ts'

import { LoginResponse } from '@/infra/integrations/login.ts'
import { PendingFormType } from '@pages/por-grupo/tecnico-cme/demandas/componentes/ModalPendingInProgress/schemas.ts'

export interface PendingResponse {
    motorista: number
    retorno: boolean
    solicitacao_esterilizacao: string
    veiculo: number
}

export const PendingAPI = {
	getOptions: async (user: LoginResponse): Promise<PendingResponse> => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const { data } = await api({
				url: `coletas/`,
				method: `GET`
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
	save: async (user: LoginResponse, body: PendingFormType) => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const { data } = await api({
				url: `coletas/`,
				method: `POST`,
				data: body
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

	atualizar: async (user: LoginResponse, body: PendingFormType) => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const { data } = await api({
				url: `coletas/${body.idcoleta}/`,
				method: `PUT`,
				data: body
			})
			return data
		} catch (e: any) {
			throw {
				status: e.response?.status,
				statusText: e.response?.data?.error?.message,
				data: undefined
			}
		}
	}
}
