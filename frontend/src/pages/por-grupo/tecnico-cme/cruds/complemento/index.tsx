import {ContainerFlexColumnDiv, headerTableStyle} from '@/util/styles'
import {Button} from 'primereact/button'
import {Column, ColumnEditorOptions} from 'primereact/column'
import {DataTable} from 'primereact/datatable'
import React from 'react'
import {Input} from '@/components/Input'
import {useComplemento} from './useComplemento'
import {ModalComplemento} from './ModalComplemento'
import {Dropdown, DropdownChangeEvent} from 'primereact/dropdown'
import {RoutersPathName} from '@/routes/schemas'
import {TitleWithBackArrow} from '@/components/TitleWithBackArrow'
import {PaginatorAndFooter} from "@/components/table-templates/Paginator/PaginatorAndFooter.tsx"
import {ModalConfirmDelete} from "@pages/por-grupo/administrativo/cruds/produto/ModalConfirmDelete.tsx"

export const Complemento =()=> {
	const {
		complementos,
		loading,
		visible,
		setVisible,
		visibleModalDelete,
		setVisibleModalDelete,
		onPageChange,
		first,
		status,
		excluirComplemento, setExcluirComplemento,
		onRowEditComplete,
		deleteComplemento,
		handleEditarStatusComplemento,
		refreshTable,
		handleEditarDescricaoComplemento
	} = useComplemento(null)


	const AcoesTemplate = (data: any) => {
		return (
			<div className="flex flex-row pr-0 ">
				<Button
					icon="pi pi-trash"
					rounded
					text
					severity="danger"
					onClick={() => {
						setVisibleModalDelete(true)
						setExcluirComplemento(data)
					}}
				/>
			</div>
		)
	}


	const TextEditor = (options: ColumnEditorOptions) => {
		return (
			<Input
				type="text"
				value={options.value}
				onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
					handleEditarDescricaoComplemento(options, event)
				}
			/>
		)
	}

	const DropdownEditor = (options: ColumnEditorOptions) => {
		return (
			<Dropdown
				options={status}
				value={options.value}
				onChange={(e: DropdownChangeEvent) =>
					handleEditarStatusComplemento(options, e)
				}
			/>
		)
	}


	return (
		<div className={ContainerFlexColumnDiv}>
			<TitleWithBackArrow title='Complementos' page={RoutersPathName.Etiquetas}/>
			<Button
				onClick={() => setVisible(true)}
				className="my-2 ml-auto hover:bg-blue-600"
				label="Novo Complemento"
				data-testid='botao-novo-complemento'
			/>
			<DataTable
				loading={loading}
				dataKey="id"
				value={complementos?.data}
				className="w-full text-sm"
				editMode="row"
				onRowEditComplete={onRowEditComplete}
				scrollHeight="500px"
				style={{height: 500}}
				rowHover
				stripedRows
				emptyMessage='Nenhum resultado encontrado'
			>
				<Column
					header='#'
					field="id"
					headerStyle={headerTableStyle}
				/>
				<Column
					header='Descrição'
					field="descricao"
					headerStyle={headerTableStyle}
					editor={(options) => TextEditor(options)}
				/>
				<Column
					header='Status'
					field="status"
					headerStyle={headerTableStyle}
					editor={(options) => DropdownEditor(options)}
				/>
				<Column
					headerStyle={headerTableStyle}
					rowEditor
					style={{width: `1rem`, paddingRight: 0}}
				/>
				<Column
					headerStyle={headerTableStyle}
					body={AcoesTemplate}
					style={{paddingLeft: 0}}
				/>
			</DataTable>
			<PaginatorAndFooter
				first={first}
				onPageChange={onPageChange}
				meta={complementos?.meta}/>

			<ModalConfirmDelete
				modalTipoVisible={visibleModalDelete}
				titulo="Confirmar"
				onClose={() => setVisibleModalDelete(false)}
				onConfirm={() => deleteComplemento(excluirComplemento)}
			/>

			<ModalComplemento
				visible={visible}
				onClose={refreshTable}
			/>
		</div>
	)
}
