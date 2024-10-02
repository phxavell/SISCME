import {DataTable} from 'primereact/datatable'
import {Column} from 'primereact/column'
import {Tag} from 'primereact/tag'
import {coletasProps} from '@/infra/integrations/solicitacoes_motoristas.ts'
import {Button} from 'primereact/button'
import DatetimeTemplate from '@/components/table-templates/DatetimeTemplate'
import { headerTableStyle } from '@/util/styles'
const getSeverity = (situacao: string) => {

	switch (situacao) {
	case `Aguardando Coleta`:
		return `danger`

	case `Em Transporte`:
		return `info`
	}
}
export const ClienteTemplate = ({solicitacao_esterilizacao}: coletasProps) => {
	if (solicitacao_esterilizacao?.cliente) {
		return <div>{solicitacao_esterilizacao?.cliente}</div>
	}
	return <div>Não informado.</div>
}
export const StatusColetarBodyTemplate = ({solicitacao_esterilizacao}: coletasProps) => {
	return <Tag value={solicitacao_esterilizacao.situacao} severity={getSeverity(solicitacao_esterilizacao.situacao)}/>
}

export const ActionsColetaTemplate = (mudarStatus: (statusA: string, statusB: string, id: any) => void) => ({
	solicitacao_esterilizacao,
	id
}: coletasProps) => {

	switch (solicitacao_esterilizacao.situacao) {
	case `Aguardando Coleta`:
		return (
			<Button
				label="Coletar"
				type="submit"
				icon="pi pi-send"
				onClick={() => mudarStatus(`Aguardando Coleta`, `Inicio da coleta`, id)}
				style={{background: `green`}}
				autoFocus/>
		)
	case `Em Transporte`:
		return (
			<Button
				onClick={() => mudarStatus(`Em Transporte`, `Entrega no expurgo`, id)}
				label="Entregar/Expurgo"
				type="submit"
				icon="pi pi-check-square"
				style={{background: `green`}}
				autoFocus/>
		)
	default:
		return (
			<Button
				label="Error na notificacao de status"
				type="submit"
				disabled
				icon="pi pi-send"
				autoFocus
			/>
		)
	}
}

// @ts-ignore
export function InProgressTableColetar({mudarStatus, solicitacoesColetas}) {

	return (

		<DataTable
			value={solicitacoesColetas}
			className="w-full"
			rowHover
			selectionMode="radiobutton"
			dataKey="id"
			emptyMessage="Nenhum resultado encontrado"
		>
			<Column
				headerStyle={headerTableStyle}
				field="id"
				header="#"
			/>
			<Column
				headerStyle={headerTableStyle}
				field="data_criacao"
				header="Data de Criação"
				body={DatetimeTemplate}
			/>
			<Column
				headerStyle={headerTableStyle}
				field="solicitacao_esterilizacao.cliente"
				header="Cliente"
				body={ClienteTemplate}
			/>
			<Column
				headerStyle={headerTableStyle}
				field="solicitacao_esterilizacao.situacao"
				header="Situação"
				body={StatusColetarBodyTemplate}
			/>
			<Column
				headerStyle={headerTableStyle}
				header="Ações"
				body={ActionsColetaTemplate(mudarStatus)}
			/>
		</DataTable>
	)
}
