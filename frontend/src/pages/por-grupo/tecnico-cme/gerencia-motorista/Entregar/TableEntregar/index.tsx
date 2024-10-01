import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'

import { EntregaPros } from '@/infra/integrations/gerenciamento-motorista-tecnico'
import { ClienteTemplate, DataFormatedMotoristaTemplate, StatusColetarBodyTemplate } from '../../Coletar/TableColetar'
import { TabelaMessagemVazia } from '../..'

const headerStyle = {
	backgroundColor: `#204887`,
	color: `#fff`
}
export const ActionsEntregarTemplate = (mudarStatus: any) =>
	({ situacao, id_coleta }: EntregaPros) => {
		switch (situacao) {
		case `Em Transporte`:
			return (
				<Button
					label="Entregar"
					type="submit"
					icon="pi pi-send"
					onClick={() => mudarStatus(`Em Transporte`, `Entrega`, id_coleta)}
					style={{ background: `green` }}
					data-testid='botao-entregar'
					autoFocus />
			)
		case `Aguardando Coleta`:
			return (
				<Button
					onClick={() => mudarStatus(`Aguardando Coleta`, `Entrega no expurgo`, id_coleta)}
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
export function TableEntregar({ mudarStatus, solicitacoesEntrega }) {

	return (

		<DataTable
			value={solicitacoesEntrega}
			className="w-full"
			rowHover
			selectionMode="radiobutton"
			emptyMessage={TabelaMessagemVazia.MessagemColetasEntregasVazio}
		>
			<Column
				headerStyle={headerStyle}
				field="id_solicitacao"
				header="#"
			/>
			<Column
				headerStyle={headerStyle}
				field="data_criacao"
				header="Data de Criação"
				body={DataFormatedMotoristaTemplate}
			/>
			<Column
				headerStyle={headerStyle}
				field="solicitacao_esterilizacao.cliente"
				header="Cliente"
				body={ClienteTemplate}
			/>
			<Column
				headerStyle={headerStyle}
				field="solicitacao_esterilizacao.situacao"
				header="Situação"
				body={StatusColetarBodyTemplate}
			/>
			<Column
				headerStyle={headerStyle}
				header="Ações"
				body={ActionsEntregarTemplate(mudarStatus)}
			/>
		</DataTable>
	)
}
