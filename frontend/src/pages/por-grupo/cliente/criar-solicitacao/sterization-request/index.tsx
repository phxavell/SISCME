import {Button} from 'primereact/button'
import SterizationComponent from '../modal-create-sterilization'
import {ContainerFlexColumnDiv, headerTableStyle, titleFlexCss} from '@/util/styles'
import {Column} from 'primereact/column'
import {DataTable} from 'primereact/datatable'
import ModalVisualizar from '@pages/por-grupo/cliente/criar-solicitacao/modal-visualizar'
import {StatusTemplate} from '@/components/table-templates/StatusTemplate'
import {useSterizationRequest} from './useSterizationRequest'
import DatetimeTemplate from '@/components/table-templates/DatetimeTemplate'
import {BoxTemplate} from '@/components/table-templates/BoxTemplate'
import {AcoesTemplate} from './AcoesTemplate'

export default function SterizationRequest() {
	const {
		onConfirmeEntrega,
		openDetail,
		openDialog,
		onRowSelect,
		updateList,
		setOpenDialog,
		rowSelected,
		loading,
		setOpenDetail,
		solicitacoes,
	} = useSterizationRequest()
	return (
		<div className={ContainerFlexColumnDiv}>
			<h1 className={titleFlexCss}>
                Solicitações de Esterilização
			</h1>
			<SterizationComponent
				openDialog={openDialog}
				closeDialog={() => {
					setOpenDialog(false)
					updateList()
				}}
			/>
			<ModalVisualizar
				openDialog={openDetail}
				closeDialog={() => {
					setOpenDetail(false)
				}}
				solicitacao={rowSelected}
			/>
			<Button
				onClick={() => setOpenDialog(true)}
				className="w-3 mb-5"
				label="Nova Solicitação"
			/>
			<DataTable
				selectionMode="single"
				dataKey="id"
				emptyMessage=' '
				loading={loading}
				value={solicitacoes}
				className="w-full"
				scrollable
				scrollHeight="1300px"
				style={{minWidth: `100px`}}
				paginator
				rows={5}
			>
				<Column
					field="id"
					header="#"
					headerStyle={headerTableStyle}
				/>
				<Column
					field="criado_por.nome"
					header="Criado por"
					headerStyle={headerTableStyle}
				/>
				<Column
					field="data_criacao"
					header="Data de Criação"
					body={DatetimeTemplate}
					headerStyle={headerTableStyle}
				/>
				<Column
					field="caixas"
					header="Quantidade de Caixas"
					body={BoxTemplate}
					headerStyle={headerTableStyle}
				/>
				<Column
					field="situacao"
					header="Situação"
					body={StatusTemplate}
					headerStyle={headerTableStyle}
				/>
				<Column
					headerStyle={headerTableStyle}
					header="Ações"
					body={AcoesTemplate({onRowSelect, onConfirmeEntrega})}
				/>
			</DataTable>

		</div>
	)
}
