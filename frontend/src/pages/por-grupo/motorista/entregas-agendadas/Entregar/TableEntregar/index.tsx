import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { entregasProps } from '@/infra/integrations/solicitacoes_motoristas.ts'
import {
	ClienteTemplate,
	StatusColetarBodyTemplate
} from '@pages/por-grupo/motorista/entregas-agendadas/Coletar/TableColetar'
import DatetimeTemplate from '@/components/table-templates/DatetimeTemplate'
import { headerTableStyle } from '@/util/styles'


export const ActionsEntregarTemplate = (mudarStatus: any) =>
	({ solicitacao_esterilizacao, id }: entregasProps) => {
		switch (solicitacao_esterilizacao.situacao) {
		case `Em Transporte`:
			return (
				<Button
					label="Entregar"
					type="submit"
					icon="pi pi-send"
					onClick={() => mudarStatus(`Em Transporte`, `Entrega`, id)}
					style={{ background: `green` }}
					autoFocus />
			)
		case `Aguardando Coleta`:
			return (
				<Button
					onClick={() => mudarStatus(`Aguardando Coleta`, `Entrega no expurgo`, id)}
					label="Entregar/Expurgo"
					type="submit"
					icon="pi pi-check-square"
					style={{ background: `green` }}
					autoFocus />
			)
		default:
			return (
				<Button
					label="Error na notificacao de status"
					type="submit"
					disabled
					icon="pi pi-send"
					autoFocus />
			)
		}
	}

// @ts-ignore
export function InProgressTableEntregar({ mudarStatus, solicitacoesEntrega }) {

	return (

		<DataTable
			value={solicitacoesEntrega}
			className="w-full"
			rowHover
			selectionMode="radiobutton"
			emptyMessage="Nenhum resultado encontrado"
			dataKey="id"
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
				body={ActionsEntregarTemplate(mudarStatus)}
			/>
		</DataTable>
	)
}
