import RemoteAccessClient from '../api/axios-s-managed'
import { LoginResponse } from '@/infra/integrations/login.ts'
import { AxiosError } from 'axios'




export interface metaPages {
    currentPage: number
    totalItems: number
    itemsPerPage: number
    totalPages: number
	firstItem: number
	lastItem: number
}

export interface IVeiculoResponse {
    status: string
    data: IVeiculo[]
    meta: metaPages
}
export interface IVeiculo {
    idveiculo: number,
    descricao: string,
    placa: string
    marca: string
    modelo: string
    foto: string
}

export interface ResultVehicle {
    idveiculo: number,
    descricao: string,
    placa: string
    marca: string
    modelo: string
    foto: string
}

export interface VehicleResponse {
    count: number;
    next: null | string;
    previous: null | string;
    results: ResultVehicle[];
}
const listar =  async (user: LoginResponse, page: number): Promise<IVeiculoResponse> => {
	try {
		const api = RemoteAccessClient.getInstance(user)
		const { data } = await api({
			url: `veiculos/`,
			method: `GET`,
			params: { page }
		})
		return data
	} catch (e:any) {
		const {error} = e.response.data
		if (error?.code === `fk_caixa_sequenciaetiqueta`) {
			throw error.message
		} else if (error?.code === `not_found` && page > 1) {
			return await listar(user, page-1)
		}
		throw `Erro ao buscar dados de veículo`

	}

}
export const VeiculoAPI = {
	listar:listar,
	save: async (user: LoginResponse, dataProps: any) => {
		try {
			const data1 = {
				descricao: dataProps.descricao,
				placa: dataProps.placa,
				marca: dataProps.marca,
				modelo: dataProps.modelo,
				foto: dataProps?.foto && dataProps?.foto[0] ? dataProps.foto[0] : ``
			}

			const api = RemoteAccessClient.getInstance(user)
			const { data } = await api({
				url: `veiculos/`,
				headers: {
					'Content-Type': `multipart/form-data`
				},
				method: `POST`,
				data: data1
			})

			return data
		} catch (error: any) {
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

	editar: async (user: LoginResponse, body: any) => {
		const payload = {
			...body,
			foto: body?.foto && body?.foto[0] ? body.foto[0] : ``
		}

		console.log(payload)
		try {
			const api = RemoteAccessClient.getInstance(user)
			const { data } = await api({
				url: `veiculos/${body.id}/`,
				headers: {
					'Content-Type': `multipart/form-data`
				},
				method: `PUT`,
				data: payload
			})
			return data
		} catch (error: any) {
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

	excluir: async (user: LoginResponse, item: any) => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const {data} = await api({
				url: `veiculos/${item.id}/`,
				method: `DELETE`,
			})
			return data
		} catch (e: any) {
			const {error} = e.response.data
			if (error?.code === `fk_caixa_sequenciaetiqueta`) {
				throw error.message
			}
			throw `Erro não mapeado ao tentat excluir caixa id=${item.id}`
		}
	},

}
