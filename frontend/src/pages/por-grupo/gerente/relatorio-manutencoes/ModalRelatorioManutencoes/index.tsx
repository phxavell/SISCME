import { styleLinhaMinimaTabela2 } from "@/pages/por-grupo/administrativo/cruds/caixa/styles-caixa"
import { headerTableStyle } from "@/util/styles"
import { Column } from "primereact/column"
import { DataTable } from "primereact/datatable"
import { Dialog } from "primereact/dialog"
import { useExports } from "./useExports"
import { Button } from "primereact/button"
import { PDFDownloadLink } from "@react-pdf/renderer"
import { RelatorioManutencoesPDF } from "@/components/pdf-templates/Relatorios/RelatorioManutencoes"
import moment from "moment"
import { SplitButton } from 'primereact/splitbutton'
import { useCallback, useRef } from "react"
import { BsFiletypeCsv } from "react-icons/bs"

export function ModalRelatorioManutencoes({ visible, onClose, data, datasRange }: any) {
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

	const dadosTabela = data?.data?.equipamentos?.reduce((acc: any, dado: any) => {
		if (dado?.manutencoes_previstas !== 0 || dado?.manutencoes_realizadas !== 0) {
			acc.push(dado)
		}
		return acc
	}, [])

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
					disabled={dadosTabela?.length > 0 ? false : true}
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

	const exibirTabela = useCallback(() => {
		if(dadosTabela?.length > 0) {
			return (
				<DataTable
					value={data?.data?.equipamentos ?? []}
					emptyMessage='Nenhum dado encontrado.'
					stripedRows
					scrollHeight={`100%`}
				>
					<Column
						field='equipamento_id'
						header="#"
						headerStyle={headerTableStyle}
						className={styleLinhaMinimaTabela2}
					/>
					<Column
						field='nome'
						header="Equipamento"
						headerStyle={headerTableStyle}
						className={styleLinhaMinimaTabela2}
					/>
					<Column
						field='manutencoes_previstas'
						header="Manutenções Planejadas"
						headerStyle={headerTableStyle}
						className={styleLinhaMinimaTabela2}
					/>
					<Column
						field='manutencoes_realizadas'
						header="Manutenções Realizadas"
						headerStyle={headerTableStyle}
						className={styleLinhaMinimaTabela2}
					/>
				</DataTable>
			)
		} else {
			return (
				<h3 className="m-0 text-4xl text-center">Não há dados!</h3>
			)
		}
	}, [data, dadosTabela])

	return (
		<Dialog
			header={headerModalTemplate}
			visible={visible}
			data-testid="modal-relatorio-manutencoes"
			style={{ width: `80vw` }}
			draggable={false}
			dismissableMask
			resizable={false}
			onHide={() => onClose()}
		>
			<div className="h-auto">
				{exibirTabela()}
			</div>
			<PDFDownloadLink
				style={{
					textDecoration: `none`,
					color: `white`,
					borderRadius: `5px`,
				}}
				document={data.data ? <RelatorioManutencoesPDF {...props} /> : <></>}
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
