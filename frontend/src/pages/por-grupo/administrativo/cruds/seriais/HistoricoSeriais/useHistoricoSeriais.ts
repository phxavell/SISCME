import {useAuth} from "@/provider/Auth"
import moment from "moment"
import {useCallback, useEffect, useMemo, useState} from "react"
import { SeriaisAPI } from "@/infra/integrations/caixa/seriais"
import { useParams } from "react-router-dom"
import * as FileSaver from 'file-saver'
import * as XLSX from 'xlsx'

export const useHistoricoSeriais = () => {
	const {user, toastError} = useAuth()
	const { serial } = useParams()

	const [paginaAtual, setPaginaAtual] = useState(0)
	const [fromDate, setFromDate] = useState<Date | any>(undefined)
	const [toDate, setToDate] = useState<Date | any>(undefined)
	const [visible, setVisible] = useState(false)

	const [ciclos, setCiclos] = useState<any>({})

	const [loading, setLoading] = useState(true)
	const [salvando] = useState(false)
	const [pesquisando, setPesquisando] = useState(false)
	const [dadoParaModal, setDadoParaModal] = useState([])

	const [dadosParaPDF, setDadosParaPDF] = useState([])

	const onPageChange = (event: { first: number }) => {
		setPaginaAtual(event.first)
	}

	const search = () => {
		if (pesquisando) {
			setPaginaAtual(0)
		}
		setPesquisando(pesquisando ?? true)
	}

	const paramsMemo = useMemo(() => {
		const params: any = {
			page: paginaAtual + 1,
			serial: serial,
		}

		if (fromDate) {
			params.data_inicial = moment(fromDate).format(`DD/MM/YYYY`)
		}
		if (toDate) {
			params.data_final = moment(toDate).format(`DD/MM/YYYY`)
		}
		return params
	}, [paginaAtual, fromDate, toDate, serial])
	const clearInputsPesquisa = () => {
		setToDate(undefined)
		setFromDate(undefined)
	}
	const listarHistorico = useCallback(() => {
		SeriaisAPI.historicoSeriais(user, paramsMemo).then((data) => {
			setCiclos(data)
			setLoading(false)
		}
		).catch((error) => {
			setCiclos(undefined)
			toastError(error.message, false)
			setLoading(false)
		})
	}, [user, paramsMemo, toastError])

	const listarHistoricoParaPDF = useCallback(() => {
		const data_inicial = () => {
			if(fromDate) {
				return moment(fromDate).format(`DD/MM/YYYY`)
			}
		}
		const data_final = () => {
			if(toDate) {
				return moment(toDate).format(`DD/MM/YYYY`)
			}
		}

		SeriaisAPI.historicoSeriaisParaPDF(user, data_inicial(), data_final(), serial).then((data) => {
			setDadosParaPDF(data?.data)
			setLoading(false)
		}
		).catch(() => {
			setDadosParaPDF([])
			setLoading(false)
		})
	}, [user, fromDate, toDate, serial])

	const exportExcel = () => {
		if (dadosParaPDF?.length > 0) {
			const columnHeadersMap = {
				processo: `PROCESSO`,
				nome: `NOME`,
				data: `DATA`,
			}

			const dataHojeFormatada = moment().format(`DD-MM-YYYY`)
			const formatarData = (data: any) => moment(data).format(`DD/MM/YYYY`)

			const dados = dadosParaPDF?.flatMap((dadoGeral: any) => {
				const worksheetData = dadoGeral?.map((dado: any) => ({
					[columnHeadersMap.processo]: dado.status,
					[columnHeadersMap.nome]: dado.usuario.nome,
					[columnHeadersMap.data]: formatarData(dado.criado_em),
				})).reverse()

				worksheetData.push({})

				return worksheetData
			})

			const worksheet = XLSX.utils.json_to_sheet(dados)

			const sheetName = `${serial} ${dataHojeFormatada}`

			const workbook = {
				Sheets: {[sheetName]: worksheet},
				SheetNames: [sheetName],
			}
			const excelBuffer = XLSX.write(workbook, {
				bookType: `xlsx`,
				type: `array`
			})

			saveAsExcelFile(excelBuffer, `${serial} ${dataHojeFormatada}`)
		}

	}

	const saveAsExcelFile = (buffer: any, fileName: any) => {
		const EXCEL_TYPE = `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8`
		const EXCEL_EXTENSION = `.xlsx`
		const data = new Blob([buffer], {
			type: EXCEL_TYPE
		})

		FileSaver.saveAs(data, fileName + EXCEL_EXTENSION)
	}

	useEffect(() => {
		listarHistorico()
		listarHistoricoParaPDF()
	}, [listarHistorico, listarHistoricoParaPDF])

	return {
		paginaAtual, setPaginaAtual, onPageChange,
		ciclos,
		fromDate, setFromDate,
		toDate, setToDate,
		loading, salvando,
		serial,
		search,
		clearInputsPesquisa,
		visible, setVisible,
		dadoParaModal, setDadoParaModal,
		dadosParaPDF,
		exportExcel
	}


}
