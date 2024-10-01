import {Column} from 'primereact/column'
import {headerTableStyle} from '@/util/styles'
import {DataTable, DataTableUnselectEvent} from 'primereact/datatable'
import {Solicitacoes} from '@/infra/integrations/tecnico-demandas.ts'
import RenderObject from '@/components/RenderObject.tsx'
import {styleDataTableDemandas} from '@pages/por-grupo/tecnico-cme/demandas/style.ts'
import {BoxTemplate} from '@/components/table-templates/BoxTemplate.tsx'
import {StatusTemplate} from '@/components/table-templates/StatusTemplate.tsx'
import DatetimeTemplate from '@/components/table-templates/DatetimeTemplate'

type DemandasPendentesTable = {
    list: Solicitacoes[],
    loading: boolean,
    onSelectRow: (e: DataTableUnselectEvent) => void
}

const DemandasPendentesTable = (props: DemandasPendentesTable) => {
	const {list, loading, onSelectRow} = props

	const motoristaTemplate = (solicitacao: Solicitacoes) => {

		if (solicitacao.coleta) {
			const {coleta} = solicitacao
			return (
				<div className="flex flex-row gap-1">
					{`${coleta?.motorista?.nome}`}
					<span> - </span>
					<RenderObject data={coleta.veiculo} keyObject="placa"/>
				</div>
			)
		} else {
			return (
				<div className="flex flex-column">
                    ---
				</div>
			)
		}
	}

	return <DataTable
		loading={loading}
		value={list}
		stripedRows
		className={styleDataTableDemandas}
		rowHover
		size="small"
		selectionMode="radiobutton"
		onRowSelect={onSelectRow}
		dataKey="id"
		emptyMessage='Nenhum resultado encontrado'
	>
		<Column
			field='id'
			header='#'
			headerStyle={headerTableStyle}
		/>
		<Column
			field='data_criacao'
			header='Solicitada'
			headerStyle={headerTableStyle}
			body={DatetimeTemplate}
		/>
		<Column
			field='situacao'
			header='Situação'
			body={StatusTemplate}
			headerStyle={headerTableStyle}
		/>
		<Column
			field='motorista'
			body={motoristaTemplate}
			header='Motorista'
			headerStyle={headerTableStyle}
			className="white-space-nowrap "
		/>
		<Column
			field='quantidade'
			body={BoxTemplate}
			header='Quantidade de Caixas'
			headerStyle={headerTableStyle}
			className="white-space-nowrap "
		/>
		<Column
			field='observacao'
			header='Observações'
			headerStyle={headerTableStyle}
		/>
	</DataTable>
}
export default DemandasPendentesTable
