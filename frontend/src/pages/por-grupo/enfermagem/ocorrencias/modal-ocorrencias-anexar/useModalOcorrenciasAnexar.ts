import {useCallback} from "react"
import {useAuth} from "@/provider/Auth"
import {OcorrenciasAPI} from "@infra/integrations/enfermagem/ocorrencias.ts"
import { FileUploadHandlerEvent } from "primereact/fileupload"

export const useModalOcorrenciasAnexar = (openDialog: boolean, closeDialog: any, conteudo: any) => {
	const {user, toastError, toastSuccess} = useAuth()

	const handleClose = useCallback( (close?: boolean) => {
		closeDialog(close)
	}, [closeDialog])
	const handlesalvar = useCallback(async (event: FileUploadHandlerEvent) => {
		const file = event.files[0]
		OcorrenciasAPI.anexarEmOcorrencia(
			user,
			{arquivo: file},
			conteudo.id,

		).then(() => {
			toastSuccess(`Arquivo anexado.`)
			handleClose(true)
		}).catch(() => {
			toastError(`Erro ao anexar arquivo. Cheque a extensão ou tamanho do mesmo.`)
		})

	}, [user, toastError, toastSuccess, conteudo,handleClose])


	return {
		handlesalvar,
		handleClose,
	}
}
