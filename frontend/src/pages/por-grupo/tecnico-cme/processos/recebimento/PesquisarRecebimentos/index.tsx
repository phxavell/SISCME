import {rowClassName} from "@/components/RowTemplate.tsx"
import {cnCellRecebimento} from "@pages/por-grupo/administrativo/cruds/caixa/styles-caixa.ts"
import {ContainerFlexColumnDiv, headerTableStyle} from "@/util/styles"
import {Button} from "primereact/button"
import {Column} from "primereact/column"
import {DataTable} from "primereact/datatable"
import {Calendar} from 'primereact/calendar'
import {InputText} from "primereact/inputtext"
import {usePesquisarRecebimentos} from "./usePesquisarRecebimentos"
import {TitleWithBackArrow} from "@/components/TitleWithBackArrow"
import {useRef} from "react"
import DateTemplate from "@/components/table-templates/DateTemplate.tsx"
import {Tag} from "primereact/tag"
import {RoutersPathName} from "@/routes/schemas.ts"
import { RelatorioRecebimento } from "@/components/pdf-templates/RelatorioRecebimento"
import {
	ModalDetailRecebimento
} from "@pages/por-grupo/tecnico-cme/processos/recebimento/modal/ModalDetailRecebimento.tsx"
import {PaginatorAndFooter} from "@/components/table-templates/Paginator/PaginatorAndFooter.tsx"
import {styleLoadingIcon} from "@pages/por-grupo/tecnico-cme/processos/recebimento/Recebimento.tsx"
import { buttonEye, buttonSearch, buttonTimes } from "@/util/styles/buttonAction"

const reMap = (status:string)=> {
	switch (status) {
	case `RECEBIDO`:
		return {
			color: `blue`,
			label: `Recebido`
		}
	default:
		return {
			color: `warning`,
			label: `Recebido`
		}

	}
}

export const StatusRecebimentoTemplate = (solicitacao: any) => {
	if (solicitacao.status) {
		return (
			<Tag className="text-sm "
				value={reMap(solicitacao.status).label}
			/>
		)
	}
	return (

		<Tag
			className="p-0 px-2 my-1"
			icon="pi pi-exclamation-triangle"
			severity="warning"
			value="Não informado."/>
	)
}

export const PesquisarRecebimentos = () => {
	const {
		recebimentos,
		first,
		onPageChange,
		search,
		fromDate, setFromDate,
		toDate, setToDate,
		serial, setSerial,
		loading,setPaginaAtual,
		showModal,
		caixaToPDF, setCaixaToPDF,
		handleCloseModalCaixa,
		handleClickShowPdf,
		baixandoPdf,
		itemSelected,
		fotos, setFotos
	} = usePesquisarRecebimentos()

	const templateActions = (item: any) => {
		return (
			<div className="flex gap-2 h-2rem">
				<Button
					loading={(baixandoPdf && itemSelected?.sequencial===item?.sequencial) }
					text
					disabled={itemSelected}
					icon={buttonEye.icon}
					className={buttonEye.color}
					style={{color: `white`}}
					onClick={() => {
						handleClickShowPdf(item);setFotos(item?.foto)
					}}
				/>
			</div>
		)
	}
	const myRef = useRef<Calendar>(null)
	const myRef2 = useRef<Calendar>(null)

	return (
		<div className={ContainerFlexColumnDiv}>
			<ModalDetailRecebimento
				dadosPDF={caixaToPDF}
				nomeArquivo={`Recebimento`}
				documentoPDF={<RelatorioRecebimento {...caixaToPDF}/>}
				showModal={showModal}
				closeModal={() => {
					handleCloseModalCaixa()
					setCaixaToPDF(undefined)
				}}
				fotos={fotos}

			/>
			<TitleWithBackArrow
				title={`Pesquisa de Itens Recebimentos`}
				page={RoutersPathName.Recebimento}
			/>
			<div className="flex gap-2 align-items-start relative">
				<div className=" flex flex-col gap-2 p-2">
					<Calendar
						locale="pt"
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
						dateFormat="dd/mm/yy"/>
					<Calendar
						id="toDate"
						value={toDate}
						placeholder="Dt. Fim"
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
						showTime
						ref={myRef2}
						hideOnDateTimeSelect={true}
						locale="pt"
						onChange={(e) => {
							e.preventDefault()
							e.stopPropagation()
							setToDate(e.value)
						}}
						showIcon
						dateFormat="dd/mm/yy"/>
					<InputText
						id="sequencial"
						value={serial}
						onChange={(e) => setSerial(e.target.value)}
						placeholder="Serial"/>
					<Button
						icon={buttonSearch.icon}
						className={buttonSearch.color}
						onClick={() => {
							setPaginaAtual(0)
							search(true)
						}}/>
					<Button
						icon={buttonTimes.icon}
						className={buttonTimes.color}
						onClick={()=> search(false)}/>
				</div>
			</div>

			<DataTable
				scrollHeight={`535px`}
				rows={10}
				style={{ height: 535 }}
				dataKey="serial"
				value={recebimentos?.data}
				className={`w-full`}
				loadingIcon={styleLoadingIcon}
				loading={loading}
				size={`small`}
				emptyMessage='Nenhum resultado encontrado.'
				stripedRows
				rowClassName={rowClassName}
				rowHover
			>
				<Column
					header="Serial"
					headerStyle={headerTableStyle}
					className={cnCellRecebimento + ` cursor-auto select-all`}
					field="serial"
				/>
				<Column
					field="data_recebimento"
					header="Data Recebimento"
					headerStyle={headerTableStyle}
					className={cnCellRecebimento + ` select-none`}
					body={DateTemplate(`DD-MM-YYYY`)}
				/>
				<Column
					field="ultima_situacao"
					header="Situação"
					headerStyle={headerTableStyle}
					className={cnCellRecebimento + ` select-none`}
					body={StatusRecebimentoTemplate}
				/>
				<Column
					header="Ações"
					headerStyle={headerTableStyle}
					body={templateActions}
				/>
			</DataTable>
			<PaginatorAndFooter
				first={first}
				onPageChange={onPageChange}
				meta={recebimentos?.meta}
				loading={loading}
			/>
		</div>
	)
}
