import { styleLinhaMinimaTabela2 } from "@/pages/por-grupo/administrativo/cruds/caixa/styles-caixa"
import { headerTableStyle } from "@/util/styles"
import { Column } from "primereact/column"
import { DataTable } from "primereact/datatable"
import { Dialog } from "primereact/dialog"
import { useExports } from "./useExports"
import { Button } from "primereact/button"
import { PDFDownloadLink } from "@react-pdf/renderer"
import moment from "moment"
import { IndicadoresProdutividadePDF } from "@/components/pdf-templates/Relatorios/IndicadoresProdutividade"
import { useCallback, useRef } from "react"
import { SplitButton } from "primereact/splitbutton"
import { BsFiletypeCsv } from "react-icons/bs"

export function ModalRelatorioProdutividade({ visible, onClose, data, datasRange, turno }: any) {
	const {
		exportExcel,
		exportCSV,
		exportODS,
		titulo,
		today
	} = useExports(data)

	const getDadosPorTurno = useCallback((tipo: any) => {
		let prefixo = ``
		if (turno === `diurno`) {
			prefixo = `diurno.`
		} else if (turno === `noturno`) {
			prefixo = `noturno.`
		}

		switch (tipo) {
		case `recebimento`:
			return `${prefixo}qtd_recebimento` || `qtd_recebimento`
		case `distribuicao`:
			return `${prefixo}qtd_distribuicao` || `qtd_distribuicao`
		default:
			return ``
		}
	}, [turno])

	const dadosAproveitamentoPorTurno = useCallback((data: any) => {
		if(turno == `diurno`) {
			return data?.diurno?.aproveitamento
		} else if(turno == `noturno`) {
			return data?.noturno?.aproveitamento
		} else {
			return data?.aproveitamento
		}
	}, [turno])

	const templateAproveitamento = (data: any) => {
		if(data.aproveitamento) {
			return `${dadosAproveitamentoPorTurno(data)}%`
		} else {
			return `0%`
		}
	}

	const props = {
		titulo,
		data,
		datasRange
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
				exportCSV()
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
					disabled={data.data ? false : true}
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
			visible={visible}
			data-testid="modal-embalagem"
			style={{ width: `70vw` }}
			draggable={false}
			dismissableMask
			resizable={false}
			onHide={() => onClose()}
		>
			<div className="h-auto">
				<DataTable
					value={data?.data?.por_cliente ?? []}
					emptyMessage='Nenhum dado encontrado.'
					stripedRows
					scrollHeight={`100%`}
				>
					<Column
						field='cliente.nome'
						header="Cliente"
						headerStyle={headerTableStyle}
						className={styleLinhaMinimaTabela2}
					/>
					<Column
						field={getDadosPorTurno(`recebimento`)}
						header="Qtd. Recebidos"
						headerStyle={headerTableStyle}
						className={styleLinhaMinimaTabela2}
					/>
					<Column
						field={getDadosPorTurno(`distribuicao`)}
						header="Qtd. Distribuidos"
						headerStyle={headerTableStyle}
						className={styleLinhaMinimaTabela2}
					/>
					<Column
						header='Aproveitamento'
						headerStyle={headerTableStyle}
						className={styleLinhaMinimaTabela2}
						body={templateAproveitamento}
					/>
				</DataTable>
			</div>
			<PDFDownloadLink
				style={{
					textDecoration: `none`,
					color: `white`,
					borderRadius: `5px`,
				}}

				document={<IndicadoresProdutividadePDF {...props} />}
				fileName={`${titulo}_${moment(today).format(`DD-MM-YYYY`)}.pdf`}>
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
