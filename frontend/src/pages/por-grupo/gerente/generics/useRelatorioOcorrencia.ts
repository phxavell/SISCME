import { RelatoriosGerenciaisAPI } from "@/infra/integrations/gerente/relatorio-ocorrencias"
import { useAuth } from "@/provider/Auth"
import { useDebounce } from "primereact/hooks"
import { useCallback, useEffect, useMemo, useState } from "react"
import moment from "moment"
import { IndicadoresAPI } from "@/infra/integrations/enfermagem/indicadores"

export const debounceTime = 700
export const useRelatorioOcorrencia = () => {
	const [loading, setLoading] = useState(false)
	const [relatorios, setRelatorios] = useState<any>([])
	const [dateInterval, dateIntervalDebounce, setDateInterval] = useDebounce(undefined, debounceTime)
	const {user, toastError} = useAuth()
	const [cliente, setCliente] = useState<any>()
	const [indicador, setIndicador] = useState()
	const [first, setFirst] = useState(0)
	const [descricao, setDescricao] = useState(``)
	const [indicadores, setIndicadores] = useState<any>()


	const handleBuscarIndicadores = useCallback(async () => {
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
				try {
					setLoading(true)
					const data = await IndicadoresAPI.listar(user, first + 1)
					setIndicadores(data)
					setLoading(false)
				} catch (error) {
					setLoading(false)
				}
			}
		}
	}, [user, first, descricao])


	const paramsMemo = useMemo(()=>{
		const params:any = {
		}
		if(dateIntervalDebounce) {
			params.data_de = moment(dateIntervalDebounce[0]).format(`YYYY-MM-DD`) + `00:00`
			if(dateIntervalDebounce[1]) {
				params.data_ate = moment(dateIntervalDebounce[1]).format(`YYYY-MM-DD`) + ` 23:59`
			}
		} else {
			params.data_de = moment().subtract(1, `months`).startOf(`month`).format(`YYYY-MM-DD`)
			params.data_ate = moment().subtract(1, `months`).endOf(`month`).format(`YYYY-MM-DD`)
		}
		if(cliente) {
			for (const [key, value] of Object.entries(cliente)) {
				params[`cliente_${key}`] = value
			}
		}

		if(indicador) {
			params.tipo = indicador
		}

		return params
	}, [cliente, dateIntervalDebounce, indicador])

	const clearFilters = () => {
		setCliente(undefined)
		setDateInterval(undefined)
		setIndicador(undefined)
	}

	const handleBuscarRelatorios = useCallback(() => {
		setLoading(true)
		RelatoriosGerenciaisAPI.listarOcorrencias(user, paramsMemo).then((resposta) => {
			setLoading(false)
			setRelatorios(resposta)
		}).catch((error) => {
			setLoading(false)
			toastError(error,false)
		})
	}, [user, paramsMemo, toastError])


	useEffect(() => {
		handleBuscarRelatorios(),
		handleBuscarIndicadores()
	}, [handleBuscarIndicadores, handleBuscarRelatorios])

	return {
		loading,
		relatorios,
		clearFilters,
		cliente, setCliente,
		dateInterval, setDateInterval,
		indicadores, setIndicadores,
		descricao, setDescricao,
		indicador, setIndicador,
		setFirst, first
	}

}
