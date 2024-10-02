import RemoteAccessClient from "@/infra/api/axios-s-managed"
import { LoginResponse } from "../login"
import { AxiosError } from "axios"
import { erroProps } from "../processo/types"

export const SeriaisAPI = {
	listar: async (user: LoginResponse, params:any) => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const { data } = await api({
				url: `seriais/`,
				method: `GET`,
				params: params
			})
			return data
		} catch (error) {
			if (error instanceof AxiosError) {
			    const customError: erroProps = {
			        message: error.response?.data.error.message,
			        code: error.response?.status
			    }
			    throw customError
			}
		}
	},

	historicoSeriais: async (user: LoginResponse, params:any) => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const { data } = await api({
				url: `seriais/historico/`,
				method: `GET`,
				params: params
			})
			return data
		} catch (error) {
			if (error instanceof AxiosError) {
			    const customError: erroProps = {
			        message: error.response?.data.error.message,
			        code: error.response?.status
			    }
			    throw customError
			}
		}
	},
	historicoSeriaisParaPDF: async (user: LoginResponse, data_inicial: any, data_final: any, serial: any) => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const { data } = await api({
				url: `seriais/historico/historico-pdf`,
				method: `GET`,
				params: {data_inicial, data_final, serial}
			})
			return data
		} catch (error) {
			if (error instanceof AxiosError) {
			    const customError: erroProps = {
			        message: error.response?.data.error.message,
			        code: error.response?.status
			    }
			    throw customError
			}
		}
	}

}
