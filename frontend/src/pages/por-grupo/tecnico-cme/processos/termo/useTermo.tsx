import { EsterilizacaoPesquisaAPI, RecebimentosPropsData } from "@/infra/integrations/esterilizacao-pesquisa"
import { useAuth } from "@/provider/Auth"
import { useCallback, useEffect, useState } from "react"

export const useTermo = () => {
	const {
		user,
		toastError,
	} = useAuth()
	const [loading, setLoading] = useState(true)
	const [caixas, setCaixas] = useState<RecebimentosPropsData | undefined>(undefined)
	const [paginaAtual, setPaginaAtual] = useState(0)
	const [showModal, setShowModal] = useState(false)
	const onPageChange = (event: { first: number }) => {
		setPaginaAtual(event.first)
	}
	const refreshTable = useCallback( () => {
		setLoading(true)
		EsterilizacaoPesquisaAPI.listarRecebimentos(user, {page:paginaAtual+1, abortadas:true}).then((data) => {
			setCaixas(data)
			setLoading(false)
		}
		).catch((error) => {
			toastError(error.message ?? `Não foi possível carregar os dados`)
			setLoading(false)
		})
	}, [user, toastError, paginaAtual])

	useEffect(() => {
		refreshTable()
	}, [refreshTable])
	return {
		caixas,
		paginaAtual,
		refreshTable,
		loading,
		onPageChange,
		showModal, setShowModal,
	}
}
