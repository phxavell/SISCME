import {LoginResponse} from '@infra/integrations/login.ts'
import RemoteAccessClient from '@infra/api/axios-s-managed.ts'
import {OcorrenciaBody, OcorrenciaOpcoes, RespostaAPI} from "@infra/integrations/enfermagem/types.ts"
import {UseFormSetError} from "react-hook-form"
import moment from "moment"
import {ListResponse} from "@infra/integrations/caixa/types.ts"

type TTratamento = (e: any, setError: UseFormSetError<any>) => any
export const tratamentoDeError: TTratamento = (e, setError) => {
	const errors: {
        keyName: any;
        type: string;
        message: any;
    }[] = []
	if (e?.error?.data) {

		const {data} = e.error
		Object.entries(data).map(([key, value]: any[]) => {
			switch (key) {
			case `profissional_responsavel`:
				setError(`profissional`, {
					type: `manual`,
					message: value[0]
				})
				break
			case `idcli`:
				setError(`cliente`, {
					type: `manual`,
					message: value[0]
				})
				break
			case `idsetor`:
				setError(`setor`, {
					type: `manual`,
					message: value[0]
				})
				break
			case `idindicador`:
				setError(`indicador`, {
					type: `manual`,
					message: value[0]
				})
				break
			case `descricao`:
				setError(`descricao`, {
					type: `manual`,
					message: value[0]
				})
				break
			case `tipodediariodeocorrencia`:
				setError(`tipo`, {
					type: `manual`,
					message: value[0]
				})
				break
			default:
				setError(`desconhecido`, {
					type: `manual`,
					message: value[0]
				})
			}
			errors.push({
				keyName: key,
				type: `manual`,
				message: value[0]
			})
		})

		throw errors
	} else {
		if (e?.response?.data) {
			setError(`cliente`, {
				type: `manual`,
				message: e?.response?.data?.error?.message
			})
		} else {
			setError(`desconhecido`, {
				type: `manual`,
				message: `Erro não mapeado.`
			})

		}
	}
	throw [{
		type: `manual`,
		message: `Erro não mapeado.`
	}]
}

const fornatOcorrencias = (data: any) => {
	return {
		...data,// @ts-ignore
		data: data.data.map(ocorrencia => {
			return {
				...ocorrencia,
				dt_registro: `${ocorrencia.dataabertura} ${ocorrencia.horaabertura}`,
				dt_ocorrencia: `${ocorrencia.dataretroativa} ${ocorrencia.horaretroativa}`,
			}
		})
	}
}

export const OcorrenciasAPI = {
	listar: async (user: LoginResponse, page: number): Promise<RespostaAPI<any>> => {
		try {
			const api = RemoteAccessClient.getInstance(user)

			const {data} = await api({
				url: `diarios/`,
				method: `GET`,
				params: {page}
			}).catch((e) => {
				//todo checar erros de conexao com internet
				console.log(`Erro em listar OcorrenciasAPI e = `, e)
				return {data: null}
			})
			if (data) {
				//console.log(data)
				// @ts-ignore
				return fornatOcorrencias(data)
			}
			throw `Erro não mapeado`
		} catch (e: any) {
			throw `Algo de errado ao listar ocorrencia.`
		}
	},
	listarOpcoes: async (user: LoginResponse): Promise<OcorrenciaOpcoes> => {
		try {
			const api = RemoteAccessClient.getInstance(user)

			const {data} = await api({
				url: `diarios/form-options/`,
				method: `GET`,
			}).catch(() => {
				//console.log(`Erro em listar caixas e = `, e)
				//return mock_get_options_ocorrencia
				return {data: null}
			})
			const options = data?.data
			options.tipo_de_ocorrencia = [
				{
					id: `RECEBIDO`,
					value: `RECEBIDO`
				},
				{
					id: `EXPEDIDO`,
					value: `EXPEDIDO`
				},

			]
			if (options) {
				return options
			}
			throw `Erro não mapeado`
		} catch (e: any) {
			throw `Algo de errado ao listar ocorrencia.`
		}
	},
	filtrarListagem: async (user: LoginResponse, params: any): Promise<ListResponse<any>> => {
		try {
			const api = RemoteAccessClient.getInstance(user)

			const {data} = await api({
				url: `diarios/`,
				method: `GET`,
				params: params
			}).catch((e) => {
				console.log(`Erro em listar caixas e = `, e)
				return {data: undefined}
			})
			if (data) {
				return fornatOcorrencias(data)
			}
			throw `Erro não mapeado`
		} catch (e: any) {
			throw `Algo de errado ao listar ocorrencia.`
		}
	},
	salvar: async (
		user: LoginResponse,
		body: any,
		setError: UseFormSetError<any>
	): Promise<boolean> => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			//TODO formatar o envio de dados;
			// @ts-ignore
			const payload: OcorrenciaBody = {
				// acao:'',//TODO integrar
				// arquivo:null,//TODO integrar
				dataretroativa: moment(new Date(body.datetime_ocorrencia)).format(`yyyy-MM-DD`),
				horaretroativa: moment(new Date(body.datetime_ocorrencia)).format(`HH:mm:ss`),
				descricao: body.descricao,
				idcli: body.cliente,
				idsetor: body.setor,
				idindicador: body.indicador,
				profissional_responsavel: body.profissional,
				tipodediariodeocorrencia: body.tipo,

			}
			// {
			//     "data_ocorrencia": "2023-11-10T18:21:00.544Z",
			//     "hora_ocorrencia": "2023-11-10T18:21:00.544Z",
			//     "datetime_ocorrencia": "2023-11-10T18:21:00.544Z",
			//     "cliente": 4,
			//     "descricao": "<p><strong>MANAUS,</strong></p><p><strong>OCORRÊNCIA RECEBIDA:</strong></p><p>A BP Serviços, em atendimento á notificação da unidade&nbsp;referente&nbsp;_______________, vem respeitosamente por meio desta informar&nbsp;que a recepcionamos e efetuamos ações de correção necessárias visando a&nbsp;resolução no menor espaço de tempo possível.</p><p>Dessa forma, apresentamos as ações corretivas referente à não conformidade relatada pela unidade:</p>",
			//     "indicador": 1,
			//     "profissional": 2,
			//     "setor": 1,
			//     "tipo": 1
			// }
			//console.log(payload)

			const [data, error] = await api({
				url: `diarios/`,
				method: `POST`,
				data: payload
			}).then(({data}) => {
				return [data, null]
			}).catch((e) => {
				return [undefined, e]
			})
			if (data) {
				return true
			} else {
				throw error
			}
		} catch (e: any) {
			return tratamentoDeError(e, setError)
		}
	},

	anexarEmOcorrencia: async (
		user: LoginResponse,
		body: any,
		id: number,
	): Promise<boolean> => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const payload: OcorrenciaBody = body

			const [data, error] = await api({
				url: `diarios/${id}/inserir-arquivo/`,
				headers: {
					'Content-Type': `multipart/form-data`
				},
				method: `POST`,
				data: payload
			}).then(({data}) => {
				return [data, null]
			}).catch((e) => {
				return [undefined, e]
			})
			if (data) {
				return true
			} else {
				throw error
			}
		} catch (e: any) {
			return tratamentoDeError(e, () => {
			})
		}
	},

	excluirAnexar: async (
		user: LoginResponse,
		id: number,
	): Promise<boolean> => {
		try {
			const api = RemoteAccessClient.getInstance(user)

			const [data, error] = await api({
				url: `diarios/${id}/remover-arquivo/`,
				method: `DELETE`,
			}).then((data) => {
				return [data, null]
			}).catch((e) => {
				return [undefined, e]
			})
			if (data) {
				return true
			} else {
				throw error
			}
		} catch (e: any) {
			return tratamentoDeError(e, () => {
			})
		}
	},

	editarOcorrencia: async (
		user: LoginResponse,
		body: any,
		id: number,
		setError: UseFormSetError<any>
	): Promise<boolean> => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			//TODO formatar o envio de dados;
			// @ts-ignore
			const payload: OcorrenciaBody = {
				// acao:'',//TODO integrar
				// arquivo:null,//TODO integrar
				dataretroativa: moment(new Date(body.datetime_ocorrencia)).format(`yyyy-MM-DD`),
				horaretroativa: moment(new Date(body.datetime_ocorrencia)).format(`HH:mm:ss`),
				descricao: body.descricao,
				idcli: body.cliente,
				idsetor: body.setor,
				idindicador: body.indicador,
				profissional_responsavel: body.profissional,
				tipodediariodeocorrencia: body.tipo,
			}


			// {//exemplo de body pra edição
			//     "arquivo": null,
			//     "dataretroativa": "2012-12-12",
			//     "descricao": "ATT 12",
			//     "horaretroativa": "12:12:12",
			//     "tipodediariodeocorrencia": "EXPEDIDA",
			//     "profissional_responsavel": 175,
			//     "titulo": "ATT Teste pós refactor",
			//     "idcli": 6,
			//     "idsetor": 6,
			//     "idindicador": 9
			// }

			const [data, error] = await api({
				url: `diarios/${id}/`,
				method: `PUT`,
				data: payload
			}).then(({data}) => {
				return [data, null]
			}).catch((e) => {
				return [undefined, e]
			})
			if (data) {
				return true
			} else {
				throw error
			}
		} catch (e: any) {
			return tratamentoDeError(e, setError)
		}
	},
	fecharOcorrencia: async (
		user: LoginResponse,
		body: any,
		id: number,
		setError: UseFormSetError<any>
	): Promise<boolean> => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			//TODO formatar o envio de dados;
			const payload: any = {
				acao: body.acao
			}

			const [data, error] = await api({
				url: `diarios/${id}/fechamento/`,
				method: `POST`,
				data: payload
			}).then(({data}) => {
				return [data, null]
			}).catch((e) => {
				return [undefined, e]
			})
			if (data) {
				return true
			} else {
				throw error
			}
		} catch (e: any) {
			return tratamentoDeError(e, setError)
		}
	},
}
