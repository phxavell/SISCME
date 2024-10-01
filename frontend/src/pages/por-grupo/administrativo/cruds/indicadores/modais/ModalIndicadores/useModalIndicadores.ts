import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import { IndicadoresFormSchemaType, indicadorFormSchema } from "../../schemas"
import { IndicadoresAPI } from "@/infra/integrations/administrativo/indicadores/indicadores"
import { useAuth } from "@/provider/Auth"
import { useCallback, useEffect, useState } from "react"
import { IndicadoresResponse } from "@/infra/integrations/administrativo/indicadores/types"
import { getFileFromUrl } from "../../../veiculos/ModalNovoVeiculo"

export const useModalIndicadores = (listarIndicadores: any, onClose: any, indicador: IndicadoresResponse) => {
	const {
		control,
		handleSubmit,
		setError,
		reset,
		getValues,
		register,
		setValue,
		watch,
		formState: {errors},
	} = useForm<IndicadoresFormSchemaType>({
		resolver: zodResolver(indicadorFormSchema),
	})
	const [miniModalVisible, setMiniModalVisible] = useState<boolean>(false)


	const {fields, update} = useFieldArray({
		control,
		name: `foto`
	})
	const watchFieldArray = watch(`foto`)
	const controlledFields = fields?.map((field, index) => {
		if (watchFieldArray && watchFieldArray[index]) {
			return {
				...field,
				...watchFieldArray[index]
			}
		} else {
			return {
				...field,

			}
		}
	})

	const handleClearFile = useCallback(() => {
		update(0,
			{
				...controlledFields[0],
				files: []
			})

	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [controlledFields])

	const { user, toastSuccess, toastError } = useAuth()

	const dropdownTipoOptions = [
		{tipo: `Classe 02`, descricao: `Teste de Bowie & Dick`},
		{tipo: `Classe 05`, descricao:`Integrador Químico`}
	]

	const handleErrorReturnApi = useCallback((data: any) => {
		if (data && typeof data === `object`) {
            type nameItem = `codigo` | `descricao` | `tipo` | `fabricante` | `foto`
            Object.keys(data).map((key: string) => {
            	if (key === `codigo` || key == `descricao` || key == `tipo` || `fabricante` || `foto`) {
            		setError(key as nameItem, {
            			type: `manual`,
            			message: data[key][0],
            		})
            	}
            })
		}
	}, [setError])

	const onSuccess = useCallback((response: any) => {
		reset()
		handleClearFile()
		toastSuccess(response)
		onClose()
		listarIndicadores()

	}, [toastSuccess, reset, handleClearFile, onClose, listarIndicadores])

	const onError =  useCallback((response: any)=> {
		const {message} = response
		if(message?.data){
			handleErrorReturnApi(message?.data)
		} else if (message?.data === null) {
			toastError(message.code)
		} else {
			toastError(message?.message)
		}

	}, [toastError, handleErrorReturnApi])

	const handleIndicador = useCallback(async (data: IndicadoresFormSchemaType) => {
		if(indicador) {
			await IndicadoresAPI.editar(user, data, indicador?.id, onSuccess, onError)
		} else {
			await IndicadoresAPI.save(user, data, onSuccess, onError)
		}
	}, [indicador, user, onSuccess, onError])

	useEffect(() => {
		if (indicador) {
			if (indicador.foto) {
				const name = indicador.foto.split(`media/produtos/`)[1]
				getFileFromUrl(indicador.foto, name).then((imgFile) => {
					setValue(`foto`, [
						{
							//@ts-ignore
							files: [imgFile]
						}
					])
				})
			}

			const resetTipo = () => {
				if(indicador?.tipo == `Classe 02 - Teste de Bowie & Dick`) {
					return `Classe 02`
				}
				if(indicador?.tipo == `Classe 05 - Integrador Químico`) {
					return `Classe 05`
				}
				return ``
			}

			reset({
				...indicador,
				codigo: indicador.codigo ?? ``,
				descricao: indicador.descricao ?? ``,
				fabricante: indicador.fabricante,
				tipo: resetTipo()
			})
		} else {
			reset({
				codigo: ``,
				descricao: ``,
				foto: [],
				tipo: ``,
				fabricante: ``
			})
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [reset, indicador])

	const hasFilledFields = () => {
		const formValues = getValues()
		const filteredValues = Object.values(formValues).filter((value, index) => index !== 2)
		if(Object.values(formValues)[2][0]?.files.length !== 0 || Object.values(filteredValues).some(value => !!value)) {
			return true
		} else {
			return false
		}
	}

	const confirmarFecharModal = () => {
		if (hasFilledFields()) {
			setMiniModalVisible(true)
		} else {
			onClose(false)
			reset({
				codigo: ``,
				descricao: ``,
				foto: [],
				tipo: ``,
				fabricante: ``
			})
		}
	}

	return {
		control,
		handleSubmit,
		confirmarFecharModal,
		miniModalVisible, setMiniModalVisible,
		reset,
		errors,
		handleIndicador,
		register,
		watch,
		handleClearFile,
		dropdownTipoOptions
	}
}
