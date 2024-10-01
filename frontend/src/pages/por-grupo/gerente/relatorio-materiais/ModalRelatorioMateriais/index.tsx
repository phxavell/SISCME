import { styleLinhaMinimaTabela2 } from "@/pages/por-grupo/administrativo/cruds/caixa/styles-caixa"
import { headerTableStyle } from "@/util/styles"
import { Column } from "primereact/column"
import { DataTable } from "primereact/datatable"
import { Dialog } from "primereact/dialog"
import { useExports } from "./useExports"
import { Button } from "primereact/button"
import { PDFDownloadLink } from "@react-pdf/renderer"
import moment from "moment"
import { RelatorioMateriaisPDF } from "@/components/pdf-templates/Relatorios/RelatorioMateriais"
import { useRef } from "react"
import { BsFiletypeCsv } from "react-icons/bs"
import { SplitButton } from "primereact/splitbutton"

export function ModalRelatorioMateriais({ visible, onClose, data, datasRange }: any) {
	const {
		exportExcel,
		exportCSV,
		exportODS,
		titulo,
		today
	} = useExports(data)

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
			data-testid="modal-relatorio-materiais"
			style={{ width: `70vw` }}
			draggable={false}
			dismissableMask
			resizable={false}
			onHide={() => onClose()}
		>
			<div className="h-auto">
				<DataTable
					value={data?.data?.etiquetas_por_tipo_etiqueta ?? []}
					emptyMessage='Nenhum dado encontrado.'
					stripedRows
					scrollHeight={`100%`}
				>
					<Column
						field='tipoetiqueta'
						header="Tipo de etiqueta"
						headerStyle={headerTableStyle}
						className={styleLinhaMinimaTabela2}
					/>
					<Column
						field='quantidade'
						header="Quantidade"
						headerStyle={headerTableStyle}
						className={styleLinhaMinimaTabela2}
					/>

				</DataTable>
			</div>
			<PDFDownloadLink
				style={{
					textDecoration: `none`,
					color: `white`,
					borderRadius: `5px`,
				}}

				document={<RelatorioMateriaisPDF {...props} />}
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
