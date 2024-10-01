import { EmbalagemModalAPI } from "@infra/integrations/administrativo/embalagem/embalagem-modal.ts"
import { Embalagem, EmbalagemObjProps, EmbalagemProps } from "@infra/integrations/administrativo/embalagem/types.ts"
import { useAuth } from "@/provider/Auth"
import { PaginatorPageChangeEvent } from "primereact/paginator"
import { useCallback, useEffect, useState } from "react"

export const useEmbalagem = () => {
	const [visible, setVisible] = useState(false)
	const [loading, setLoading] = useState(false)
	const [first, setFirst] = useState(0)
	const [embalagens, setEmbalagens] = useState<EmbalagemProps>()
	const [embalagem, setEmbalagem] = useState<EmbalagemObjProps>({} as EmbalagemObjProps)
	const [visibleModalDelete, setVisibleModalDelete] = useState(false)
	const [visibleModalEditar, setVisibleModalEditar] = useState(false)
	const [visibleModalPreview, setVisibleModalPreview] = useState(false)
	const { user, toastError, toastSuccess } = useAuth()

	const onPageChange = (event: PaginatorPageChangeEvent) => {
		setFirst(event.first)
	}
	const handleBuscarEmbalagem = useCallback(async () => {
		try {
			const data = await EmbalagemModalAPI.listar(user, first + 1)
			setEmbalagens(data)
			setLoading(false)
		} catch (e: any) {
			setLoading(false)
			toastError(`Não foi possível carregar os dados`, false)
		}
	}, [user, toastError, first])


	useEffect(() => {
		handleBuscarEmbalagem()
	}, [handleBuscarEmbalagem])

	const refreshTable = (success: boolean) => {
		setVisible(false)
		if (success) {
			setLoading(true)
			handleBuscarEmbalagem()
		}
	}
	const openModalEditar = (data: EmbalagemObjProps) => {
		setEmbalagem(data)
		setVisibleModalEditar(true)
	}
	const closeModalEditar = () => {
		handleBuscarEmbalagem()
		setVisibleModalEditar(false)
	}
	const openModalPreview = (data: EmbalagemObjProps) => {
		setEmbalagem(data)
		setVisibleModalPreview(true)
	}
	const closeModalPreview = () => {
		setVisibleModalPreview(false)
	}


	const deleteEmbalagem = (embalagem: Embalagem) => {
		EmbalagemModalAPI.deletar(user, embalagem).then(() => {
			refreshTable(true)
			setVisibleModalDelete(false)
			toastSuccess(`Embalagem excluida!`)
		}).catch((error) => {
			toastError(error?.data?.message ?? `Não foi possível excluir embalagem!`, false)
			setVisibleModalDelete(false)
		})
	}

	return {
		embalagens,
		visible, setVisible,
		loading,
		onPageChange,
		first,
		refreshTable,
		deleteEmbalagem,
		visibleModalDelete, setVisibleModalDelete,
		embalagem,
		visibleModalEditar, openModalEditar, closeModalEditar,
		visibleModalPreview, openModalPreview, closeModalPreview,
	}
}
