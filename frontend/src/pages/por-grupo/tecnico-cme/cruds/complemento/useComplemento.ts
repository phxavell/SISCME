import { useAuth } from '@/provider/Auth'
import { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { complementoFormSchema, ComplementoFormSchemaType } from './schemas.ts'
import { zodResolver } from '@hookform/resolvers/zod'
import { ComplementoAPI } from '@/infra/integrations/complemento.ts'
import { ComplementoResponse } from '@/infra/integrations/administrativo/types-equipamentos.ts'
import { defaultValuesComplemento } from "@pages/por-grupo/tecnico-cme/cruds/complemento/helpers-complemento.ts"
import { DataTableRowEditCompleteEvent } from "primereact/datatable"
import { ColumnEditorOptions } from "primereact/column"

export function useComplemento(onClose: any) {
	const { user, toastSuccess, toastError } = useAuth()
	const [visible, setVisible] = useState(false)
	const [visibleModalDelete, setVisibleModalDelete] = useState(false)
	const {
		register,
		handleSubmit,
		reset,
		control,
		setError,
		formState: { errors }
	} = useForm<ComplementoFormSchemaType>({
		criteriaMode: `all`,
		resolver: zodResolver(complementoFormSchema)
	})

	const [complementos, setComplementos] = useState<ComplementoResponse>()
	const [first, setFirst] = useState(0)
	const [loading, setLoading] = useState(true)
	const [id, setId] = useState<number>(0)
	const [excluirComplemento, setExcluirComplemento] = useState(defaultValuesComplemento)
	const handleEditarDescricaoComplemento = (options: ColumnEditorOptions, event: any) => {
		if (options.editorCallback) {
			options.editorCallback(event.target.value)
		}
	}

	const handleEditarStatusComplemento = (options: ColumnEditorOptions, event: any) => {
		if (options.editorCallback) {
			options.editorCallback(event.value)
		}
	}
	const deleteComplemento = (complemento: any) => {
		ComplementoAPI.delete(user, complemento.id).then(() => {
			toastSuccess(`Complemento excluído!`)
			refreshTable(true)
			setVisibleModalDelete(false)
		}).catch((e) => {
			toastError(e.data?.descricao ?? `Não foi possível excluir complemento!`)
			setVisibleModalDelete(false)
		})
	}

	const onRowEditComplete = ({ newData }: DataTableRowEditCompleteEvent) => {
		ComplementoAPI.editar(user, {
			id: newData.id,
			descricao: newData.descricao,
			status: newData.status
		}).then(() => {
			refreshTable(true)
			toastSuccess(`Complemento atualizado!`)
		}).catch((error) => {
			toastError(error.data?.descricao ?? `Não foi possível realizar a atualização`)
		})
	}

	const refreshTable = (success: boolean) => {
		setVisible(false)
		if (success) {
			handleListComplementos()
		}
	}

	const handleListComplementos = useCallback(async () => {
		setLoading(true)
		try {
			const data = await ComplementoAPI.listar(user, first + 1)
			setComplementos(data)
		} catch (error : string | any) {
			toastError(error)
		} finally {
			setLoading(false)
		}
	}, [user, first, toastError])


	const status = [
		`ATIVO`,
		`INATIVO`
	]
	const onSave = (response: any) => {
		toastSuccess(response)
		reset()
		onClose(true)

	}

	const onError =  (response: any)=> {
		const {message} = response

		if(message?.data){
			const messagesData  = Object.entries(message.data).map(([, valor]) => valor).join(`\n`)

			toastError(messagesData)

		} else if (message.data === null) {

			toastError(message.message)
		} else {
			toastError(message)
		}

	}

	const handleCreateComplemento = async (data: any) => {

		await ComplementoAPI.save(user, data, onSave, onError)

	}

	const onPageChange = (event: { first: number }) => {
		setFirst(event.first)
	}

	useEffect(() => {
		handleListComplementos()
	}, [handleListComplementos])

	return {
		complementos, setComplementos,
		handleSubmit,
		register,
		errors,
		handleCreateComplemento,
		reset,
		handleListComplementos,
		loading, setLoading,
		id,
		setId,
		visible, setVisible,
		visibleModalDelete, setVisibleModalDelete,
		user,
		setError,
		first, setFirst,
		onPageChange,
		control,
		status,
		excluirComplemento, setExcluirComplemento,
		onRowEditComplete,
		deleteComplemento,
		handleEditarStatusComplemento,
		refreshTable,
		handleEditarDescricaoComplemento

	}
}
