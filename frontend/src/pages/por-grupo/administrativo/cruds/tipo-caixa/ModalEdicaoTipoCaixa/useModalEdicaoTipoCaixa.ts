import { useAuth } from "@/provider/Auth"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { TipoCaixaInputs, TipoCaixaSchema } from "../schemas"

interface EditarTipoCaixaProps {
    id: number,
    descricao: string,
}
export function useModalEdicaoTipoCaixa(props: EditarTipoCaixaProps){
	const { toastError } = useAuth()

	const {
		register,
		control,
		handleSubmit,
		reset,
		setError,
		formState: { errors }
	} = useForm<TipoCaixaInputs>({
		defaultValues: {
			descricao: props.descricao
		},
		resolver: zodResolver(TipoCaixaSchema)
	})
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
