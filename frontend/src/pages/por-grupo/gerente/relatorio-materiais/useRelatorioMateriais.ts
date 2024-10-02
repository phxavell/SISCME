import { useAuth } from "@/provider/Auth"
import { useDebounce } from "primereact/hooks"
import { useCallback, useEffect, useMemo, useState } from "react"
import { debounceTime } from "../../tecnico-cme/processos/esterilizacao/PesquisarEsterilizacao/usePesquisarEsterilizacao"
import moment from "moment"
import { RelatorioMateriaisAPI } from "@/infra/integrations/gerente/relatorios-materiais"

export const useRelatoriosMateriais = () => {
	const [dados, setDados] = useState<any>({})
	const [loading, setLoading] = useState(false)
	const [dateInterval, dateIntervalDebounce, setDateInterval] = useDebounce(undefined, debounceTime)
	const [tipoEtiqueta, setTipoEtiqueta]  = useState()
	const [turno, setTurno] = useState(`todos`)

	const { user, toastError  } = useAuth()

	const paramsMemo = useMemo(() => {
		const params:any = {
		}
		if(dateIntervalDebounce) {
			params.data_de = moment(dateIntervalDebounce[0]).format(`YYYY-MM-DD`) + ` 00:00`
			if(dateIntervalDebounce[1]) {
				params.data_ate = moment(dateIntervalDebounce[1]).format(`YYYY-MM-DD`) + ` 23:59`
			}
		} else {
			params.data_de = moment().startOf(`month`).format(`YYYY-MM-DD`)
			params.data_ate = moment().endOf(`month`).format(`YYYY-MM-DD`)
		}
		if(tipoEtiqueta) {
			for (const [key, value] of Object.entries(tipoEtiqueta)) {
				params[`tipomaterial_${key}`] = value
			}
		}

		return params
	}, [tipoEtiqueta, dateIntervalDebounce])

	const clearFilters = () => {
		setDateInterval(undefined)
		setTipoEtiqueta(undefined)
		setTurno(`todos`)
	}

	const handleBuscarRelatorios = useCallback( () => {
		setLoading(true)
		RelatorioMateriaisAPI.listarRelatorios(user, paramsMemo).then((resposta) => {
			setLoading(false)
			setDados(resposta)
		}).catch((error) => {
			setLoading(false)
			toastError(error,false)
		})
	}, [user, paramsMemo, toastError])

	const handleSetSevenDays = () => {
		const date = new Date()
		const sevenDaysAgo = new Date(date.setDate(date.getDate() - 7))
		setDateInterval([sevenDaysAgo, new Date()])
	}

	const handleSetThirtyDays = () => {
		const date = new Date()
		const thirtyDaysAgo = new Date(date.setDate(date.getDate() - 30))
		setDateInterval([thirtyDaysAgo, new Date()])
	}

	useEffect(() => {
		handleBuscarRelatorios()
	}, [handleBuscarRelatorios])
	return {
		loading,
		clearFilters,
		dados,
		dateInterval, setDateInterval,
		tipoEtiqueta, setTipoEtiqueta,
		handleSetSevenDays,
		handleSetThirtyDays,
		turno, setTurno
	}
}
