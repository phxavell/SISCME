import { AxiosError } from "axios"
import { LoginResponse } from "../login"
import RemoteAccessClient from "@/infra/api/axios-s-managed"
import { isValidDate } from "@infra/integrations/processo/utils.ts"
import { EsterilizacaoPreparoProps, erroProps, filtrarPreparoProps } from "./types"

export const PreparoAPI = {
	listarPreparos: async (user: LoginResponse, page: number): Promise<EsterilizacaoPreparoProps | undefined> => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const { data } = await api({
				url: `/processo/preparo/itens-preparados/`,
				method: `GET`,
				params: {page}
			})
			return data
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
	preparoReport: async (user: LoginResponse, id: number): Promise<any> => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const { data } = await api({
				url: `/processo/preparo/dados-report/${id}`,
				method: `GET`,
			})
			return data
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
	filtrarPreparos: async (user: LoginResponse, body: filtrarPreparoProps): Promise<EsterilizacaoPreparoProps | undefined> => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const params:any = {}

			if(isValidDate(body.data_de)) {
				params.data_de = body.data_de
			}
			if(isValidDate(body.data_ate)) {
				params.data_ate = body.data_ate
			}
			const { data } = await api({
				url: `/processo/preparo/itens-preparados`,
				method: `GET`,
				data: body,
				params:{
					...params,
					serial: body.serial,
					page: body.page

				}
			})
			return data

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
