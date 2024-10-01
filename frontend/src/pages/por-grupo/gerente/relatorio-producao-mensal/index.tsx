import {styleActionHeader} from "@/components/RowTemplate"
import {titleStyle} from "@/util/styles"
import {Button} from "primereact/button"
import {Calendar} from "primereact/calendar"
import { Sidebar } from 'primereact/sidebar'
import {useState} from "react"
import {useCliente} from "../../administrativo/cruds/cliente/novo-cliente/useCliente"
import {useRelatoriosProducaoMensal} from "./useRelatorioProducaoMensal"
import {GraficoGeral} from "./graficos/GraficoGeral"
import { MultiSelect } from "primereact/multiselect"
import { ModalRelatorioProducaoMensal } from "./ModalRelatorioProducaoMensal"

export const RelatorioProducaoMensal = () => {
	const [visibleModalRelatorioProducaoMensal, setVisibleRelatorioProducaoMensal] = useState(false)
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
	} = useRelatoriosProducaoMensal(clientes)

	return (
		<div className={`px-8`}>
			<h1 className={titleStyle}>Relatórios - Produção Mensal</h1>
			<div className="flex gap-5">
				<div className="h-full w-full pb-7">
					<ModalRelatorioProducaoMensal
						visible={visibleModalRelatorioProducaoMensal}
						onClose={() => setVisibleRelatorioProducaoMensal(false)}
						data={dados}
						datasRange={dateInterval}
					/>
					<GraficoGeral
						data={dados}
						setVisibleRelatorioProducaoMensal={setVisibleRelatorioProducaoMensal}
						setVisibleFiltros={setVisibleFiltros}
					/>
				</div>

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
							value={cliente}
							options={clientesDropdown}
							onChange={(e) => {
								setCliente(e.value)
							}}
							placeholder="Selecione um ou mais clientes"
							className="text-left"
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
				</Sidebar>

			</div>

		</div>

	)
}
