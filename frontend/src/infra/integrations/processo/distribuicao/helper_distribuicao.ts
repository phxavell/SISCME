import { AxiosError } from "axios"
import {errorProps} from "@infra/integrations/plantao.ts"

export const getMensagemDeErroDistribuicao = (
	e: any,
	messageDefault = `Erro não mapeado`,
) => {
	if (e instanceof AxiosError) {
		if (e.code === `ERR_NETWORK`) {
			return `Erro de conexão com internet.`
		}

		const customError: errorProps = {
			code: e?.response?.status,
			message: e?.response?.statusText ?? messageDefault,
			//@ts-ignore
			data: e?.response?.error ?? e?.response?.data,
		}

		if (typeof customError.data === `string`) {
			console.error(customError)
			if (customError.data === `URL não encontrada.`) {
				return `Falha na chamada do servidor. Tente mais tarde.`
			}
			return messageDefault
		}

		if (customError.data) {
			// TODO ajustar padrão de retorno do backend
			// TODO após ajuste atualizar a lógica abaixo, possível só remover;
			Object.keys(customError.data).map((key) => {
				customError.message = customError.data[key][0]
			})
		}
		console.error(customError)
		if (customError.message) {
			return customError.message
		}
	}
	return messageDefault
}
export const tratarErrorDistribuicao = (errorObj: any, showError: any) => {
	const erro = errorObj?.response?.data?.error
	const { message, data } = erro
	if (data) {
		Object.keys(data)?.forEach((key) => {
			if (key === `itens`) {
				data.itens.forEach((itemError: any) => {
					if (itemError.serial) {
						const message = itemError.serial[0]
						showError(message, false)
					} else {
						showError(itemError, false)
					}
				})
			} else {
				showError(`${key.toUpperCase()}: ${data[key][0]}`, false)
			}
		})
	} else {
		showError(message, false)
	}
}
export const getErrosDistribuicao = (errorObj: any, showError: any, setError:any, clearErrors:any) => {
	clearErrors()
	const erro = errorObj?.response?.data?.error
	if (!erro) {
		return []
	}
	const { message, data } = erro
	const erros: string[] = []

	if (data) {
		Object.keys(data)?.forEach((key) => {
			if (key === `itens`) {
				data.itens.forEach((itemError: any) => {
					if (itemError.serial) {
						const message = itemError.serial[0]
						erros.push(message)
					} else {
						erros.push(itemError)
					}
				})
			} else {
				erros.push(`${key.toUpperCase()}: ${data[key][0]}`)
				setError(key,{
				    type: `manual`,
				    message: data[key][0]
				})

			}
		})
	} else {
		erros.push(message)
	}
	showError(erros.join(` `))
	return erros
}
