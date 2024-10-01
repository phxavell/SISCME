import {useForm} from 'react-hook-form'
import {ItemCaixaSchema, TItemCaixa} from '@pages/por-grupo/administrativo/cruds/caixa/nova-caixa/schemas.ts'
import {zodResolver} from '@hookform/resolvers/zod'
import {useCallback, useEffect} from 'react'
import {ItensDinamicos, IUseProps} from '@pages/por-grupo/administrativo/cruds/caixa/nova-caixa/modal-caixa/types-modal.ts'

export const useItensDinamicos = (props:IUseProps) => {
	const {
		itensSelecionadosParaCaixa,
		setItensSelecionadosParaCaixa,
	} = props
	const {
		control,
		formState: {
			errors
		},
		watch,
		reset,
		getValues,
		setValue
	} = useForm<TItemCaixa>({
		resolver: zodResolver(ItemCaixaSchema), defaultValues: {
			criticidade: 1,
			quantidade: 1
		}
	})

	const handleChange: ItensDinamicos.TOnChange = useCallback((keyItem, index) => (event) => {

		const arrayNew = [...itensSelecionadosParaCaixa]
		const valor = event?.value || 0
		const newValue = {...itensSelecionadosParaCaixa[index]}
		newValue[keyItem] = valor
		arrayNew.splice(index, 1, newValue)
		setItensSelecionadosParaCaixa(arrayNew)
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [itensSelecionadosParaCaixa])

	const handleDelete: (index: number) => () => void = useCallback((index) => () => {
		const arrayNew = [...itensSelecionadosParaCaixa]
		arrayNew.splice(index, 1)
		setItensSelecionadosParaCaixa(arrayNew)
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [itensSelecionadosParaCaixa])

	const tratarInserir = useCallback((valorSelecionado: TItemCaixa) => {
		// @ts-ignore
		const jaSelecionadoIndex = itensSelecionadosParaCaixa.findIndex(item => item.item.id === valorSelecionado.item.id)
		let arrayMudado = [...itensSelecionadosParaCaixa]
		if (jaSelecionadoIndex !== -1) {
			arrayMudado[jaSelecionadoIndex].quantidade++
		} else {
			arrayMudado =[valorSelecionado].concat(arrayMudado)
		}
		setItensSelecionadosParaCaixa(arrayMudado)
		reset({...valorSelecionado, item: undefined})
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [itensSelecionadosParaCaixa])

	useEffect(() => {

		if (watch(`item`)) {
			const valorSeleted = getValues()
			tratarInserir(valorSeleted)
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [getValues, tratarInserir, watch(`item`)])

	return {
		control,
		errors,
		watch,
		reset,
		getValues,
		setValue,
		tratarInserir,
		handleDelete,
		handleChange,

	}
}
