import { Dialog } from 'primereact/dialog'
import { Input } from '@/components/Input'
import React, { useEffect, useState } from 'react'
import { DataTable, DataTableRowEditCompleteEvent } from 'primereact/datatable'
import { Column, ColumnEditorOptions } from 'primereact/column'
import { Button } from 'primereact/button'
import { headerTableStyle } from '@/util/styles'
import { TiposCaixaAPI } from '@infra/integrations/caixa/tipos-caixa.ts'
import { useAuth } from '@/provider/Auth'
import { NModalTipoCaixa } from "@pages/por-grupo/administrativo/cruds/caixa/types-caixa.ts"
import { PaginatorAndFooter } from '@/components/table-templates/Paginator/PaginatorAndFooter'
import { rowClassName } from '@/components/RowTemplate'


export const ModalTipoCaixa: React.FC<NModalTipoCaixa.IProps> = (props) => {
	const {
		onClose, visible,
	} = props
	const { user } = useAuth()
	const [tipos, setTipos] = useState<any>()
	const [loading, setLoading] = useState(true)
	const [first, setFirst] = useState(0)

	useEffect(() => {
		if (visible && user) {
			setLoading(true)
			TiposCaixaAPI.listar(user, first + 1).then((response) => {
				setTipos(response)
				setLoading(false)
			})
		}
	}, [visible, user, first])

	const AcoesTemplate = () => {

		return (
			<div className="flex flex-row pr-0 ">
				<Button icon="pi pi-trash" rounded text severity="danger" />
			</div>
		)
	}

	const onRowEditComplete = ({ newData }: DataTableRowEditCompleteEvent) => {
		TiposCaixaAPI.alterar(user, {
			id: newData.idsubtipoproduto,
			descricao: newData.descricao
		})
	}
	const TextEditor = (options: ColumnEditorOptions) => {

		return (
			<Input
				type="text"
				value={options.value}
				onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
					if (options.editorCallback) {
						options.editorCallback(e.target.value)
					}
				}} />
		)
	}
	const [descricao, setDescricao] = useState<string>(``)
	const handleClick = async () => {
		await TiposCaixaAPI.salvar(user, {
			descricao: descricao,
		}).then((data: any) => {
			onClose(data?.data?.id)
		})
	}

	const onPageChange = (event: { first: number }) => {
		setFirst(event.first)
	}

	console.log(tipos)

	return (
		<Dialog
			header={`Adicionar Tipos de Caixa`}
			visible={visible}
			style={{ width: `60vw` }}
			dismissableMask={true}
			closeOnEscape={true}
			blockScroll={true}
			focusOnShow={false}
			resizable={false}
			draggable={false}
			onHide={() => onClose(0)}
		>
			<div className="w-full flex gap-2 my-4">
				<Input
					type="text"
					placeholder='Descrição'
					spanClassName='w-full'
					autoFocus={true}
					value={descricao}
					onChange={e => setDescricao(e.target.value)}
				/>
				<Button
					label="Cadastrar"
					className='w-2'
					onClick={handleClick}
				/>
			</div>
			<DataTable
				className="w-full"
				dataKey="id"
				rows={5}
				paginator={false}
				paginatorClassName={`p-0`}
				tableClassName={`p-0`}
				emptyMessage='Nenhum resultado encontrado.'
				stripedRows
				rowClassName={rowClassName}
				rowHover
				loading={loading}
				value={tipos?.data}
				editMode="row"
				onRowEditComplete={onRowEditComplete}
			>
				<Column
					headerStyle={headerTableStyle}
					header="#"
					field="id" />
				<Column
					headerStyle={headerTableStyle}
					header="Descrição"
					field="descricao"
					editor={(options) => TextEditor(options)} />
				<Column
					headerStyle={headerTableStyle}
					rowEditor
					style={{ width: `1rem`, paddingRight: 0 }} />
				<Column
					headerStyle={headerTableStyle}
					body={AcoesTemplate}
					style={{ paddingLeft: 0 }} />
			</DataTable>
			<PaginatorAndFooter
				first={first}
				meta={tipos?.meta}
				onPageChange={onPageChange}
			/>
		</Dialog>
	)
}
