import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import { Tag } from 'primereact/tag'

import moment from "moment"
import { Button } from "primereact/button"
import { ColetaProps } from "@/infra/integrations/gerenciamento-motorista-tecnico"
import { TabelaMessagemVazia } from "../.."

const headerStyle = {
	backgroundColor: `#204887`,
	color: `#fff`
}
const getSeverity = (situacao: string) => {

	switch (situacao) {
	case `Aguardando Coleta`:
		return `danger`

	case `Em Transporte`:
		return `info`
	}
}
export const ClienteTemplate = ({ cliente }: ColetaProps) => {
	if (cliente) {
		return <div>{cliente}</div>
	}
	return <div>Não informado.</div>
}
export const StatusColetarBodyTemplate = ({ situacao }: ColetaProps) => {
	return <Tag value={situacao} severity={getSeverity(situacao)} />
}

export const DataFormatedMotoristaTemplate = ({ data_criacao }: ColetaProps) => {
	if (data_criacao) {
		const dataFormated = moment(data_criacao)
			.format(`DD/MM/YYYY HH:mm`)
		return (
			<div className="flex flex-column">
				{dataFormated}
			</div>
		)
	} else {
		return (
			<div className="flex flex-column">
                --/--/----
			</div>
		)
	}
}
export const ActionsColetaTemplate = (mudarStatus: (statusA: string, statusB: string, id: any) => void) => ({ situacao, id_coleta }: ColetaProps) => {
	switch (situacao) {
	case `Aguardando Coleta`:
		return (
			<Button
				label="Coletar"
				type="submit"
				data-testid="botao-coletar"
				icon="pi pi-send"
				onClick={() => mudarStatus(`Aguardando Coleta`, `Inicio da coleta`, id_coleta)}
				style={{ background: `green` }}
				autoFocus />
		)
	case `Em Transporte`:
		return (
			<Button
				onClick={() => mudarStatus(`Em Transporte`, `Entrega no expurgo`, id_coleta)}
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
				autoFocus
			/>
		)
	}
}
// @ts-ignore
export function TableColetar({ mudarStatus, solicitacoesColetas }) {
	return (

		<DataTable
			value={solicitacoesColetas}
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
				field="situacao"
				header="Situação"
				body={StatusColetarBodyTemplate}
			/>
			<Column
				headerStyle={headerStyle}
				header="Ações"
				body={ActionsColetaTemplate(mudarStatus)}
			/>
		</DataTable>
	)
}
