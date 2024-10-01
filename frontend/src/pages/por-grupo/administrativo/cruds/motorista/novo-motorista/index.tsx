import {ModalMotorista} from './ModalMotorista'
import {Button} from 'primereact/button'
import {DataTable} from 'primereact/datatable'
import {Column} from 'primereact/column'
import {DataMotorista, DriverAPI} from '@/infra/integrations/motorista.ts'
import {ContainerFlexColumnDiv, headerTableStyle, titleStyle} from '@/util/styles'
import moment from 'moment'
import {useMotorista} from './useMotorista'
import {ModalDetails} from './ModalMotorista/ModalDetails'
import {ModalEditMotorista} from './ModalMotorista/ModalEditMotorista'
import {ModalEditSenhaMotorista} from './ModalMotorista/ModalEditSenhaMotorista'
import {rowClassName, styleActionHeader} from '@/components/RowTemplate.tsx'
import {PaginatorAndFooter} from "@/components/table-templates/Paginator/PaginatorAndFooter.tsx"
import {useAuth} from "@/provider/Auth"
import {ModalConfirmDelete} from "@pages/por-grupo/administrativo/cruds/produto/ModalConfirmDelete.tsx"
import DateTemplate from '@/components/table-templates/DateTemplate'

export const NewDriver = ()  =>{
	const {
		visible, setVisible,
		motoristas,
		user,
		excluirMotorista, setExcluirMotorista,
		visibleModalDelete, setVisibleModalDelete,
		visibleModalEdit,
		setVisibleModalDetail,
		editMotorista,
		loading,
		refreshTable,
		editarMotorista,
		first,
		onPageChange,
		visibleModalDetail,
		onRowSelect,
		motoristaDetail,
		visibleModalEditSenha,
		editSenhaMotorista,
		editarSenhaMotorista
	} = useMotorista()

	const {toastSuccess, toastError} = useAuth()

	const deleteMotorista = (motorista: DataMotorista) => {
		DriverAPI.excluir(user, motorista).then(() => {
			refreshTable(true)
			toastSuccess(`Motorista deletado com sucesso!`)
		}).catch((e) => {
			toastError(e.message)
		})
	}

	const templateActions = (motorista: DataMotorista) => {
		return (
			<div className="flex gap-2 h-2rem">
				<Button
					className={styleActionHeader(`blue`, `600`, `400`)}
					icon='pi pi-pencil'
					onClick={() => editarMotorista(motorista)}
					tooltip="Editar"
					tooltipOptions={{position: `bottom`, mouseTrack: true, mouseTrackTop: 15}}
				/>

				<Button
					className={styleActionHeader(`red`, `800`, `600`)}
					icon='pi pi-trash'
					onClick={() => {
						setVisibleModalDelete(true)
						setExcluirMotorista(motorista)
					}}
					tooltip="Excluir"
					tooltipOptions={{position: `bottom`, mouseTrack: true, mouseTrackTop: 15}}
				/>

				<Button
					className={styleActionHeader(`primary`, `800`, `600`)}
					icon='pi pi-lock'
					onClick={() => {
						editarSenhaMotorista(motorista)
					}}
					tooltip="Resetar senha"
					tooltipOptions={{position: `bottom`, mouseTrack: true, mouseTrackTop: 15}}
				/>
			</div>
		)
	}

	return (
		<div className={ContainerFlexColumnDiv}>
			<h1 className={titleStyle}>Motoristas</h1>


			<Button
				onClick={() => setVisible(true)}

				label="Novo Motorista"
				icon={`pi pi-plus`}
				iconPos={`right`}
				className=" w-12rem ml-auto my-2 h-3rem"
			/>

			<DataTable
				loading={loading}
				dataKey="idprofissional"
				value={motoristas?.data}
				className={`w-full`}
				paginatorClassName={`p-0 mt-0`}
				scrollHeight="500px"
				style={{ height: 500}}
				onRowSelect={onRowSelect}
				selectionMode="single"
				emptyMessage='Nenhum resultado encontrado'
				rowClassName={rowClassName}
				rowHover
				stripedRows
			>
				<Column
					field="idprofissional"
					header="#"
					headerStyle={headerTableStyle}
				/>
				<Column
					field="nome"
					header="Nome"
					headerStyle={headerTableStyle}
				/>
				<Column
					field="matricula"
					header="Matrícula"
					headerStyle={headerTableStyle}
				/>
				<Column
					field="cpf"
					header="CPF"
					headerStyle={headerTableStyle}
				/>
				<Column
					field="dtnascimento"
					header="Data de Nascimento"
					headerStyle={headerTableStyle}
					body={DateTemplate(``)}
				/>
				<Column
					header="Ações"
					headerStyle={headerTableStyle}
					body={templateActions}
				/>
			</DataTable>

			<PaginatorAndFooter
				first={first}
				meta={motoristas?.meta}
				onPageChange={onPageChange}
			/>
			<ModalMotorista
				visible={visible}
				onClose={refreshTable}
			/>

			<ModalEditMotorista
				visible={visibleModalEdit}
				onClose={refreshTable}
				motorista={editMotorista}
				setVisibleModalDetail={setVisibleModalDetail}
			/>

			<ModalEditSenhaMotorista
				visible={visibleModalEditSenha}
				onClose={refreshTable}
				motorista={editSenhaMotorista}
				setVisibleModalDetail={setVisibleModalDetail}
			/>

			<ModalDetails
				visible={visibleModalDetail}
				onClose={refreshTable}
				motorista={motoristaDetail}
				deleteMotorista={deleteMotorista}
				editarMotorista={editarMotorista}
				editarSenhaMotorista={editarSenhaMotorista}
			/>

			<ModalConfirmDelete
				modalTipoVisible={visibleModalDelete}
				titulo={`Confirmação`}
				onClose={()=> setVisibleModalDelete(false)}
				onConfirm={()=> {
					deleteMotorista(excluirMotorista)
					setVisibleModalDelete(false)
				}}
			/>

		</div>

	)
}
