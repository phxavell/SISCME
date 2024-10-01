import { useAuth } from "@/provider/Auth"
import { useDebounce } from "primereact/hooks"
import { useCallback, useEffect, useMemo, useState } from "react"
import { debounceTime } from "../../tecnico-cme/processos/esterilizacao/PesquisarEsterilizacao/usePesquisarEsterilizacao"
import moment from "moment"
import { RelatorioEficienciaAPI } from "@/infra/integrations/gerente/relatorios-eficiencia"
import { EquipamentosAPI } from "@/infra/integrations/administrativo/equipamentos"
import { Equipamentos, EquipamentosResponse } from "@/infra/integrations/administrativo/types-equipamentos"

export const useRelatoriosEficiencia = () => {
	const [dados, setDados] = useState<any>({})
	const [loading, setLoading] = useState(false)
	const [dateInterval, dateIntervalDebounce, setDateInterval] = useDebounce(undefined, debounceTime)
	const [equipamentos, setEquipamentos]  = useState<Equipamentos>()
	const [equipamento, setEquipamento]  = useState()
	const [tipoDado, setTipoDado] = useState(`autoclave`)

	const { user, toastError  } = useAuth()

	const optionsTipoDeDados = [
		{name: `Autoclave`, value: `autoclave`},
		{name: `Termodesinfecção`, value: `termodesinfeccao`}
	]

	const handleBuscarEquipamentos = useCallback(() => {
		try {
			EquipamentosAPI.listar(user).then(data => {
				setEquipamentos(data)
				setLoading(false)
			})

		} catch (e: any) {
			setLoading(false)
			toastError(e.message ? e.message : `Não foi possível carregar os dados`, false)
		}
	}, [user, toastError])

	const equipamentosPorTipoAutoclave = equipamentos?.data?.filter((equipamento: EquipamentosResponse) => equipamento.tipo.valor == `Autoclave`)
	const equipamentosPorTipoTermo = equipamentos?.data?.filter((equipamento: EquipamentosResponse) => equipamento.tipo.valor == `Termodesinfectora`)

	const equipamentosDropdown = useCallback(() => {
		if(tipoDado == `autoclave`) {
			return equipamentosPorTipoAutoclave?.map((equipamento: any) => ({
				label: equipamento?.descricao,
				value: equipamento?.idequipamento
			}))

		} else {
			return equipamentosPorTipoTermo?.map((equipamento: any) => ({
				label: equipamento?.descricao,
				value: equipamento?.idequipamento
			}))
		}
	}, [equipamentosPorTipoAutoclave, equipamentosPorTipoTermo, tipoDado])

	const paramsMemo = useMemo(() => {
		const params:any = {
		}
		if(dateIntervalDebounce) {
			params.data_de = moment(dateIntervalDebounce[0]).format(`YYYY-MM-DD HH:mm`)
			if(dateIntervalDebounce[1]) {
				params.data_ate = moment(dateIntervalDebounce[1]).format(`YYYY-MM-DD`) + ` 23:59`
			}
		} else {
			params.data_de = moment().startOf(`month`).format(`YYYY-MM-DD HH:mm`)
			params.data_ate = moment().endOf(`month`).format(`YYYY-MM-DD HH:mm`)
		}
		if(equipamento) {
			for (const [key, value] of Object.entries(equipamento)) {
				params[`equipamento_${key}`] = value
			}
		}

		return params
	}, [equipamento, dateIntervalDebounce])

	const clearFilters = () => {
		setDateInterval(undefined)
		setEquipamento(undefined)
	}

	const handleBuscarRelatorios = useCallback( () => {
		setLoading(true)
		if(tipoDado == `autoclave`) {
			RelatorioEficienciaAPI.listarRelatoriosAutoclave(user, paramsMemo).then((resposta) => {
				setLoading(false)
				setDados(resposta)
			}).catch((error) => {
				setLoading(false)
				toastError(error,false)
			})

		} else {
			RelatorioEficienciaAPI.listarRelatoriosTermo(user, paramsMemo).then((resposta) => {
				setLoading(false)
				setDados(resposta)
			}).catch((error) => {
				setLoading(false)
				toastError(error,false)
			})
		}
	}, [user, paramsMemo, toastError, tipoDado])

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
		handleBuscarEquipamentos()
	}, [handleBuscarRelatorios, handleBuscarEquipamentos])
	return {
		loading,
		clearFilters,
		dados,
		dateInterval, setDateInterval,
		equipamentosDropdown,
		equipamento, setEquipamento,
		handleSetSevenDays,
		handleSetThirtyDays,
		tipoDado, setTipoDado,
		optionsTipoDeDados
	}
}
