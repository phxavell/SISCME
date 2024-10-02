import {Dialog} from 'primereact/dialog'
import {Input} from '@/components/Input'
import React, {useEffect, useState} from 'react'
import {DataTable, DataTableRowEditCompleteEvent} from 'primereact/datatable'
import {Column} from 'primereact/column'
import {Button} from 'primereact/button'
import {headerTableStyle} from '@/util/styles'
import {useAuth} from '@/provider/Auth'
import {IOptionToSelect} from '@infra/integrations/caixa/types.ts'
import {EmbalagemAPI} from '@infra/integrations/caixa/embalagem.ts'
import {NModalEmbalagem} from "@pages/por-grupo/administrativo/cruds/caixa/types-caixa.ts"
import { TextEditor } from '@/components/input-file/TextEditor'

export const ModalEmbalagem: React.FC<NModalEmbalagem.IProps> = (props) => {
	const {
		onClose,
		visible,
	} = props
	const {user} = useAuth()
	const [list, setList] = useState<IOptionToSelect[]>([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		if (visible && user) {
			setLoading(true)
			EmbalagemAPI.listar(user).then((response) => {
				setList(response)
				setLoading(false)
			})
		}
	}, [visible, user])

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const AcoesTemplate = (data: any) => {

		return (
			<div className="flex flex-row pr-0 ">
				<Button icon="pi pi-trash" rounded text severity="danger"/>
			</div>
		)
	}
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const onRowEditComplete = ({data, index, newData}: DataTableRowEditCompleteEvent) => {
		EmbalagemAPI.alterar(user, {
			id: newData.idsubtipoproduto,
			descricao: newData.descricao,
			valorcaixa: newData.descricao
		})
	}

	const [descricao, setDescricao] = useState<string>(``)
	const [valor, setValor] = useState<string>(``)
	const handleClick = async () => {
		await EmbalagemAPI.salvar(user, {
			descricao: descricao,
			valorcaixa: valor
		}).then((id)=> {
			onClose(id)
		})
	}
	return (
		<Dialog
			header={`Adicionar Embalagens.`}
			visible={visible}
			style={{width: `60vw`}}
			onHide={() => onClose(0)}
		>
			<div className="mb-3">
				<div className="w-full flex flex-row gap-2">
					<div className="w-full">
						<div className="mb-4">
							<Input
								type="text"
								placeholder='Descrição'
								autoFocus={true}
								value={descricao}
								onChange={e => setDescricao(e.target.value)}
							/>
							<Input
								type="text"
								placeholder='Valor'
								value={valor}
								onChange={e => setValor(e.target.value)}
								autoFocus={true}
							/>
						</div>
					</div>
					<Button
						className="h-3rem"
						label="Cadastrar"
						onClick={handleClick}
					/>
				</div>
			</div>
			<DataTable
				value={list}
				loading={loading}
				lazy
				emptyMessage={` `}
				editMode="row"
				paginator

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
					field="valor"
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
