import {rowClassName, styleActionHeader} from "@/components/RowTemplate"
import { ContainerFlexColumnDiv, headerTableStyle, styleColumn2, titleStyle } from "@/util/styles"
import { Button } from "primereact/button"
import { Column } from "primereact/column"
import { DataTable } from "primereact/datatable"
import { InputText } from "primereact/inputtext"
import { useUsuarios } from "./useUsuarios"
import { useState } from "react"
import { ModalEdit } from "./modal-novo-usuario/ModalEdit"
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog"
import {styleFilter, styleInputsFilter, styleToolbarTable} from "@pages/por-grupo/administrativo/cruds/styles-crud.ts"
import {PaginatorAndFooter} from "@/components/table-templates/Paginator/PaginatorAndFooter.tsx"
import TableColumn from "@/components/table-templates/TableColumn.tsx"
import { ModalNovoUsuario } from "./modal-novo-usuario/ModalNovoUsuario"


export function Usuario() {
	const [usuario, setUsuario] = useState(null)

	const {
		loading, paginaAtual, onPageChange,
		usuarios,
		cpf, nome,
		setCpf, setNome,
		showModal, setShowModal,
		setShowModalEdit, showModalEdit,
		listarUsuarios,
		setLoading, handleStatusUsuario,
		setPaginaAtual,
		resetarSenha,
	} = useUsuarios()


	const TemplateAction = (rowData: any) => {
		return (
			<div className="flex gap-2 ">
				<div className="flex gap-2 h-2rem">
					<Button
						text
						icon='pi pi-pencil'
						className={styleActionHeader(`blue`, `600`, `600`)}
						style={{color: `white`}}
						onClick={async () => {
							setUsuario(rowData)
							setShowModalEdit(true)
						}}
						tooltip="Editar Usuário"
					/>
					<Button
						text
						icon='pi pi-unlock'
						className={styleActionHeader(`blue`, `600`, `600`)}
						style={{color: `white`}}
						onClick={async () => {
							confirmDialog({
								message: `Deseja resetar a senha do usuário ${rowData.nome} para a senha padrão Bringel@${new Date().getFullYear()}`,
								header: `Resetar Senha`,
								icon: `pi pi-exclamation-triangle`,
								accept: () => {
									if(rowData?.user){
										resetarSenha(rowData?.user?.id)
									}

								},
								reject: () => {
								},
								acceptLabel: `Sim`,
								rejectLabel: `Não`,
							})

						}}
						tooltip="Resetar Senha"
					/>
				</div>

			</div>
		)
	}
	const resetFilter = () => {
		setNome(``)
		setCpf(``)
		setPaginaAtual(0)
	}
	return (
		<div className={ContainerFlexColumnDiv}>
			<h1 className={titleStyle}>Usuários</h1>
			<div className={styleToolbarTable}>
				<div className={styleFilter}>
					<div className={styleInputsFilter}>
						<InputText
							id="nome"
							autoFocus={true}
							placeholder="Nome"
							value={nome}
							onChange={(e) =>
							{
								setNome(e.target.value)
								setPaginaAtual(0)
							}}/>
						<InputText
							id="cpf"
							placeholder="CPF"
							value={cpf}
							onChange={(e) =>
							{
								setCpf(e.target.value)
								setPaginaAtual(0)
							}}/>
						<Button
							className={styleActionHeader(`gray`, `700`, `500`) + ` h-3rem`}
							icon="pi pi-times"
							tooltip="Limpar pesquisa"
							onClick={resetFilter}
						/>
					</div>

				</div>
				<Button
					onClick={() => {
						setShowModal(true)
					}}
					className={styleActionHeader(`blue`, `600`, `800`)}
					label="Novo Usuário"
				/>
			</div>


			<DataTable
				loading={loading}
				dataKey="idprofissional"
				className={`w-full`}
				tableClassName={`p-0`}
				value={usuarios?.data}
				emptyMessage="Nenhum resultado encontrado."
				rowClassName={rowClassName}

				scrollHeight="500px"
				style={{ height: 500}}
				stripedRows
				paginator={false}
				paginatorClassName={`p-0 mt-0`}
				rowHover
			>
				<Column
					field="idprofissional"
					header="#"
					headerStyle={headerTableStyle}
					className={styleColumn2}
					body={TableColumn}
				/>
				<Column
					field="user.username"
					header="Nome de Usuário"
					headerStyle={headerTableStyle}
					className={styleColumn2}
					body={TableColumn}
				/>
				<Column
					field="nome"
					header="Nome"
					headerStyle={headerTableStyle}
					className={styleColumn2}
				/>
				<Column
					field="profissao.descricao"
					header="Profissão"
					headerStyle={headerTableStyle}
					className={styleColumn2}
					body={TableColumn}
				/>
				<Column
					field="status"
					header="Situação"
					headerStyle={headerTableStyle}
					className={styleColumn2}
				/>
				<Column
					header="Ações"
					headerStyle={headerTableStyle}
					body={TemplateAction}
				/>
			</DataTable>
			<PaginatorAndFooter
				first={paginaAtual}
				onPageChange={onPageChange}
				meta={usuarios?.meta}
			/>
			<ModalNovoUsuario
				showModal={showModal}
				onClose={() => {
					setLoading(true)
					setShowModal(false)
					setTimeout(() => {
						listarUsuarios()
						setLoading(false)

					}, 1000)
				}}
			/>
			<ConfirmDialog />
			<ModalEdit
				showModal={showModalEdit}
				usuarioEdit={usuario}
				handleStatusUsuario={handleStatusUsuario}
				onClose={() => {
					setLoading(true)
					setShowModalEdit(false)
					setTimeout(() => {
						listarUsuarios()
						setLoading(false)

					}, 1000)
				}}
			/>

		</div>
	)
}
