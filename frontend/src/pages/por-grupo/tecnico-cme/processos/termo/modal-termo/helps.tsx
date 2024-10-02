import React from "react"
import { MessageType } from "./types"

export const makeShowMessage = (msgs: any) => (type: MessageType, serial: any) => {
	switch (type) {
	case MessageType.SerialNaoEncontrado:
		msgs?.current?.show(
			{
				severity: `warn`,
				life: 2000,
				closable: true,
				content: (
					<React.Fragment>
						<div>
							<ul>
								<li>Caixa {serial ?? ``} não encontrada</li>
							</ul>
						</div>
					</React.Fragment>
				)
			}
		)
		break
	case MessageType.SerialJaLido:
		msgs?.current?.show(
			{
				severity: `warn`,
				life: 1600,


				closable: true,
				content: (
					<React.Fragment>
						<div>
							<ul>
								<li>Caixa {serial ?? ``} já lida.</li>
							</ul>
						</div>
					</React.Fragment>
				)
			}
		)
		break
	case MessageType.SerialNaoInformado:
		msgs?.current?.show(
			{
				severity: `warn`,
				life: 1600,
				closable: true,
				content: (
					<React.Fragment>
						<div>
							<ul>
								<li>Serial não informado</li>
							</ul>
						</div>
					</React.Fragment>
				)
			}
		)
		break
	case MessageType.PrimeiroCarregamento:
		msgs?.current?.show(
			{
				severity: `info`,
				life: 7200,
				closable: true,
				content: (
					<React.Fragment>
						<div>
							<ul>
								<li className="text-xl">Leia uma sequência e clique em +</li>
								<li className="text-xl">Ao ler todas as caixas clique em salvar para salvar o lote</li>
							</ul>
						</div>
					</React.Fragment>
				)
			}
		)
		break
	default:
		break
	}
}
