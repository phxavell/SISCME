import { TipoProdutoAPI, TipoProdutoProps } from '@infra/integrations/tipo-produto.ts'
import { useAuth } from '@/provider/Auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCallback, useEffect, useState} from 'react'
import { useForm } from 'react-hook-form'
import { TipoProductInputs, TipoProductSchema } from './schemaTipoProduto.ts'
import { DropdownFilterEvent } from 'primereact/dropdown'

export function useTipoProduto() {
	const { user, toastError, toastSuccess } = useAuth()
	const {
		register,
		handleSubmit,
		reset,
		setError,
		formState: { errors }
	} = useForm<TipoProductInputs>({ criteriaMode: `all`, resolver: zodResolver(TipoProductSchema) })
	const [tipoProdutos, setTipoProdutos] = useState<TipoProdutoProps[] | undefined>([])
	const [loading, setLoading] = useState(true)
	const [loadingOption, setLoadingOption] = useState(false)
	const [visible, setVisible] = useState(false)
	const [visibleModalDelete, setVisibleModalDelete] = useState(false)
	const [id, setId] = useState<number>(0)

	const onGetTipoProduto: () => Promise<void> = useCallback(async () => {
		setLoading(true)
		try {
			const data = await TipoProdutoAPI.onList(user)
			setTipoProdutos(data)
			setLoading(false)
		} catch (error: any) {
			toastError(error.data?.status, error.data?.error?.message)
			setLoading(false)
		}
	}, [user, toastError])
	const handleCreateTipoProduto: any = async (dataPayload: TipoProductInputs) => {
		try {
			const {data} =await TipoProdutoAPI.onSave(user, dataPayload)
			toastSuccess(`Tipo Produto salvo com sucesso!`)
			reset()
			onGetTipoProduto()
			return data
		} catch (error: any) {
			const msgError = `Não foi possível salvar produto!!`
			if (error?.response?.data) {
				toastError(error?.data?.status, error?.data?.error?.message ?? msgError)
			} else {
				toastError(msgError)
			}
		}
	}
	const handleUpdateTipoProduto = async (data: TipoProductInputs, id: number) => {
		try {
			await TipoProdutoAPI.onUpdate(user, data, id)
			toastSuccess(`Atualizado com sucesso!`)
			reset()
		} catch (error: any) {
			if (error.data) {
				toastError(error.data.status, error.data.message)
			} else {
				toastError(`Não foi possível atualizar!!`)
			}
		}
	}
	const handleDeletar = async () => {
		try {
			await TipoProdutoAPI.onDelete(user, id)
			toastSuccess(`Excluído com sucesso!`)
			reset()
		} catch (error: any) {
			const msgErrror =`Não foi possível excluir!!`
			if (error.data) {
				toastError(error?.data?.status, error?.data?.error?.message ?? msgErrror)
			} else {
				toastError(msgErrror)
			}
		}
	}
	const onFilterTiProduto = useCallback((event: DropdownFilterEvent) => {

		if (event.filter && tipoProdutos) {
			setLoadingOption(true)
			TipoProdutoAPI.onSearch(user, event.filter).then(r => {
				if (r.length) {
					setTipoProdutos(r)
				}
				setLoadingOption(false)
			}).catch(() => {
				setLoadingOption(false)
			})
		}
	}, [user, tipoProdutos])
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
			toastError(data?.status, data?.error?.message)
		}
	}

	useEffect(() => {
		onGetTipoProduto()
	}, [onGetTipoProduto])

	return {
		tipoProdutos,
		setTipoProdutos,
		handleSubmit,
		register,
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
		user,
		handleErrorReturnApi,
		setVisibleModalDelete,
		visibleModalDelete,
		onFilterTiProduto,
		loadingOption
	}
}
