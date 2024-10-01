import {useState} from 'react'
import {ContainerFlexColumnDiv, headerTableStyle, titleStyle} from '@/util/styles'
import {Column} from 'primereact/column'
import {DataTable} from 'primereact/datatable'
import {useEmbalagem} from './useEmbalagem.ts'
import {Button} from 'primereact/button'
import {ModalEmbalagem} from './ModalEmbalagem'
import {styleLinhaMinimaTabela2} from '../../cruds/caixa/styles-caixa.ts'
import {rowClassName} from '@/components/RowTemplate.tsx'
import {
	ModalEmbalagemVisualizacao
} from '@pages/por-grupo/administrativo/especificoes/embalagem/ModalEmbalagemVisualizacao/intex.tsx'
import {
	ModalEdicaoEmbalagem
} from '@pages/por-grupo/administrativo/especificoes/embalagem/ModalEdicaoEmbalagem/ModalEdicaoEmbalagem.tsx'
import {PaginatorAndFooter} from "@/components/table-templates/Paginator/PaginatorAndFooter.tsx"
import {ModalConfirmDelete} from "@pages/por-grupo/administrativo/cruds/produto/ModalConfirmDelete.tsx"
import { buttonEdit, buttonEye, buttonPlus, buttonTrash } from '@/util/styles/buttonAction.ts'

const defaultValuesEmbalagem = {
	id: 0,
	descricao: ``,
	valorcaixa: ``
}

export function Embalagem() {
	const [excluirEmbalagem, setExcluirEmbalagem] = useState(defaultValuesEmbalagem)

	const {
		embalagens,
		loading,
		onPageChange,
		first,
		setVisible,
		visible,
		refreshTable,
		deleteEmbalagem,
		visibleModalDelete,
		setVisibleModalDelete,
		embalagem,
		visibleModalEditar, openModalEditar, closeModalEditar,
		visibleModalPreview, openModalPreview, closeModalPreview,
	} = useEmbalagem()

	const AcoesTemplate = (data: any) => {
		return (
			<div className="flex gap-2 h-2rem">
				<Button
					icon={buttonEye.icon}
					className={buttonEye.color}
					outlined
					data-testid='botao-visualizar'
					onClick={() => {
						openModalPreview(data)
					}}
				/>
				<Button
					icon={buttonEdit.icon}
					className={buttonEdit.color}
					outlined
					data-testid='botao-editar'
					onClick={() => {
						openModalEditar(data)
					}}
				/>
				<Button
					icon={buttonTrash.icon}
					className={buttonTrash.color}
					outlined
					data-testid='botao-excluir'
					onClick={() => {
						setVisibleModalDelete(true)
						setExcluirEmbalagem(data)
					}}
				/>
			</div>
		)
	}

	return (
		<div className={ContainerFlexColumnDiv}>
			<h1 className={titleStyle}>Embalagens</h1>
			<Button
				onClick={() => setVisible(true)}
				icon={buttonPlus.icon}
				className={`${buttonPlus.color} mb-2 ml-auto`}
				label="Nova Embalagem"
				data-testid='botao-nova-embalagem'
			/>

			<DataTable
				value={embalagens?.data}
				loading={loading}
				className="w-full text-sm"
				scrollable
				scrollHeight="450px"
				stripedRows
				rowClassName={rowClassName}
				rowHover
				emptyMessage='Nenhum resultado encontrado'

			>
				<Column
					headerStyle={headerTableStyle}
					header="#"
					field="id"
					className={`${styleLinhaMinimaTabela2} w-1`}
				/>
				<Column
					header="Descrição"
					field="descricao"
					headerStyle={headerTableStyle}
					className={styleLinhaMinimaTabela2}
				/>
				<Column
					header="Valor"
					field="valorcaixa"
					headerStyle={headerTableStyle}
					className={styleLinhaMinimaTabela2}
				/>

				<Column
					header="Ações"
					headerStyle={headerTableStyle}
					body={AcoesTemplate}
					className={`${styleLinhaMinimaTabela2} w-14rem`}
				/>
			</DataTable>

			<PaginatorAndFooter
				first={first}
				onPageChange={onPageChange}
				meta={embalagens?.meta}/>

			<ModalConfirmDelete
				modalTipoVisible={visibleModalDelete}
				titulo="Confirmar"
				onClose={() => setVisibleModalDelete(false)}
				onConfirm={() => deleteEmbalagem(excluirEmbalagem)}
			/>

			<ModalEmbalagem
				visible={visible}
				onClose={refreshTable}/>

			<ModalEmbalagemVisualizacao
				visible={visibleModalPreview}
				onClose={closeModalPreview}
				embalagemData={embalagem}/>

			<ModalEdicaoEmbalagem
				visible={visibleModalEditar}
				onClose={closeModalEditar}
				EmbalagemData={embalagem}/>
		</div>
	)
}
