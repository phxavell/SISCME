import {useAuth} from "@/provider/Auth"
import moment from "moment"
import {useCallback, useEffect, useMemo, useState} from "react"
import {useForm} from "react-hook-form"
import {TPesquisarCaixasEsterilizacao} from "../modal-esterilizacao/schemas"
import {EsterilizacaoAPI} from "@infra/integrations/processo/esterilizacao.ts"
import {RespostaAPI} from "@/infra/integrations/types"
import {IFEsterilizacao} from "@/infra/integrations/processo/types"
import { useDebounce } from "primereact/hooks"
import { DadosPdfEtiquetaEsterilizacao } from "./modal-etiqueta-esterilizacao"

export const debounceTime = 700
export const usePesquisarEsterilizacao = () => {
	const [esterilizacaoView, setEsterilizacaoView] = useState<any>(undefined)
	const [esterilizacaoFiltro, setEsterilizacaoFiltro] = useState<RespostaAPI<IFEsterilizacao> | undefined>(undefined)
	const { user, toastSuccess,toastError } = useAuth()
	const [paginaAtual, setPaginaAtual] = useState(0)
	const [fromDate, fromDateDebounce, setFromDate] = useDebounce(undefined, debounceTime)
	const [toDate, toDateDebounce, setToDate] = useDebounce(undefined, debounceTime)
	const [ciclo, setCiclo] = useState<any>(undefined)
	const [serial,serialDebounce, setSerial] = useDebounce(``, debounceTime)
	const [status, setStatus] = useState<any>(undefined)
	const [selectEsterilizacao, setSelectEsterilizacao] = useState<any>(undefined)
	const [loading, setLoading] = useState(true)
	const [salvando] = useState(false)
	const [acionandoAcao, setAcionandoAcao] = useState(false)
	const [dadosEtiqueta, setDadosEtiqueta] = useState<DadosPdfEtiquetaEsterilizacao | undefined>(undefined)
	const [showModalEtiqueta, setShowModalEtiqueta] = useState<boolean>(false)
	const [successEsterilizacao, setSucessEsterilizacao] = useState<boolean>(false)

	const onPageChange = (event: { first: number }) => {
		setPaginaAtual(event.first)
	}
	const [formOptions, setFormOptions] = useState<any>(undefined)
	const formOptionsEsterilizacao = useCallback( () => {
		EsterilizacaoAPI.listarStatus(user).then((data) => {
			setFormOptions(data)
		}).catch((error) => {
			toastError(error.message, false)
		})
	}, [user, toastError])

	const {
		control,
		register,
	} = useForm<TPesquisarCaixasEsterilizacao>({
		defaultValues: {
			ciclo: ``,
			serial: ``,
			situacao_atual: ``,
			data_de: ``,
			data_ate: ``,
		}
	})

	const paramsMemo = useMemo(()=>{
		const params:any = {
			ciclo: ciclo === undefined ? `` : ciclo,
			serial: serialDebounce === undefined ? `` : serialDebounce,
			situacao_atual: status === undefined ? `` : status.id,
			page: paginaAtual + 1
		}

		if(fromDateDebounce) {
			params.data_de = moment(fromDateDebounce).format(`YYYY-MM-DD HH:mm`)
		}
		if(toDateDebounce) {
			params.data_ate = moment(toDateDebounce).format(`YYYY-MM-DD HH:mm`)
		}
		return params

	}, [fromDateDebounce, toDateDebounce, ciclo, serialDebounce, status, paginaAtual])

	const clearInputsFiltros = () => {
		setCiclo(undefined)
		setStatus(undefined)
		setSerial(``)
		setPaginaAtual(0)
		setFromDate(undefined)
		setToDate(undefined)
	}
	const viewEsterilizacao = useCallback(async (id: number) => {
		EsterilizacaoAPI.view(user, id).then((data) => {
			setEsterilizacaoView(data)
		}
		).catch((error) => {
			toastError(error.message,false)
		})
	}
	, [user, toastError])

	const listarCaixasEsterilizacao = useCallback( () => {
		setLoading(true)
		EsterilizacaoAPI.listarCaixasFiltro(user, paramsMemo).then((data) => {
			setEsterilizacaoFiltro(data)
			setLoading(false)
		}
		).catch((error) => {
			toastError(error.message, false)
			setLoading(false)
		})

	}, [user, paramsMemo, toastError])

	const abortarStatus = useCallback( (id: number) => {
		setLoading(true)
		EsterilizacaoAPI.abortar(user, id).then(() => {
			setLoading(false)
			toastSuccess(`Ciclo abortado com sucesso!`)
			listarCaixasEsterilizacao()
		}
		).catch((error) => {
			setLoading(false)
			toastError(error, false)
		})
	}, [user, toastSuccess, listarCaixasEsterilizacao, toastError])

	const generateEtiquetasEsterilizacao = useCallback(async(id: number) => {
		const response = await EsterilizacaoAPI.buscarDadosEtiquetaPdf(user, id)

		if (response) {
			setDadosEtiqueta({
				cliente: response.itens_por_cliente[0].cliente,
				equipamento: response.equipamento,
				ciclo: response.ciclo,
				itens: response.itens_por_cliente[0].itens
			})
			setSucessEsterilizacao(true)
			setShowModalEtiqueta(true)
		} else {
			toastError(`Não foi possivel buscar os dados`)
		}

	}, [toastError, user])

	const finalizarStatus = useCallback(async (id: number) => {
		setAcionandoAcao(true)
		EsterilizacaoAPI.finalizar(user, id).then(() => {
			setAcionandoAcao(false)
			generateEtiquetasEsterilizacao(id)
			listarCaixasEsterilizacao()
		}
		).catch((error) => {
			setAcionandoAcao(false)
			toastError(error.message, false)
		})
	}, [user, toastSuccess, listarCaixasEsterilizacao, toastError, generateEtiquetasEsterilizacao])



	useEffect(() => {
		listarCaixasEsterilizacao()
	}, [listarCaixasEsterilizacao])

	useEffect(() => {
		formOptionsEsterilizacao()
	}, [formOptionsEsterilizacao])

	return {
		formOptions,
		esterilizacaoFiltro,
		toastSuccess, toastError,
		paginaAtual, setPaginaAtual,
		onPageChange,
		fromDate, setFromDate,
		toDate, setToDate,
		loading, salvando,
		ciclo, setCiclo,
		serial, setSerial,
		status, setStatus,
		selectEsterilizacao,
		setSelectEsterilizacao,
		abortarStatus,
		finalizarStatus,
		control, register,
		viewEsterilizacao, esterilizacaoView, setEsterilizacaoView,
		acionandoAcao, setAcionandoAcao,
		serialDebounce,
		listarCaixasEsterilizacao, clearInputsFiltros,
		showModalEtiqueta, setShowModalEtiqueta,
		generateEtiquetasEsterilizacao, dadosEtiqueta,
		successEsterilizacao, setSucessEsterilizacao
	}
}
