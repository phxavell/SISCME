import { useState, useCallback, useEffect } from 'react'
import { useAuth } from '@/provider/Auth'
import { PaginatorPageChangeEvent } from 'primereact/paginator'

import { DataTableRowEditCompleteEvent } from 'primereact/datatable'
import { ProfissaoProps } from '.'
import { ProfissaoAPI, ProfissoesProps } from '@/infra/integrations/profissao'
export function useProfissao() {
	const { user, toastError, toastSuccess } = useAuth()
	const [profissoes, setProfissoes] = useState<ProfissoesProps>()
	const [profissao, setProfissao] = useState<ProfissaoProps>({} as ProfissaoProps)
	const [first, setFirst] = useState(0)
	const [loading, setLoading] = useState(true)
	const [idProfissao, setIdProfissao] = useState<number>(0)
	const [visibleModalDelete, setVisibleModalDelete] = useState(false)
	const [visibleModalCreate, setVisibleModalCreate] = useState(false)
	const [visibleModalEditar, setVisibleModalEditar] = useState(false)
	const [visibleModalPreview, setVisibleModalPreview] = useState(false)

	const handleBuscarProfissoes = useCallback(async () => {
		try {
			setLoading(true)
			const data = await ProfissaoAPI.onList(user, first + 1)
			setProfissoes(data)
			setLoading(false)
		} catch (error) {
			console.log(error)
			setLoading(false)
		}
	}, [user, first])
	const onRowEditComplete = async ({ newData }: DataTableRowEditCompleteEvent) => {
		try {
			const body = {
				descricao: newData.descricao
			}
			await ProfissaoAPI.onUpdate(user, body, newData.id)
			handleBuscarProfissoes()
			toastSuccess(`Profissão atualizada com sucesso!`)
		} catch (error: any) {
			toastError(error.data?.descricao ?? `Não foi possível realizar a atualização`, false)
		}
	}
	const onPageChange = (event: PaginatorPageChangeEvent) => {
		setFirst(event.first)
	}
	const openModalDelete = () => {
		setVisibleModalDelete(true)
	}
	const closeModalDelete = () => {
		setVisibleModalDelete(false)
	}
	const openModalEditar = (data: ProfissaoProps) => {
		setProfissao(data)
		setVisibleModalEditar(true)
	}
	const closeModalEditar = () => {
		handleBuscarProfissoes()
		setVisibleModalEditar(false)
	}
	const openModalPreview = (data: ProfissaoProps) => {
		setProfissao(data)
		setVisibleModalPreview(true)
	}
	const closeModalPreview = () => {
		setVisibleModalPreview(false)
	}
	const openModalCreate = () => {
		setVisibleModalCreate(true)
	}
	const closeModalCreate = () => {
		setVisibleModalCreate(false)
		handleBuscarProfissoes()
	}
	const deleteProfissao = (id: number) => {
		openModalDelete()
		setIdProfissao(id)

	}
	const handleConfirmardelecao = async () => {
		try {
			await ProfissaoAPI.onDelete(user, idProfissao)
			handleBuscarProfissoes()
			toastSuccess(`Profissão excluída com sucesso!`)
		} catch (error: any) {
			toastError(error.data?.descricao ?? `Não foi possível excluir profissão`, false)

		} finally {
			closeModalDelete()
		}

	}
	useEffect(() => {
		handleBuscarProfissoes()
	}, [handleBuscarProfissoes])
	return {
		profissoes,
		onPageChange,
		first,
		loading,
		onRowEditComplete,
		deleteProfissao,
		setIdProfissao,
		visibleModalDelete,
		openModalDelete,
		closeModalDelete,
		handleConfirmardelecao,
		openModalCreate,
		closeModalCreate,
		visibleModalCreate,
		visibleModalPreview,
		openModalPreview,
		closeModalPreview,
		openModalEditar,
		closeModalEditar,
		visibleModalEditar,
		profissao,
	}
}
