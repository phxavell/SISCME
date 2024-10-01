import {ContainerFlexColumnDiv, headerTableStyle, titleStyle} from '@/util/styles'
import {Button} from 'primereact/button'
import {Column} from 'primereact/column'
import {DataTable} from 'primereact/datatable'
import {useState} from 'react'
import {ModalTipoProduto} from './ModalTipoProduto'
import {useTipoProdutoModal} from './useTipoProdutoModal.ts'
import {useAuth} from '@/provider/Auth'
import {styleLinhaMinimaTabela2} from '../../cruds/caixa/styles-caixa.ts'
import {TipoProdutoModalModalAPI} from '@infra/integrations/administrativo/tipo-produto-modal/tipo-produto-modal.ts'
import {rowClassName} from '@/components/RowTemplate.tsx'
import {
	ModalTipoProdutoVisualizacao
} from '@pages/por-grupo/administrativo/especificoes/tipo-produto/ModalTipoProdutoVisualizacao/intex.tsx'
import {TipoProdutoProps} from '@infra/integrations/administrativo/tipo-produto-modal/types.ts'
import {
	ModalEdicaoTipoProduto
} from '@pages/por-grupo/administrativo/especificoes/tipo-produto/ModalEdicaoTipoProduto/ModalEdicaoTipoProduto.tsx'
import {PaginatorAndFooter} from "@/components/table-templates/Paginator/PaginatorAndFooter.tsx"
import {ModalConfirmDelete} from "@pages/por-grupo/administrativo/cruds/produto/ModalConfirmDelete.tsx"
import { buttonEdit, buttonEye, buttonPlus, buttonTrash } from '@/util/styles/buttonAction.ts'

const defaultValuesTipo = {
	id: 0,
	descricao: ``
}

export const TipoProduto = () => {
	const [excluirTipo, setExcluirTipo] = useState(defaultValuesTipo)
	const {user, toastSuccess, toastError} = useAuth()
	const {
		loading,
		tipoProdutos,
		first,
		onPageChange,
		visible,
		setVisible,
		onGetTipoProduto,
		visibleModalDelete,
		setVisibleModalDelete,
		openModalPreview,
		visibleModalPreview,
		closeModalPreview,
		tipoProduto,
		openModalEditar,
		closeModalEditar,
		visibleModalEditar
	} = useTipoProdutoModal()


	const deleteTipo = (tipo: any) => {
		TipoProdutoModalModalAPI.onDelete(user, tipo.id).then(() => {
			refreshTable(true)
			setVisibleModalDelete(false)
			toastSuccess(`Tipo produto excluído!`)
		}).catch((e) => {
			toastError(e.data?.descricao ?? `Não foi possível excluir tipo produto!`, false)
			setVisibleModalDelete(false)
		})
	}


	const AcoesTemplate = (data: TipoProdutoProps) => {
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
						setExcluirTipo(data)
					}}
				/>
			</div>
		)
	}


	const refreshTable = (success: boolean) => {
		setVisible(false)
		if (success) {
			onGetTipoProduto()
		}
	}
	return (
		<div className={ContainerFlexColumnDiv}>
			<h1 className={titleStyle}>Tipo de Produto</h1>
			<Button
				onClick={() => setVisible(true)}
				icon={buttonPlus.icon}
				className={`${buttonPlus.color} mb-2 ml-auto`}
				label="Novo Tipo de Produto"
				data-testid='botao-novo-tipo-produto'
			/>

			<DataTable
				value={tipoProdutos?.data}
				dataKey="id"
				loading={loading}
				className="w-full text-sm"
				scrollable
				scrollHeight="450px"
				stripedRows
				rowClassName={rowClassName}
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
				meta={tipoProdutos?.meta}/>

			<ModalConfirmDelete
				modalTipoVisible={visibleModalDelete}
				titulo="Confirmar"
				onClose={() => setVisibleModalDelete(false)}
				onConfirm={() => deleteTipo(excluirTipo)}
			/>

			<ModalTipoProduto
				visible={visible}
				onClose={refreshTable}/>

			<ModalTipoProdutoVisualizacao
				visible={visibleModalPreview}
				onClose={closeModalPreview}
				tipoProdutoData={tipoProduto}/>

			<ModalEdicaoTipoProduto
				visible={visibleModalEditar}
				onClose={closeModalEditar}
				tipoProdutoData={tipoProduto}/>
		</div>
	)
}
