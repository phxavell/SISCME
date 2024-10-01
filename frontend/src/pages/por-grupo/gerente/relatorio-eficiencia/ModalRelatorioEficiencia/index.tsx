import { styleLinhaMinimaTabela2 } from "@/pages/por-grupo/administrativo/cruds/caixa/styles-caixa"
import { headerTableStyle } from "@/util/styles"
import { Column } from "primereact/column"
import { DataTable } from "primereact/datatable"
import { Dialog } from "primereact/dialog"
import { useExports } from "./useExports"
import { Button } from "primereact/button"
import { PDFDownloadLink } from "@react-pdf/renderer"
import moment from "moment"
import { RelatorioEficienciaPDF } from "@/components/pdf-templates/Relatorios/RelatorioEficiencia"
import { SplitButton } from "primereact/splitbutton"
import { BsFiletypeCsv } from "react-icons/bs"
import { useRef } from "react"

export function ModalRelatorioEficiencia({ visible, onClose, data, datasRange }: any) {
	const {
		exportExcel,
		exportCSV,
		exportODS,
		titulo,
		today
	} = useExports(data)

	const tempoTotalFormatado = (data: any) => {
		const tempoSegundos = data?.tempo_total
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

	const tempoTotalParadoFormatado = (data: any) => {
		const tempoSegundos = data?.tempo_parado
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
			data-testid="modal-relatorio-eficiencia"
			style={{ width: `80vw` }}
			draggable={false}
			dismissableMask
			resizable={false}
			onHide={() => onClose()}
		>
			<div className="h-auto">
				<DataTable
					value={data?.data?.por_equipamento ?? []}
					emptyMessage='Nenhum dado encontrado.'
					stripedRows
					scrollHeight={`100%`}
				>
					<Column
						field='equipamento.nome'
						header="Equipamento"
						headerStyle={headerTableStyle}
						className={styleLinhaMinimaTabela2}
					/>
					<Column
						field='ciclos'
						header="Total de ciclos"
						headerStyle={headerTableStyle}
						className={styleLinhaMinimaTabela2}
					/>
					<Column
						field='ciclos_em_andamento'
						header="Em andamento"
						headerStyle={headerTableStyle}
						className={styleLinhaMinimaTabela2}
					/>
					<Column
						field='ciclos_finalizados'
						header="Finalizados"
						headerStyle={headerTableStyle}
						className={styleLinhaMinimaTabela2}
					/>
					<Column
						field='ciclos_abortados'
						header="Abortados"
						headerStyle={headerTableStyle}
						className={styleLinhaMinimaTabela2}
					/>
					<Column
						header='Tempo Funcionando'
						headerStyle={headerTableStyle}
						className={styleLinhaMinimaTabela2}
						body={tempoTotalFormatado}
					/>
					<Column
						header='Tempo Parado'
						headerStyle={headerTableStyle}
						className={styleLinhaMinimaTabela2}
						body={tempoTotalParadoFormatado}
					/>
				</DataTable>
			</div>

			<PDFDownloadLink
				style={{
					textDecoration: `none`,
					color: `white`,
					borderRadius: `5px`,
				}}

				document={<RelatorioEficienciaPDF {...props} />}
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
