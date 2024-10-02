import {Solicitacoes} from '@/infra/integrations/tecnico-demandas.ts'
import {DataTable, DataTableUnselectEvent} from 'primereact/datatable'
import {styleDataTableDemandas} from '@pages/por-grupo/tecnico-cme/demandas/style.ts'
import {Column} from 'primereact/column'
import {headerTableStyle} from '@/util/styles'
import DatetimeTemplate from '@/components/table-templates/DatetimeTemplate.tsx'
import React from 'react'
import {BoxTemplate} from '@/components/table-templates/BoxTemplate.tsx'
import {StatusTemplate} from '@/components/table-templates/StatusTemplate.tsx'

type DemandasEntreguesTable = {
    list: Solicitacoes[],
    loading: boolean,
    onSelectRow?: (e: DataTableUnselectEvent) => void
}

const DemandasEntreguesTable = (props: DemandasEntreguesTable) => {
	const {list, loading} = props

	return (
		<DataTable
			loading={loading}
			value={list}
			className={styleDataTableDemandas}
			dataKey="id"
			emptyMessage='Nenhum resultado encontrado'
		>
			<Column
				field='id'
				header='#'
				headerStyle={headerTableStyle}
			/>
			<Column
				field='data_atualizacao'
				header='Atualizado em'

				headerStyle={headerTableStyle}
				body={DatetimeTemplate}
			/>
			<Column
				body={StatusTemplate}
				header='Situação'
				headerStyle={headerTableStyle}
			/>
			<Column
				field='quantidade'
				body={BoxTemplate}
				header='Quantidade de Caixas'
				headerStyle={headerTableStyle}
				className="white-space-nowrap"
				sortable
			/>
			<Column
				field='observacao'
				header='Observações'
				headerStyle={headerTableStyle}
			/>
		</DataTable>
	)
}
export default DemandasEntreguesTable
