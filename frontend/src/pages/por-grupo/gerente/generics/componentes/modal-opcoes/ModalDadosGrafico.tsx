import React, { useMemo, useRef } from 'react'
import { Dialog } from 'primereact/dialog'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { rowClassName } from '@/components/RowTemplate'
import { headerTableStyle } from '@/util/styles'
import { IHospitalData, IModalDadosGrafico } from '../grafico/types'
import { Button } from 'primereact/button'
import * as XLSX from 'xlsx'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { RelatorioOcorrenciasPDF } from '@/components/pdf-templates/RelatorioOcorrencias'
import { SplitButton } from 'primereact/splitbutton'
import { BsFiletypeCsv } from 'react-icons/bs'

export const ModalDadosGrafico: React.FC<IModalDadosGrafico & { dateInterval: Date[]; selectedClientes: number[]; clientesDropdown: {label: string, value: number}[]; titulo: string}> = (props) => {
	const { data, titulo} = props
	const hospitalData = useMemo(() => {
		const rows: IHospitalData[] = []

		if (data && data.clientes) {
			Object.entries(data.clientes).forEach(([hospitalName, clientData]) => {
				data.tipos.forEach(tipo => {
					if (clientData.tipos[tipo.tipo]) {
						rows.push({
							hospitalName,
							quantidade: clientData.tipos[tipo.tipo],
							tipo: tipo.tipo,
						})
					}
				})
			})
		}

		return rows
	}, [data])

	const formatDate = (date: Date) => {
		  const day = date.getDate().toString().padStart(2, `0`)
		  const month = (date.getMonth() + 1).toString().padStart(2, `0`)
		  const year = date.getFullYear()
		  return `${day}/${month}/${year}`
	}

	const exportCSVUsingXLSX = () => {
		const dataToExport = hospitalData.map(row => ({
			Hospital: row.hospitalName,
			Quantidade: row.quantidade,
			Tipo: row.tipo
		}))

		const ws = XLSX.utils.json_to_sheet(dataToExport)
		const csvOutput = XLSX.utils.sheet_to_csv(ws)

		const blob = new Blob([csvOutput], {type: `text/csv;charset=utf-8;`})

		const link = document.createElement(`a`)
		if (link.download !== undefined) {
			const url = URL.createObjectURL(blob)
			link.setAttribute(`href`, url)
			link.setAttribute(`download`, `${titulo}_${formatDate(new Date())}.csv`)
			link.style.visibility = `hidden`
			document.body.appendChild(link)
			link.click()
			document.body.removeChild(link)
		}

	}

	const exportExcel = () => {
		const dataToExport = hospitalData.map(row => ({
			Hospital: row.hospitalName,
			Quantidade: row.quantidade,
			Tipo: row.tipo
		}))

		const ws = XLSX.utils.json_to_sheet(dataToExport)

		const wb = XLSX.utils.book_new()
		XLSX.utils.book_append_sheet(wb, ws, titulo)

		const fileName = `${titulo}_${formatDate(new Date())}.xlsx`

		XLSX.writeFile(wb, fileName)
	}

	const exportODS = () => {
		const dataToExport = hospitalData.map(row => ({
			Hospital: row.hospitalName,
			Quantidade: row.quantidade,
			Tipo: row.tipo
		}))

		const ws = XLSX.utils.json_to_sheet(dataToExport)
		const wb = XLSX.utils.book_new()
		XLSX.utils.book_append_sheet(wb, ws, titulo)

		XLSX.writeFile(wb, `${titulo}_${formatDate(new Date())}.ods`, {bookType: `ods`})
	}

	const pdfButtonRef = useRef<HTMLButtonElement>(null)

	const exportPdf = () => {
		if (pdfButtonRef.current) {
			pdfButtonRef.current.click()
		  }
	}

	const buttonsExports = [
		{
			label: `PDF`,
			icon: `pi pi-file-pdf`,
			command: () => {
				exportPdf()
			}
		},
		{
			label: `EXCEL`,
			icon: `pi pi-file-excel`,
			command: () => {
				exportExcel()
			}
		},
		{
			label: `CSV`,
			icon: <BsFiletypeCsv className='mr-2' />,
			command: () => {
				exportCSVUsingXLSX()
			}
		},
		{
			label: `ODS`,
			icon: `pi pi-file`,
			command: () => {
				exportODS()
			}
		}
	]

	const headerModalTemplate = () => {
		return (
			<div className="flex justify-content-between pr-4 align-items-center">
				<h3 className="p-0 m-0">Dados Gerados</h3>
				<SplitButton
					disabled={hospitalData ? false : true}
					label="Exportar"
					icon="pi pi-file-export"
					buttonClassName="text-white shadow-none"
					menuButtonClassName="text-white shadow-none"
					outlined
					model={buttonsExports}
					raised
					onClick={exportPdf}

				/>
			</div>
		)
	}
	return (
		<Dialog
			header={headerModalTemplate}
			visible={props.showModal}
			style={{ width: `70vw` }}
			onHide={props.closeModal}
			blockScroll={true}
			draggable={false}
			dismissableMask
		>
			<DataTable
				value={hospitalData}
				emptyMessage='Nenhum resultado encontrado.'
				rowClassName={rowClassName}
			>
				<Column
					field="hospitalName"
					header="Hospital"
					headerStyle={headerTableStyle}
				/>
				<Column
					field="quantidade"
					header="Quantidade"
					headerStyle={headerTableStyle}
				/>
				<Column
					field="tipo"
					header="Tipo"
					headerStyle={headerTableStyle}
				/>
			</DataTable>
			<PDFDownloadLink
				style={{
					textDecoration: `none`,
					color: `white`,
					borderRadius: `5px`,
				}}

				document={<RelatorioOcorrenciasPDF {...props} />}
				fileName={`${titulo}_${formatDate(new Date())}.pdf`}>
				<Button
					label="Exportar PDF"
					severity="danger"
					className='hidden'
					//@ts-ignore
					ref={pdfButtonRef}
				/>

			</PDFDownloadLink>
		</Dialog>
	)
}
