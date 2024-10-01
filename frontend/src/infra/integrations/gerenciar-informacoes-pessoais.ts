import { AxiosError } from 'axios'
import RemoteAccessClient from '../api/axios-s-managed'
import { LoginResponse } from '@/infra/integrations/login.ts'

export interface Info {
    nome: string,
    contato: string,
    coren: string,
    email: string,
    sexo: string,
    profissao: string,
    dtnascimento: string,
    cpf: string,
    cliente: string,
    dtcadastro: string,
    dtadmissao: string,
    matricula: string,
    responsável_tecnico: string,
}

export interface ContaProps {
    usuario: string,
    grupos: Array<string>,
    staff: boolean,
    super_usuario: boolean
}
interface UpdateSenha {
    nova_senha: string,
}
export interface UsuarioProps {
    infos: Info,
    conta: ContaProps
}

export type Setor = {
    id?: number,
    descricao: string,
}
export type SetoresProps = {
    data: Array<Setor>,
    meta: {
        currentPage: number
        itemsPerPage: number,
        totalItems: number
        totalPages: number
    }
}
export const GereciarInformacoesPessoaisPI = {
	onList: async (user: LoginResponse): Promise<UsuarioProps | undefined> => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const { data } = await api.get(`usuario/me/`)
			return data.data

		} catch (error) {
			if (error instanceof AxiosError) {
				throw {
					code: error.status,
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
	onUpdateDadosPessoais: async (user: LoginResponse, body: any) => {

		try {

			const api = RemoteAccessClient.getInstance(user)
			const { data } = await api({
				url: `usuario/me/edit/`,
				method: `PUT`,
				data: body
			})
			return data
		} catch (error) {
			if (error instanceof AxiosError) {
				throw {
					code: error.response?.status,
					message: error.response?.data,
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
	onUpdateSenha: async (user: LoginResponse, body: UpdateSenha) => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const { data } = await api({
				url: `usuario/me/alterar-senha/`,
				method: `PATCH`,
				data: body
			})
			return data
		} catch (error) {
			if (error instanceof AxiosError) {
				throw {
					code: error.response?.status,
					message: error.response?.data,
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
}
