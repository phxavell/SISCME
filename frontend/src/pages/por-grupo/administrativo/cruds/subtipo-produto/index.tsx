import { ContainerFlexColumnDiv, headerTableStyle, titleStyle } from '@/util/styles'
import { Button } from 'primereact/button'
import { Column} from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { ModalSubtipoProduto } from './ModalSubtipoProduto'
import { useState } from 'react'
import { useSubTipoProdutoModal } from './useSubTipoProdutoModal'
import { useAuth } from '@/provider/Auth'
import { SubTipoProdutoModalAPI } from '@/infra/integrations/administrativo/sub-tipo-produto-modal/sub-tipo-produto-modal'
import { rowClassName } from '@/components/RowTemplate'
import { styleLinhaMinimaTabela2 } from '../caixa/styles-caixa'
import { ModalSubTipoProdutoVisualizacao } from './ModalSubTipoProdutoVisualizacao/intex'
import { ModalEdicaoSubTipoProduto } from './ModalEdicaoSubtipoProduto/ModalEdicaoSubTipoProduto'
import {PaginatorAndFooter} from "@/components/table-templates/Paginator/PaginatorAndFooter.tsx"
import {ModalConfirmDelete} from "@pages/por-grupo/administrativo/cruds/produto/ModalConfirmDelete.tsx"
import { buttonEdit, buttonEye, buttonPlus, buttonTrash } from '@/util/styles/buttonAction'

const defaultValuesSubtipo = {
	id: 0,
	descricao: ``
}
export function SubTipoProduto() {
	const { user, toastError, toastSuccess } = useAuth()
	const {
		subTipoProdutos,
		onPageChange,
		first,
		loading,
		visible,
		setVisible,
		handleListSubTipoProdutos,
		visibleModalDelete,
		setVisibleModalDelete,
		visibleModalEditar,
		openModalEditar,
		closeModalEditar,
		visibleModalPreview,
		openModalPreview, closeModalPreview,
		subTipoProduto,
	} = useSubTipoProdutoModal()
	const [excluirSubtipo, setExcluirSubtipo] = useState(defaultValuesSubtipo)
	const refreshTable = (success: boolean) => {
		setVisible(false)
		if (success) {
			handleListSubTipoProdutos()
		}
	}

	const AcoesTemplate = (data: any) => {
		return (
			<div className="flex gap-2 h-2rem">
				<Button
					icon={buttonEye.icon}
					className={buttonEye.color}
					outlined
					data-testid='botao-visualizar-sub-tipo'
					onClick={() => { openModalPreview(data) }}
				/>
				<Button
					icon={buttonEdit.icon}
					className={buttonEdit.color}
					outlined
					data-testid='botao-editar'

					onClick={() => { openModalEditar(data) }}
				/>
				<Button
					icon={buttonTrash.icon}
					className={buttonTrash.color}
					outlined
					data-testid='botao-excluir'
					onClick={() => { setVisibleModalDelete(true); setExcluirSubtipo(data) }}
				/>
			</div>
		)
	}

	const deleteSubtipo = async (subtipo: any) => {
		SubTipoProdutoModalAPI.onDelete(user, subtipo.id).then(() => {
			toastSuccess(`Sub tipo produto excluído!`)
			refreshTable(true)
			setVisibleModalDelete(false)
		}).catch((e) => {
			toastError(e.data?.descricao ?? `Não foi possível excluir sub tipo produto!`, false)
			setVisibleModalDelete(false)
		})
	}
	return (
		<div className={ContainerFlexColumnDiv}>
			<h1 className={titleStyle}>Subtipo de produto</h1>
			<Button
				icon={buttonPlus.icon}
				className={`${buttonPlus.color} mb-2 ml-auto`}
				onClick={() => setVisible(true)}
				label="Novo Subtipo de Produto"
				data-testid='botao-novo-subtipo-produto'
			/>

			<DataTable
				loading={loading}
				dataKey="id"
				value={subTipoProdutos?.data}
				className="w-full text-sm"
				scrollable
				scrollHeight="450px"
				stripedRows
				rowClassName={rowClassName}
				rowHover
				emptyMessage='Nenhum resultado encontrado'
			>
				<Column
					header='#'
					field="id"
					headerStyle={headerTableStyle}
					className={`${styleLinhaMinimaTabela2} w-1`}
				/>
				<Column
					header='Descrição'
					field="descricao"
					headerStyle={headerTableStyle}
					className={`${styleLinhaMinimaTabela2}`}
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
				meta={subTipoProdutos?.meta}/>

			<ModalConfirmDelete
				modalTipoVisible={visibleModalDelete}
				titulo="Confirmar"
				onClose={() => setVisibleModalDelete(false)}
				onConfirm={() => deleteSubtipo(excluirSubtipo)}
			/>

			<ModalSubtipoProduto
				visible={visible}
				onClose={refreshTable} />

			<ModalSubTipoProdutoVisualizacao
				visible={visibleModalPreview}
				onClose={closeModalPreview}
				subTipoProdutoData={subTipoProduto} />

			<ModalEdicaoSubTipoProduto
				visible={visibleModalEditar}
				onClose={closeModalEditar}
				subTipoProdutoData={subTipoProduto} />
		</div>
	)
}
