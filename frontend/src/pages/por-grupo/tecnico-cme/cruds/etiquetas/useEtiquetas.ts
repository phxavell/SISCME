import {EtiquetaAPI} from "@/infra/integrations/processo/etiquetas"
import { DataEtiqueta, EtiquetaResponse } from "@/infra/integrations/processo/types-etiquetas"
import {useAuth} from "@/provider/Auth"
import moment from "moment"
import {useCallback, useEffect, useRef, useState} from "react"
import {useDebounce} from 'primereact/hooks'
import { Toast } from "primereact/toast"

export const useEtiquetas = () => {
	const [visible, setVisible] = useState(false)
	const [loading, setLoading] = useState(true)
	const [first, setFirst] = useState(0)
	const [dateInitial, debouncedDateInitial, setDateInitial] = useDebounce(null, 500)
	const [dateFinal, debouncedDateFinal, setDateFinal] = useDebounce(null, 500)
	const [codigo, debouncedCodigo, setCodigo] = useDebounce(``, 500)
	const [etiquetas, setEtiquetas] = useState<EtiquetaResponse>()
	const [visibleModalDelete, setVisibleModalDelete] = useState(false)
	const [visibleModalPdf, setVisibleModalPdf] = useState(false)
	const [visibleModalEdicao, setVisibleEdicao] = useState(false)
	const [etiqueta, setEtiqueta] = useState<DataEtiqueta>()
	const [etiquetaEdicao, setEtiquetaEdicao] = useState<DataEtiqueta>()
	const [etiquetaCriada, setEtiquetaCriada] = useState<boolean>(false)
	const today = new Date()
	const toastEtiqueta = useRef<Toast>(null)
	const {user, toastSuccess, toastError} = useAuth()

	const limparFiltro = () => {
		refreshTable()
		setDateInitial(null)
		setDateFinal(null)
		setCodigo(``)
		setFirst(0)
	}
	const handleFecharModalEdicao = () => {
		setVisibleEdicao(false)
		refreshTable()
	}

	const handleEditarEtiqueta = (etiqueta: DataEtiqueta) => {

		setEtiquetaEdicao(etiqueta)

		setVisibleEdicao(true)
	}

	useEffect(()=> {
		let mounted = true
		EtiquetaAPI.getOptions(user,  1).then((data) => {
			if (mounted) {
				setEtiquetas(data)
				setLoading(false)
			}
		}).catch(() => {
			if (mounted) {
				toastError(`Não foi possível baixar dados`, false)
				setLoading(false)
			}
		})
		return () => {
			mounted = false
		}
	}, [toastError, user])

	useEffect(() => {
		let mounted = true
		if (debouncedDateInitial || debouncedDateFinal || debouncedCodigo) {
			const dateInitialFormatada = debouncedDateInitial ? moment(debouncedDateInitial).format(`YYYY-MM-DD`) : ``
			const dateFinalFormatada = debouncedDateFinal ? moment(debouncedDateFinal).format(`YYYY-MM-DD`) : ``
			EtiquetaAPI.buscaEtiquetaFiltro(
				user,
				first + 1,
				dateInitialFormatada,
				dateFinalFormatada,
				debouncedCodigo).then((data) => {
				if(mounted){
					setEtiquetas(data)
					setLoading(false)
				}

			}).catch((e) => {
				if(mounted){
					toastError(e.data ?? `Não foi possível baixar dados`, false)
					setLoading(false)

				}

			})
		}


		return () => {
			mounted = false
		}
	}, [debouncedCodigo, user, first, debouncedDateInitial, debouncedDateFinal, toastError])

	const onPageChange = (event: { first: number }) => {
		setFirst(event.first)
	}

	const filterEtiqueta = () => {

		if (dateInitial || dateFinal || codigo) {
			const dateInitialFormatada = dateInitial ? moment(dateInitial).format(`YYYY-MM-DD`) : ``
			const dateFinalFormatada = dateFinal ? moment(dateFinal).format(`YYYY-MM-DD`) : ``

			EtiquetaAPI.buscaEtiquetaFiltro(user, 1, dateInitialFormatada, dateFinalFormatada, codigo).then((data) => {
				setEtiquetas(data)
				setLoading(false)
			}).catch((e) => {
				toastError(e.data, false)
				setLoading(false)
			})
		} else {
			toastError(`Preencha um dos campos de filtro`, false)
		}
	}

	const refreshTable = useCallback(() => {
		setLoading(true)
		EtiquetaAPI.getOptions(user, first + 1).then((data) => {
			setEtiquetas(data)
			setLoading(false)
		}).catch(() => {
			toastError(`Não foi possível baixar dados!`, false)
			setLoading(false)
		})
	}, [user,first, toastError])

	const excluirEtiqueta = useCallback((etiqueta: DataEtiqueta) => {
		EtiquetaAPI.excluir(user, etiqueta.id).then(() => {
			refreshTable()
			toastSuccess(`Etiqueta excluída com sucesso`)
		}).catch((e) => {
			toastError(e.message ?? `Não foi possível excluir Etiqueta`, false)
		})
	}, [user, toastError, toastSuccess, refreshTable])

	return {
		visible, setVisible, loading, first,
		setFirst, onPageChange, dateInitial, setDateInitial,
		dateFinal, setDateFinal, refreshTable, codigo, setCodigo,
		etiquetas, filterEtiqueta, excluirEtiqueta, visibleModalDelete,
		setVisibleModalDelete, visibleModalPdf, setVisibleModalPdf, visibleModalEdicao,
		etiqueta, setEtiqueta, etiquetaEdicao, setEtiquetaEdicao, etiquetaCriada,
		setEtiquetaCriada, today, toastEtiqueta, limparFiltro, handleFecharModalEdicao,
		handleEditarEtiqueta
	}
}
