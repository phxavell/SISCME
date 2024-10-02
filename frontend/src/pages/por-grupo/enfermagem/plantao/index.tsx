import { ContainerFlexColumnDiv, headerTableStyle, titleStyle } from "@/util/styles"
import { Button } from "primereact/button"
import { usePlantao } from "./usePlantao"
import { Column } from "primereact/column"
import { DataTable } from "primereact/datatable"
import { DataPlantao } from "@/infra/integrations/plantao"
import { ModalDescricao } from "./ModalPlantao/ModalDescricao"
import { ModalEditDescricao } from "./ModalPlantao/ModalEditDescricao"
import { ModalPlantao } from "./ModalPlantao"
import { ModalFechamentoDescricao } from "./ModalPlantao/ModalFechamentoDescricao"
import { Tag } from "primereact/tag"
import { Tooltip } from "primereact/tooltip"
import { ModalPlantaoPdf } from "./ModalPlantao/ModalPlantaoPdf"
import {PaginatorAndFooter} from "@/components/table-templates/Paginator/PaginatorAndFooter.tsx"
import DateTemplate from "@/components/table-templates/DateTemplate"

export function Plantao() {
	const {
		visible, setVisible,
		visibleModalDescricao,
		visibleModalEditDescricao, setVisibleModalEditDescricao,
		loading,
		first,
		onPageChange,
		plantoes,
		onRowSelect,
		plantaoDescricao, setPlantaoDescricao,
		refreshTable,
		visibleModalFechamentoDescricao, setVisibleModalFechamentoDescricao,
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
					className='pdf bg-red-600 border-red-600 hover:bg-red-700'
					icon='pi pi-file-pdf'
					onClick={() => {setPlantaoDescricao(plantao); setVisibleModalPlantaoPdf(true)}}
				/>
			</div>
		)
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
				className="w-3 mb-5"
				label="Novo Plantão"
			/>

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
				rowHover
				stripedRows
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
					field="dtnascimento"
					header="Data de Cadastro"
					headerStyle={headerTableStyle}
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
			<PaginatorAndFooter
				first={first}
				onPageChange={onPageChange}
				meta={plantoes?.meta}/>
		</div>
	)
}
