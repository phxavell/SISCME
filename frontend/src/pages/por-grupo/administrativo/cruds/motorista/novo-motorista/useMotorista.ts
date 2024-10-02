import { DataMotorista, DriverAPI, MotoristaResponse } from '@/infra/integrations/motorista'
import { useAuth } from '@/provider/Auth'
import { DataTableUnselectEvent } from 'primereact/datatable'
import { useCallback, useEffect, useState } from 'react'

export const defaultValuesMotorista = {
	idprofissional: 0,
	atrelado: ``,
	cpf: ``,
	nome: ``,
	matricula: undefined,
	dtnascimento: ``,
	email: ``,
	contato: ``,
	sexo: ``,
	idprofissao: ``,
	apelidousu: ``,
	senhausu: ``,
	confirmasenha: ``
}

export const useMotorista = () => {
	const [visible, setVisible] = useState(false)
	const [motoristas, setMotorista] = useState<MotoristaResponse | undefined>()
	const [editMotorista, setEditMotorista] = useState<DataMotorista>()
	const [editSenhaMotorista, setEditSenhaMotorista] = useState<DataMotorista>()
	const [motoristaDetail, setMotoristaDetail] = useState<DataMotorista>(defaultValuesMotorista)
	const [excluirMotorista, setExcluirMotorista] = useState<DataMotorista>(defaultValuesMotorista)
	const [visibleModalEdit, setVisibleModalEdit] = useState(false)
	const [visibleModalEditSenha, setVisibleModalEditSenha] = useState(false)
	const [visibleModalDelete, setVisibleModalDelete] = useState(false)
	const [visibleModalDetail, setVisibleModalDetail] = useState(false)

	const { user, toastError } = useAuth()
	const [first, setFirst] = useState(0)

	const [loading, setLoading] = useState(true)

	const renderMotorista = useCallback(() => {
		try {
			DriverAPI.getOptions(user, first + 1).then((data) => {
				setMotorista(data)
				setLoading(false)
			})
		} catch (e: any) {
			toastError(`Não foi possível baixar os dados.`)
			setLoading(false)
		}

	}, [first, toastError, user])


	const onPageChange = (event: { first: number }) => {
		setFirst(event.first)
	}

	const editarMotorista = (motorista: DataMotorista) => {
		setEditMotorista(motorista)
		setTimeout(() => {
			setVisibleModalEdit(true)
		}, 300)
	}

	const editarSenhaMotorista = (motorista: DataMotorista) => {
		setEditSenhaMotorista(motorista)
		setTimeout(() => {
			setVisibleModalEditSenha(true)
		}, 100)
	}

	const onRowSelect = (e: DataTableUnselectEvent) => {
		setVisibleModalDetail(true)
		setMotoristaDetail(e.data)
	}

	const refreshTable = (success: boolean) => {
		if (visible) {
			setVisible(false)
		} else if (visibleModalEdit && visibleModalDetail) {
			setVisibleModalEdit(false)
		} else if (visibleModalEditSenha && visibleModalDetail) {
			setVisibleModalEditSenha(false)
		} else if (visibleModalEdit) {
			setVisibleModalEdit(false)
		} else if (visibleModalDetail) {
			setVisibleModalDetail(false)
		} else if (visibleModalEditSenha) {
			setVisibleModalEditSenha(false)
		}

		if (success) {
			setLoading(true)
			DriverAPI.getOptions(user, first + 1).then((data) => {
				setMotorista(data)
				setLoading(false)
			}).catch(() => {
				toastError(`Não foi possível baixar os dados.`)
				setLoading(false)
			})
		}
	}

	useEffect(() => {
		renderMotorista()
	}, [renderMotorista])

	return {
		visible, setVisible,
		motoristas,
		editMotorista,
		setEditMotorista,
		excluirMotorista, setExcluirMotorista,
		visibleModalDelete, setVisibleModalDelete,
		visibleModalEdit, setVisibleModalEdit,
		user,
		loading,
		refreshTable,
		editarMotorista,
		first,
		onPageChange,
		visibleModalDetail, setVisibleModalDetail,
		onRowSelect,
		motoristaDetail,

		visibleModalEditSenha, setVisibleModalEditSenha,
		editSenhaMotorista, setEditSenhaMotorista,
		editarSenhaMotorista
	}
}
