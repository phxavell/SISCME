import {RelatorioPlantaoAPI, RelatorioPlantaoResponse} from "@/infra/integrations/relatorio-plantao"
import {useAuth} from "@/provider/Auth"
import moment from "moment"
import {Nullable} from "primereact/ts-helpers"
import {useRef, useState} from "react"
import * as FileSaver from 'file-saver'
import * as XLSX from 'xlsx'


export const useRelatorioPlantao = () => {
	const [dataRelatorio, setDataRelatorio] = useState<Nullable<Date>>(null)
	const [listaFiltroRelatorio, setListaFiltroRelatorio] = useState<RelatorioPlantaoResponse[]>([])
	const [visibleModalGrafico, setVisibleModalGrafico] = useState(false)
	const dt = useRef(null)

	const {user, toastError, toastInfor, toastAlert} = useAuth()


	const filterRelatorio = () => {
		if (dataRelatorio) {
			const mes = moment(dataRelatorio).format(`MM`)
			const ano = moment(dataRelatorio).format(`YYYY`)
			RelatorioPlantaoAPI.listTable(user, mes, ano).then((data) => {
				setListaFiltroRelatorio(data)
				if (data.length < 1) {
					toastInfor(`Nenhum dado encontrado neste mês`)
				}
			}).catch(() => {
				toastError(`Falha na busca de dados!`)
			})

		} else {
			toastAlert(`Informe uma data`)
		}
	}

	const mostraGrafico = () => {
		if (listaFiltroRelatorio.length > 0) {
			setVisibleModalGrafico(true)
		}
	}

	const exportExcel = () => {
		if (listaFiltroRelatorio.length > 0) {
			const columnHeadersMap = {
				idprofissional: `ID do Profissional`,
				nome: `Nome do Profissional`,
				quantidade_abertos: `Quantidade Abertos`,
				quantidade_fechados: `Quantidade Fechados`,
				media_duracao: `Média de Duração`,
			}

			const dataRelatorioFormatada = moment(dataRelatorio).format(`MM-YYYY`)

			const worksheet = XLSX.utils.json_to_sheet(listaFiltroRelatorio, {
				header: Object.keys(columnHeadersMap),
			})

			worksheet[`A1`].v = columnHeadersMap[`idprofissional`]
			worksheet[`B1`].v = columnHeadersMap[`nome`]
			worksheet[`C1`].v = columnHeadersMap[`quantidade_abertos`]
			worksheet[`D1`].v = columnHeadersMap[`quantidade_fechados`]
			worksheet[`E1`].v = columnHeadersMap[`media_duracao`]

			const sheetName = `Resumo Plantões ${dataRelatorioFormatada}`

			const workbook = {
				Sheets: {[sheetName]: worksheet},
				SheetNames: [sheetName],
			}
			const excelBuffer = XLSX.write(workbook, {
				bookType: `xlsx`,
				type: `array`
			})

			saveAsExcelFile(excelBuffer, `Resumo Plantões ${dataRelatorioFormatada}`)
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

	return {
		dataRelatorio, setDataRelatorio,
		listaFiltroRelatorio, setListaFiltroRelatorio,
		filterRelatorio,
		visibleModalGrafico, setVisibleModalGrafico,
		mostraGrafico,
		dt,
		exportExcel
	}
}
