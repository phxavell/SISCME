import {ContainerFlexColumnDiv, headerTableStyle, titleStyle} from '@/util/styles'
import {Button} from 'primereact/button'
import {Column} from 'primereact/column'
import {DataTable} from 'primereact/datatable'
import {useState} from 'react'
import {useTipoCaixa} from './useTipoCaixa'
import {ModalTipoCaixa} from './ModalTipoCaixa'
import {TiposCaixaModalAPI} from '@/infra/integrations/administrativo/tipo-caixa/tipos-caixa-modal'
import {useAuth} from '@/provider/Auth'
import {rowClassName} from '@/components/RowTemplate'
import {styleLinhaMinimaTabela2} from '../caixa/styles-caixa'
import {ModalEdicaoTipoCaixa} from './ModalEdicaoTipoCaixa/ModalEdicaoTipoCaixa'
import {ModalTipoCaixaVisualizacao} from './ModalTipoCaixaVisualizacao'
import {ModalConfirmDelete} from "@pages/por-grupo/administrativo/cruds/produto/ModalConfirmDelete.tsx"
import {PaginatorAndFooter} from "@/components/table-templates/Paginator/PaginatorAndFooter.tsx"
import { buttonEdit, buttonEye, buttonPlus, buttonTrash } from '@/util/styles/buttonAction'

const defaultValuesTipo = {
	id: 0,
	descricao: ``
}

export function TipoCaixa() {
	const [excluirTipo, setExcluirTipo] = useState(defaultValuesTipo)
	const {user, toastSuccess, toastError} = useAuth()
	const {
		loading,
		tipoCaixas,
		visible,
		setVisible,
		onGetTipoCaixa,
		onPageChange,
		first,
		visibleModalDelete,
		setVisibleModalDelete,
		tipoCaixa,
		openModalEditar, closeModalEditar, visibleModalEditar,
		openModalPreview, closeModalPreview, visibleModalPreview
	} = useTipoCaixa()

	const handleExcluirTipoCaixa = (data: any) => {
		setVisibleModalDelete(true)
		setExcluirTipo(data)
	}
	const deleteTipo = (tipo: any) => {
		TiposCaixaModalAPI.deletar(user, tipo).then(() => {
			refreshTable(true)
			setVisibleModalDelete(false)
			toastSuccess(`Tipo caixa excluída!`)
		}).catch((e) => {
			toastError(e.message, false)
			setVisibleModalDelete(false)
		})
	}

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
					onClick={() => handleExcluirTipoCaixa(data)}
				/>
			</div>
		)
	}

	const refreshTable = (success: boolean) => {
		setVisible(false)
		if (success) {
			onGetTipoCaixa()
		}
	}

	return (
		<div className={ContainerFlexColumnDiv}>
			<h1 className={titleStyle}>Tipos de Caixa</h1>
			<Button
				onClick={() => setVisible(true)}
				icon={buttonPlus.icon}
				className={`${buttonPlus.color} mb-2 ml-auto`}
				label="Novo Tipo"
				data-testid='botao-novo-tipo-caixa'
			/>

			<DataTable
				loading={loading}
				dataKey="id"
				value={tipoCaixas?.data}
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
				meta={tipoCaixas?.meta}/>

			<ModalConfirmDelete
				modalTipoVisible={visibleModalDelete}
				titulo="Confirmar"
				onClose={() => setVisibleModalDelete(false)}
				onConfirm={() => deleteTipo(excluirTipo)}
			/>

			<ModalTipoCaixa
				visible={visible}
				onClose={refreshTable}/>

			<ModalEdicaoTipoCaixa
				visible={visibleModalEditar}
				onClose={closeModalEditar}
				TipoCaixaData={tipoCaixa}/>

			<ModalTipoCaixaVisualizacao
				visible={visibleModalPreview}
				onClose={closeModalPreview}
				tipoCaixaData={tipoCaixa}/>
		</div>
	)
}
