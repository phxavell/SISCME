import {TitleWithBackArrow} from "@/components/TitleWithBackArrow"
import {rowClassName, styleActionHeader} from "@/components/RowTemplate.tsx"
import {styleColumnCaixa} from "@pages/por-grupo/administrativo/cruds/caixa/styles-caixa.ts"
import {ContainerColumnPx, headerTableStyle} from "@/util/styles"
import {Button} from "primereact/button"
import {Calendar} from "primereact/calendar"
import {Column} from "primereact/column"
import {DataTable} from "primereact/datatable"
import { Dropdown} from 'primereact/dropdown'
import {InputText} from "primereact/inputtext"
import {usePesquisarEsterilizacao} from "./usePesquisarEsterilizacao"
import {useState} from "react"
import {Timeline} from "primereact/timeline"
import {TimelineEvent} from "@/pages/por-grupo/cliente/criar-solicitacao/modal-visualizar/useModalVisualizar"
import moment from "moment"
import 'moment/dist/locale/pt-br'
import {ViewEsterilizacao} from "../modal-view"
import {ConfirmDialog, confirmDialog} from 'primereact/confirmdialog'
import {useModalPdf} from "@pages/por-grupo/tecnico-cme/processos/esterilizacao/useModalPdf.ts"
import './style.css'
import { ModalEquipamentoView } from "../../../../administrativo/cruds/equipamento/ModalEquipamentoView"
import { useModalEquipamentoView } from "@/pages/por-grupo/administrativo/cruds/equipamento/ModalEquipamentoView/useModalEquipamentoView"
import {RoutersPathName} from "@/routes/schemas.ts"
import {PaginatorAndFooter} from "@/components/table-templates/Paginator/PaginatorAndFooter.tsx"
import { DadosPdfEtiquetaEsterilizacao, ModalEtiquetaEsterilizacao } from "./modal-etiqueta-esterilizacao"

const style1= `flex flex-wrap gap-2 align-items-start relative mb-2`
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
		<div className="text-xs mt-0 gray-900 flex ml-0">
			{item.status}
		</div>
	)
}

export const PesquisarEsterilizacao = () => {
	const [showModalEquipamento, setShowModalEquipamento] = useState(false)
	const [showModalView, setShowModalView] = useState(false)
	const {
		esterilizacaoFiltro,
		fromDate, setFromDate,
		toDate, setToDate,
		ciclo, setCiclo,
		serial, setSerial,
		status, setStatus,
		loading,
		abortarStatus, finalizarStatus,
		viewEsterilizacao,
		esterilizacaoView, setEsterilizacaoView,
		acionandoAcao, setAcionandoAcao,
		listarCaixasEsterilizacao, clearInputsFiltros,
		paginaAtual, onPageChange, setPaginaAtual, formOptions,
		showModalEtiqueta, setShowModalEtiqueta, dadosEtiqueta,
		successEsterilizacao
	} = usePesquisarEsterilizacao()

	const {
		getEquipamento, equipamento
	} = useModalEquipamentoView()

	const {
		buscarDadosPdf,
		conteudoPDF, setConteudoPDF
	} = useModalPdf()

	const handleViewEquipamento = async (id: number) => {
		getEquipamento(id)
	}

	const handleCloseModalView = async () => {
		setEsterilizacaoView(undefined)
		setConteudoPDF(undefined)
		setShowModalView(false)
	}

	const handleDadosView = async (id: number) => {
		viewEsterilizacao(id)
	}

	const enviarStatusAbortado = (id: number) => {
		abortarStatus(id)
	}

	const handleConfirmar = (id: number) => {
		setAcionandoAcao(true)
		finalizarStatus(id)
	}

	const checkStatus = (situacao: string, id?: any) => {
		if (situacao !== `ESTERILIZACAO_INICIO` && situacao !== `ABORTADO`) {
			buscarDadosPdf(id)
		}

	}

	const showAction = (situacao: string, esterilizacao: any) => {
		if (situacao === `ESTERILIZACAO_INICIO`) {
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
									handleConfirmar(esterilizacao.id)
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
									enviarStatusAbortado(esterilizacao.id)
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
	const MostrarAcoes = (esterilizacao: any) => {
		return (
			<div className="flex gap-2 ">
				{showAction(esterilizacao.situacao_atual, esterilizacao)}
				<div className="flex gap-2 h-3rem">
					<Button
						text
						icon='pi pi-eye'
						className={styleActionHeader(`blue`, `600`, `600`)}
						style={{color: `white`}}
						onClick={() => {
							handleDadosView(esterilizacao.id)
							checkStatus(esterilizacao.situacao_atual, esterilizacao.id)
							setShowModalView(true)
						}}
						tooltip="Visualizar"
					/>
				</div>

			</div>
		)
	}

	const customBodyTimeline = (esterilizacao: any) => {

		const formateDateFrom = `DD/MM/YYYY HH:mm`
		const formateDateFinal = `DD/MM/YYYY HH:mm`

		const events = [
			{
				date: moment(esterilizacao.data_inicio, formateDateFrom).format(formateDateFinal),
				status: `Iniciado`,
				icon: `pi pi-arrow-circle-right`,
				color: `green`,
			},
		]

		if (esterilizacao.situacao_atual === `ESTERILIZACAO_INICIO`) {
			events.push({
				status: `Operando`,
				icon: `pi pi-clock`,
				color: `blue`,
				date: `Há ${moment(esterilizacao.data_inicio, formateDateFrom).locale(`pt-br`).fromNow(true)}`
			})
		}

		if (esterilizacao.situacao_atual === `ESTERILIZACAO_FIM`) {
			events.push({
				date: moment(esterilizacao.data_fim, formateDateFrom).format(formateDateFinal),
				status: `Finalizado`,
				icon: `pi pi-check-circle`,
				color: `green`,
			})
		}

		if (esterilizacao.situacao_atual === `ABORTADO`) {
			events.push({
				status: `Abortado`,
				date: moment(esterilizacao.data_fim, formateDateFrom).format(formateDateFinal),
				icon: `pi pi-exclamation-triangle`,
				color: `red`,
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
			<TitleWithBackArrow
				title={`Pesquisa de Esterilização`}
				page={RoutersPathName.Esterilizacao}
			/>
			<ViewEsterilizacao
				setShowModal={handleCloseModalView}
				showModal={showModalView}
				dadosView={esterilizacaoView}
				conteudoPDF={conteudoPDF}
				abortarStatus={abortarStatus}
				finalizarStatus={finalizarStatus}
			/>
			<ModalEquipamentoView
				showModal={showModalEquipamento}
				setShowModal={setShowModalEquipamento}
				dadosView={equipamento}
			/>
			<ModalEtiquetaEsterilizacao
				showModalEtiqueta={showModalEtiqueta}
				setShowModalEtiqueta={setShowModalEtiqueta}
				dadosEtiqueta={dadosEtiqueta as DadosPdfEtiquetaEsterilizacao}
				finalizado={successEsterilizacao}
			/>
			<div className={style1}>
				<div className="flex gap-2">
					<Calendar
						style={{ width: `100%` }}
						id="fromDate"
						value={fromDate}
						onChange={(e) => {
							setFromDate(e.value)
							setPaginaAtual(0)
						}}
						placeholder="Data de"
						showTime
						showIcon
						dateFormat="dd/mm/yy"/>
					<Calendar
						style={{width: `100%`}}
						id="toDate"
						value={toDate}
						onChange={(e) => {
							setToDate(e.value)
							setPaginaAtual(0)
						}}
						placeholder="Data até"
						showTime
						showIcon
						dateFormat="dd/mm/yy"/>
					<ConfirmDialog
						draggable={false}
					/>
				</div>
				<div className="flex gap-2">
					<InputText
						id="ciclo"
						placeholder="Ciclo"
						value={ciclo}
						onChange={(e) => {
							setCiclo(e.target.value)
							setPaginaAtual(0)
						}}/>
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
						options={formOptions?.data?.status}
						optionLabel="valor"
						placeholder="Situação"
						value={status}
						onChange={e => {setPaginaAtual(0), setStatus(e.value)}}
					/>
					<div className="flex gap-2 h-3rem">
						<Button
							icon="pi pi-search"
							className={styleActionHeader(`blue`, `600`, `700`) }
							onClick={listarCaixasEsterilizacao}
						/>

						<Button
							icon="pi pi-times"
							className={styleActionHeader(`blue`, `600`, `700`) }
							onClick={clearInputsFiltros}
						/>
					</div>
				</div>
			</div>
			<DataTable
				loading={loading}
				scrollHeight="500px"
				rows={5}
				style={{minWidth: `100px`, height: 520}}
				dataKey="id"
				paginator={false}
				paginatorClassName={`p-0`}
				tableClassName={`p-0`}
				value={esterilizacaoFiltro?.data}
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
					field="equipamento"
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
			<PaginatorAndFooter
				first={paginaAtual}
				meta={esterilizacaoFiltro?.meta}
				onPageChange={onPageChange} />
		</div>
	)
}
