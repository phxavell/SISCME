import * as FileSaver from 'file-saver'
import moment from 'moment'
import * as XLSX from 'xlsx'

export const useExports = ({ data }: any) => {
	const today = new Date()
	const titulo = `Relatório de Manutenções`

	const exportODS = () => {
		const dataToExport = data?.equipamentos.map((row:any) => ({
			Id: row.equipamento_id,
			Equipamento: row.nome,
			Manutencoes_Planejadas: row.manutencoes_previstas,
			Manutencoes_Realizadas: row.manutencoes_realizadas
		}))

		const ws = XLSX.utils.json_to_sheet(dataToExport)
		const wb = XLSX.utils.book_new()
		XLSX.utils.book_append_sheet(wb, ws, titulo)

		XLSX.writeFile(wb, `data.ods`, {bookType: `ods`})
	}

	const exportCSV = () => {
		const dataToExport = data?.por_equipamento.map((row: any) => {
			return ({
				Id: row.equipamento_id,
				Equipamento: row.nome,
				Manutencoes_Planejadas: row.manutencoes_previstas,
				Manutencoes_Realizadas: row.manutencoes_realizadas
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
		if (data?.por_equipamento.length > 0) {
			const columnHeadersMap = {
				id: `#`,
				equipamento: `Equipamento`,
				manutencoes_realizadas: `Manutenções Realizadas`,
				manutencoes_planejadas: `Manutenções Planejadas`
			}

			const dataHojeFormatada = moment(today).format(`DD-MM-YYYY`)

			const worksheetData = data?.por_equipamento.map((dado: any) => ({
				[columnHeadersMap.id]: dado.idequipamento,
				[columnHeadersMap.equipamento]: dado.equipamento,
				[columnHeadersMap.manutencoes_planejadas]: dado.manutencoes_previstas,
				[columnHeadersMap.manutencoes_realizadas]: dado.manutencoes_realizadas,
			}))

			const worksheet = XLSX.utils.json_to_sheet(worksheetData)

			const sheetName = `Manutenções ${dataHojeFormatada}`

			const workbook = {
				Sheets: {[sheetName]: worksheet},
				SheetNames: [sheetName],
			}
			const excelBuffer = XLSX.write(workbook, {
				bookType: `xlsx`,
				type: `array`
			})

			saveAsExcelFile(excelBuffer, `Manutenções ${dataHojeFormatada}`)
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
