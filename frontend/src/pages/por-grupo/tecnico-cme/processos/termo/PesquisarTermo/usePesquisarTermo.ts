import {EsterilizacaoPesquisaAPI, TermoPropsData} from "@/infra/integrations/esterilizacao-pesquisa"
import {useAuth} from "@/provider/Auth"
import moment from "moment"
import {useCallback, useEffect, useMemo, useState} from "react"
import { useDebounce } from "primereact/hooks"


export const debounceTime = 700
export const usePesquisarTermo = () => {
	const {user, toastError, toastSuccess} = useAuth()


	const [termoView, setTermoView] = useState<any>(undefined)
	const [acionandoAcao, setAcionandoAcao] = useState(false)
	const [termo, setTermo] = useState<TermoPropsData | undefined>(undefined)
	const [paginaAtual, setPaginaAtual] = useState(0)
	const [fromDate, setFromDate] = useState<Date | any>(undefined)
	const [toDate, setToDate] = useState<Date | any>(undefined)
	const [ciclo, setCiclo] = useState<any>(``)
	const [serial,serialDebounce, setSerial] = useDebounce(``, debounceTime)
	const [status, setStatus] = useState<any>([])
	const [listStatus, setListStatus] = useState<any>([])
	const [equipamentos, setEquipamentos] = useState<any>([])
	const [statusInicial, setStatusInicial] = useState<any>(null)
	const [statusFinal, setStatusFinal] = useState<any>(null)
	const [selectTermo, setSelectTermo] = useState<any>(null)
	const [equipamentoSelecionado, setEquipamentoSelecionado] = useState<any>([])
	const [statusSelecionado, setStatusSelecionado] = useState<any>([])
	const [statusSelecionadoFinal, setStatusSelecionadoFinal] = useState<any>([])
	const [loading, setLoading] = useState(true)
	const [salvando] = useState(false)
	const [pesquisando, setPesquisando] = useState(false)


	const setEquipamentoSelecionadoFunc = (e: any) => {
		setEquipamentoSelecionado(e)
	}

	const setStatusSelecionadoFunc = (e: any) => {
		setStatusSelecionado(e)
	}

	const setStatusSelecionadoFinalFunc = (e: any) => {
		setStatusSelecionadoFinal(e)
	}

	const onPageChange = (event: { first: number }) => {
		setPaginaAtual(event.first)
	}

	const search = () => {
		if (pesquisando) {
			setPaginaAtual(0)
		}
		setPesquisando(pesquisando ?? true)
	}

	const viewTermo = useCallback(async (id: number) => {
		EsterilizacaoPesquisaAPI.view(user, id).then((data) => {
			setTermoView(data)
		}
		).catch((error) => {
			toastError(error.message,false)
		})
	}
	, [user, toastError])

	const paramsMemo = useMemo(() => {
		const params: any = {
			data_de: fromDate === null ? `` : fromDate,
			data_ate: toDate === null ? `` : toDate,
			ciclo: ciclo === null ? `` : ciclo,
			serial: serialDebounce === null ? `` : serialDebounce,
			situacao_atual: status.id === null ? `` : status.id,
			page: paginaAtual + 1
		}

		if (fromDate) {
			params.data_inicial = moment(fromDate).format(`YYYY-MM-DD HH:mm`)
		}
		if (toDate) {
			params.data_final = moment(toDate).format(`YYYY-MM-DD HH:mm`)
		}
		return params
	}, [ciclo, serialDebounce, status, paginaAtual, fromDate, toDate])
	const clearInputsPesquisa = () => {
		setToDate(undefined)
		setFromDate(undefined)
		setCiclo(``)
		setSerial(``)
		setStatus([])
	}
	const listarEquipamentos = useCallback(() => {
		EsterilizacaoPesquisaAPI.formOptions(user).then((data) => {
			setEquipamentos(data.data.equipamentos)
			setListStatus(data.data.status)
		}
		).catch((error) => {
			toastError(error.message, false)
		}
		)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user])

	const filtrarTermo = useCallback(() => {
		setLoading(true)
		EsterilizacaoPesquisaAPI.listarCaixasTermo(user, paramsMemo).then((data) => {
			setTermo(data)
			setLoading(false)
		}
		).catch((error) => {
			toastError(error.message, false)
			setLoading(false)
		}
		)
	}, [user, paramsMemo, toastError])

	const enviarStatusTermo = useCallback((body: any) => {
		EsterilizacaoPesquisaAPI.enviarStatusTermo(user, body).then((data) => {
			setTermo(data)
			setAcionandoAcao(false)
		}
		).catch((error) => {
			toastError(error.message)
			setAcionandoAcao(false)
		})
	}, [user, toastError])

	const abortarStatus = useCallback((id: number) => {
		EsterilizacaoPesquisaAPI.abortar(user, id).then(() => {
			toastSuccess(`Ciclo abortado com sucesso!`)
			filtrarTermo()
			setAcionandoAcao(false)
		}
		).catch((error) => {
			toastError(error.message, false)
			setAcionandoAcao(false)
		})
	}, [user, toastError, toastSuccess, filtrarTermo])

	const finalizarStatus = useCallback(async (id: number) => {
		EsterilizacaoPesquisaAPI.finalizar(user, id).then(() => {
			toastSuccess(`Ciclo finalizado com sucesso!`)
			filtrarTermo()
			setAcionandoAcao(false)
		}
		).catch((error) => {
			toastError(error.message, false)
			setAcionandoAcao(false)
		})
	}, [user, toastError, toastSuccess, filtrarTermo])

	useEffect(() => {
		filtrarTermo()
		listarEquipamentos()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [filtrarTermo])

	return {
		paginaAtual, setPaginaAtual, onPageChange,
		termo, setTermo, equipamentos,
		abortarStatus, finalizarStatus,
		fromDate, setFromDate,
		toDate, setToDate,
		loading, salvando,
		ciclo, setCiclo,
		serial, setSerial,
		statusInicial, setStatusInicial,
		statusFinal, setStatusFinal,
		selectTermo, setSelectTermo,
		enviarStatusTermo, filtrarTermo,
		search,
		equipamentoSelecionado, setEquipamentoSelecionadoFunc,
		statusSelecionado, setStatusSelecionadoFunc,
		statusSelecionadoFinal, setStatusSelecionadoFinalFunc,
		acionandoAcao, setAcionandoAcao,
		termoView, setTermoView,
		viewTermo, setStatus,
		status,
		listStatus,
		clearInputsPesquisa
	}


}
