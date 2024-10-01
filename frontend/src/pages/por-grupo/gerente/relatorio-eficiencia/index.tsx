import {styleActionHeader} from "@/components/RowTemplate"
import {titleStyle} from "@/util/styles"
import {Button} from "primereact/button"
import {Calendar} from "primereact/calendar"
import { Sidebar } from 'primereact/sidebar'
import {useState} from "react"
import {useRelatoriosEficiencia} from "./useRelatorioEficiencia"
import {GraficoGeral} from "./graficos/GraficoGeral"
import { ModalRelatorioEficiencia } from "./ModalRelatorioEficiencia"
import { MultiSelect } from "primereact/multiselect"
import { SelectButton, SelectButtonChangeEvent } from "primereact/selectbutton"

export const RelatorioEficiencia = () => {
	const [visibleModalRelatorioEficiencia, setVisibleRelatorioEficiencia] = useState(false)
	const [visibleFiltros, setVisibleFiltros] = useState(false)
	const {
		dados,
		clearFilters,
		equipamentosDropdown,
		equipamento, setEquipamento,
		dateInterval, setDateInterval,
		handleSetSevenDays,
		handleSetThirtyDays,
		optionsTipoDeDados,
		setTipoDado, tipoDado
	} = useRelatoriosEficiencia()
	const justifyTemplate = (option: any) => {
		return <label>{option.name}</label>
	}
	return (
		<div className={`lg:px-8 md:px-0`}>
			<h1 className={titleStyle}>Relatórios - Eficiência</h1>
			<div className="flex gap-5">
				<div className="h-full w-full pb-7">
					<ModalRelatorioEficiencia
						visible={visibleModalRelatorioEficiencia}
						onClose={() => setVisibleRelatorioEficiencia(false)}
						data={dados}
						datasRange={dateInterval}
					/>
					<GraficoGeral
						data={dados}
						setVisibleRelatorioEficiencia={setVisibleRelatorioEficiencia}
						setVisibleFiltros={setVisibleFiltros}
					/>
				</div>
				<div className={`mt-4`}>
					<Sidebar
						position="right"
						visible={visibleFiltros}
						onHide={() => setVisibleFiltros(false)}
					>
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
								value={equipamento}
								options={equipamentosDropdown()}
								onChange={(e) => {
									setEquipamento(e.value)
								}}
								placeholder="Equipamentos"
								className="text-left"
							/>
							<Button
								icon="pi pi-times"
								label="Limpar filtros"
								onClick={() => {
									clearFilters()
								}}
								className={styleActionHeader(`blue`, `600`, `700`)}
							/>
							<SelectButton
								value={tipoDado}
								className="mt-3"
								onChange={(e: SelectButtonChangeEvent) => {setTipoDado(e.value), setEquipamento(undefined)}}
								optionLabel="name"
								options={optionsTipoDeDados}
								itemTemplate={justifyTemplate}
							/>

						</div>
					</Sidebar>
				</div>
			</div>
		</div>

	)
}
