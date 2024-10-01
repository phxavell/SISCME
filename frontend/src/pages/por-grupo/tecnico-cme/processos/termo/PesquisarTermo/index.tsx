import {TitleWithBackArrow} from "@/components/TitleWithBackArrow"
import {rowClassName, styleActionHeader} from "@/components/RowTemplate.tsx"
import {styleColumnCaixa} from "@pages/por-grupo/administrativo/cruds/caixa/styles-caixa.ts"
import {ContainerColumnPx, headerTableStyle} from "@/util/styles"
import {Button} from "primereact/button"
import {Calendar} from "primereact/calendar"
import {Column} from "primereact/column"
import {DataTable} from "primereact/datatable"
import {usePesquisarTermo} from "./usePesquisarTermo"
import {useState} from "react"
import {Timeline} from "primereact/timeline"
import {TimelineEvent} from "@/pages/por-grupo/cliente/criar-solicitacao/modal-visualizar/useModalVisualizar"
import moment from "moment"
import {Paginator} from "primereact/paginator"
import {TemplatePaginatorTotal} from "@/components/table-templates/Paginator/TemplatePaginatorTotal.tsx"
import {ConfirmDialog, confirmDialog} from "primereact/confirmdialog"
import { InputText } from "primereact/inputtext"
import { useModalEquipamentoView } from "@/pages/por-grupo/administrativo/cruds/equipamento/ModalEquipamentoView/useModalEquipamentoView"
import { ModalEquipamentoView } from "@/pages/por-grupo/administrativo/cruds/equipamento/ModalEquipamentoView"
import { ViewTermo } from "../modal-view"
import { Dropdown } from "primereact/dropdown"
import {RoutersPathName} from "@/routes/schemas.ts"
import { useModalPdf } from "../useModalPdf"
import { unfinishedTermos} from "./types"


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
		<div className="text-xs mt-1 gray-900 flex ml-5">
			{item.status}
		</div>
	)
}

export const PesquisarTermo = () => {
	const [showModalEquipamento, setShowModalEquipamento] = useState(false)
	const [showModalView, setShowModalView] = useState(false)
	const {
		abortarStatus, finalizarStatus,
		termo,
		fromDate, setFromDate,
		toDate, setToDate,
		loading,
		paginaAtual, onPageChange,
		acionandoAcao, setAcionandoAcao,
		termoView,
		setTermoView,
		viewTermo,
		setCiclo,
		ciclo,
		serial,
		setPaginaAtual,
		setSerial,
		status, setStatus,
		listStatus,
		clearInputsPesquisa,
		filtrarTermo,
	} = usePesquisarTermo()

	const {
		buscarDadosPdf,
		conteudoPDF	} = useModalPdf()


	const {
		getEquipamento, equipamento
	} = useModalEquipamentoView()


	const enviarStatusAbortado = async (id: number) => {
		abortarStatus(id)
	}

	const checkStatus = (situacao: string, id?: any) => {
		if (unfinishedTermos.includes(situacao)) return

		buscarDadosPdf(id)
	}

	const handleViewEquipamento = async (id: number) => {
		getEquipamento(id)
	}

	const handleDadosView = async (id: number) => {
		viewTermo(id)
	}

	const handleConfirmar = (id: number) => {
		setAcionandoAcao(true)
		finalizarStatus(id)
	}

	const handleCloseModalView = async () => {
		setTermoView(undefined)
		setShowModalView(false)
	}

	const showAction = (situacao: string, termo: any) => {
		if (situacao === `TERMO_INICIO`) {
			return (
				<div className="flex gap-2 h-3rem">
					<Button
						draggable={false}
						icon="pi pi-check-circle"
						loading={acionandoAcao}
						className={styleActionHeader(`green`, `600`, `600`)}
						onClick={() => {
							confirmDialog({
								message: `Deseja finalizar o ciclo?`,
								header: `Finalizar Ciclo`,
								icon: `pi pi-exclamation-triangle`,
								accept: () => {
									handleConfirmar(termo.id)
								},
								reject: () => {
								},
								acceptLabel: `Sim`,
								rejectLabel: `Não`,
							})
						}}
						tooltip="Finalizar Ciclo"
					/>
					<Button
						draggable={false}
						loading={acionandoAcao}
						text
						icon='pi pi-exclamation-triangle'
						className={styleActionHeader(`red`, `600`, `600`)}
						style={{color: `white`}}
						onClick={() => {
							confirmDialog({
								message: `Deseja abortar o ciclo?`,
								header: `Abortar Ciclo`,
								icon: `pi pi-exclamation-triangle`,
								accept: () => {
									enviarStatusAbortado(termo.id)
								},
								reject: () => {
								},
								acceptLabel: `Sim`,
								rejectLabel: `Não`,
							})
						}}
						tooltip="Abortar Ciclo"
					/>
				</div>
			)
		}
	}



	const MostrarAcoes = (termo: any) => {
		return (
			<div className="flex gap-2 ">
				{showAction(termo.situacao_atual, termo)}
				<div className="flex gap-2 h-3rem">
					<Button
						text
						icon='pi pi-eye'
						className={styleActionHeader(`blue`, `600`, `600`)}
						style={{color: `white`}}
						onClick={async () => {
							checkStatus(termo.situacao_atual, termo.id)
							await handleDadosView(termo.id)
							setShowModalView(true)
						}}
						tooltip="Visualizar"
					/>
				</div>

			</div>
		)
	}


	const customBodyTimeline = (termo: any) => {

		const formateDate = `DD/MM/YYYY HH:mm`

		const events = [
			{
				date: termo.data_inicio,
				status: `Iniciado`,
				icon: `pi pi-arrow-circle-right`,
				color: `green`
			},
		]
		console.log(termo)

		if (termo.situacao_atual === `TERMO_INICIO`) {
			events.push({
				date: `Há ${moment(termo.data_inicio, formateDate).fromNow(true)}`,
				status: `Operando`,
				icon: `pi pi-clock`,
				color: `blue`
			})
		}

		if (termo.situacao_atual === `TERMO_FIM`) {
			events.push({
				date: termo.data_fim,
				status: `Finalizado`,
				icon: `pi pi-check-circle`,
				color: `green`
			})
		}

		if (termo.situacao_atual === `ABORTADO`) {
			events.push({
				status: `Abortado`,
				icon: `pi pi-exclamation-triangle`,
				color: `red`,
				date: termo.data_fim,
			})
		}

		return (
			<Timeline
				value={events}
				content={CustomizedContent}
				layout="horizontal"
				className="text-xs px-0 mb-0"
				marker={CustomizedMarker}
				opposite={(item) => item.date}

			/>
		)
	}



	return (
		<div className={ContainerColumnPx}>
			<ViewTermo
				setShowModal={handleCloseModalView}
				showModal={showModalView}
				dadosView={termoView}
				conteudoPDF={conteudoPDF}
				abortarStatus={abortarStatus}
				finalizarStatus={finalizarStatus}
			/>
			<ModalEquipamentoView
				showModal={showModalEquipamento}
				setShowModal={setShowModalEquipamento}
				dadosView={equipamento}
			/>
			<TitleWithBackArrow
				title={`Pesquisa de Termodesinfecção`}
				page={RoutersPathName.Termo}
			/>
			<div className="md:flex flex-wrap gap-2 align-items-start relative mb-2 ms:flex-column">
				<div className="flex gap-2 mb-2">
					<Calendar
						style={{width: `100%`}}
						id="fromDate"
						value={fromDate}
						onChange={(e) => setFromDate(e.value)}
						placeholder="Data de"
						showTime
						showIcon
						dateFormat="dd/mm/yy"
					/>
					<Calendar
						style={{width: `100%`}}
						id="toDate"
						value={toDate}
						onChange={(e) => setToDate(e.value)}
						placeholder="Data até"
						showTime
						showIcon
						dateFormat="dd/mm/yy"
					/>
				</div>
				<div className="flex gap-2 mb-2">
					<InputText
						id="ciclo"
						placeholder="Ciclo"
						value={ciclo}
						onChange={(e) => {
							setCiclo(e.target.value)
							setPaginaAtual(0)
						}}
					/>
					<InputText
						id="serial"
						placeholder="Serial"
						value={serial}
						onChange={(e) => {
							setSerial(e.target.value)
							setPaginaAtual(0)
						}}
					/>
				</div>
				<div className="flex gap-2">
					<Dropdown
						id="id"
						placeholder="Situação"
						value={status}
						options={listStatus}
						optionLabel="valor"
						onChange={(e) => {
							setStatus(e.value)
							setPaginaAtual(0)
						}}
					/>
					<div className="flex gap-2 h-3rem">
						<Button
							icon="pi pi-search"
							className={styleActionHeader(`blue`, `600`, `700`) }
							onClick={filtrarTermo}
						/>

						<Button
							icon="pi pi-times"
							onClick={clearInputsPesquisa}
							className={styleActionHeader(`blue`, `600`, `700`) }
						/>
					</div>
				</div>
				<ConfirmDialog
					draggable={false}
				/>
			</div>
			<DataTable
				loading={loading}
				scrollHeight="500px"
				rows={10}
				style={{minWidth: `100px`, height: 520}}
				dataKey="id"
				value={termo?.data}
				className={`w-full`}

				emptyMessage='Nenhum resultado encontrado.'
				stripedRows
				rowClassName={rowClassName}
				rowHover
			>
				<Column
					header="Código"
					headerStyle={headerTableStyle}
					className="w-1"
					field="id"
				/>
				<Column
					header="Ciclo"
					headerStyle={headerTableStyle}
					className="w-1"
					field="ciclo"
				/>
				<Column
					header="Equipamento"
					headerStyle={headerTableStyle}
					className="w-3"
					field="equipamento.descricao"
					body={(e: any) => {
						return (
							<div className="flex gap-2">
								{e.equipamento.descricao}
								<Button
									text
									icon='pi pi-eye'
									className={styleActionHeader(`yellow`, `600`, `600`)}
									style={{color: `white`}}
									onClick={() => {
										handleViewEquipamento(e.equipamento.id)
										setShowModalEquipamento(true)
									}}
									tooltip="Visualizar Equipamento"
								/>
							</div>
						)
					}}
				/>
				<Column
					header="Situação"
					headerStyle={headerTableStyle}
					className={styleColumnCaixa}
					field="status"
					body={customBodyTimeline}
					style={{width: `40%`}}
				/>
				<Column
					header="Ações"
					headerStyle={headerTableStyle}
					body={MostrarAcoes}
					className="w-1"
				/>


			</DataTable>
			<div className="w-full">
				<Paginator
					first={paginaAtual}
					rows={1}
					totalRecords={termo?.meta?.totalPages}
					onPageChange={(e) => onPageChange(e)}
					template={TemplatePaginatorTotal}
				/>
			</div>
		</div>
	)
}
