import {ContainerFlexColumnDiv, headerTableStyle, titleStyle} from "@/util/styles"
import {Button} from "primereact/button"
import {Column} from "primereact/column"
import {DataTable} from "primereact/datatable"
import {Calendar} from 'primereact/calendar'
import {useRelatorioPlantao} from "./useRelatorioPlantao"
import {ModalGrafico} from "./ModalGrafico"

export function RelatorioPlantao() {
	const {
		dataRelatorio, setDataRelatorio,
		filterRelatorio,
		listaFiltroRelatorio,
		mostraGrafico,
		visibleModalGrafico, setVisibleModalGrafico,
		exportExcel
	} = useRelatorioPlantao()

	const today = new Date()

	const header = (
		<Button icon="pi pi-file-excel" label="Exportar Excel" severity="success" rounded onClick={exportExcel}
			data-pr-tooltip="XLS"/>
	)

	return (
		<div className={ContainerFlexColumnDiv}>

			<h1 className={titleStyle}>Relatórios de Plantões</h1>
			<div>
				<Calendar
					mask="99/9999"
					value={dataRelatorio}
					onChange={(e) => {
						//@ts-ignore
						setDataRelatorio(e.value)
					}}
					className="mt-4"
					showIcon
					dateFormat="mm/yy"
					locale="pt"
					view="month"
					maxDate={today}
				/>
				<Button
					className="ml-1 hover:bg-blue-700"
					icon='pi pi-search'
					label="Pesquisar"
					onClick={filterRelatorio}
				/>
				<Button
					className="ml-1 bg-red-600 border-red-600 hover:bg-red-700"
					icon='pi pi-chart-bar'
					label="Exibir Gráficos"
					onClick={mostraGrafico}
				/>
			</div>

			<ModalGrafico
				visible={visibleModalGrafico}
				onClose={() => setVisibleModalGrafico(false)}
				dados={listaFiltroRelatorio}
			/>

			<DataTable
				value={listaFiltroRelatorio}
				className="w-full mt-4"
				scrollable
				header={header}
				scrollHeight="1300px"
				style={{minWidth: `100px`}}
				selectionMode="single"
				rowHover
				emptyMessage='Nenhum resultado encontrado'
			>
				<Column
					field="idprofissional"
					header="#"
					headerStyle={headerTableStyle}
				/>

				<Column
					field="nome"
					header="Profissional"
					headerStyle={headerTableStyle}
				/>

				<Column
					field="quantidade_abertos"
					header="Abertos"
					headerStyle={headerTableStyle}
				/>
				<Column
					field="quantidade_fechados"
					header="Fechados"
					headerStyle={headerTableStyle}
				/>
				<Column
					field="media_duracao"
					header="Média de Duração"
					headerStyle={headerTableStyle}
				/>
			</DataTable>
		</div>
	)
}
