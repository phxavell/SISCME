import {Dialog} from 'primereact/dialog'
import {Input} from '@/components/Input.tsx'
import React from 'react'
import {DataTable, DataTableRowEditCompleteEvent} from 'primereact/datatable'
import {Column} from 'primereact/column'
import {Button} from 'primereact/button'
import {useTipoProduto} from './useTipoProduto.ts'
import {headerTableStyle} from '@/util/styles'
import {Errors} from '@/components/Errors.tsx'
import {ModalConfirmDelete} from '../ModalConfirmDelete.tsx'
import { TipoProductInputs } from './schemaTipoProduto.ts'
import { ModalTipoProdutoProps, TipoProdutoProps } from './types.ts'

export const ModalTipoProduto: React.FC<ModalTipoProdutoProps> = (
	{
		onClose,
		modalTipoVisible,
		onRetornoData,
		titulo,
	}) => {
	const {
		tipoProdutos,
		handleSubmit,
		register,
		errors,
		handleCreateTipoProduto,
		reset,
		handleUpdateTipoProduto,
		onGetTipoProduto,
		loading,
		setId,
		handleDeletar,
		setVisibleModalDelete,
		visibleModalDelete,
	} = useTipoProduto()

	const ExcluirProduto = (id: number) => {
		setId(id)
		setVisibleModalDelete(true)
	}

	const AcoesTemplate = (rowData: TipoProdutoProps) => {
		return (
			<div className="flex flex-row pr-0 ">
				<Button
					icon="pi pi-trash"
					rounded
					text
					severity="danger"
					onClick={() => ExcluirProduto(rowData.id)}
				/>
			</div>
		)
	}
	const onRowEditComplete = ({newData}: DataTableRowEditCompleteEvent) => {
		const data = {
			descricao: newData.descricao
		}
		handleUpdateTipoProduto(data, newData.id).then(async () => {
			await onGetTipoProduto()
		})
	}
	const TextEditor = (options: any) => {
		return <Input
			type="text"
			value={options.value}
			onChange={(e: React.ChangeEvent<HTMLInputElement>) => options.editorCallback(e.target.value)}
		/>
	}
	const handleSubmitTipo = (dataPayload: TipoProductInputs) => {
		handleCreateTipoProduto(dataPayload).then((data: any) => {
			if(onRetornoData) onRetornoData(data)
		})
	}

	const handleConfirmarDelecao = () => {
		handleDeletar().then(async () => {
			await onGetTipoProduto()
			setVisibleModalDelete(false)
		})
	}
	return (
		<Dialog
			header={titulo}
			visible={modalTipoVisible}
			style={{width: `60vw`}}
			position='top'
			draggable={false}
			onHide={() => {
				onClose()
				reset()
			}}
		>
			<ModalConfirmDelete
				modalTipoVisible={visibleModalDelete}
				titulo="Confirmar"
				onClose={() => setVisibleModalDelete(false)}
				onConfirm={handleConfirmarDelecao}

			/>
			<div className="mb-3">
				<form className="w-full mt-4">
					<div className="w-full flex flex-row gap-2">
						<div className="w-full">
							<div className="mb-4">
								<Input
									type="text"
									placeholder='Descrição:'
									{...register(`descricao`)}
								/>
								{errors.descricao && <Errors message={errors.descricao.message}/>}
							</div>
						</div>
						<Button
							icon="pi pi-check"
							rounded
							aria-label="Filter"
							onClick={handleSubmit(handleSubmitTipo)}
						/>
					</div>
				</form>
			</div>
			<DataTable
				value={tipoProdutos}
				editMode="row"
				paginator
				loading={loading}
				rows={3}
				onRowEditComplete={onRowEditComplete}
			>
				<Column
					headerStyle={headerTableStyle}
					header="#"
					field="id"
				/>
				<Column
					headerStyle={headerTableStyle}
					header="Descrição"
					field="descricao"
					editor={(options) => TextEditor(options)}
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

		</Dialog>
	)
}
