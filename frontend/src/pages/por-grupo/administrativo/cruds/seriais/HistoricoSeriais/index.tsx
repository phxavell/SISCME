import {TitleWithBackArrow} from "@/components/TitleWithBackArrow"
import {rowClassName, styleActionHeader} from "@/components/RowTemplate.tsx"
import {styleColumnCaixa} from "@pages/por-grupo/administrativo/cruds/caixa/styles-caixa.ts"
import {ContainerColumnPx, headerTableStyle} from "@/util/styles"
import {Button} from "primereact/button"
import {Calendar} from "primereact/calendar"
import {Column} from "primereact/column"
import {DataTable} from "primereact/datatable"
import {Timeline} from "primereact/timeline"
import {TimelineEvent} from "@/pages/por-grupo/cliente/criar-solicitacao/modal-visualizar/useModalVisualizar"
import moment from "moment"
import {Paginator} from "primereact/paginator"
import {TemplatePaginatorTotal} from "@/components/table-templates/Paginator/TemplatePaginatorTotal.tsx"
import {RoutersPathName} from "@/routes/schemas.ts"
import { useHistoricoSeriais } from "./useHistoricoSeriais"
import { ModalHistorico } from "./ModalHistorico"
import { PDFDownloadLink } from "@react-pdf/renderer"
import { HistoricoSeriaisPDF } from "@/components/pdf-templates/HistoricoSerial"
import { useRef } from "react"
import { SplitButton } from "primereact/splitbutton"

const CustomizedMarker = (item: TimelineEvent) => {
	const style = `
    text-white
    border-circle
    `
	return (
		<div
			className={style}
			style={{backgroundColor: item.color}}>
			<i style={{height: `15px`}} className={`${item.icon} iconI`}></i>
		</div>
	)
}
const CustomizedContent = (item: TimelineEvent) => {
	return (
		<div className="mt-1 gray-900 flex ml-5">
			{item.status}
		</div>
	)
}

export const HistoricoSeriais = () => {
	const {
		fromDate, setFromDate,
		toDate, setToDate,
		loading,
		paginaAtual, onPageChange,
		ciclos,
		serial,
		visible, setVisible,
		clearInputsPesquisa,
		dadosParaPDF,
		dadoParaModal, setDadoParaModal,
		exportExcel
	} = useHistoricoSeriais()

	const customBodyTimeline = (data: any) => {
		const formatDate = `DD/MM/YYYY HH:mm`

		const timeline = data?.reduce((acc: any, dado: any) => {
			let novoObjeto
			if (dado?.status === `Recebido`) {
				novoObjeto = {
					date: moment(dado?.criado_em).format(formatDate),
					status: `Recebido`,
					icon: `pi pi-check-circle`,
					color: `green`
				}
			} else if (dado?.status === `Em termodesinfecção`) {
				novoObjeto = {
					date: moment(dado?.criado_em).format(formatDate),
					status: `Início termodesinfectora`,
					icon: `pi pi-sign-in`,
					color: `blue`
				}
			} else if (dado?.status === `Termodesinfecção concluída`) {
				novoObjeto = {
					date: moment(dado?.criado_em).format(formatDate),
					status: `Fim termodesinfectora`,
					icon: `pi pi-sign-out`,
					color: `purple`
				}
			} else if (dado?.status === `Embalado`) {
				novoObjeto = {
					date: moment(dado?.criado_em).format(formatDate),
					status: `Preparo e embalagem`,
					icon: `pi pi-box`,
					color: `#456532`
				}
			} else if (dado?.status === `Em esterilização`) {
				novoObjeto = {
					date: moment(dado?.criado_em).format(formatDate),
					status: `Início esterilização`,
					icon: `pi pi-sign-in`,
					color: `blue`
				}
			} else if (dado?.status === `Esterilização concluída`) {
				novoObjeto = {
					date: moment(dado?.criado_em).format(formatDate),
					status: `Fim esterilização`,
					icon: `pi pi-sign-out`,
					color: `purple`
				}
			} else if (dado?.status === `Distribuído`) {
				novoObjeto = {
					date: moment(dado?.criado_em).format(formatDate),
					status: `Distribuição`,
					icon: `pi pi-truck`,
					color: `#0b6366`
				}
			}  else if (dado?.status === `Abortado`) {
				novoObjeto = {
					date: moment(dado?.criado_em).format(formatDate),
					status: `Abortado`,
					icon: `pi pi-times-circle`,
					color: `red`
				}
			}

			if (novoObjeto) {
				acc.push(novoObjeto)
			}

			return acc
		}, [])

		const events = timeline.reverse()

		const textSize = () => {
			if(events.length > 10) {
				return `xs`
			} else {
				return `base`
			}
		}

		return (
			<Timeline
				value={events}
				content={CustomizedContent}
				layout="horizontal"
				className={`text-${textSize()} px-0 mb-0`}
				marker={CustomizedMarker}
				opposite={(item) => item.date}
			/>
		)
	}

	const onRowClick = (data: any) => {
		setDadoParaModal(data?.data)
		setVisible(true)
	}

	const pdfButtonExportRef = useRef<HTMLButtonElement>(null)

	const exportPdf = () => {
		if (pdfButtonExportRef.current) {
			pdfButtonExportRef.current.click()
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
	]

	const props = {
		dadosParaPDF: dadosParaPDF,
		serial,
		fromDate,
		toDate
	}

	return (
		<div className={ContainerColumnPx}>
			<TitleWithBackArrow
				title={`Histórico do Serial - ${serial}`}
				page={RoutersPathName.Seriais}
			/>
			<div className="md:flex flex-wrap gap-2 align-items-start relative mb-2 ms:flex-column">
				<div className="flex gap-2 mb-2">
					<Calendar
						style={{width: `100%`}}
						id="fromDate"
						value={fromDate}
						onChange={(e) => setFromDate(e.value)}
						placeholder="Data de"
						maxDate={new Date()}
						showIcon
						dateFormat="dd/mm/yy"
					/>
					<Calendar
						style={{width: `100%`}}
						id="toDate"
						value={toDate}
						maxDate={new Date()}
						onChange={(e) => setToDate(e.value)}
						placeholder="Data até"
						showIcon
						dateFormat="dd/mm/yy"
					/>
				</div>
				<div className="flex gap-2">
					<div className="flex gap-2 h-3rem">
						<Button
							icon="pi pi-times"
							onClick={clearInputsPesquisa}
							className={styleActionHeader(`blue`, `600`, `700`) }
						/>
						<SplitButton
							disabled={ciclos ? false : true}
							label="Exportar"
							icon="pi pi-file-export"
							buttonClassName="bg-blue-700 text-white shadow-none"
							menuButtonClassName="bg-blue-700 text-white shadow-none"
							outlined
							model={buttonsExports}
							raised
							onClick={exportPdf}

						/>
					</div>
				</div>
			</div>

			<DataTable
				loading={loading}
				scrollHeight="500px"
				rows={10}
				style={{minWidth: `100px`, height: 520}}
				value={ciclos?.data}
				className={`w-full`}
				emptyMessage='Nenhum resultado encontrado.'
				stripedRows
				onRowClick={onRowClick}
				selectionMode="radiobutton"
				rowClassName={rowClassName}
				rowHover
			>
				<Column
					header="Linha do tempo"
					headerStyle={headerTableStyle}
					className={styleColumnCaixa + `px-4`}
					field="status"
					body={customBodyTimeline}
					style={{width: `40%`}}
				/>
			</DataTable>
			<div className="w-full">
				<Paginator
					first={paginaAtual}
					rows={1}
					totalRecords={ciclos?.meta?.totalPages}
					onPageChange={(e) => onPageChange(e)}
					template={TemplatePaginatorTotal}
				/>
			</div>
			<ModalHistorico
				visible={visible}
				onClose={() => setVisible(false)}
				data={dadoParaModal}
			/>
			<PDFDownloadLink
				style={{
					textDecoration: `none`,
					color: `white`,
					borderRadius: `5px`,
				}}
				document={<HistoricoSeriaisPDF {...props} />}
				fileName={`${serial}_${moment().format(`DD-MM-YYYY`)}.pdf`}>
				<Button
					label="PDF"
					className='hidden'
					//@ts-ignore
					ref={pdfButtonExportRef}
					severity="danger"
					icon='pi pi-file-pdf'
				/>
			</PDFDownloadLink>
		</div>
	)
}
