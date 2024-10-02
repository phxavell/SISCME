import { useAuth } from "@/provider/Auth"
import { useDebounce } from "primereact/hooks"
import { useCallback, useEffect, useMemo, useState } from "react"
import { debounceTime } from "../../tecnico-cme/processos/esterilizacao/PesquisarEsterilizacao/usePesquisarEsterilizacao"
import moment from "moment"
import { EquipamentosAPI } from "@/infra/integrations/administrativo/equipamentos"
import { Equipamentos } from "@/infra/integrations/administrativo/types-equipamentos"
import { RelatorioManutencoesAPI } from "@/infra/integrations/gerente/relatorios-manutencao"
import { mock_dados } from "./mocks"

export const useRelatorioManutencoes = () => {
	const [dados, setDados] = useState<any>(mock_dados)
	const [loading, setLoading] = useState(false)
	const [dateInterval, dateIntervalDebounce, setDateInterval] = useDebounce(undefined, debounceTime)
	const [equipamentos, setEquipamentos]  = useState<Equipamentos>()
	const [equipamento, setEquipamento]  = useState()

	const { user, toastError  } = useAuth()

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

	const equipamentosDropdown = () => {
		return equipamentos?.data?.map((equipamento: any) => ({
			label: equipamento?.descricao,
			value: equipamento?.idequipamento
		}))
	}

	const paramsMemo = useMemo(() => {
		const exibirData_de = () => {
			if(moment(dateIntervalDebounce[0]).format(`YYYY-MM-DD HH:mm`) == `Data inválida`) {
				return ``
			} else {
				return moment(dateIntervalDebounce[0]).format(`YYYY-MM-DD HH:mm`)
			}
		}

		const exibirData_ate = () => {
			if(moment(dateIntervalDebounce[1]).format(`YYYY-MM-DD HH:mm`) == `Data inválida`) {
				return ``
			} else {
				return moment(dateIntervalDebounce[1]).format(`YYYY-MM-DD HH:mm`)
			}
		}
		const params:any = {
		}
		if(dateIntervalDebounce) {
			params.data_de = exibirData_de()
			params.data_ate = exibirData_ate()
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

		RelatorioManutencoesAPI.listarRelatoriosManutencoes(user, paramsMemo).then((resposta) => {
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
	}
}
