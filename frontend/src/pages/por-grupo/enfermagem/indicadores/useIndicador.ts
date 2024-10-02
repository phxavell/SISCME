import {IndicadoresAPI} from "@/infra/integrations/enfermagem/indicadores"
import {useAuth} from "@/provider/Auth"
import {PaginatorPageChangeEvent} from "primereact/paginator"
import {useCallback, useEffect, useState} from "react"

export const useIndicador = () => {
	const [loading, setLoading] = useState(false)
	const [first, setFirst] = useState(0)
	const [descricao, setDescricao] = useState(``)
	const [visible, setVisible] = useState(false)
	const [visibleModalVisualizar, setVisibleModalVisualizar] = useState(false)
	const [visibleModalDeletar, setVisibleModalDeletar] = useState(false)
	const [indicadores, setIndicadores] = useState<any>()
	const [indicador, setIndicador] = useState()

	const {user, toastError} = useAuth()

	const handleBuscarIndicadores = useCallback(() => {
		if (user) {
			if (descricao) {
				setLoading(true)
				IndicadoresAPI.pesquisarIndicador(user, first + 1, descricao).then((data) => {
					setIndicadores(data)
					setLoading(false)
				}).catch(() => {
					setLoading(false)
				})
			} else {

				setLoading(true)
				IndicadoresAPI.listar(user, first + 1).then((data) => {
					setIndicadores(data)
					setLoading(false)
				}).catch(() => {
					setLoading(false)
				})

			}
		}
	}, [user, first, descricao])

	const onPageChange = (event: PaginatorPageChangeEvent) => {
		setFirst(event.first)
	}

	const refreshTable = (success: boolean) => {
		setVisible(false)
		if (success) {
			setLoading(true)
			handleBuscarIndicadores()
		}
	}

	const deleteIndicador = (indicador: any) => {
		IndicadoresAPI.excluir(user, indicador.id).then(() => {
			refreshTable(true)
			setVisibleModalDeletar(false)
		}).catch((e) => {
			toastError(e.message, false)
			setVisibleModalDeletar(false)
		})
	}

	useEffect(() => {
		handleBuscarIndicadores()
	}, [handleBuscarIndicadores])

	return {
		loading,
		first, setFirst,
		descricao, setDescricao,
		visible, setVisible,
		indicadores, setIndicadores,
		indicador, setIndicador,
		visibleModalVisualizar, setVisibleModalVisualizar,
		onPageChange,
		refreshTable,
		visibleModalDeletar, setVisibleModalDeletar,
		user,
		deleteIndicador
	}

}
