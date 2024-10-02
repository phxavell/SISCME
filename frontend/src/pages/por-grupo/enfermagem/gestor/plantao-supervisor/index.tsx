import { ContainerFlexColumnDiv, headerTableStyle, titleStyle } from "@/util/styles"
import { Button } from "primereact/button"
import { usePlantao } from "../../plantao/usePlantao"
import { Column } from "primereact/column"
import { DataTable } from "primereact/datatable"
import { DataPlantao } from "@/infra/integrations/plantao"
import { ModalEditDescricao } from "./ModalPlantao/ModalEditDescricao"
import { ModalPlantao } from "./ModalPlantao"
import { ModalFechamentoDescricao } from "./ModalPlantao/ModalFechamentoDescricao"
import { Calendar } from 'primereact/calendar'
import { RadioButton } from "primereact/radiobutton"
import { InputText } from "primereact/inputtext"
import { Tag } from "primereact/tag"
import { Tooltip } from "primereact/tooltip"
import { ModalPlantaoPdf } from "../../plantao/ModalPlantao/ModalPlantaoPdf"
import { divFilterStyle } from "./styles"
import {ModalDescricao} from "@pages/por-grupo/enfermagem/plantao/ModalPlantao/ModalDescricao.tsx"
import DateTemplate from "@/components/table-templates/DateTemplate"
import { PaginatorAndFooter } from "@/components/table-templates/Paginator/PaginatorAndFooter"

export function PlantaoSupervisor() {
	const {
		visible, setVisible,
		visibleModalDescricao,
		visibleModalEditDescricao, setVisibleModalEditDescricao,
		loading,
		first, setFirst,
		onPageChange,
		plantoes,
		onRowSelect,
		plantaoDescricao, setPlantaoDescricao,
		refreshTable,
		visibleModalFechamentoDescricao,
		setVisibleModalFechamentoDescricao,
		filterPlantao,
		dateInitial, setDateInitial,
		dateFinal, setDateFinal,
		status, setStatus,
		profissional, setProfissional,
		visibleModalPlantaoPdf, setVisibleModalPlantaoPdf
	} = usePlantao()

	const templateActions = (plantao: DataPlantao) => {
		const styleButtonEdit = () => {
			if (plantao.status == `FECHADO`) {
				return `edit bg-blue-800 border-0 opacity-60`
			} else {
				return `edit bg-blue-800 border-0 hover:bg-blue-900`
			}
		}

		const styleButtonFecharPlantao = () => {
			if (plantao.status == `FECHADO`) {
				return `fechar bg-gray-800 border-0 opacity-60`
			} else {
				return `fechar bg-gray-800 border-0 hover:bg-gray-900`
			}
		}
		return (
			<div className="flex gap-2 h-2rem">
				<Tooltip
					target=".edit"
					mouseTrack
					mouseTrackLeft={20}
					content="Editar Plantão"
				/>
				<Tooltip
					target=".fechar"
					mouseTrack
					mouseTrackLeft={20}
					content="Fechar Plantão"
				/>
				<Tooltip
					target=".pdf"
					mouseTrack
					mouseTrackLeft={20}
					content="PDF"
				/>
				<Button
					className={styleButtonEdit()}
					icon='pi pi-pencil'
					disabled={plantao.status == `FECHADO`}
					onClick={() => {setVisibleModalEditDescricao(true); setPlantaoDescricao(plantao)}}
				/>

				<Button
					className={styleButtonFecharPlantao()}
					icon='pi pi-lock'
					disabled={plantao.status == `FECHADO`}
					onClick={() => {setPlantaoDescricao(plantao); setVisibleModalFechamentoDescricao(true)}}
				/>
				<Button
					className='pdf bg-orange-600 border-orange-600 hover:bg-orange-700'
					icon='pi pi-file-pdf'
					onClick={() => {setPlantaoDescricao(plantao); setVisibleModalPlantaoPdf(true)}}
				/>
			</div>
		)
	}

	const today = new Date()

	const limparFiltro = () => {
		refreshTable(true)
		setProfissional(``)
		setDateInitial(null)
		setDateFinal(null)
		setStatus(``)
		setFirst(0)
	}

	const statusTemplate = (plantao: DataPlantao) => {
		return (
			<Tag className="text-sm "
				style={plantao?.status == `ABERTO` ? {background: `green`} : {background: `red`} }
				value={plantao.status}
			/>
		)
	}

	return (
		<div className={ContainerFlexColumnDiv}>

			<h1 className={titleStyle}>Plantões</h1>

			<ModalPlantao
				visible={visible}
				onClose={refreshTable}
			/>

			<ModalDescricao
				visible={visibleModalDescricao}
				onClose={refreshTable}
				plantao={plantaoDescricao}
			/>

			<ModalEditDescricao
				visible={visibleModalEditDescricao}
				onClose={refreshTable}
				plantao={plantaoDescricao}
			/>

			<ModalFechamentoDescricao
				onClose={refreshTable}
				visible={visibleModalFechamentoDescricao}
				plantao={plantaoDescricao}
			/>


			<ModalPlantaoPdf
				plantao={plantaoDescricao}
				visible={visibleModalPlantaoPdf}
				onClose={refreshTable}
			/>

			<Button
				onClick={() => setVisible(true)}
				className="w-3 hover:bg-blue-600"
				label="Novo Plantão"
			/>

			<div className={divFilterStyle}>
				<div className="flex justify-content-center gap-2 align-items-center relative">
					<p className="m-0">De:</p>
					<Calendar
						mask="99/99/9999"
						value={dateInitial}
						onChange={(e) => {
							//@ts-ignore
							setDateInitial(e.value)
							setFirst(0)
						}}
						showIcon
						dateFormat="dd/mm/yy"
						locale="pt"
						maxDate={today}
						showOnFocus={false}
					/>
					<p className="m-0 ml-3 ">Até:</p>
					<Calendar
						value={dateFinal}
						onChange={(e) => {
							//@ts-ignore
							setDateFinal(e.value)
							setFirst(0)
						}}
						showIcon
						dateFormat="dd/mm/yy"
						locale="pt"
						maxDate={today}
						showOnFocus={false}
						mask="99/99/9999"
					/>
				</div>

				<div className="flex justify-content-center gap-4 align-items-center responsive-filter-plantao">
					<div className="flex justify-content-center gap-6 align-items-center">
						<div className="flex align-items-center">
							<h3 className="m-0 mr-3">Status:</h3>
							<label htmlFor="status1" className="mr-2">Aberto</label>
							<RadioButton inputId="status1" name="aberto" value="ABERTO" onChange={(e) => {setStatus(e.value); setFirst(0)}} checked={status === `ABERTO`} />
						</div>
						<div className="flex align-items-center">
							<label htmlFor="status2" className="mr-2">Fechado</label>
							<RadioButton inputId="status2" name="fechado" value="FECHADO" onChange={(e) => {setStatus(e.value); setFirst(0)}} checked={status === `FECHADO`} />
						</div>

					</div>
					<div className="flex gap-2 align-items-center">
						<h3 className="m-0">Profissional:</h3>
						<InputText value={profissional} onChange={(e) => {setProfissional(e.target.value); setFirst(0)}} />

					</div>
				</div>
				<div className="flex gap-2">
					<Button
						label="Pesquisar"
						className="flex justify-content-center hover:bg-blue-600 px-5"
						icon='pi pi-search'
						onClick={filterPlantao}
					/>
					<Button
						label="Limpar Filtro"
						className="flex justify-content-center bg-gray-800 border-gray-800 hover:bg-gray-900 px-5"
						onClick={limparFiltro}
					/>

				</div>
			</div>

			<DataTable
				loading={loading}
				dataKey="idplantao"
				value={plantoes?.data}
				className="w-full"
				scrollable
				scrollHeight="1300px"
				style={{ minWidth: `100px` }}
				onRowSelect={onRowSelect}
				selectionMode="single"
				stripedRows
				rowHover
				emptyMessage='Nenhum resultado encontrado'
			>
				<Column
					field="idplantao"
					header="#"
					headerStyle={headerTableStyle}
				/>

				<Column
					field="profissional.nome"
					header="Usuário"
					headerStyle={headerTableStyle}
				/>

				<Column
					field="grupousuario"
					header="Grupo"
					headerStyle={headerTableStyle}
				/>

				<Column
					header="Data de Cadastro"
					headerStyle={headerTableStyle}
					field="datacadastro"
					body={DateTemplate(``)}
				/>

				<Column
					field="turno"
					header="Turno"
					headerStyle={headerTableStyle}
				/>

				<Column
					field="status"
					header="Situação"
					headerStyle={headerTableStyle}
					body={statusTemplate}
				/>

				<Column
					header="Ações"
					headerStyle={headerTableStyle}
					body={templateActions}
				/>

			</DataTable>
			<div className="w-full">
				<PaginatorAndFooter
					first={first}
					onPageChange={onPageChange}
					meta={plantoes?.meta}/>
			</div>
		</div>
	)
}
