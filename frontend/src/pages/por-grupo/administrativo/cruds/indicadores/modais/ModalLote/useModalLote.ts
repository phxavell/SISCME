import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { LoteFormSchemaType, loteFormSchema } from "../../schemas"
import { IndicadoresAPI } from "@/infra/integrations/administrativo/indicadores/indicadores"
import { useAuth } from "@/provider/Auth"
import { useEffect } from "react"
import { IndicadoresResponse } from "@/infra/integrations/administrativo/indicadores/types"
import moment from "moment"

export const useModalLote = (indicador?: IndicadoresResponse, buscarLotes?: any, onClose?: any, lote?: any) => {
	const defaultValuesLote = {
		codigo: ``,
		saldo: undefined,
		indicador:  undefined,
		fabricacao: undefined,
		vencimento: undefined,
	}

	const {
		control,
		handleSubmit,
		setError,
		reset,
		formState: {errors},
	} = useForm<LoteFormSchemaType>({
		resolver: zodResolver(loteFormSchema),
		defaultValues: defaultValuesLote
	})

	const { user, toastSuccess, toastError } = useAuth()

	function handleErrorReturnApi(data: any) {
		if (data.error && typeof data.error.data === `object`) {
            type nameItem = `codigo` | `fabricacao` | `vencimento`
            Object.keys(data.error.data).map((key: string) => {
            	if (key == `codigo` || key == `fabricacao` || key == `vencimento`) {
            		setError(key as nameItem, {
            			type: `manual`,
            			message: data.error.data[key][0],
            		})
            	}
            })
		} else {
			toastError(data.error.message, false)
		}
	}

	const handleLote = (data: LoteFormSchemaType) => {
		if(indicador) {
			data.indicador = indicador?.id
		}

		const dataFabricacao = moment(data.fabricacao).format(`YYYY-MM-DD`)
		const dataVencimento = moment(data.vencimento).format(`YYYY-MM-DD`)

		const payload = {
			...data,
			fabricacao: dataFabricacao == `Data inválida` ? null : dataFabricacao,
			vencimento: dataVencimento == `Data inválida` ? null : dataVencimento,
		}

		if(lote) {
			IndicadoresAPI.editarLote(user, payload, lote?.id).then(() => {
				toastSuccess(`Lote editado.`)
				reset()
				buscarLotes(true)
				onClose()
			}).catch((e: any) => {
				handleErrorReturnApi(e?.data)
			})
		} else {
			IndicadoresAPI.saveLote(user, payload).then(() => {
				toastSuccess(`Lote cadastrado.`)
				reset()
				buscarLotes(true)
				onClose()
			}).catch((e: any) => {
				handleErrorReturnApi(e?.data)
			})
		}

	}


	useEffect(() => {
		if(lote) {
			reset({
				codigo: lote?.codigo ?? ``,
				fabricacao: lote?.fabricacao ?? ``,
				vencimento: lote?.vencimento ?? ``
			})
		} else {
			reset({
				codigo: ``,
				fabricacao: ``,
				vencimento: ``
			})
		}
	}, [reset, lote])

	return {
		control,
		handleSubmit,
		handleLote,
		reset,
		errors,
	}
}
