import {DataTable} from 'primereact/datatable'
import {TabPanel, TabView} from "primereact/tabview"
import {Column} from "primereact/column"
import {SolicitacaoProps} from "@/infra/integrations/gerenciamento-motorista-tecnico"
import {ModalColetar} from "./Coletar/ModalColetar"
import {TableEntregar} from "./Entregar/TableEntregar"
import {TableColetar} from "./Coletar/TableColetar"
import {ModalEntragar} from "./Entregar/ModalEntragar"
import {useGerenciarMotoristas} from "./useGerenciarMotoristas"
import {ContainerFlexColumnDiv, titleStyle} from '@/util/styles'

export enum TabelaMessagemVazia {
    MessagemColetasEntregasVazio = `Nenhum transporte em andamento.`
}

export function GerenciarMotoristaColetaEntrega() {
	const {
		onConfirmeColetar,
		onConfirmeEntregar,
		setActiveIndex,
		activeIndex,
		mudarStatus,
		statusAtual,
		statusASerAtualizado,
		salvando,
		solicitacoes,
		expandedRows,
		setExpandedRows,
		loading,
		dialogColetar, setDialogColetar,
		dgEntregar, setDgEntregar,
		mudarStatusColetar,
	} = useGerenciarMotoristas()
	const allowExpansion = (rowData: SolicitacaoProps) => {
		return rowData.profissional.nome.length > 0
	}
	const rowExpansionTemplate = (data: SolicitacaoProps) => {

		return (
			<div className="w-full">

				<TabView className="w-full flex flex-column "
					activeIndex={activeIndex}
					onTabChange={(e) => setActiveIndex(e.index)}
				>
					<TabPanel header="A Coletar">
						<div className="w-full flex flex-column">
							<div className="flex mt-2 relative">
								<TableColetar
									mudarStatus={mudarStatusColetar}
									solicitacoesColetas={data.coletas}
								/>
							</div>
						</div>


					</TabPanel>
					<TabPanel header="A Entregar">
						<div className="w-full flex flex-column">
							<div className="flex mt-2 relative">
								<TableEntregar
									mudarStatus={mudarStatus}
									solicitacoesEntrega={data.entregas}
								/>
							</div>
						</div>


					</TabPanel>
				</TabView>

			</div>
		)
	}

	return (
		<div className={ContainerFlexColumnDiv}>
			<h1 className={titleStyle}>Gerenciamento de Entregas/Coletas</h1>
			<DataTable
				tableStyle={{minWidth: `70rem`}}
				value={solicitacoes}
				expandedRows={expandedRows}
				onRowToggle={(e) => setExpandedRows(e.data)}
				rowExpansionTemplate={rowExpansionTemplate}
				scrollable
				scrollHeight="600px"
				emptyMessage={TabelaMessagemVazia.MessagemColetasEntregasVazio}
				loading={loading}
			>
				<Column expander={allowExpansion} style={{width: `4rem`}}/>
				<Column field="profissional.nome" className="text-xl text-900 font-bold"/>
			</DataTable>

			<ModalColetar
				onConfirmeColetar={onConfirmeColetar}
				statusAtual={statusAtual}
				statusASerAtualizado={statusASerAtualizado}
				visible={dialogColetar}
				onClose={() => setDialogColetar(false)}
				salvando={salvando}
			/>
			<ModalEntragar
				onConfirmeEntregar={onConfirmeEntregar}
				statusAtual={statusAtual}
				statusASerAtualizado={statusASerAtualizado}
				visible={dgEntregar}
				onClose={() => setDgEntregar(false)}
				salvando={salvando}
			/>
		</div>
	)
}
