import { useAuth } from "@/provider/Auth"
import { SetorInputs, SetortSchema } from "../schemas.ts"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useCallback, useEffect } from "react"
import { SetorAPI } from "@/infra/integrations/setor.ts"
import { useSetorStore } from "../store/useSetorState.ts"

export function useModalEdicaoSetor(){
	const { user, toastSuccess, toastError } = useAuth()
	const {closeModalEditar, visibleModalEditar, setor, getSetores, setFirst} = useSetorStore()
	const {
		register,
		control,
		handleSubmit,
		reset,
		setError,
		formState: { errors }
	} = useForm<SetorInputs>({
		defaultValues: {
			descricao: setor?.descricao
		},
		resolver: zodResolver(SetortSchema)
	})

	const handleErrorReturnApi = useCallback((data: any) => {
		if (data.error && typeof data.error.data === `object`) {
            type nameItem = `descricao`
            // @ts-ignore
            Object.keys(data.error.data).map((key: nameItem) => {
            	if (key === `descricao`) {
            		setError(key, {
            			type: `manual`,
            			message: data.error.data[key][0],
            		})
            	}
            })
		} else {
			toastError(data.error.message, false)
		}
	}, [setError, toastError])
	const handleEditarSetor = useCallback(async (data: SetorInputs) => {
		try {
			if(data.id){
				await SetorAPI.onUpdate(user, data, data.id)
				toastSuccess(`Setor editado!`)
				setFirst(0)
				await getSetores(user)
				closeModalEditar()
				reset()
			}
		} catch (error: any) {
			if (error.data) {
				handleErrorReturnApi(error.data)
			} else {
				toastError(`Não foi possível editar o setor!`, false)
			}
		}
	},[closeModalEditar, user, setFirst, toastError, toastSuccess, reset, handleErrorReturnApi, getSetores])
	useEffect(() => {
		if(setor?.descricao){
			reset({
				descricao: setor.descricao,
				id: setor.id
			})
		}
	}, [setor, reset])

	return {
		control,
		register,
		handleSubmit, handleEditarSetor,
		errors,
		reset,
		closeModalEditar, visibleModalEditar
	}
}
