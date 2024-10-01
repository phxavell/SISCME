import { useAuth } from '@/provider/Auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { ProfissaoInputs, ProfissaoSchema } from '../schemas'
import { ProfissaoAPI } from '@/infra/integrations/profissao'

export function useModalProfissao() {
	const { user, toastSuccess, toastError } = useAuth()

	const {
		register,
		handleSubmit,
		reset,
		setError,
		formState: { errors }
	} = useForm<ProfissaoInputs>({ resolver: zodResolver(ProfissaoSchema) })

	const handleErrorReturnApi = (data: any) => {
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
	}
	const handleCreateProfissao = async (data: ProfissaoInputs) => {
		try {
			await ProfissaoAPI.onSave(user, data)
			toastSuccess(`Profissão cadastrada!`)
			reset()
		} catch (error: any) {
			if (error.data) {
				handleErrorReturnApi(error.data)
				const setError = error.data.error?.data?.descricao
				toastError(setError, false)
			} else {
				toastError(`Não foi possível cadastrar a profissão!`, false)
			}
		}
	}
	return {
		register,
		handleSubmit,
		errors,
		handleCreateProfissao,
		reset
	}
}
