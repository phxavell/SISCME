import { useAuth } from '@/provider/Auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { SetorInputs, SetortSchema } from '../schemas.ts'
import { SetorAPI } from '@infra/integrations/setor.ts'
import { useCallback } from 'react'
import { useSetorStore } from '../store/useSetorState.ts'

export function useModalSetor() {
	const { user, toastSuccess, toastError } = useAuth()
	const getSetores = useSetorStore(state => state.getSetores)
	const {setFirst} = useSetorStore()
	const {
		register,
		control,
		handleSubmit,
		reset,
		setError,
		formState: { errors }
	} = useForm<SetorInputs>({ resolver: zodResolver(SetortSchema) })

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
	},[setError, toastError])

	const handleCreateSetor = useCallback( async (payload: SetorInputs) => {
		try {
			const {data} = await SetorAPI.onSave(user, payload)
			toastSuccess(`Setor cadastrado!`)
			setFirst(0)
			await getSetores(user)
			reset()
			return data
		} catch (error: any) {
			if (error.data) {
				handleErrorReturnApi(error.data)
			} else {
				toastError(`Não foi possível cadastrar o setor!`, false)
			}
		}
	}, [user, toastSuccess, reset, handleErrorReturnApi, getSetores, setFirst, toastError])
	return {
		register,
		control,
		handleSubmit,
		errors,
		handleCreateSetor,
		reset
	}
}
