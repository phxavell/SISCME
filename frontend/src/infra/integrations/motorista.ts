import { DriverFormSchemaType } from '@pages/por-grupo/administrativo/cruds/motorista/novo-motorista/schemas.ts'
import RemoteAccessClient from '../api/axios-s-managed'
import { LoginResponse } from '@/infra/integrations/login.ts'
import { AxiosError } from 'axios'
import { DriverFormSchemaEditType } from '@/pages/por-grupo/administrativo/cruds/motorista/novo-motorista/ModalMotorista/schemasEdit'
import { IOptionToSelect } from './caixa/types'
import { mapMakeOptionListFromMotorista } from './caixa/caixa'
import moment from 'moment'
import {metaPages} from "@infra/integrations/administrativo/types-equipamentos.ts"
import {errorProps} from "@infra/integrations/plantao.ts"

export interface DataMotorista {
    idprofissional: number
    cpf: string | undefined
    nome: string | undefined
    matricula: string | undefined
    dtnascimento: string | undefined
    email: string | undefined
    contato: string | undefined
    sexo: string | undefined
    idprofissao: string | undefined
    apelidousu: string | undefined
}

export interface MotoristaResponse {
    status: string
    data: DataMotorista[]
    meta: metaPages
}


const getMensagemDeErro = (e: any, messageDefault = `Erro não mapeado`) => {
	console.log(`deerro`, e)
	if (e instanceof AxiosError) {

		if (e.code === `ERR_NETWORK`) {
			return `Erro de conexão com internet.`
		}

		const customError: errorProps = {
			message: e?.response?.statusText ?? messageDefault,
			code: e?.response?.status,
			data: e?.response?.data
		}

		if (customError.data) {
			// TODO ajustar padrão de retorno do backend
			// TODO após ajuste atualizar a lógica abaixo, possível só remover;
			Object.keys(customError.data).map((key) => {
				customError.message = customError.data[key][0]
			})
		}
		if (customError.message) {
			return customError.message
		}
	}
	return messageDefault
}

export const DriverAPI = {
	getOptions: async (user: LoginResponse, page: number): Promise<MotoristaResponse> => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const { data } = await api({
				url: `motoristas/`,
				method: `GET`,
				params: { page }
			})
			return data
		} catch (e) {
			throw getMensagemDeErro(e, `Erro ao buscar motoristas.`)
		}
	},
	buscarMotoristas: async (user: LoginResponse, busca:string): Promise<IOptionToSelect[]> => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const {data} = await api({
				url: `motoristas/?search=`+busca,
				method: `GET`
			}).catch(() => {
				return {data: undefined}
			})
			if(data && Array.isArray(data.data)){
				return data.data.map(mapMakeOptionListFromMotorista)
			}

			return []
		} catch (e: any) {
			throw `Erro ao buscar motoristas.`
		}
	},
	save: async (user: LoginResponse, body: DriverFormSchemaType) => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const payload = {
				...body,
				dtnascimento: moment(body?.dtnascimento, `DD/MM/YYYY`).format(`YYYY-MM-DD`)
			}
			const { data } = await api({
				url: `motoristas/`,
				method: `POST`,
				data: payload
			})
			if (Array.isArray(data)) {
				return data
			} else {
				return []
			}
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

	atualizar: async (user: LoginResponse, body: DriverFormSchemaEditType) => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const payload = {
				...body,
				dtnascimento: moment(body?.dtnascimento, `DD/MM/YYYY`).format(`YYYY-MM-DD`)
			}
			const { data } = await api({
				url: `motoristas/${body.idprofissional}/`,
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

	resetarSenha: async (user: LoginResponse, id: number | undefined) => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const { data } = await api({
				url: `motoristas/${id}/resetar-senha/`,
				method: `PUT`,
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

	excluir: async (user: LoginResponse, body: DataMotorista) => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const { data } = await api({
				url: `motoristas/${body.idprofissional}/`,
				method: `DELETE`,
			})
			return data
		} catch (e: any) {
			throw {
				status: e.response?.status,
				message: e.response?.data?.error?.message,
				data: undefined
			}
		}
	},

}
