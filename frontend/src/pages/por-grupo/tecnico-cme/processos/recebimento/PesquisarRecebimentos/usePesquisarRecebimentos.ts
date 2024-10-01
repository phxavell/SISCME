import {EsterilizacaoPesquisaAPI, RecebimentosPropsData} from "@/infra/integrations/esterilizacao-pesquisa"
import {useAuth} from "@/provider/Auth"
import moment from "moment"
import {useCallback, useEffect, useMemo, useState} from "react"
import {useDebounce} from "primereact/hooks"
import {RecebimentoAPI} from "@infra/integrations/processo/recebimento/recebimento.ts"
import {IItemRecebimento} from "@infra/integrations/processo/recebimento/types-recebimento.ts"

const debounceTime = 700
export const usePesquisarRecebimentos = () => {

	const {user, toastSuccess, toastError} = useAuth()
	const [recebimentos, setRecebimentos] = useState<RecebimentosPropsData | undefined>(undefined)
	const [paginaAtual, setPaginaAtual] = useState(0)
	const [serial, sequencialDebounce, setSerial] = useDebounce(``, debounceTime)
	const [fromDate, fromDateDebounce, setFromDate] = useDebounce(undefined, debounceTime)
	const [toDate, toDateDebounce, setToDate] = useDebounce(undefined, debounceTime)
	const [loading, setLoading] = useState(false)
	const [pesquisando, setPesquisando] = useState(false)
	const [visibleModalDetails, setVisibleModalDetails] = useState(false)
	const [fotos, setFotos] = useState([])

	const [caixaToPDF, setCaixaToPDF] = useState<any>()
	const [showModal, setShowModal] = useState(false)
	const [baixandoPdf, setBaixandoPdf] = useState(false)
	const [itemSelected, setItemSelected] = useState<any>(undefined)

	const onPageChange = (event: { first: number }) => {
		setPaginaAtual(event.first)
	}
	const search = (pesquisando?: boolean) => {
		if (pesquisando) {
			setPaginaAtual(0)
		} else {
			setSerial(``)
			setFromDate(undefined)
			setToDate(undefined)
		}
		setPesquisando(pesquisando ?? true)
	}

	const handleClickShowPdf = (item: IItemRecebimento) => {
		setBaixandoPdf(true)
		setItemSelected(item)
		RecebimentoAPI.DadosParaPDF(user, item ).then((dadosPdf) => {
			setCaixaToPDF(dadosPdf)
			setShowModal(true)
			setBaixandoPdf(false)
		}).catch(errorMessage => {
			setItemSelected(undefined)
			setBaixandoPdf(false)
			toastError(errorMessage, false)
		})

	}
	const handleCloseModalCaixa = async () => {
		setShowModal(false)
		setItemSelected(undefined)
	}

	const paramsMemo = useMemo(() => {

		const params:any = {
			serial: sequencialDebounce,
			page: paginaAtual + 1
		}
		if(fromDateDebounce){
			params.data_de =  moment(fromDateDebounce).format(`YYYY-MM-DD HH:mm`)
		}
		if(toDateDebounce){
			params.data_ate =  moment(toDateDebounce).format(`YYYY-MM-DD HH:mm`)
		}
		return params

	}, [toDateDebounce, sequencialDebounce,  fromDateDebounce, paginaAtual])

	const listRecebimentos = useCallback(() => {

		if (!pesquisando) {
			setLoading(true)
			EsterilizacaoPesquisaAPI.listarRecebimentos(user, {page: paginaAtual + 1}).then((data) => {
				setRecebimentos(data)
				setLoading(false)
			}
			).catch((error) => {
				toastError(error.message, false)
				setLoading(false)
			})
		}

	}
	, [user, toastError, paginaAtual, pesquisando])

	const filtrarRecebimentos = useCallback(() => {
		if (pesquisando) {
			setLoading(true)
			EsterilizacaoPesquisaAPI.listarRecebimentos(user, paramsMemo).then((data) => {
				setRecebimentos(data)
				setLoading(false)
			}
			).catch((error) => {
				toastError(error.message, false)
				setLoading(false)
			})
		}

	}
	, [user, toastError, pesquisando, paramsMemo])

	useEffect(() => {
		listRecebimentos()
	}, [listRecebimentos])

	useEffect(() => {
		filtrarRecebimentos()
	}, [filtrarRecebimentos])


	return {
		setPaginaAtual,
		recebimentos,
		setRecebimentos,
		toastSuccess,
		toastError,
		first: paginaAtual, setFirst: setPaginaAtual,
		onPageChange,
		search,
		serial, setSerial,
		fromDate, setFromDate,
		toDate, setToDate,
		loading,
		showModal, setShowModal,
		caixaToPDF, setCaixaToPDF,
		handleCloseModalCaixa,
		handleClickShowPdf,
		baixandoPdf,
		itemSelected,
		visibleModalDetails, setVisibleModalDetails,
		fotos, setFotos

	}

}
