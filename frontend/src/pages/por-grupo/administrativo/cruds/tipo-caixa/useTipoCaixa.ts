import { useAuth } from '@/provider/Auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCallback, useEffect, useState} from 'react'
import { useForm } from 'react-hook-form'
import { TipoCaixaInputs, TipoCaixaProps, TipoCaixaSchema } from './schemas'
import { PaginatorPageChangeEvent } from 'primereact/paginator'
import { TiposCaixaModalAPI } from '@/infra/integrations/administrativo/tipo-caixa/tipos-caixa-modal'
import { TipoCaixaModalProps } from '@/infra/integrations/administrativo/tipo-caixa/types'
export function useTipoCaixa() {
	const { user, toastSuccess, toastError } = useAuth()
	const {
		register,
		handleSubmit,
		reset,
		setError,
		formState: { errors, isDirty }
	} = useForm<TipoCaixaInputs>({ criteriaMode: `all`, resolver: zodResolver(TipoCaixaSchema) })
	const [tipoCaixas, setTipoCaixas] = useState<TipoCaixaModalProps>()
	const [tipoCaixa, setTipoCaixa] = useState<TipoCaixaProps>({} as TipoCaixaProps)
	const [loading, setLoading] = useState(true)
	const [visible, setVisible] = useState(false)
	const [visibleModalDelete, setVisibleModalDelete] = useState(false)
	const [visibleModalEditar, setVisibleModalEditar] = useState(false)
	const [visibleModalPreview, setVisibleModalPreview] = useState(false)
	const [first, setFirst] = useState(0)
	const [id, setId] = useState<number>(0)

	const onPageChange = (event: PaginatorPageChangeEvent) => {
		setFirst(event.first)
	}
	const onGetTipoCaixa: () => Promise<void> = useCallback(async () => {
		setLoading(true)
		try {
			const data = await TiposCaixaModalAPI.listar(user, first + 1)
			setTipoCaixas(data)
			setLoading(false)
		} catch (error: any) {
			toastError(error.data.error.message, false)
			setLoading(false)
		}
	}, [user, first, toastError])
	const handleCreateTipoCaixa = async (data: TipoCaixaInputs) => {
		try {
			await TiposCaixaModalAPI.salvar(user, data)
			toastSuccess(`Tipo salvo!`)
			reset()
			onGetTipoCaixa()
		} catch (error: any) {
			if (error.response?.data) {
				toastError(error.data.error.message, false)
			} else {
				toastError(`Não foi possível salvar tipo de caixa!!`, false)
			}
		}
	}
	const openModalEditar = (data: TipoCaixaProps) => {
		setTipoCaixa(data)
		setVisibleModalEditar(true)
	}
	const closeModalEditar = () => {
		onGetTipoCaixa()
		setVisibleModalEditar(false)
	}
	const openModalPreview = (data: TipoCaixaProps) => {
		setTipoCaixa(data)
		setVisibleModalPreview(true)
	}
	const closeModalPreview = () => {
		setVisibleModalPreview(false)
	}
	const handleErrorReturnApi = (data: any) => {
		if (data?.error && typeof data.error.data === `object`) {
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
		onGetTipoCaixa()
	}, [onGetTipoCaixa])

	return {
		tipoCaixas,
		handleSubmit,
		register,
		isDirty,
		errors,
		handleCreateTipoCaixa,
		reset,
		onGetTipoCaixa,
		onPageChange,
		first,
		loading,
		id,
		setId,
		visible,
		setVisible,
		user,
		handleErrorReturnApi,
		visibleModalDelete, setVisibleModalDelete,
		tipoCaixa,
		openModalEditar, closeModalEditar, visibleModalEditar,
		openModalPreview, closeModalPreview, visibleModalPreview
	}
}
