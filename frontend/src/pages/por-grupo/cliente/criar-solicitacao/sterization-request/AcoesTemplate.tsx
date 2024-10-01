import { SolicitacaoDoCliente } from '@/infra/integrations/cliente-solicitacoes'
import { Button } from 'primereact/button'
import { Tag } from 'primereact/tag'
import { Tooltip } from 'primereact/tooltip'
import { FaHistory } from 'react-icons/fa'
import { GiConfirmed } from 'react-icons/gi'
import { StatusEvent } from '../modal-visualizar/useModalVisualizar'

interface AcoesTemplateProps {
    onConfirmeEntrega: (idColetar: number) => void
    onRowSelect: (event: SolicitacaoDoCliente) => void
}
export const AcoesTemplate = (
	props: AcoesTemplateProps
) => (solicitacao: SolicitacaoDoCliente) => {
	const { onRowSelect, onConfirmeEntrega } = props
	if (solicitacao.situacao) {
		if (solicitacao.situacao === StatusEvent.EmTransporte && solicitacao.retorno) {
			return (
				<div className="flex align-content-center gap-3">
					<Button className="h-2rem" severity="secondary"
						onClick={() => onRowSelect(solicitacao)}
						tooltip="Histórico"
						tooltipOptions={{ position: `bottom`, mouseTrack: true, mouseTrackTop: 15 }}
					>
						<FaHistory size={24} />
						<Tooltip target=".logo" mouseTrack mouseTrackLeft={10} />
					</Button>
					<Button className="h-2rem" severity="success"
						onClick={() => onConfirmeEntrega(solicitacao.coleta.idcoleta)}
						tooltip="Confirmar Recebimento?"
						tooltipOptions={{ position: `bottom`, mouseTrack: true, mouseTrackTop: 15 }}
					>
						<GiConfirmed size={20} />
					</Button>

				</div>
			)
		} else {
			return (
				<div className="flex align-content-center justify-content-between">
					<Button className="h-2rem" severity="secondary"
						onClick={() => onRowSelect(solicitacao)}
						tooltip="Histórico"
						tooltipOptions={{ position: `bottom`, mouseTrack: true, mouseTrackTop: 15 }}
					>
						<Tooltip target=".logo" mouseTrack mouseTrackLeft={10} />
						<FaHistory size={24} />
					</Button>
				</div>
			)
		}

	}
	return (<Tag value="Error" severity="danger" />)
}
