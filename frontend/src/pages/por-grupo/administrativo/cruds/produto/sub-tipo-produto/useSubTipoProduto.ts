import {useAuth} from '@/provider/Auth'
import {useCallback, useEffect,  useState} from 'react'
import {useForm} from 'react-hook-form'
import {SubTipoProductInputs, SubTipoProductSchema} from './schemaTipoProduto.ts'
import {zodResolver} from '@hookform/resolvers/zod'
import {SubTipoProdutoAPI, SubTipoProdutoProps} from '@infra/integrations/sub-tipo-produto.ts'
import {DropdownFilterEvent} from 'primereact/dropdown'

export function useSubTipoProduto() {
	const {user , toastError, toastSuccess} = useAuth()
	const [visible, setVisible] = useState(false)
	const [visibleModalDelete, setVisibleModalDelete] = useState(false)
	const {
		register,
		handleSubmit,
		reset,
		setError,
		formState: {errors, isDirty}
	} = useForm<SubTipoProductInputs>({criteriaMode: `all`, resolver: zodResolver(SubTipoProductSchema)})
	const [subTipoProdutos, setSubTipoProdutos] = useState<SubTipoProdutoProps[] | undefined>([])
	const [loading, setLoading] = useState(true)
	const [loadingOptionDropdown, setLoadingOptionDropdown] = useState(true)
	const [id, setId] = useState<number>(0)

	const handleListSubTipoProdutos: () => Promise<void> = useCallback(async () => {
		setLoading(true)
		try {
			const data = await SubTipoProdutoAPI.onList(user)
			setSubTipoProdutos(data)
			setLoading(false)
		} catch (error: any) {
			toastError(error?.data?.status, error?.data?.error?.message?? `Erro ao buscar informações.`)
			setLoading(false)
		}
	}, [user, toastError])

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

	const handleCreateSubTipoProduto = async (dataPayload: SubTipoProdutoProps) => {
		try {
			const {data} = await SubTipoProdutoAPI.onSave(user, dataPayload)
			toastSuccess(`Tipo Produto salvo com sucesso!`)
			reset()
			handleListSubTipoProdutos()
			return data
		} catch (error: any) {
			const msgError = `Não foi possível salvar produto!!`
			if (error?.data) {
				toastError(error?.data?.status, error?.data?.error?.message ?? msgError)
			} else {
				toastError(msgError)
			}
		}
	}
	const handleUpdateSubTipoProduto = async (data: SubTipoProdutoProps, id: number) => {
		try {
			await SubTipoProdutoAPI.onUpdate(user, data, id)
			toastSuccess(`Atualizado com sucesso!`)
			reset()
		} catch (error: any) {
			const msgError = `Não foi possível atualizar!!`
			if (error?.data) {
				toastError(error?.data?.status, error?.data?.error?.message ?? msgError)
			} else {
				toastError(msgError)
			}
		}
	}
	const handleDeletar = async () => {
		try {
			await SubTipoProdutoAPI.onDelete(user, id)
			toastSuccess(`Excluído com sucesso!`)
			reset()
		} catch (error: any) {
			const msgError = `Não foi possível excluir!!`
			if (error?.data) {
				toastError(error?.data?.status, error?.data?.error?.message ?? msgError)
			} else {
				toastError(msgError)
			}
		}
	}
	const onFilterSubTiProduto = useCallback((event: DropdownFilterEvent) => {

		if (event.filter) {
			setLoadingOptionDropdown(true)
			SubTipoProdutoAPI.onSearch(user, event.filter).then(r => {
				if (r.length) {
					setSubTipoProdutos(r)
				}
				setLoadingOptionDropdown(false)
			}).catch(() => {
				setLoadingOptionDropdown(false)
			})
		}
	}, [user])
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
		reset,
		handleUpdateSubTipoProduto,
		handleListSubTipoProdutos,
		loading,
		id,
		setId,
		handleDeletar,
		visible, setVisible,
		visibleModalDelete, setVisibleModalDelete,
		setError,
		handleErrorReturnApi,
		onFilterSubTiProduto,
		loadingOptionDropdown
	}
}
