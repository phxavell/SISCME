import {styleActionHeader} from "@/components/RowTemplate"
import {titleStyle} from "@/util/styles"
import {Button} from "primereact/button"
import {Calendar} from "primereact/calendar"
import { Sidebar } from 'primereact/sidebar'
import {useState} from "react"
import {useRelatoriosMateriais} from "./useRelatorioMateriais"
import {GraficoGeral} from "./graficos/GraficoGeral"
import { ModalRelatorioMateriais } from "./ModalRelatorioMateriais"
import { MultiSelect } from "primereact/multiselect"

export const RelatorioMateriais = () => {
	const [visibleModalRelatorioMateriais, setVisibleRelatorioMateriais] = useState(false)
	const [visibleFiltros, setVisibleFiltros] = useState(false)
	const {
		dados,
		clearFilters,
		tipoEtiqueta, setTipoEtiqueta,
		dateInterval, setDateInterval,
		handleSetSevenDays,
		handleSetThirtyDays,
	} = useRelatoriosMateriais()

	return (
		<div className={`px-8`}>
			<h1 className={titleStyle}>Relatórios - Materiais</h1>
			<div className="flex gap-5">
				<div className="h-full w-full pb-7">
					<ModalRelatorioMateriais
						visible={visibleModalRelatorioMateriais}
						onClose={() => setVisibleRelatorioMateriais(false)}
						data={dados}
						datasRange={dateInterval}
					/>
					<GraficoGeral
						data={dados}
						setVisibleRelatorioMateriais={setVisibleRelatorioMateriais}
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
								value={tipoEtiqueta}
								options={dados?.data?.tipos}
								optionLabel="tipoetiqueta"
								onChange={(e) => {
									setTipoEtiqueta(e.value)
								}}
								placeholder="Tipos de etiqueta"
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

						</div>
					</Sidebar>
				</div>
			</div>
		</div>

	)
}
