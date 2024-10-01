import { AxiosError } from "axios"
import RemoteAccessClient from "../api/axios-s-managed"
import { LoginResponse } from "./login"
import { erroProps } from "./processo/types"

export const UsuariosAPI = {
	listar: async (user: LoginResponse, params:any): Promise<any | undefined> => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const { data } = await api({
				url: `cadastro/usuarios`,
				method: `GET`,
				params: params
			})
			return data
		} catch (error) {
			if (error instanceof AxiosError) {
			    const customError: erroProps = {
			        message: error.response?.data,
			        code: error.response?.status
			    }
				if(customError?.code) {
					throw customError
				} else {
					throw {	 message: `Erro não mapeado.` }
				}
			} else {
				throw {	message: `Erro não mapeado.` }
			}
		}
	},

	listarProfissoes: async (user: LoginResponse, params:any): Promise<any | undefined> => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const { data } = await api({
				url: `profissoes/`,
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

	cadastrar: async (user: LoginResponse, params: any): Promise<any | undefined> => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const response = await api({
				url: `cadastro/usuarios/`,
				method: `POST`,
				data: params
			})
			return response
		} catch (error: any) {
			if (error instanceof AxiosError) {
				if (error.code === `ERR_NETWORK`) {
					return `Erro de conexão com internet.`
				}
			    const customError: erroProps = {
					message: error.response?.data.error,
			        code: error.response?.status
			    }
			    throw customError
			} else {
				throw {
					// @ts-ignore
					status: error.response.status, statusText: `Erro não mapeado.`
				}
			}
		}
	},

	deactive: async (user: LoginResponse, id: number): Promise<any | undefined> => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const response = await api({
				url: `cadastro/usuarios/${id}/desativar/`,
				method: `PATCH`,
			})
			return response
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

	active: async (user: LoginResponse, id: number): Promise<any | undefined> => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const response = await api({
				url: `cadastro/usuarios/${id}/ativar/`,
				method: `PATCH`,
			})
			return response
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

	update: async (user: LoginResponse, id: number, params: any): Promise<any | undefined> => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const response = await api({
				url: `cadastro/usuarios/${id}/`,
				method: `PUT`,
				data: params
			})
			return response
		} catch (error) {
			if (error instanceof AxiosError) {
			    const customError: erroProps = {
			        message: error.response?.data.error,
			        code: error.response?.status
			    }
			    throw customError
			}
		}
	},

	resetPassword: async (user: LoginResponse, id: number): Promise<any | undefined> => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const response = await api({
				url: `cadastro/usuarios/${id}/resetar-senha/`,
				method: `PATCH`,
			})
			return response
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

export namespace NRotasUsuarios {
    export enum MethodsUsuarios {
        Get = `cadastro/usuarios`,
    }
}

export type UsuariosCadastrarPropsData = {
    data: UsuariosCadastrarProps[]
    meta: {
        currentPage: number
        itemsPerPage: number,
        totalItems: number
        totalPages: number
    }
    status: string
}

export type UsuariosCadastrarProps = {
    atrelado: string
    cliente: string
    contato: string
    coren: string
    cpf: string
    dtadmissao: string
    dtcadastro: string
    dtdesligamento: string
    dtnascimento: string
    email: string
    idprofissao: number
    iduser: number
    matricula: string
    nome: string
    profissao: {
        descricao: string
        id: number
    }
    rt: string
    sexo: string
    status: string
}
