import { EmbalagemAPI } from "@infra/integrations/caixa/embalagem.ts"
import { useAuth } from "@/provider/Auth"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { EmbalagemInputs, EmbalagemSchema } from "./schema.ts"
import {ModalEmbalagemProps} from "@pages/por-grupo/administrativo/especificoes/embalagem/types.ts"

export const useModalEmbalagem = (props: ModalEmbalagemProps) => {
	const { onClose } = props
	const [descricao, setDescricao] = useState<string>(``)
	const [valor, setValor] = useState<string>(``)
	const [salvando, setSalvando] = useState(false)

	const { user, toastSuccess, toastError } = useAuth()

	const {
		register,
		handleSubmit,
		reset,
		setError,
		formState: { errors, isDirty }
	} = useForm<EmbalagemInputs>({ criteriaMode: `all`, resolver: zodResolver(EmbalagemSchema) })

	function handleErrorReturnApi(data: any) {
		if (data.error && typeof data.error.data === `object`) {
            type nameItem = `descricao` | `valorcaixa`
            // @ts-ignore
            Object.keys(data.error.data).map((key: nameItem) => {
            	if (key === `descricao` || key === `valorcaixa`) {
            		setError(key, {
            			type: `manual`,
            			message: data.error.data[key][0],
            		})
            	}
            })
		} else {
			toastError(data.error.data.descricao ?? `Erro ao salvar embalagem`, false)
		}
	}

	const handleSubmitEmbalagem = async (data: EmbalagemInputs) => {
		setSalvando(true)
		await EmbalagemAPI.salvar(user, data).then(() => {
			setSalvando(false)
			toastSuccess(`Embalagem salva com sucesso!`)
			reset()
			onClose(true)
		}).catch((error) => {
			setSalvando(false)
			const descricao = error.data?.error.data.descricao ?? ``
			const valorcaixa = error.data?.error.data.valorcaixa ?? ``
			toastError(`${descricao}, ${valorcaixa} ` ?? `Erro ao salvar embalagem!`, false)
			handleErrorReturnApi(error.data)
		})
	}

	return {
		handleSubmitEmbalagem,
		descricao, setDescricao,
		valor, setValor,
		salvando,
		handleSubmit,
		register,
		isDirty,
		errors,
		reset
	}
}
