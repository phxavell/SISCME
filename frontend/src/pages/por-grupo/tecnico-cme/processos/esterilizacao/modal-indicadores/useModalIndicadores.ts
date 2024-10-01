import { IndicadoresAPI } from "@/infra/integrations/administrativo/indicadores/indicadores"
import { EsterilizacaoAPI } from "@/infra/integrations/processo/esterilizacao"
import { useAuth } from "@/provider/Auth"
import { useCallback, useEffect, useState } from "react"

export const useModalIndicadores = (values: any, onClose: any) => {
	const { user, toastError, toastSuccess } = useAuth()
	const [indicadores, setIndicadores] = useState()
	const [indicador, setIndicador] = useState()

	const listarIndicadores = useCallback(() => {
		IndicadoresAPI.formOptions(user, `classe 02`).then((data: any) => {
			setIndicadores(data?.data)
		})
	}, [user])

	const handleIniciarEsterilizacaoTeste = useCallback(() => {
		const body = values()
		const payload = {
			...body,
			lote: indicador
		}
		EsterilizacaoAPI.iniciarEsterilizacaoTeste(user, payload).then(() => {
			onClose()
			toastSuccess(`Ciclo de teste iniciado!`)
		}).catch((e) => {
			toastError(e.message ?? `Erro ao enviar ciclo`)
		})
	}, [user, values, indicador, onClose, toastError, toastSuccess])

	useEffect(() => {
		listarIndicadores()
	}, [listarIndicadores])
	return {
		indicadores,
		indicador, setIndicador,
		handleIniciarEsterilizacaoTeste
	}
}
