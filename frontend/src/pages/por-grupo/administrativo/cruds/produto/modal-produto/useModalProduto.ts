import {useFieldArray, useForm} from 'react-hook-form'
import { ProductInputs, ProductSchema } from '../schemas.ts'
import { zodResolver } from '@hookform/resolvers/zod'
import {useCallback, useState} from 'react'
import { useAuth } from '@/provider/Auth'

import { defaultValuesProduto } from '../style.ts'

export function useModalProduto() {
	const { toastError } = useAuth()
	const {
		control,
		register,
		handleSubmit,
		reset,
		setError,
		trigger,
		setValue,
		getValues,
		watch,
		formState: { errors }
	} = useForm<ProductInputs>({ criteriaMode: `all`, resolver: zodResolver(ProductSchema), defaultValues: defaultValuesProduto })

	const {fields, update} = useFieldArray({
		control,
		// @ts-ignore
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


	const [modalTipovisible, setModalTipoVisible] = useState(false)
	const [modalSubTipovisible, setModalSubTipoVisible] = useState(false)


	const [fileImage, setFileImage] = useState<File>()
	const [fileName, setFileName] = useState<string>()

	const handleClearFileVehicle = useCallback(() => {

		update(0,
			{
				...controlledFields[0],
				files: []
			})

	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [controlledFields])
	const handleModalSubTipoProduto = () => {
		setModalSubTipoVisible(!modalSubTipovisible)
	}
	const handleModalTipoProduto = () => {
		setModalTipoVisible(!modalTipovisible)
	}

	function handleErrorReturnApi(data: any) {
		if (data.error && typeof data.error.data === `object`) {
            type nameItem = `descricao` | `idtipopacote` | `idsubtipoproduto` | `embalagem`
            // @ts-ignore
            Object.keys(data.error.data).map((key: nameItem) => {
            	if (key === `descricao` || key === `idsubtipoproduto` || key == `idtipopacote` || key == `embalagem`) {
            		setError(key, {
            			type: `manual`,
            			message: data.error.data[key][0],
            		})
            	}
            })
		} else {
			toastError(data?.status, data?.error?.message)
		}
	}

	return {
		trigger,
		fileImage,
		setFileImage,
		fileName,
		setFileName,
		control, watch, setValue,getValues,
		register,
		handleSubmit,
		errors,
		modalTipovisible,
		setModalTipoVisible,
		modalSubTipovisible,
		setModalSubTipoVisible,
		handleClearFileVehicle,
		reset,
		handleErrorReturnApi,
		handleModalTipoProduto,
		handleModalSubTipoProduto,
	}
}
