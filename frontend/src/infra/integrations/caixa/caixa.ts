import {LoginResponse} from '@infra/integrations/login.ts'
import RemoteAccessClient from '@infra/api/axios-s-managed.ts'
import {ICaixaOptionsResponse, IOptionResponse, IOptionToSelect, ListResponse} from '@infra/integrations/caixa/types.ts'
import {ProdutoProps} from '@infra/integrations/produto.ts'
import {UseFormSetError} from 'react-hook-form'
import {DataMotorista} from '../motorista'
import {OptionOcorrencia} from "@infra/integrations/enfermagem/types.ts"
import {AxiosError} from 'axios'
import {erroProps} from '../processo/types'

import {getMensagemDeErroDistribuicao} from "@infra/integrations/processo/distribuicao/helper_distribuicao.ts"
import {ClienteData} from "@infra/integrations/types-client.ts"

export interface IErroForUseForm {
    keyName: any
    type: string
    message: any
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const manipularErroBackend  = (setError:any, alertError?: any) => (e: any) => {
	const errors: IErroForUseForm[] = []
	const {data} = e.error
	if (data) {
		Object.entries(data).map(([key, value]: any[]) => {

			if (key === `itens`) {
				errors.push({
					keyName: key,
					type: `manual`,
					message: value
				})
			} else {
				errors.push({
					keyName: key,
					type: `manual`,
					message: value[0]
				})
			}


			if (key === `nome`) {
				setError(`caixa`, {
					type: `manual`,
					message: value[0]
				})
			} else if (key !== `itens`) {
				setError(key, {
					type: `manual`,
					message: value[0]
				})
			}
		})
		console.log(`manipularErroBackend`,errors)

		throw errors
	} else {
		if (e?.error) {
			setError(`cliente`, {
				type: `manual`,
				message: e?.error?.message
			})
		} else {
			setError(`desconhecido`, {
				type: `manual`,
				message: `Erro não mapeado.`
			})

		}
	}
	//alertError(`Erro não mapeado.`)//TODO checar
	throw [{
		type: `manual`,
		message: `Erro não mapeado.`
	}]
}

// @ts-ignore
export const CaixaAPI = {
	buscarProdutos: async (user: LoginResponse, busca: string): Promise<IOptionToSelect[]> => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const {data} = await api({
				url: `produtos/?descricao=${busca}`,
				method: `GET`
			}).catch(() => {
				return {data: undefined}
			})
			if (data && Array.isArray(data.data)) {
				return data.data.map(mapMakeOptionListFromProduct)
			}

			return []
		} catch (e: any) {
			throw `Erro ao buscar produtos.`
		}
	},
	produtoById: async (user: LoginResponse, id: number): Promise<any> => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const {data} = await api({
				url: `produtos/${id}/`,
				method: `GET`
			}).catch(() => {
				return {data: undefined}
			})
			const produto = data.data
			if (produto) {
				return {
					id: produto.id,
					valor: produto.descricao
				} as IOptionToSelect
			}
		} catch (e: any) {
			throw `Erro ao buscar produtos.`
		}
	},
	opcoesParaFormulario: async (user: LoginResponse): Promise<ICaixaOptionsResponse> => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const {data} = await api({
				url: `caixas/form-options/`,
				method: `GET`
			}).catch(() => {
				return {data: undefined}
			})
			return data.data ?? undefined
		} catch (e: any) {
			throw `Erro ao buscar opções de formulário.`
		}
	},
	listar: async (user: LoginResponse,  params:any): Promise<ListResponse<any> | undefined> => {
		try {
			const api = RemoteAccessClient.getInstance(user)

			const {data} = await api({
				url: `caixas/`,
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
	salvar: async (
		user: LoginResponse,
		body: any,
		setError: UseFormSetError<any>
	): Promise<boolean> => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const [data, error] = await api({
				url: `caixas/`,
				method: `POST`,
				headers: {
					'Content-Type': `multipart/form-data`,
				},
				data: body
			}).then(({data}) => {
				return [data, null]
			}).catch((e) => {
				return [undefined, e.response.data]
			})
			if (data) {
				return true
			} else {
				throw error
			}
		} catch (e: any) {
			return manipularErroBackend(setError)(e)
		}
	},
	editar: async (
		user: LoginResponse,
		body: any,
		idCaixa: number,
		setError: UseFormSetError<any>
	): Promise<boolean> => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const [data, error] = await api({
				url: `caixas/${idCaixa}/`,
				method: `PUT`,
				headers: {
					'Content-Type': `multipart/form-data`,
				},
				data: body
			}).then(({data}) => {
				return [data, null]
			}).catch((e) => {
				return [undefined, e.response.data]
			})
			if (data) {
				return true
			}
			throw error
		} catch (e: any) {
			const errors: { keyName: any; type: string; message: any; }[] = []
			if (e?.error?.data) {
				const {data} = e.error
				Object.entries(data).map(([key, value]: any[]) => {

					if (key === `itens`) {
						errors.push({
							keyName: key,
							type: `manual`,
							message: value
						})
					} else {
						errors.push({
							keyName: key,
							type: `manual`,
							message: value[0]
						})
					}


					if (key === `nome`) {
						setError(`caixa`, {
							type: `manual`,
							message: value[0]
						})
					} else if (key !== `itens`) {
						setError(key, {
							type: `manual`,
							message: value[0]
						})
					}
				})
				throw errors
			} else {
				setError(`desconhecido`, {
					type: `manual`,
					message: `Erro não mapeado.`
				})
			}
			throw [{
				type: `manual`,
				message: `Erro não mapeado.`
			}]
		}
	},
	excluir: async (user: LoginResponse, caixa: any) => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const {data} = await api({
				url: `caixas/${caixa.id}/`,
				method: `DELETE`,
			})
			return data
		} catch (e: any) {
			const {error} = e.response.data
			if (error?.code === `fk_caixa_sequenciaetiqueta`) {
				throw error.message
			}
			throw `Erro não mapeado ao tentat excluir caixa id=${caixa.id}`
		}
	},

	enviarQuantidade: async (user: LoginResponse, body: any, id: any) => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const {data} = await api({
				url: `caixas/${id}/gerar-seriais/`,
				method: `POST`,
				data: body
			})
			console.log(data)
			return data
		} catch (error) {
			throw getMensagemDeErroDistribuicao(error, `Erro ao enviar quantidade.`)
		}
	},

	listarSeriais: async (user: LoginResponse, id: any) => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const {data} = await api({
				url: `caixas/${id}/lista-seriais/`,
				method: `GET`
			})
			return data
		} catch (error) {
			//TODO ajustar mensagem de erro para backend
			throw getMensagemDeErroDistribuicao(error, `Erro ao buscar seriais.`)
		}
	},
	listarCaixaPorSerial: async (user: LoginResponse, serial: string) => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const {data} = await api({
				url: `caixa/${serial}/relatorio/`,
				method: `GET`,
			})
			return data
		} catch (error) {
			console.log(error)
		}
	}
}

export const mapMakeOptionList =
    (item: IOptionResponse) => {
    	return {
    		id: item.id,
    		valor: item.descricao
    	} as IOptionToSelect
    }
export const mapMakeOptionListFromProduct =
    (item: ProdutoProps) => {
    	return {
    		id: item.id,
    		valor: item.descricao
    	} as IOptionToSelect
    }
export const mapMakeOptionListFromCliente =
    (item: ClienteData) => {
    	return {
    		id: item.idcli,
    		valor: item.nomeabreviado + ` - ` + item.nomefantasiacli
    	} as IOptionToSelect
    }
export const mapMakeOpcaoListFromCliente =
    (item: ClienteData) => {
    	return {
    		id: item.idcli,
    		value: item.nomeabreviado + ` - ` + item.nomefantasiacli,
    		nome: item?.nomecli
    	} as OptionOcorrencia
    }

export const mapMakeOptionListFromMotorista =
    (item: DataMotorista) => {
    	return {
    		id: item.idprofissional,
    		valor: item.nome
    	} as IOptionToSelect
    }
