import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import {
	ContainerFlexColumnDiv,
	headerTableStyle,
	titleStyle,
} from "@/util/styles"
import { ModalConferenciaRecebimento } from "@pages/por-grupo/tecnico-cme/processos/recebimento/modal/ModalConferenciaRecebimento.tsx"
import { usePreRecebimento } from "./usePreRecebimento.ts"
import "./recebimento.css"
import { rowClassName } from "@/components/RowTemplate.tsx"
import {
	cnCellRecebimento,
	heigthTable,
} from "@pages/por-grupo/administrativo/cruds/caixa/styles-caixa.ts"
import { InputText } from "primereact/inputtext"
import { Button } from "primereact/button"
import { RoutersPathName } from "@/routes/schemas.ts"
import { useHome } from "@pages/general/Home/useHome.ts"
import { Chart } from "primereact/chart"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import "./style.css"
import moment from "moment"
import { configurarChart } from "@pages/por-grupo/tecnico-cme/processos/recebimento/grafico/utils.ts"
import {
	FlexResponsiveRecebimento,
	styleCell2,
	styleCell2_a,
	styleContainerDireito,
	styleContainerEsquerdo,
	styleContainerEsquerdo2,
	styleContainerRecebimento,
	styleRecebimento4,
	styleTabelas,
} from "@pages/por-grupo/tecnico-cme/processos/recebimento/style.ts"
import { PaginatorAndFooter } from "@/components/table-templates/Paginator/PaginatorAndFooter.tsx"
import TableColumn from "@/components/table-templates/TableColumn.tsx"
import { ProgressSpinner } from "primereact/progressspinner"
import { OverlayPanel } from "primereact/overlaypanel"
import { buttonCheckBox, buttonSearch } from "@/util/styles/buttonAction.ts"
import { Dropdown } from "primereact/dropdown"
import { useAuth } from "@/provider/Auth/index.tsx"

enum ExibirChar {
    Carregando,
    NaoExibir,
    Exibir,
}

export const styleLoadingIcon = `
pi pi-spin
pi-spinner
color-gradiente-maximum-compatibility
`
export const Recebimento = () => {
	const { goRouter } = useHome(0)

	const {
		caixas,
		caixasWithProducts,
		visible,
		loading,
		pesquisando,
		handleCloseModal,
		pesquisarSerial,
		serialRef,
		serial,
		setSerial,
		paginaAtual,
		onPageChange,
		caixasTemporarias,
	} = usePreRecebimento()

	const {
		alertReduced,
		setAlertReduced
	} = useAuth()

	const op = useRef<OverlayPanel>(null)
	const [chartData, setChartData] = useState({})
	const [chartOptions, setChartOptions] = useState({})
	const [exibirChart, setExibirChart] = useState(ExibirChar.Carregando)

	const chartRef = useRef(null)

	const alertPlaceholderLabel = useMemo(() => {
		return alertReduced ? `Sem alerta` : `Alerta normal`
	}, [alertReduced])

	useEffect(() => {
		const documentStyle = getComputedStyle(document.documentElement)
		if (caixas?.data?.summarized?.por_cliente?.length > 1) {
			const { summarized } = caixas.data
			const labels = summarized.por_cliente.map(
				(cliente: any) => cliente?.cliente?.nome_abreviado,
			)
			const dados = summarized.por_cliente.map(
				(cliente: any) => cliente?.quantidade,
			)
			const tooltips = summarized.por_cliente.map(
				(cliente: any) => cliente?.cliente?.nome,
			)
			const [data, options] = configurarChart(
				documentStyle,
				labels,
				dados,
				tooltips,
			)
			setChartData(data)
			setChartOptions(options)
			setTimeout(() => {
				setExibirChart(ExibirChar.Exibir)
			}, 200)
		}
		if (caixas?.data?.summarized?.por_cliente?.length === 1) {
			setExibirChart(ExibirChar.NaoExibir)
		}
	}, [caixas])

	useEffect(() => {
		if (chartRef.current) {
			const updateChartSize = () => {
				// Atualiza apenas se o elemento do gráfico existir
				// @ts-ignore
				chartRef?.current?.refresh()
			}
			window.addEventListener(`resize`, updateChartSize)
		}
	}, [chartRef])

	const MostrarGrafico = useCallback(() => {
		if (exibirChart === ExibirChar.Exibir) {
			return (
				<div className={styleCell2_a}>
					<h4 className={styleRecebimento4}>Demandas por cliente</h4>
					<Chart
						ref={chartRef}
						type="bar"
						data={chartData}
						options={chartOptions}
						height={`550px`}
					/>
				</div>
			)
		}
		if (exibirChart === ExibirChar.Carregando) {
			return (
				<div className={styleCell2_a}>
					<h4 className={styleRecebimento4}>Demandas por cliente</h4>
					<div className="card flex justify-content-center">
						<ProgressSpinner />
					</div>
				</div>
			)
		}
	}, [chartData, chartOptions, exibirChart])

	const [caixaToDetail, setCaixaToDetail] = useState()
	return (
		<div
			className={ContainerFlexColumnDiv}
			style={styleContainerRecebimento}
		>
			<h1 className={titleStyle}>Recepção</h1>
			<div className={FlexResponsiveRecebimento}>
				<div className={styleContainerEsquerdo2}>
					<div className={`margin-top-custom w-full`}></div>
					<div className={styleContainerEsquerdo}>
						{MostrarGrafico()}
						<div className={styleCell2}>
							<h4 className={styleRecebimento4}>
                                Últimas caixas conferidas
							</h4>
							<OverlayPanel ref={op} dismissable={true}>
								{JSON.stringify(caixaToDetail)}
							</OverlayPanel>
							<DataTable
								value={caixasTemporarias ?? []}
								emptyMessage={`Os registros serão temporários`}
								scrollHeight={heigthTable}
								className={styleTabelas}
								dataKey={`serial`}
								stripedRows
								rowHover
								rowClassName={rowClassName}
							>
								{/*<Column*/}
								{/*	header=""*/}
								{/*	field=""*/}
								{/*	headerStyle={headerTableStyle}*/}
								{/*	className={cnCellRecebimento}*/}
								{/*	body={(data) => {*/}
								{/*		return (*/}
								{/*			<Button*/}
								{/*				icon={`pi pi-info`}*/}
								{/*				severity="info"*/}
								{/*				text*/}
								{/*				onMouseEnter={(e) => {*/}
								{/*					// @ts-ignore*/}
								{/*					op.current.toggle(e)*/}
								{/*					setCaixaToDetail(data)*/}
								{/*				}}*/}
								{/*				onMouseLeave={(e) => {*/}
								{/*					// @ts-ignore*/}
								{/*					op.current.toggle(e)*/}
								{/*				}}*/}

								{/*			/>*/}

								{/*		)*/}
								{/*	}}*/}
								{/*	style={{*/}
								{/*		width: `5%`*/}
								{/*	}}*/}
								{/*/>*/}
								<Column
									field="serial"
									header="Caixa"
									headerStyle={headerTableStyle}
									className={cnCellRecebimento}
									style={{
										width: `25%`,
									}}
								/>
								<Column
									field=""
									header="Horário"
									headerStyle={headerTableStyle}
									className={cnCellRecebimento}
									body={(data) => {
										return (
											<div>
												{data.caixa_completa
													? `Conforme`
													: `Não conforme`}{` `}
                                                em{` `}
												{moment(data.horario).format(
													`DD/MM/YYYY hh:mm`,
												)}
											</div>
										)
									}}
									style={{
										width: `70%`,
									}}
								/>
							</DataTable>
						</div>
					</div>
				</div>
				<div className={styleContainerDireito}>
					<form
						onSubmit={(e) => {
							e.preventDefault()
							e.stopPropagation()
							pesquisarSerial()
						}}
						style={{ height: 64 }}
						className="flex gap-2"
					>
						<InputText
							ref={serialRef}
							type="text"
							autoFocus
							placeholder="Serial"
							className="w-10rem h-3rem"
							value={serial}
							onChange={(e) => {
								// @ts-ignore
								setSerial(e.target.value)
							}}
						/>

						<Button
							type="submit"
							iconPos={`right`}
							icon={buttonCheckBox.icon}
							label={`Conferir`}
							loading={pesquisando}
							className={`h-3rem mr-auto ${buttonCheckBox.color}`}
						/>

						<Dropdown
							placeholder={alertPlaceholderLabel}
							className={`h-3rem mr-auto`}
							value={alertReduced}
							options={[
								{ label: `Sem alerta`, value: true },
								{ label: `Alerta normal`, value: false },
							]}
							onChange={(e) => {
								setAlertReduced(e.value)
							}}
						/>

						<Button
							className={`h-3rem w-12rem xl:w-18rem ${buttonSearch.color}`}
							type="button"
							iconPos={`right`}
							icon={buttonSearch.icon}
							label={`Histórico de itens recebidos`}
							disabled={pesquisando}
							onClick={() => {
								goRouter(RoutersPathName.PesquisarRecebimentos)
							}}
						/>
					</form>
					<h4 className={styleRecebimento4}>Itens a conferir</h4>
					<DataTable
						value={caixas?.data?.paginated ?? []}
						className={styleTabelas}
						scrollHeight={`500px`}
						style={{ height: 500 }}
						loading={loading}
						loadingIcon={styleLoadingIcon}
						dataKey="serial"
						rowHover
						stripedRows
						rowClassName={rowClassName}
						emptyMessage="Não há caixas pendentes."
						size={`small`}
						cellSelection
					>
						<Column
							field="serial"
							header="Serial"
							headerStyle={headerTableStyle}
							className={
								cnCellRecebimento + ` cursor-auto select-all`
							}
							style={{
								width: `20%`,
							}}
							body={TableColumn}
						/>
						<Column
							field="descricao"
							header="Descrição"
							headerStyle={headerTableStyle}
							className={cnCellRecebimento + ` select-none`}
							body={TableColumn}
						/>
						<Column
							field="cliente.nome_abreviado"
							header="Cliente"
							headerStyle={headerTableStyle}
							className={cnCellRecebimento + ` select-none`}
							body={TableColumn}
							style={{
								width: `15%`,
							}}
						/>
						<Column
							field="situacao"
							header="Situação"
							headerStyle={headerTableStyle}
							className={cnCellRecebimento + ` select-none`}
							body={TableColumn}
							style={{
								width: `15%`,
							}}
						/>

						<Column
							field="ultimo_registro"
							header="Atualizado em"
							headerStyle={headerTableStyle}
							className={cnCellRecebimento + ` select-none`}
							body={TableColumn}
							style={{
								width: `20%`,
							}}
						/>
					</DataTable>
					<PaginatorAndFooter
						first={paginaAtual}
						onPageChange={onPageChange}
						meta={caixas?.meta}
						loading={loading}
					/>
				</div>
			</div>
			<ModalConferenciaRecebimento
				closeDialog={handleCloseModal}
				conteudo={caixasWithProducts}
				openDialog={visible}
			/>
		</div>
	)
}
