import {rowClassName, styleActionHeader} from "@/components/RowTemplate.tsx"
import {TemplatePaginator} from "@/components/table-templates/Paginator/TemplatePaginator.tsx"
import {styleColumnCaixa} from "@pages/por-grupo/administrativo/cruds/caixa/styles-caixa.ts"
import {ContainerFlexColumnDiv, headerTableStyle} from "@/util/styles"
import {Button} from "primereact/button"
import {Column} from "primereact/column"
import {DataTable} from "primereact/datatable"
import {Paginator} from "primereact/paginator"
import {Calendar} from 'primereact/calendar'
import {InputText} from "primereact/inputtext"
import {usePesquisarProducoes} from "./usePesquisarProducoes"
import {TitleWithBackArrow} from "@/components/TitleWithBackArrow"
import {useState, useRef} from "react"
import DateTemplate from "@/components/table-templates/DateTemplate.tsx"
import { ModalDetalhesProducao } from "./modal-producao-pdf"
import { ModalPreparoEtiquetaPDF } from "../modal-preparo-etiqueta-pdf"
import {RoutersPathName} from "@/routes/schemas.ts"

export const PesquisarProducoes = () => {
	const [showModal, setShowModal] = useState(false)
	const [showModalEtiqueta, setShowModalEtiqueta] = useState(false)
	const myRef = useRef<Calendar>(null)
	const myRef2 = useRef<Calendar>(null)
	const handleCloseModalEtiqueta = () => {
		setShowModalEtiqueta(false)
	}
	const handleCloseModalCaixa = async () => {
		setShowModal(false)
	}

	const {
		preparos,
		first,
		setFirst,
		loading,
		onPageChange,
		search,
		fromDate, setFromDate,
		toDate, setToDate,
		serial, setSerial,
		handleGerarPDF,
		caixaToPDF,
		clearFiltroPesquisa
	} = usePesquisarProducoes()
	const templateActions = (item: any) => {
		return (
			<div className="flex gap-2 h-2rem">
				<Button
					text
					icon='pi pi-eye'
					className={styleActionHeader(`blue`, `400`, `600`)}
					style={{color: `white`}}
					onClick={() => {
						handleGerarPDF(item)
						setShowModal(true)
					}}
					tooltip="Visualizar Detalhes"
				/>
			</div>
		)
	}

	const templateSerialEtiquetas = (item: any) => {
		return (
			<div className="flex gap-2 h-2rem">
				<Button
					text
					icon='pi pi-file-pdf'
					className={styleActionHeader(`orange`, `400`, `600`)}
					style={{color: `white`}}
					onClick={() => {
						handleGerarPDF(item)
						setShowModalEtiqueta(true)
					}}
					tooltip="Visualizar Etiqueta"
				/>
			</div>
		)
	}

	return (
		<div className={ContainerFlexColumnDiv}>
			<TitleWithBackArrow
				title={`Pesquisa de Itens em Produção`}
				page={RoutersPathName.Producao}
			/>
			<div className="flex gap-2 align-items-start relative">
				<div className=" flex flex-wrap gap-2 p-2">
					<div className="flex gap-2">
						<Calendar
							id="fromDate"
							value={fromDate}
							onChange={(e) => {
								e.preventDefault()
								e.stopPropagation()
								setFromDate(e.value)
							}}
							hideOnDateTimeSelect={true}
							footerTemplate={() => {
								return (
									<div className={`flex justify-content-end`}>
										<Button
											label={`Confirmar`}
											onClick={() => {
												myRef?.current?.hide()
											}}
										/>
									</div>
								)
							}}
							ref={myRef}
							showTime
							placeholder="Dt. Início"
							showIcon
							dateFormat="dd/mm/yy"
						/>
						<Calendar
							id="toDate"
							value={toDate}
							onChange={(e) => setToDate(e.value)}
							hideOnDateTimeSelect={true}
							footerTemplate={() => {
								return (
									<div className={`flex justify-content-end`}>
										<Button
											label={`Confirmar`}
											onClick={() => {
												myRef2?.current?.hide()
											}}
										/>
									</div>
								)
							}}
							ref={myRef2}
							placeholder="Dt. Fim"
							showTime
							showIcon dateFormat="dd/mm/yy"
						/>
					</div>
					<InputText
						id="sequencial"
						value={serial}
						onChange={(e) => setSerial(e.target.value)}
						placeholder="Serial"
					/>
					<Button
						icon="pi pi-search"
						className="p-button-raised"
						onClick={() => {
							search(true)
							setFirst(0)
						}}
					/>
					<Button
						icon="pi pi-times"
						className="p-button-raised"
						onClick={clearFiltroPesquisa}/>
				</div>
			</div>
			<ModalDetalhesProducao
				setShowModal={handleCloseModalCaixa}
				showModal={showModal}
				caixaToPDF={caixaToPDF}
			/>
			<div style={{
				display: `none`
			}}>
				<img id="barcode"/>
			</div>
			<ModalPreparoEtiquetaPDF
				showModal={showModalEtiqueta}
				setShowModal={handleCloseModalEtiqueta}
				preparoEtiquetaToPDF={caixaToPDF}
			/>
			<DataTable
				scrollHeight="500px"
				style={{minWidth: `100px`, height: 500}}
				value={preparos?.data}
				className={`w-full`}
				emptyMessage='Nenhum resultado encontrado.'
				stripedRows
				id={`serial`}
				dataKey={`serial`}
				rowClassName={rowClassName}
				rowHover
				loading={loading}
			>
				<Column
					header="Serial"
					headerStyle={headerTableStyle}
					className={styleColumnCaixa}
					field="serial"
				/>
				<Column
					field="data_preparo"
					header="Data Preparo"
					headerStyle={headerTableStyle}
					className={styleColumnCaixa}
				/>
				<Column
					field="data_validade"
					header="Data Validade"
					headerStyle={headerTableStyle}
					className={styleColumnCaixa}
					body={DateTemplate(`DD-MM-YYYY`)}
				/>
				<Column
					header="Ações"
					headerStyle={headerTableStyle}
					body={templateActions}
				/>
				<Column
					header="Etiqueta"
					headerStyle={headerTableStyle}
					body={templateSerialEtiquetas}
				/>
			</DataTable>
			<div className="w-full">
				<Paginator
					first={first}
					rows={1}
					totalRecords={preparos?.meta?.totalPages ?? 0}
					onPageChange={(e) => onPageChange(e)}
					template={TemplatePaginator}
				/>
			</div>
		</div>
	)
}
