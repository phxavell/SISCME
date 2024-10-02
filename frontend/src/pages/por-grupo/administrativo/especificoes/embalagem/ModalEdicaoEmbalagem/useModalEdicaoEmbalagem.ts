import {useAuth} from "@/provider/Auth"
import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import {useEffect} from "react"
import {EmbalagemInputs, EmbalagemSchema} from "../ModalEmbalagem/schema.ts"
import {EditarEmbalagemProps} from "@pages/por-grupo/administrativo/especificoes/embalagem/types.ts"


export function useModalEdicaoEmbalagem(props: EditarEmbalagemProps){
	const { toastError } = useAuth()

	const {
		register,
		control,
		handleSubmit,
		reset,
		setError,
		formState: { errors }
	} = useForm<EmbalagemInputs>({resolver: zodResolver(EmbalagemSchema)})
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
				valorcaixa: props.valorcaixa,
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
