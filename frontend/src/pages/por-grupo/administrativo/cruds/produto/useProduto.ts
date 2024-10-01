import { ProductAPI, ProductResponse } from '@infra/integrations/produto.ts'
import { useAuth } from '@/provider/Auth'
import { useCallback, useEffect, useState } from 'react'
import { PaginatorPageChangeEvent } from 'primereact/paginator'

export const useProduto = ()=>  {
	const { user, toastSuccess, toastError } = useAuth()
	const [visible, setVisible] = useState(false)
	const [visibleDelete, setVisibleDelete] = useState(false)
	const [loading, setLoading] = useState(true)
	const [id, setId] = useState<number>(0)
	const [produtos, setProdutos] = useState<ProductResponse>()
	const [first, setFirst] = useState(0) // Primeiro índice da página
	const [descricao, setDescricao] = useState(``)
	const [embalagem, setEmbalagem] = useState(``)
	const [tipoProduto, setTipoProduto] = useState(``)
	const [subTipoProduto, setSubTipoProduto] = useState(``)

	const [visibleModalVisualizar, setVisibleModalVisualizar] = useState(false)

	const handleBuscarProdutos = useCallback( () => {
		if (user) {
			if (descricao || tipoProduto || embalagem || subTipoProduto) {
				setLoading(true)
				ProductAPI.onListFilter(user, first + 1, descricao, embalagem, tipoProduto, subTipoProduto).then((data) => {
					setProdutos(data)
					setLoading(false)
				}).catch(() => {
					setLoading(false)
				})
			} else {
				try {
					setLoading(true)
					ProductAPI.onList(user, first + 1).then(data => {
						setProdutos(data)
						setLoading(false)
					})
				} catch (error) {
					setLoading(false)
				}
			}
		}
	}, [user, first, descricao, tipoProduto, embalagem, subTipoProduto])

	const onPageChange = (event: PaginatorPageChangeEvent) => {
		setFirst(event.first)
	}

	const handleDeletar = async () => {
		const msgError = `Não foi possível excluir!!`
		try {
			await ProductAPI.onDelete(user, id)

			toastSuccess(`Excluido com sucesso!`)
		} catch (error: any) {
			if (error.data) {
				toastError(error?.data?.error?.message ?? msgError)
			} else {
				toastError(msgError)

			}
		}
	}

	useEffect(() => {
		handleBuscarProdutos()
	}, [handleBuscarProdutos])

	const refreshTable = (success: boolean) => {
		setVisible(false)
		if (success) {
			setLoading(true)
			handleBuscarProdutos()
		}
	}

	return {
		produtos,
		onPageChange,
		first, setFirst,
		handleBuscarProdutos,
		visible,
		setVisible,
		visibleDelete,
		setVisibleDelete,
		loading,
		setId,
		handleDeletar,
		refreshTable,
		descricao, setDescricao,
		embalagem, setEmbalagem,
		tipoProduto, setTipoProduto,
		subTipoProduto, setSubTipoProduto,
		visibleModalVisualizar, setVisibleModalVisualizar
	}
}
