import { rowClassName, styleActionTable } from "@/components/RowTemplate"
import { PaginatorAndFooter } from "@/components/table-templates/Paginator/PaginatorAndFooter"
import { ContainerFlexColumnDiv, headerTableStyle, titleStyle } from "@/util/styles"
import { Button } from "primereact/button"
import { Column } from "primereact/column"
import { DataTable } from "primereact/datatable"
import { useIndicadores } from "./useIndicadores"
import { IndicadoresResponse } from "@/infra/integrations/administrativo/indicadores/types"
import { ModalAssociar } from "./modais/ModalAssociar"
import { ModalIndicadores } from "./modais/ModalIndicadores"
import { ModalVisualizarIndicador } from "./modais/ModalVisualizar"
import { Dialog } from "primereact/dialog"

export function Indicadores() {
	const {
		indicadores,
		loading,
		visible, setVisible,
		paginaAtual,
		onPageChange,
		visibleModalView, setVisibleModalView,
		indicador, setIndicador,
		listarIndicadores,
		visibleModalAssociar, setVisibleModalAssociar,
		visibleModalExcluir, setVisibleModalExcluir,
		excluirIndicadores
	} = useIndicadores()

	const templateActions = (data: IndicadoresResponse) => {
		return (
			<div className="flex gap-2 h-2rem">
				<Button
					className={styleActionTable(`blue`, 500)}
					outlined
					icon='pi pi-pencil'
					tooltip={`Editar`}
					onClick={() => {setIndicador(data), setVisible(true)}}
				/>
				<Button
					className={styleActionTable(`red`, 700)}
					outlined
					icon='pi pi-trash'
					tooltip={`Excluir`}
					onClick={() => {setIndicador(data), setVisibleModalExcluir(true)}}
				/>
				<Button
					className={styleActionTable(`blue`, 900)}
					outlined
					icon='pi pi-eye'
					onClick={() => {
						setIndicador(data)
						setVisibleModalView(true)
					}}
				/>
				<Button
					className={styleActionTable(`green`, 600)}
					outlined
					tooltip="Adicionar unidades"
					icon='pi pi-plus'
					onClick={() => {
						setVisibleModalAssociar(true)
						setIndicador(data)
					}}
				/>
			</div>
		)
	}

	return (
		<div className={ContainerFlexColumnDiv}>
			<h1 className={titleStyle}>Indicadores</h1>

			<Button
				onClick={() => setVisible(true)}
				className={`my-2 ml-auto bg-blue-800 hover:bg-blue-600`}
				label="Novo Indicador"
				data-testid='botao-novo-indicador'
			/>

			<DataTable
				loading={loading}
				dataKey="id"
				value={indicadores?.data}
				className="w-full"
				style={{minWidth: `100px`}}
				rowClassName={rowClassName}
				paginatorClassName={`p-0 mt-0`}
				tableClassName={`p-0`}
				rowHover
				stripedRows
				emptyMessage='Nenhum resultado encontrado.'
			>
				<Column
					field="id"
					header="#"
					headerStyle={headerTableStyle}
				/>
				<Column
					field="codigo"
					header="Código"
					headerStyle={headerTableStyle}
				/>
				<Column
					field="descricao"
					header="Descrição"
					headerStyle={headerTableStyle}
				/>
				<Column
					field="tipo"
					header="Tipo"
					headerStyle={headerTableStyle}
				/>
				<Column
					field="saldo"
					header="Saldo"
					headerStyle={headerTableStyle}
				/>
				<Column
					header="Ações"
					headerStyle={headerTableStyle}
					body={templateActions}
				/>
			</DataTable>
			<PaginatorAndFooter
				first={paginaAtual}
				meta={indicadores?.meta}
				onPageChange={onPageChange}
			/>

			<ModalIndicadores
				visible={visible}
				onClose={() => {setVisible(false), setIndicador(undefined)}}
				indicador={indicador}
				listarIndicadores={listarIndicadores}
			/>

			<ModalAssociar
				visible={visibleModalAssociar}
				onClose={() => {setVisibleModalAssociar(false), setIndicador(undefined), listarIndicadores()}}
				indicador={indicador}
			/>

			<ModalVisualizarIndicador
				showModal={visibleModalView}
				onClose={() => {setVisibleModalView(false), setIndicador(undefined), listarIndicadores()}}
				listarIndicadores={listarIndicadores}
				dadosView={indicador}

			/>

			<Dialog
				header={<i className="pi pi-exclamation-circle text-4xl"></i>}
				draggable={false}
				resizable={false}
				closeOnEscape={true}
				dismissableMask={true}
				onHide={() => setVisibleModalExcluir(false)}
				visible={visibleModalExcluir}
			>
				<h2 className="m-0 mb-3 flex flex-column">Tem certeza que deseja excluir este registro?
					<i className="text-xs">&#40;Ao excluir o indicador, todos os lotes vinculados a ele também serão excluídos&#41;</i>
				</h2>

				<div className="flex gap-2">
					<Button label="Não" onClick={() => setVisibleModalExcluir(false)} />
					<Button
						label="Sim, tenho certeza"
						onClick={() => {
							excluirIndicadores(indicador)
						} }
						data-testid='confirmar-switch' />

				</div>
			</Dialog>
		</div>
	)
}
