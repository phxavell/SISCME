import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { AssociarFormSchemaType, associarFormSchema } from "../../schemas"
import { IndicadoresAPI } from "@/infra/integrations/administrativo/indicadores/indicadores"
import { useAuth } from "@/provider/Auth"
import { useCallback, useEffect, useState } from "react"
import { DropdownFilterEvent } from "primereact/dropdown"
import { IndicadoresResponse } from "@/infra/integrations/administrativo/indicadores/types"

export const useModalAssociar = (onClose: any, indicador: IndicadoresResponse, lote: any) => {
	const [visibleModalLote, setVisibleModalLote] = useState(false)
	const [loadingOption, setLoadingOption] = useState(true)
	const [itensParaSelecao, setItensParaSelecao] = useState<any[]>([])
	const [checked, setChecked] = useState(true)

	const {
		control,
		handleSubmit,
		setError,
		setValue,
		register,
		reset,
		formState: {errors},
	} = useForm<AssociarFormSchemaType>({
		resolver: zodResolver(associarFormSchema),
	})

	const { user, toastSuccess, toastError } = useAuth()

	function handleErrorReturnApi(data: any) {
		if (data.error && typeof data.error.data === `object`) {
            type nameItem = `lote` | `quantidade`
            Object.keys(data.error.data).map((key: string) => {
            	if (key == `lote` || key == `quantidade`) {
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

	const handleGerarMovimentacao = (data: AssociarFormSchemaType) => {
		const payload = () => {
			if(lote) {
				if(checked) {
					return {
						...data,
						lote: lote?.id,
						operacao: `ENTRADA`
					}
				} else {
					return {
						...data,
						lote: lote?.id,
						operacao: `SAIDA`
					}
				}
			} else {
				return {
					...data,
					operacao: `ENTRADA`
				}
			}
		}
		IndicadoresAPI.gerarMovimentacao(user, payload(), indicador?.id, payload()?.lote).then(() => {
			toastSuccess(`Operação realizada.`)
			onClose()
			reset()
		}).catch((e: any) => {
			handleErrorReturnApi(e?.data)
		})
	}

	const onFilterItens = useCallback((event: DropdownFilterEvent) => {
		if (event.filter) {
			setLoadingOption(true)
			IndicadoresAPI.buscarLotes(user, event.filter, indicador?.id).then(r => {
				if (r?.data?.length) {
					setItensParaSelecao(r?.data)
				}
				setLoadingOption(false)
			}).catch(() => {
				setLoadingOption(false)
			})
		}
	}, [setItensParaSelecao, setLoadingOption, user, indicador])

	const buscarLotes = useCallback((exist?: boolean) => {
		if(exist) {
			IndicadoresAPI.buscarLotes(user, ``, indicador?.id).then(data => {
				setItensParaSelecao(data?.data)
				setValue(`lote`, data?.data[0]?.id)
				setLoadingOption(false)
			}).catch(() => {
				setLoadingOption(false)
			})
		} else {
			IndicadoresAPI.buscarLotes(user, ``, indicador?.id).then(data => {
				setItensParaSelecao(data?.data)
				setLoadingOption(false)
			}).catch(() => {
				setLoadingOption(false)
			})
		}
	}, [user, setValue, indicador])

	useEffect(() => {
		if(indicador) {
			buscarLotes()

		} else {
			return
		}
	}, [buscarLotes, indicador])

	return {
		control,
		handleSubmit,
		reset,
		errors,
		handleGerarMovimentacao,
		visibleModalLote, setVisibleModalLote,
		loadingOption, setLoadingOption,
		itensParaSelecao, setItensParaSelecao,
		onFilterItens,
		buscarLotes,
		checked, setChecked,
		register
	}
}
