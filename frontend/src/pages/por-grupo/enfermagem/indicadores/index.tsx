import {rowClassName, styleActionHeader, styleActionTable} from "@/components/RowTemplate"
import {ContainerFlexColumnDiv, headerTableStyle, titleStyle} from "@/util/styles"
import {Button} from "primereact/button"
import {Column} from "primereact/column"
import {DataTable} from "primereact/datatable"
import {InputText} from "primereact/inputtext"
import {Paginator} from "primereact/paginator"
import {useIndicador} from "./useIndicador"
import {TemplatePaginator} from "@/components/table-templates/Paginator/TemplatePaginator.tsx"
import {ModalIndicador} from "./ModalIndicador"
import {ModalVisualizarIndicador} from "./ModalIndicador/ModalVisualizarIndicador"
import {Dialog} from "primereact/dialog"

export const TipoOcorrencia = () => {
	const {
		loading,
		visible, setVisible,
		descricao, setDescricao,
		first, setFirst,
		indicadores,
		indicador, setIndicador,
		visibleModalVisualizar, setVisibleModalVisualizar,
		onPageChange,
		refreshTable,
		visibleModalDeletar, setVisibleModalDeletar,
		deleteIndicador
	} = useIndicador()

	const visualizarIndicador = (indicador: any) => {
		setIndicador(indicador)
		setVisibleModalVisualizar(true)
	}

	const editIndicador = (indicador: any) => {
		setIndicador(indicador)
		setVisible(true)
	}

	const AcoesEditDelete = (indicador: any) => {
		return (
			<div className='flex gap-2 h-2rem'>
				<Button
					icon="pi pi-eye"
					outlined
					className={styleActionTable(`green`, 600)}
					onClick={() => visualizarIndicador(indicador)}
				/>
				<Button
					icon="pi pi-pencil"
					outlined
					className={styleActionTable(`blue`, 500)}
					onClick={() => editIndicador(indicador)}
				/>
				<Button
					icon="pi pi-trash"
					outlined
					className={styleActionTable(`red`, 700)}
					onClick={() => {
						setVisibleModalDeletar(true)
						setIndicador(indicador)
					}}
				/>
			</div>
		)
	}

	const resetFilter = () => {
		refreshTable(true)
		setDescricao(``)
	}

	return (
		<div className={ContainerFlexColumnDiv}>
			<h1 className={titleStyle}>Tipos de Ocorrências</h1>
			<Dialog
				header=':"&#40;'
				onHide={() => setVisibleModalDeletar(false)}
				visible={visibleModalDeletar}
			>
				<h2 className="m-0 mb-3">Tem certeza que deseja excluir?</h2>

				<div className="flex gap-2">
					<Button label="Não" onClick={() => setVisibleModalDeletar(false)}/>
					<Button label="Sim, tenho certeza" onClick={() => deleteIndicador(indicador)}/>
				</div>
			</Dialog>

			<div
				className={`my-3 flex flex-column lg:flex-row justify-content-between w-full align-items-center gap-2`}>
				<div className='flex align-items-center gap-2'>
					<div className={`flex lg:flex-row flex-column gap-2`}>
						<InputText
							placeholder="Descrição"
							value={descricao}
							onChange={(e) => {
								setDescricao(e.target.value)
								setFirst(0)
							}}
						/>
					</div>
					<Button
						className={styleActionHeader(`gray`, `700`, `500`) + `h-3rem`}
						icon="pi pi-times"
						tooltip="Limpar pesquisa"
						onClick={resetFilter}
					/>
				</div>
				<Button
					onClick={() => setVisible(true)}
					className="w-3 hover:bg-blue-300"
					label="Novo Tipo de Ocorrência"
				/>
			</div>
			<ModalIndicador
				visible={visible}
				onClose={refreshTable}
				indicador={indicador}
				setIndicador={setIndicador}
			/>
			<ModalVisualizarIndicador
				visible={visibleModalVisualizar}
				onClose={() => setVisibleModalVisualizar(false)}
				indicador={indicador}
			/>
			<DataTable
				value={indicadores?.data}
				loading={loading}
				scrollable
				className="w-full text-sm"
				stripedRows
				size="small"
				rowClassName={rowClassName}
				rowHover
				emptyMessage="Nenhum resultado encontrado"
			>
				<Column
					headerStyle={headerTableStyle}
					field="id"
					header="#"
				/>
				<Column
					headerStyle={headerTableStyle}
					field="descricao"
					header="Descrição"
				/>
				<Column
					headerStyle={headerTableStyle}
					header="Ações"
					body={AcoesEditDelete}
				/>
			</DataTable>
			<div className="w-full">
				<Paginator
					className={`p-0`}
					first={first}
					rows={1}
					totalRecords={indicadores?.meta?.totalPages}
					onPageChange={(e) => onPageChange(e)}
					template={TemplatePaginator}
				/>
			</div>
			<div className='w-full flex justify-content-end py-2 px-4 mb-5 bg-blue-800 text-white'>
				<span>Exibindo {indicadores?.meta?.firstItem}-{indicadores?.meta?.lastItem} de {indicadores?.meta?.totalItems} itens</span>
			</div>
		</div>
	)
}
