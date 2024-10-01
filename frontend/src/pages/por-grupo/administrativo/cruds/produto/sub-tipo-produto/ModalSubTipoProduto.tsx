import { Dialog } from 'primereact/dialog'
import { Input } from '@/components/Input.tsx'
import React, { useState } from 'react'
import { DataTable, DataTableRowEditCompleteEvent } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { headerTableStyle } from '@/util/styles'
import { Errors } from '@/components/Errors.tsx'
import { ModalConfirmDelete } from '../ModalConfirmDelete.tsx'
import { useSubTipoProduto } from './useSubTipoProduto.ts'
import { ModalSubTipoProdutoProps, SubTipoProdutoProps } from './types.ts'

export const ModalSubTipoProduto: React.FC<ModalSubTipoProdutoProps> = (
	{
		onClose,
		modalTipoVisible,
		onRetornoData,
		titulo,
	}) => {
	const {
		subTipoProdutos,
		handleSubmit,
		register,
		errors,
		handleCreateSubTipoProduto,
		reset,
		handleUpdateSubTipoProduto,
		handleListSubTipoProdutos,
		loading,
		setId,
		handleDeletar
	} = useSubTipoProduto()
	const [visible, setVisible] = useState(false)

	const ExcluirProduto = (id: number) => {
		setId(id)
		setVisible(true)
	}

	const AcoesTemplate = (rowData: SubTipoProdutoProps) => {
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
	const onRowEditComplete = ({ newData }: DataTableRowEditCompleteEvent) => {
		const data = {
			descricao: newData.descricao
		}
		const id = newData.id
		handleUpdateSubTipoProduto(data, id).then(async () => {
			await handleListSubTipoProdutos()
		})
	}
	const TextEditor = (options: any) => {
		return <Input
			type="text"
			value={options.value}
			onChange={(e: React.ChangeEvent<HTMLInputElement>) => options.editorCallback(e.target.value)}
		/>
	}
	const handleSubTipoProduto = (dataPayload: any) => {
		handleCreateSubTipoProduto(dataPayload).then((data) => {
			if(onRetornoData) onRetornoData(data)
		})
	}
	const handleConfirmarDelecao = () => {
		handleDeletar().then(async () => {
			await handleListSubTipoProdutos()
			setVisible(false)
		})
	}
	return (
		<Dialog
			header={titulo}
			visible={modalTipoVisible}
			style={{ width: `60vw` }}
			position='top'
			draggable={false}
			onHide={() => {
				onClose()
				reset()
			}}
		>
			<ModalConfirmDelete
				modalTipoVisible={visible}
				titulo="Confirmar"
				onClose={() => setVisible(false)}
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
								{errors.descricao && <Errors message={errors.descricao.message} />}
							</div>
						</div>
						<Button
							icon="pi pi-check"
							rounded
							aria-label="Filter"
							onClick={handleSubmit(handleSubTipoProduto)}
						/>
					</div>
				</form>
			</div>
			<DataTable
				value={subTipoProdutos}
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
					style={{ width: `1rem`, paddingRight: 0 }}
				/>
				<Column
					headerStyle={headerTableStyle}
					body={AcoesTemplate}
					style={{ paddingLeft: 0 }}
				/>
			</DataTable>

		</Dialog>
	)
}
