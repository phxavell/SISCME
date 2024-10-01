import { IndicadoresAPI } from "@/infra/integrations/administrativo/indicadores/indicadores"
import { IndicadoresResponse, Lotes } from "@/infra/integrations/administrativo/indicadores/types"
import { useAuth } from "@/provider/Auth"
import { useCallback, useEffect, useState } from "react"

export const useModalView = (indicador: any) => {
	const [visible, setVisible] = useState(false)
	const [visibleModalLote, setVisibleModalLote] = useState(false)
	const [loading, setLoading] = useState(false)
	const [lotes, setLotes] = useState<Lotes>()
	const [lote, setLote] = useState<IndicadoresResponse>()
	const [paginaAtual, setPaginaAtual] = useState(0)
	const [visibleModalExcluir, setVisibleModalExcluir] = useState(false)
	const { user, toastError, toastSuccess } = useAuth()

	const listarLotes = useCallback(async () => {
		setLoading(true)
		IndicadoresAPI.buscarLotes(user, ``, indicador?.id, paginaAtual + 1).then((data) => {
			setLotes(data)
			setLoading(false)
		}).catch((error) => {
			toastError(error.message, false)
			setLoading(false)
		})
	}, [toastError, user, paginaAtual, indicador])

	const onPageChange = (event: { first: number }) => {
		setPaginaAtual(event.first)
	}

	const excluirLotes = (lote: any) => {
		IndicadoresAPI.excluirLote(user, indicador?.id, lote?.id).then(() => {
			toastSuccess(`Lote excluído.`)
			listarLotes()
			setVisibleModalExcluir(false)
		}).catch((e) => {
			setVisibleModalExcluir(false)
			toastError(e?.data?.error?.message ?? `Não foi possível excluir o lote`)
		})
	}

	useEffect(() => {
		if(indicador) {
			listarLotes()

		}
	}, [listarLotes, indicador])

	return {
		visible, setVisible,
		loading,
		lotes,
		paginaAtual, setPaginaAtual,
		onPageChange,
		lote, setLote,
		listarLotes,
		visibleModalLote, setVisibleModalLote,
		visibleModalExcluir, setVisibleModalExcluir,
		excluirLotes
	}
}
