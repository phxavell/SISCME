import { AxiosError } from "axios"
import RemoteAccessClient from "../api/axios-s-managed"
import { LoginResponse } from "./login"

interface erroProps {
    code: number | undefined,
    message: string | undefined
}

export interface filtrarRecebimentosProps {
    data_inicial: string,
    data_final: string,
    sequencial: string,
}

export interface filtrarCaixasTermoProps {
    data_inicial: string,
    data_final: string,
    ciclo: string,
    status_inicial: string,
    status_final: string,
    termo: string,
}

export type RecebimentosPropsData = {
    data: RecebimentosProps[],
    meta: {
        currentPage: number
        itemsPerPage: number,
        totalItems: number
        totalPages: number
    }
}

export interface RecebimentosProps {
    cliente:          string;
    data_recebimento: string;
    nome_caixa:       string;
    recebimento:      number;
    sequencial:       string;
    status:           string;
    ultima_situacao:  string;
    ultimo_registro:  string;
    // cliente: string,
    // caixa: {
    //     tipo: string,
    //     codigo: string,
    //     sequencial: string,
    //     temperatura: string,
    //     medida: string,
    //     status: string,
    // },
    // data_recebimento: string,
    // sequencial: string,
    // user: string,
    // itens: [
    //     {
    //         id: number,
    //         descricao: string,
    //         quantidade: number,
    //     }
    // ],
    // meta: {
    //     currentPage: number
    //     itemsPerPage: number,
    //     totalItems: number
    //     totalPages: number
    // }
}

export type TermoPropsData = {
    data: TermoProps[],
    meta: {
        currentPage: number
        itemsPerPage: number,
        totalItems: number
        totalPages: number
    }
}

export type TermoProps = {
    user: string,
    maquina: string,
    ciclo: string,
    progamacao: string,
    data_inicio: string,
    data_fim: string,
    caixas: [
        {
            cliente: string,
            sequencial: string,
            caixa: string,
        }
    ],
    lotes: string,
    codigo: string,
    status_inicio: string,
    status_fim: string,
    status: string,
    status_abortado: string,
    data_abortado: string,
    processo: string,
}

export namespace NEsterilizacaoPesquisaAPI {
    export enum MethodsRecebimentos {
        Get = `caixas-recebidas?`,
    }
}

export interface CaixasProps {
    user: string,
    maquina: string,
    ciclo: string,
    progamacao: string,
    data_inicio: string,
    data_fim: string,
    lote: string,
    sequencial: string,
    caixa: string,
    itens: [
        {
            cliente: string,
            sequencial: string,
            caixa: string,
        }
    ]
}


export const EsterilizacaoPesquisaAPI = {
	listarRecebimentos: async (user: LoginResponse, params:any): Promise<RecebimentosPropsData | undefined> => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const { data } = await api({
				url: `/caixas-recebidas`,
				method: `GET`,
				params: params
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

	formOptions: async (user: LoginResponse): Promise<any | undefined> => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const { data } = await api({
				url: `processo/termodesinfeccao/form-options/`,
				method: `GET`
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

	listarCaixasTermo: async (user: LoginResponse, params:any): Promise<TermoPropsData | undefined> => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const { data } = await api({
				url: `processo/termodesinfeccao/acompanhamento`,
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

	enviarTermo: async (user: LoginResponse, body: any) => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const { data } = await api({
				url: `processo/termodesinfeccao/`,
				data: body,
				method: `POST`
			})
			return data
		} catch (error) {
			if (error instanceof AxiosError) {
				const customError: erroProps = {
					message: error.response?.data?.error,
					code: error.response?.status
				}
				throw customError
			}
		}
	},

	abortar: async (user: LoginResponse, id: number): Promise<any | undefined> => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const { data } = await api({
				url: `processo/termodesinfeccao/${id}/abortar/`,
				method: `POST`
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

	finalizar: async (user: LoginResponse, id: number): Promise<any | undefined> => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const { data } = await api({
				url: `processo/termodesinfeccao/${id}/finalizar/`,
				method: `POST`
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

	enviarStatusTermo: async (user: LoginResponse, body: any) => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const { data } = await api({
				url: `processo/termodesinfeccao/`,
				data: body,
				method: `PATCH`
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

	view: async (user: LoginResponse, id: number): Promise<any | undefined> => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const { data } = await api({
				url: `processo/termodesinfeccao/${id}`,
				method: `GET`
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

	buscarDadosPdf: async (user: LoginResponse, id: number): Promise<any> => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const {data} = await api({
				url: `processo/termodesinfeccao/${id}/dados-report/`,
				method: `GET`
			})
			if (data) {
				return data
			}
			throw `Error`
		} catch (error) {
			if (error instanceof AxiosError) {
				const customError: erroProps = {
					message: error.response?.data.error.message,
					code: error.response?.status
				}
				throw customError.message
			}
			throw `Erro ao buscar dados do relatório. Tente mais tarde;`
		}
	}

}
