import { useAuth } from "@/provider/Auth"
import { useForm } from "react-hook-form"
import { IndicadorFormSchemaType, indicadorFormSchema } from "../schemas"
import { zodResolver } from "@hookform/resolvers/zod"

export const useModalIndicador = () => {
	const { user, toastError, toastSuccess } = useAuth()
	const {
		control,
		handleSubmit,
		reset,
		setError,
		formState: { errors }
	} = useForm<IndicadorFormSchemaType>({ criteriaMode: `all`, resolver: zodResolver(indicadorFormSchema)})

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

	return {
		handleErrorReturnApi,
		errors,
		handleSubmit,
		user,
		toastSuccess,
		reset,
		control,
		toastError
	}
}
