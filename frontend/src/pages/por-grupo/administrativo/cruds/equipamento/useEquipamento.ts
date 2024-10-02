/* eslint-disable @typescript-eslint/no-explicit-any */
import {defaultValueEquipamento} from "@infra/integrations/__mocks__/administrativo/equipamentos-mock.ts"
import {EquipamentosAPI} from "@infra/integrations/administrativo/equipamentos.ts"
import {useAuth} from "@/provider/Auth"
import {Toast, ToastMessage} from "primereact/toast"
import {useCallback, useEffect, useRef, useState} from "react"
import {Equipamentos, EquipamentosResponse,} from "@infra/integrations/administrativo/types-equipamentos.ts"

export const useEquipamento = () => {
	const [visible, setVisible] = useState(false)
	const [visibleModalManutencao, setVisibleModalManutencao] = useState(false)
	const [visibleModalFinalizarManutencao, setVisibleModalFinalizarManutencao] = useState(false)
	const [loading, setLoading] = useState(true)
	const [equipamentos, setEquipamentos] = useState<Equipamentos>()
	const [equipamentoEdit, setEquipamentoEdit] =
        useState<EquipamentosResponse>()
	const [excluirEquipamento, setExcluirEquipamento] = useState<any>(
		defaultValueEquipamento,
	)
	const [visibleModalDelete, setVisibleModalDelete] = useState(false)
	const [first, setFirst] = useState(0)
	const [equipamento, setEquipamento] = useState<any>()
	const [equipamentoParaManutencao, setEquipamentoParaManutencao] = useState<EquipamentosResponse>()

	const { user, toastError, toastSuccess } = useAuth()

	const handleBuscarEquipamentos = useCallback(() => {
		try {
			EquipamentosAPI.listar(user, first + 1).then((data) => {
				setEquipamentos(data)
				setLoading(false)
			}).catch(() => {
				setLoading(false)
			})

		} catch (e: any) {
			setLoading(false)
			showToast(
				`error`,
				e.message ? e.message : `Não foi possível carregar os dados`,
			)
		}
	}, [user, first])

	const onPageChange = (event: { first: number }) => {
		setFirst(event.first)
	}

	const toast = useRef<Toast>(null)
	const showToast = (severity: ToastMessage[`severity`], message: string) => {
		toast.current?.show({
			severity: severity,
			detail: message,
		})
	}

	useEffect(() => {
		handleBuscarEquipamentos()
	}, [handleBuscarEquipamentos])

	const refreshTable = (success: boolean) => {
		setVisible(false)
		if (success) {
			setLoading(true)
			handleBuscarEquipamentos()
		}
	}

	const editEquipamento = (equipamento: EquipamentosResponse) => {
		setEquipamentoEdit(equipamento)
		setTimeout(() => {
			setVisible(true)
		}, 300)
	}

	const deleteEquipamento = (equipamento: EquipamentosResponse) => {
		EquipamentosAPI.excluir(user, equipamento).then(() => {
			refreshTable(true)
			setVisibleModalDelete(false)
			toastSuccess(`Equipamento excluído!`)
		}).catch((e) => {
			toastError(e.message, false)
			setVisibleModalDelete(false)
		})
	}

	const situacaoTemplate = (equipamento: EquipamentosResponse) => {
		if (equipamento.ativo) {
			return `Habilitado`
		} else {
			return `Desabilitado`
		}
	}

	const finalizarManutencao = (idequipamento: number) => {
		EquipamentosAPI.finalizarManutencoesPorEquipamento(user, idequipamento).then(() => {
			setVisibleModalFinalizarManutencao(false)
			toastSuccess(`Manutenção finalizada.`)
			refreshTable(true)
		}).catch((e: any) => {
			setVisibleModalFinalizarManutencao(false)
			toastError(e.message, false)
		})
	}

	return {
		visible, setVisible,
		user,
		loading,
		equipamentos,
		equipamentoEdit,
		setEquipamentoEdit,
		excluirEquipamento,
		setExcluirEquipamento,
		visibleModalDelete,
		setVisibleModalDelete,
		onPageChange,
		toast,
		refreshTable,
		first,
		editEquipamento,
		deleteEquipamento,
		situacaoTemplate,
		equipamento, setEquipamento,
		visibleModalManutencao, setVisibleModalManutencao,
		equipamentoParaManutencao, setEquipamentoParaManutencao,
		visibleModalFinalizarManutencao, setVisibleModalFinalizarManutencao,
		finalizarManutencao
	}
}
