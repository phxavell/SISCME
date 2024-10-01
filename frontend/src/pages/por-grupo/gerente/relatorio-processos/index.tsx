import {styleActionHeader} from "@/components/RowTemplate"
import {titleStyle} from "@/util/styles"
import {Button} from "primereact/button"
import {Calendar} from "primereact/calendar"
import { Sidebar } from 'primereact/sidebar'
import {useState} from "react"
import {useCliente} from "../../administrativo/cruds/cliente/novo-cliente/useCliente"
import {useRelatoriosProcessos} from "./useRelatorioProcessos"
import {GraficoGeral} from "./graficos/GraficoGeral"
import { ModalRelatorioProdutividade } from "./ModalRelatorioProdutividade"
import { MultiSelect } from "primereact/multiselect"
import { SelectButton, SelectButtonChangeEvent } from 'primereact/selectbutton'

export const RelatorioProcessos = () => {
	const [visibleModalRelatorioProdutividade, setVisibleRelatorioProdutividade] = useState(false)
	const [visibleFiltros, setVisibleFiltros] = useState(false)
	const {
		clientes,
	} = useCliente()
	const {
		dados,
		clearFilters,
		clientesDropdown,
		setCliente,
		dateInterval, setDateInterval,
		handleSetSevenDays,
		handleSetThirtyDays,
		cliente,
		turno, setTurno,
		loading
	} = useRelatoriosProcessos(clientes)

	const optionsTurno = [
		{name: `Todos`, value: `todos`},
		{name: `Diurno`, value: `diurno`},
		{name: `Noturno`, value: `noturno`}
	]
	const justifyTemplate = (option: any) => {
		return <label>{option.name}</label>
	}
	return (
		<div className={`lg:px-8 md:px-0`}>
			<h1 className={titleStyle}>Relatórios - Indicadores de Produtividade</h1>
			<div className="flex">
				<div className="h-full w-full pb-7">
					<ModalRelatorioProdutividade
						visible={visibleModalRelatorioProdutividade}
						onClose={() => setVisibleRelatorioProdutividade(false)}
						data={dados}
						datasRange={dateInterval}
						turno={turno}
					/>
					<GraficoGeral
						loading={loading}
						data={dados}
						setVisibleRelatorioProdutividade={setVisibleRelatorioProdutividade}
						turno={turno}
						setVisibleFiltros={setVisibleFiltros}
					/>
				</div>


				<Sidebar
					position="right"
					visible={visibleFiltros}
					onHide={() => setVisibleFiltros(false)}>
					<div className="flex flex-column w-full">
						<h3 className="m-0 mb-2 text-gray-800 bg-blue-800 border-round-top text-white p-3">Filtros:</h3>
						<div className="flex flex-column gap-2">
							<Calendar
								value={dateInterval}
								id="fromDate"
								onChange={(e) => {
									setDateInterval(e.value)
								}}
								placeholder="Intervalo de datas"
								selectionMode="range"
								showIcon
								maxDate={new Date()}
								dateFormat="dd/mm/yy"
							/>
							<div className="flex gap-1">
								<Button
									icon="pi pi-calendar"
									onClick={() => {
										handleSetSevenDays()
									}}
									className={styleActionHeader(`blue`, `600`, `800`) + `w-full`}
									label="7 dias"
									tooltip="Últimos 7 dias"
								/>
								<Button
									icon="pi pi-calendar"
									onClick={() => {
										handleSetThirtyDays()
									}}
									className={styleActionHeader(`blue`, `600`, `800`) + `w-full`}
									label="30 dias"
									tooltip="Últimos 30 dias"
								/>

							</div>
							<MultiSelect
								value={cliente}
								options={clientesDropdown}
								onChange={(e) => {
									setCliente(e.value)
								}}
								placeholder="Selecione um ou mais clientes"
								className="w-full text-left"
							/>
							<Button
								icon="pi pi-times"
								label={`Limpar filtros`}
								onClick={() => {
									clearFilters()
								}}
								className={styleActionHeader(`blue`, `600`, `700`)}
							/>

						</div>
						<div className="flex flex-column  align-items-center justify-content-center mt-1">
							<h4 className="text-gray-800">Filtrar por turno:</h4>
							<div className="card flex ">
								<SelectButton
									itemTemplate={justifyTemplate}
									value={turno}
									onChange={(e: SelectButtonChangeEvent) => setTurno(e.value)}
									optionLabel="name"
									options={optionsTurno}
								/>
							</div>
						</div>
					</div>
				</Sidebar>

			</div>

		</div>

	)
}
