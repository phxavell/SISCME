import { useAuth } from '@/provider/Auth'
import { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { SubTipoProdutoModal, SubTipoProdutoModalInputs, SubTipoProdutoModalProps, SubTipoProdutoModalSchema, SubTipoProdutoProps } from '@/infra/integrations/administrativo/sub-tipo-produto-modal/types'
import { SubTipoProdutoModalAPI } from '@/infra/integrations/administrativo/sub-tipo-produto-modal/sub-tipo-produto-modal'
import { PaginatorPageChangeEvent } from 'primereact/paginator'

export function useSubTipoProdutoModal() {
	const { user, toastError, toastSuccess } = useAuth()

	const [visible, setVisible] = useState(false)
	const [visibleModalDelete, setVisibleModalDelete] = useState(false)
	const [visibleModalEditar, setVisibleModalEditar] = useState(false)
	const [visibleModalPreview, setVisibleModalPreview] = useState(false)
	const {
		register,
		handleSubmit,
		reset,
		setError,
		formState: { errors, isDirty}
	} = useForm<SubTipoProdutoModalInputs>({ criteriaMode: `all`, resolver: zodResolver(SubTipoProdutoModalSchema) })
	const [subTipoProdutos, setSubTipoProdutos] = useState<SubTipoProdutoModalProps>()
	const [subTipoProduto, setSubTipoProduto] = useState<SubTipoProdutoProps>({} as SubTipoProdutoProps)
	const [loading, setLoading] = useState(false)
	const [first, setFirst] = useState(0)

	const onPageChange = (event: PaginatorPageChangeEvent) => {
		console.log(`teste`,{event})
		setFirst(event.first)
	}

	const handleListSubTipoProdutos = useCallback(async () => {
		setLoading(true)
		try {
			const data = await SubTipoProdutoModalAPI.onList(user, first + 1)
			setSubTipoProdutos(data)
			setLoading(false)
		} catch (error: any) {
			toastError(error?.data?.error?.message, false)
			setLoading(false)
		}
	}, [user, first, toastError])

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
	const openModalEditar = (data: SubTipoProdutoProps) => {
		setSubTipoProduto(data)
		setVisibleModalEditar(true)
	}
	const closeModalEditar = () => {
		handleListSubTipoProdutos()
		setVisibleModalEditar(false)
	}
	const openModalPreview = (data: SubTipoProdutoProps) => {
		setSubTipoProduto(data)
		setVisibleModalPreview(true)
	}
	const closeModalPreview = () => {
		setVisibleModalPreview(false)
	}
	const handleCreateSubTipoProduto = async (data: SubTipoProdutoModal) => {
		try {
			await SubTipoProdutoModalAPI.onSave(user, data)
			toastSuccess(`Sub Tipo Produto salvo!`)
			reset()
			handleListSubTipoProdutos()
		} catch (error: any) {
			if (error.data) {
				toastError(error.data.error.message, false)
			} else {
				toastError(`Não foi possível salvar produto!!`, false)
			}
		}
	}

	useEffect(() => {
		handleListSubTipoProdutos()
	}, [handleListSubTipoProdutos])

	return {
		subTipoProdutos,
		handleSubmit,
		register,
		errors,
		isDirty,
		handleCreateSubTipoProduto,
		onPageChange,
		first,
		setFirst,
		reset,
		handleListSubTipoProdutos,
		loading,
		visible, setVisible,
		visibleModalDelete, setVisibleModalDelete,
		visibleModalEditar,
		openModalEditar,
		closeModalEditar,
		visibleModalPreview,
		openModalPreview, closeModalPreview,
		subTipoProduto,
		setError,
		handleErrorReturnApi,
	}
}
