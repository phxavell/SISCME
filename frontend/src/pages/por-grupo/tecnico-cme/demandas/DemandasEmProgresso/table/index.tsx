import {DataTable} from 'primereact/datatable'
import {Column} from 'primereact/column'
import {Solicitacoes} from '@/infra/integrations/tecnico-demandas.ts'
import {ImTruck} from 'react-icons/im'
import {Button} from 'primereact/button'
import RenderObject from '@/components/RenderObject.tsx'
import {styleDataTableDemandas} from '@pages/por-grupo/tecnico-cme/demandas/style.ts'
import {BoxTemplate} from '@/components/table-templates/BoxTemplate.tsx'
import DatetimeTemplate from '@/components/table-templates/DatetimeTemplate.tsx'
import {StatusTemplate} from '@/components/table-templates/StatusTemplate.tsx'

const headerStyle = {
	backgroundColor: `#204887`,
	color: `#fff`
}

type InProgressTableProps = {
    onSelectRow: any
    solicitacoes: Solicitacoes[]
    loading: boolean
}

export function EmProgressoTable({onSelectRow, solicitacoes, loading}: InProgressTableProps) {

	const motoristaTemplate = (solicitacao: Solicitacoes) => {

		if (solicitacao.coleta) {
			const {coleta} = solicitacao
			return (
				<div className="flex flex-row gap-1">
					{`${coleta.motorista.nome}`}
					<span> - </span>
					<RenderObject data={coleta.veiculo} keyObject="placa"/>
				</div>
			)
		} else {
			return (
				<div className="flex flex-column">
                    ----
				</div>
			)
		}
	}
	const StatusColetaTemplate = (solicitacao: Solicitacoes) => {

		const disponivelParaColeta = solicitacao.situacao === `Em Arsenal`
		const permitirTrocarMotorista = solicitacao.situacao === `Em Transporte`
		if (disponivelParaColeta) {
			return <div>
				<Button
					label="Iniciar entrega"
					type="submit"
					disabled={!disponivelParaColeta}
					onClick={() => onSelectRow(solicitacao)}
					icon={<ImTruck className="mr-2"/>}
					style={{background: `green`}}
					autoFocus/>
			</div>
		} else if (permitirTrocarMotorista) {
			return <div>
				<Button
					label="Alterar motorista"
					type="submit"
					onClick={() => onSelectRow(solicitacao)}
					disabled={!permitirTrocarMotorista}
					style={{background: `blue`}}
					icon={<ImTruck className="mr-2"/>}
					autoFocus/>
			</div>
		} else {
			return <div>
				<Button
					label="Iniciar entrega"
					disabled={permitirTrocarMotorista}
					icon={<ImTruck className="mr-2"/>}
					style={{background: `green`, opacity: .5, cursor: `default`}}
					autoFocus/>
			</div>
		}

	}

	return (

		<DataTable
			value={solicitacoes}
			className={styleDataTableDemandas}
			loading={loading}
			rowHover
			selectionMode="radiobutton"
			dataKey="id"
			emptyMessage='Nenhuma solicitação em andamento'
		>
			<Column
				headerStyle={headerStyle}
				field="id"
				header="#"
			/>
			<Column
				headerStyle={headerStyle}
				field="data_atualizacao"
				header="Atualizado em"
				body={DatetimeTemplate}
			/>
			<Column
				headerStyle={headerStyle}
				field="caixas"
				header="Quantidade de Caixas"
				body={BoxTemplate}
			/>
			<Column
				field="situacao"
				headerStyle={headerStyle}
				body={StatusTemplate}
				header="Situação"
			/>
			<Column
				field='Motorista'
				body={motoristaTemplate}
				header='Motorista'
				headerStyle={headerStyle}
				className="white-space-nowrap "
				sortable
			/>
			<Column
				headerStyle={headerStyle}
				header="Ações"
				body={StatusColetaTemplate}
			/>
		</DataTable>

	)
}
