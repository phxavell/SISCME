import { ProductInputs } from '@pages/por-grupo/administrativo/cruds/produto/schemas.ts'
import RemoteAccessClient from '../api/axios-s-managed'
import { LoginResponse } from '@/infra/integrations/login.ts'
import { AxiosError } from 'axios'

export interface ProdutoProps {
    id?: number,
    descricao: string,
    embalagem: string,
    situacao: boolean,
    foto: any[],
    status: 1,
    idsubtipoproduto: {
        id: number,
        descricao: string
    },
    idtipopacote: {
        id: number,
        descricao: string
    },
}
export interface ProductResponse {
    data: Array<ProdutoProps>,
    meta: {
        currentPage: number
        itemsPerPage: number,
        totalItems: number
        totalPages: number
        firstItem: number
        lastItem: number
    }
}

export const ProductAPI = {
	onList: async (user: LoginResponse, page: number): Promise<ProductResponse | undefined> => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const { data } = await api.get(`produtos`, {
				params: { page }
			})
			return data
		} catch (error) {
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
	onListFilter: async (user: LoginResponse, page: number, descricao: string, embalagem: string, tipo: string, subtipo: string): Promise<ProductResponse | undefined> => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const { data } = await api.get(`produtos`, {
				params: { page, descricao, embalagem, tipo, subtipo }
			})
			return data
		} catch (error) {
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
	formOptions: async (user: LoginResponse): Promise<any | undefined> => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const { data } = await api.get(`produtos/form-options`)
			return data
		} catch (error) {
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
	onListAll: async (user: LoginResponse): Promise<ProdutoProps[]> => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const { data } = await api.get(`produtos`, {
			})
			return data.data
		} catch (error) {
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
	onListSearchDropdown: async (user: LoginResponse, descricao: string): Promise<ProdutoProps[]> => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const { data } = await api.get(`produtos`, {
				params: {descricao}
			})
			return data.data
		} catch (error) {
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
	onSave: async (user: LoginResponse, body: any) => {
		try {
			const data1 = {
				descricao: body.descricao,
				idtipopacote: body.idtipopacote,
				idsubtipoproduto: body.idsubtipoproduto,
				embalagem: body.embalagem,
				status: 1,
				foto: body.foto !== undefined ? body.foto[0].files[0] : ``,
				situacao: body.situacao
			}
			const api = RemoteAccessClient.getInstance(user)
			const { data } = await api({
				url: `produtos/`,
				headers: {
					'Content-Type': `multipart/form-data`
				},
				method: `POST`,
				data: data1
			})
			return data
		} catch (error) {
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

	atualizar: async (user: LoginResponse, body: any) => {
		try {
			const fotoValidacao = () => {
				if (body.foto[0].files[0]?.length > 0 || body.foto[0].files[0] !== undefined) {
					return body.foto[0].files[0]
				} else {
					return ``
				}
			}
			const api = RemoteAccessClient.getInstance(user)
			const payload = {
				descricao: body.descricao,
				idtipopacote: body.idtipopacote,
				idsubtipoproduto: body.idsubtipoproduto,
				embalagem: body.embalagem,
				status: 1,
				foto: fotoValidacao(),
				situacao: body.situacao
			}
			const { data } = await api({
				url: `produtos/${body.idproduto}/`,
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

	onUpdate: async (user: LoginResponse, body: ProductInputs) => {
		try {
			const data1 = {
				descricao: body.descricao,
				idtipopacote: body.idtipopacote,
				idsubtipoproduto: body.idsubtipoproduto,
				embalagem: body.embalagem,
				status: 1,
				foto: body.foto !== undefined ? body.foto[0] : ``,
				situacao: body.situacao
			}
			const id = body.idproduto
			const api = RemoteAccessClient.getInstance(user)
			const { data } = await api({
				url: `produtos/${id}/`,
				headers: {
					'Content-Type': `multipart/form-data`
				},
				method: `PATCH`,
				data: data1
			})
			return data
		} catch (error) {
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
	onDelete: async (user: LoginResponse, id: number) => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const { data } = await api({
				url: `produtos/${id}/`,
				method: `DELETE`,
			})
			return data
		} catch (error) {
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
	}
}
