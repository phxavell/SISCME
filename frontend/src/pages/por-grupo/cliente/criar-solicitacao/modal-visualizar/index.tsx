import { SolicitacaoDoCliente } from '@/infra/integrations/cliente-solicitacoes.ts'
import { Dialog } from 'primereact/dialog'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { Timeline } from 'primereact/timeline'

import './modal.css'
import RenderObject from '@/components/RenderObject.tsx'
import { TimelineEvent, useModalVisualizar } from './useModalVisualizar'

interface propsModal {
    openDialog: boolean
    closeDialog: (success: boolean) => void
    solicitacao: SolicitacaoDoCliente | undefined
}

interface Caixa {
    id: string
}
const CustomizedMarker = (item: TimelineEvent) => {
	const style = `
    text-lg
    flex
    align-items-center
    justify-content-center
    text-white
    border-circle
    iconDiv
    `
	return (
		<div
			className={style}
			style={{ backgroundColor: item.color }}>
			<i className={`${item.icon} iconI`}></i>
		</div>
	)
}
const CustomizedContent = (item: TimelineEvent) => {
	return (
		<div className="text-lg mt-1 text-200 pl-2">
			{item.status}
		</div>
	)
}

export default function ModalVisualizar(props: propsModal) {
	const { eventsAtualizados } = useModalVisualizar()

	const { openDialog, closeDialog, solicitacao } = props
	const handleClose = () => {
		closeDialog(false)
	}
	if (!solicitacao) {
		return <></>
	}
	const caixas: Caixa[] = solicitacao.caixas?.map(caixa => ({ id: caixa }))

	const headerMemo = () => {
		if (solicitacao?.id) {
			return `#${solicitacao.id} Solicitação de Esterilização `
		}
		return `# Solicitação de Esterilização: `
	}

	return (
		<Dialog
			className="text-lg w-10  flex flex-column"
			header={headerMemo}
			visible={openDialog}
			onHide={handleClose}
		>

			<Timeline
				value={eventsAtualizados(solicitacao.historico)}
				content={CustomizedContent}
				layout="horizontal"
				className="text-lg px-6 mb-3"
				marker={CustomizedMarker}
				opposite={(item) => item.date}

			/>

			<div className="flex flex-row gap-4">
				<div className="flex-1">
					<div className=" flex flex-column mb-3">
						<div className="flex flex-row gap-1">
							<div className="font-medium mr-2">
                                Criado por:
							</div>
							<RenderObject data={solicitacao} keyObject={`criado_por.nome`}></RenderObject>
						</div>

					</div>

					<DataTable
						emptyMessage=' '
						value={caixas}
						size="small"
						key="id"
						className="text"
						scrollable
						scrollHeight="500px"
						style={{ minWidth: `100px` }}
					>
						<Column
							header={`Caixas (${caixas?.length})`}
							field="id">
						</Column>
					</DataTable>
				</div>
				<div className="flex flex-column w-4">
					<div className="font-medium mr-2 mb-2">
                        Observação:
					</div>
					<RenderObject data={solicitacao} keyObject="observacao"></RenderObject>
				</div>
			</div>
		</Dialog>

	)
}
