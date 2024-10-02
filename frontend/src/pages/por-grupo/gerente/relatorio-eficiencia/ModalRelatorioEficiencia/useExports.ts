import * as FileSaver from 'file-saver'
import moment from 'moment'
import * as XLSX from 'xlsx'

export const useExports = ({ data }: any) => {
	const today = new Date()
	const titulo = `Relatório de Eficiência`

	const tempoTotalFormatado = (tempoSegundos: any) => {
		const duration = moment.duration(tempoSegundos, `seconds`)
		const dias = Math.floor(duration.asDays())
		const horas = duration.asHours() % 24
		if (duration.asDays() == 1) {
			return `${dias} dia ${Math.floor(horas).toString().padStart(2, `0`)}:${duration.minutes().toString().padStart(2, `0`)}:${duration.seconds().toString().padStart(2, `0`)}s`
		} else if(duration.asDays() > 1) {
			return `${dias} dias ${Math.floor(horas).toString().padStart(2, `0`)}:${duration.minutes().toString().padStart(2, `0`)}:${duration.seconds().toString().padStart(2, `0`)}s`
		} else {
			return `${Math.floor(duration.asHours()).toString().padStart(2, `0`)}:${duration.minutes().toString().padStart(2, `0`)}:${duration.seconds().toString().padStart(2, `0`)}s`
		}
	}

	const exportODS = () => {
		const dataToExport = data?.por_equipamento.map((row:any) => ({
			Equipamento: row.equipamento.name,
			Total_de_ciclos: row.ciclos,
			Ciclos_em_andamento: row.ciclos_em_andamento,
			Ciclos_finalizados: row.ciclos_finalizados,
			Ciclos_abortados: row.ciclos_abortados,
			Tempo_funcionando: tempoTotalFormatado(row.tempo_total),
			Tempo_parado: tempoTotalFormatado(row.tempo_parado)
		}))

		const ws = XLSX.utils.json_to_sheet(dataToExport)
		const wb = XLSX.utils.book_new()
		XLSX.utils.book_append_sheet(wb, ws, titulo)

		XLSX.writeFile(wb, `data.ods`, {bookType: `ods`})
	}

	const exportCSV = () => {
		const dataToExport = data?.por_equipamento.map((row: any) => {
			return ({
				Equipamento: row.equipamento.name,
				Total_de_ciclos: row.ciclos,
				Ciclos_em_andamento: row.ciclos_em_andamento,
				Ciclos_finalizados: row.ciclos_finalizados,
				Ciclos_abortados: row.ciclos_abortados,
				Tempo_funcionando: tempoTotalFormatado(row.tempo_total),
				Tempo_parado: tempoTotalFormatado(row.tempo_parado)
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
				equipamento: `Equipamento`,
				ciclos: `Total de ciclos`,
				ciclos_em_andamento: `Ciclos em andamento`,
				ciclos_finalizados: `Ciclos finalizados`,
				ciclos_abortados: `Ciclos abortados`,
				tempo_funcionando: `Tempo funcionando`,
				tempo_parado: `Tempo Parado`
			}

			const dataHojeFormatada = moment(today).format(`DD-MM-YYYY`)

			const worksheetData = data?.por_equipamento.map((dado: any) => ({
				[columnHeadersMap.equipamento]: dado.equipamento.nome,
				[columnHeadersMap.ciclos]: dado.ciclos,
				[columnHeadersMap.ciclos_em_andamento]: dado.ciclos_em_andamento,
				[columnHeadersMap.ciclos_finalizados]: dado.ciclos_finalizados,
				[columnHeadersMap.ciclos_abortados]: dado.ciclos_abortados,
				[columnHeadersMap.tempo_funcionando]: tempoTotalFormatado(dado.tempo_total),
				[columnHeadersMap.tempo_parado]: tempoTotalFormatado(dado.tempo_parado),
			}))

			const worksheet = XLSX.utils.json_to_sheet(worksheetData)

			const sheetName = `Eficiência ${dataHojeFormatada}`

			const workbook = {
				Sheets: {[sheetName]: worksheet},
				SheetNames: [sheetName],
			}
			const excelBuffer = XLSX.write(workbook, {
				bookType: `xlsx`,
				type: `array`
			})

			saveAsExcelFile(excelBuffer, `Eficiência ${dataHojeFormatada}`)
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
