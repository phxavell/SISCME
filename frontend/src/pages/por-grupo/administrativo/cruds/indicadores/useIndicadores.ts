import { IndicadoresAPI } from "@/infra/integrations/administrativo/indicadores/indicadores"
import { Indicadores, IndicadoresResponse } from "@/infra/integrations/administrativo/indicadores/types"
import { useAuth } from "@/provider/Auth"
import { useCallback, useEffect, useState } from "react"

export const useIndicadores = () => {
	const [visible, setVisible] = useState(false)
	const [visibleModalView, setVisibleModalView] = useState(false)
	const [visibleModalAssociar, setVisibleModalAssociar] = useState(false)
	const [loading, setLoading] = useState(false)
	const [indicadores, setIndicadores] = useState<Indicadores>()
	const [indicador, setIndicador] = useState<IndicadoresResponse>()
	const [paginaAtual, setPaginaAtual] = useState(0)
	const [visibleModalExcluir, setVisibleModalExcluir] = useState(false)
	const { user, toastError, toastSuccess } = useAuth()

	const listarIndicadores = useCallback(async () => {
		setLoading(true)
		IndicadoresAPI.listar(user, paginaAtual + 1).then((data) => {
			setIndicadores(data)
			setLoading(false)
		}).catch((error) => {
			toastError(error.message, false)
			setLoading(false)
		})
	}, [toastError, user, paginaAtual])

	const excluirIndicadores = (indicador: any) => {
		IndicadoresAPI.excluir(user, indicador?.id).then(() => {
			toastSuccess(`Indicador excluído! \n${indicador?.codigo} | ${indicador?.descricao} | ${indicador?.tipo}`)
			listarIndicadores()
			setIndicador(undefined)
			setVisibleModalExcluir(false)
		}).catch((e) => {
			setVisibleModalExcluir(false)
			setIndicador(undefined)
			toastError(e?.data?.error?.message ?? `Não foi possível excluir o indicador`)
		})
	}

	const onPageChange = (event: { first: number }) => {
		setPaginaAtual(event.first)
	}

	useEffect(() => {
		listarIndicadores()
	}, [listarIndicadores])

	return {
		visible, setVisible,
		visibleModalView, setVisibleModalView,
		loading,
		indicadores,
		paginaAtual, setPaginaAtual,
		onPageChange,
		indicador, setIndicador,
		listarIndicadores,
		visibleModalExcluir, setVisibleModalExcluir,
		visibleModalAssociar, setVisibleModalAssociar,
		excluirIndicadores
	}
}
