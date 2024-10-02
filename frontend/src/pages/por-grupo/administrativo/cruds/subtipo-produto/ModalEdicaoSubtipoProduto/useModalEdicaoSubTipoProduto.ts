import { useAuth } from "@/provider/Auth"
import { SubTipoProdutoModalInputs, SubTipoProdutoModalSchema} from '@/infra/integrations/administrativo/sub-tipo-produto-modal/types'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"

interface EditarSubTipoProdutoProps {
    id: number,
    descricao: string,
}

export function useModalEdicaoSubTipoProduto(props: EditarSubTipoProdutoProps){
	const { toastError } = useAuth()

	const {
		register,
		control,
		handleSubmit,
		reset,
		setError,
		formState: { errors }
	} = useForm<SubTipoProdutoModalInputs>({
		defaultValues: {
			descricao: props.descricao
		},
		resolver: zodResolver(SubTipoProdutoModalSchema)
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
