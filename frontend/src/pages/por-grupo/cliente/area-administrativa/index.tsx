import {ContainerFlexColumnDiv} from '@/util/styles'
import {useSterizationRequest} from '../criar-solicitacao/sterization-request/useSterizationRequest'

export function AreaAdministrativa() {
	const {mensagemErrorForbiden} = useSterizationRequest()
	return (
		<div className={ContainerFlexColumnDiv}>
			<div className="flex flex-column gap-4">
				<span>Área do cliente</span>
				<strong>{mensagemErrorForbiden}</strong>
			</div>
		</div>
	)
}
