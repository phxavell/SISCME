import {useCallback, useState} from "react"
import {useAuth} from "@/provider/Auth"
import {useForm} from "react-hook-form"
import {OcorrenciaFecharSchema, TOcorrenciaFechar} from "@pages/por-grupo/enfermagem/ocorrencias/schemas.ts"
import {zodResolver} from "@hookform/resolvers/zod"
import {OptionOcorrencia} from "@infra/integrations/enfermagem/types.ts"
import {OcorrenciasAPI} from "@infra/integrations/enfermagem/ocorrencias.ts"

const template1 = ``
export const defaultValuesModal = () => {
	return {
		acao: template1
	}
}
export const useModalOcorrenciasFechar = (openDialog: boolean, closeDialog: any, conteudo: any) => {
	const {user, toastError, toastSuccess} = useAuth()
	const [clientes, setClientes] = useState<OptionOcorrencia[]>([])

	const {
		control,
		register,
		handleSubmit,
		reset,
		setValue,
		getValues,
		trigger,
		watch,
		setError,
		clearErrors,
		formState: {errors},
		setFocus
	} = useForm<TOcorrenciaFechar>({
		shouldFocusError: true,
		resolver: zodResolver(OcorrenciaFecharSchema),
		mode: `all`,
		defaultValues: defaultValuesModal()
	})


	const handleClose = useCallback((close?: boolean) => {
		closeDialog(close)
		reset(defaultValuesModal())
	}, [closeDialog, reset])

	const handlesalvar = useCallback(async () => {

		await trigger().then((ok) => {
			if (ok) {
				const values = getValues()
				OcorrenciasAPI.fecharOcorrencia(
					user,
					values,
					conteudo.id,
					setError).then(() => {
					toastSuccess(`Ocorrência fechada.`)
					handleClose(true)
				}).catch((erros) => {
					console.log(`fecharOcorrencia`, erros)
					toastError(`Falha ao fechar ocorrência`)
				})

			}
		})
	}, [user, trigger, getValues, toastSuccess, toastError, handleClose, conteudo, setError])


	return {
		clientes,
		setClientes,
		control,
		register,
		handleSubmit, clearErrors,
		reset,
		setValue,
		getValues,
		trigger,
		watch,
		setError,
		errors,
		setFocus,
		handlesalvar,
		handleClose,
	}
}
