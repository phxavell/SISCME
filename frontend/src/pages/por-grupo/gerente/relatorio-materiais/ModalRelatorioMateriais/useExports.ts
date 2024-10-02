import * as FileSaver from 'file-saver'
import moment from 'moment'
import * as XLSX from 'xlsx'

export const useExports = ({ data }: any) => {
	const today = new Date()
	const titulo = `Relatório de Materiais`

	const exportODS = () => {
		const dataToExport = data?.etiquetas_por_tipo_etiqueta.map((row:any) => ({
			Tipo_de_etiqueta: row.tipoetiqueta,
			Quantidade: row.quantidade,
		}))

		const ws = XLSX.utils.json_to_sheet(dataToExport)
		const wb = XLSX.utils.book_new()
		XLSX.utils.book_append_sheet(wb, ws, titulo)

		XLSX.writeFile(wb, `data.ods`, {bookType: `ods`})
	}

	const exportCSV = () => {
		const dataToExport = data?.etiquetas_por_tipo_etiqueta.map((row: any) => {
			return ({
				Tipo_de_etiqueta: row.tipoetiqueta,
				Quantidade: row.quantidade,
			})
		})

		const ws = XLSX.utils.json_to_sheet(dataToExport)
		const csvOutput = XLSX.utils.sheet_to_csv(ws)

		const blob = new Blob([csvOutput], {type: `text/csv;charset=utf-8;`})

		const link = document.createElement(`a`)
		if (link.download !== undefined) {
			const url = URL.createObjectURL(blob)
			link.setAttribute(`href`, url)
			link.setAttribute(`download`, `data.csv`)
			link.style.visibility = `hidden`
			document.body.appendChild(link)
			link.click()
			document.body.removeChild(link)
		}

	}

	const exportExcel = () => {
		if (data?.por_tipo_material.length > 0) {
			const columnHeadersMap = {
				tipoetiqueta: `Tipo de etiqueta`,
				quantidade: `Quantidade`,
			}

			const dataHojeFormatada = moment(today).format(`DD-MM-YYYY`)

			const worksheetData = data?.etiquetas_por_tipo_etiqueta.map((dado: any) => ({
				[columnHeadersMap.tipoetiqueta]: dado.tipoetiqueta,
				[columnHeadersMap.quantidade]: dado.quantidade,
			}))

			const worksheet = XLSX.utils.json_to_sheet(worksheetData)

			const sheetName = `Materiais ${dataHojeFormatada}`

			const workbook = {
				Sheets: {[sheetName]: worksheet},
				SheetNames: [sheetName],
			}
			const excelBuffer = XLSX.write(workbook, {
				bookType: `xlsx`,
				type: `array`
			})

			saveAsExcelFile(excelBuffer, `Materiais ${dataHojeFormatada}`)
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
		exportExcel,
		exportODS,
		exportCSV,
		titulo,
		today
	}
}
