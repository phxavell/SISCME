import { useAuth } from '@/provider/Auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCallback, useEffect, useState} from 'react'
import { useForm } from 'react-hook-form'
import { TipoProdutoModalModalAPI } from '@infra/integrations/administrativo/tipo-produto-modal/tipo-produto-modal.ts'
import { PaginatorPageChangeEvent } from 'primereact/paginator'
import { TipoProdutoModalProps, TipoProdutoProps, TipoProdutoModalInputs, TipoProdutoModalSchema } from '@infra/integrations/administrativo/tipo-produto-modal/types.ts'
export function useTipoProdutoModal() {
	const { user, toastSuccess, toastError } = useAuth()

	const {
		register,
		handleSubmit,
		reset,
		setError,
		formState: { errors, isDirty }
	} = useForm<TipoProdutoModalInputs>({ criteriaMode: `all`, resolver: zodResolver(TipoProdutoModalSchema) })
	const [tipoProdutos, setTipoProdutos] = useState<TipoProdutoModalProps>()
	const [tipoProduto, setTipoProduto] = useState<TipoProdutoProps>({} as TipoProdutoProps)
	const [loading, setLoading] = useState(true)
	const [first, setFirst] = useState(0)
	const [visible, setVisible] = useState(false)
	const [visibleModalDelete, setVisibleModalDelete] = useState(false)
	const [visibleModalEditar, setVisibleModalEditar] = useState(false)
	const [visibleModalPreview, setVisibleModalPreview] = useState(false)
	const [id, setId] = useState<number>(0)

	const onPageChange = (event: PaginatorPageChangeEvent) => {
		setFirst(event.first)
	}

	const onGetTipoProduto: () => Promise<void> = useCallback(async () => {
		setLoading(true)
		try {
			const data = await TipoProdutoModalModalAPI.onList(user, first + 1)
			setTipoProdutos(data)
			setLoading(false)
		} catch (error: any) {
			toastError(error.data?.error?.message, false)
			setLoading(false)
		}
	}, [user, first, toastError])
	const handleCreateTipoProduto = async (data: TipoProdutoModalInputs) => {
		try {
			await TipoProdutoModalModalAPI.onSave(user, data)
			toastSuccess(`Tipo Produto salvo!`)
			reset()
			onGetTipoProduto()
		} catch (error: any) {
			if (error.response?.data) {
				toastError(error.data.error.message, false)
			} else {
				toastError(`Não foi possível salvar produto!!`, false)
			}
		}
	}
	const handleUpdateTipoProduto = async (data: TipoProdutoModalInputs, id: number) => {
		try {
			await TipoProdutoModalModalAPI.onUpdate(user, data, id)
			toastSuccess(`Tipo produto Atualizado!`)
			reset()
		} catch (error: any) {
			if (error.data) {
				toastError(error.data.message, false)
			} else {
				toastError(`Não foi possível atualizar!!`, false)
			}
		}
	}
	const handleDeletar = async () => {
		try {
			await TipoProdutoModalModalAPI.onDelete(user, id)
			toastSuccess(`Tipo produto Excluido!`)
			reset()
		} catch (error: any) {
			if (error.data) {
				toastError(error.data.error.message, false)
			} else {
				toastError(`Não foi possível excluir!!`, false)
			}
		}
	}
	const openModalPreview = (data: TipoProdutoProps) => {
		setTipoProduto(data)
		setVisibleModalPreview(true)
	}
	const closeModalPreview = () => {
		setVisibleModalPreview(false)
	}
	const openModalEditar = (data: TipoProdutoProps) => {
		setTipoProduto(data)
		setVisibleModalEditar(true)
	}
	const closeModalEditar = () => {
		onGetTipoProduto()
		setVisibleModalEditar(false)
	}
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

	useEffect(() => {
		onGetTipoProduto()
	}, [onGetTipoProduto])

	return {
		tipoProdutos,
		setTipoProdutos,
		onPageChange,
		first,
		handleSubmit,
		register,
		isDirty,
		errors,
		handleCreateTipoProduto,
		reset,
		handleUpdateTipoProduto,
		onGetTipoProduto,
		loading,
		id,
		setId,
		handleDeletar,
		visible,
		setVisible,
		handleErrorReturnApi,
		visibleModalDelete,
		setVisibleModalDelete,
		openModalPreview,
		visibleModalPreview,
		closeModalPreview,
		tipoProduto,
		openModalEditar,
		closeModalEditar,
		visibleModalEditar,
	}
}
