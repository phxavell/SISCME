import { useAuth } from "@/provider/Auth"
import { ProfissaoInputs, ProfissaoSchema } from "../schemas"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"

interface EditarProfissaoProps {
    id: number,
    descricao: string,
}

export function useModalEdicaoProfissao(props: EditarProfissaoProps){
	const { toastError } = useAuth()

	const {
		register,
		control,
		handleSubmit,
		reset,
		setError,
		formState: { errors }
	} = useForm<ProfissaoInputs>({
		resolver: zodResolver(ProfissaoSchema)
	})

	function handleErrorReturnApi(data: any) {
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
	useEffect(() => {
		if(props.descricao){
			reset({
				descricao: props.descricao,
				id: props.id
			})
		}
	}, [props, reset])

	return {
		control,
		register,
		handleSubmit,
		errors,
		reset,
		handleErrorReturnApi,
	}
}
