import { Dialog } from "primereact/dialog"
import { Message } from "primereact/message"
import moment from "moment"
import { styleMessage } from "@/util/styles"

export function ModalVisualizarIndicador({ onClose, indicador, visible }: any) {
	const messageTemplate = (title: string, label: string | undefined) => {
		const exibirLabel = () => {
			if (label == `` || label == null) {
				return `Não informado!`
			} else {
				return label
			}
		}

		return (
			<div>
				<h4 className="p-0 m-0">{title}</h4>
				<p className="p-0 m-0">{exibirLabel()}</p>
			</div>
		)
	}

	const footer = () => {
		return (
			<div>
				<div className="flex mb-2 align-items-center text-sm font-italic">
					Criado por {indicador?.criado_por?.nome} em {moment(indicador?.criado_em).format(`DD/MM/YYYY HH:mm`)}
				</div>
				<div className="flex align-items-center text-sm font-italic">
					Atualizado por {indicador?.atualizado_por?.nome} em {moment(indicador?.atualizado_em).format(`DD/MM/YYYY HH:mm`)}
				</div>
			</div>
		)
	}

	return (
		<Dialog
			onHide={onClose}
			dismissableMask={true}
			closeOnEscape={true}
			blockScroll={false}
			draggable={false}
			visible={visible}
			header='Detalhes'
			style={{width: `40vw`}}
			footer={footer}
		>
			<div className="flex align-items-center justify-content-center">
				<div className="grid mt-3 gap-5 justify-content-between px-4">
					<Message
						style={styleMessage}
						className="border-primary h-4rem"
						severity="info"
						content={() => messageTemplate(`Descrição`, indicador?.descricao)}
					/>
					<Message
						style={styleMessage}
						className="border-primary h-4rem"
						severity="info"
						content={() => messageTemplate(`Data de cadastro`, moment(indicador?.datalancamento).format(`DD/MM/YYYY`))}
					/>
				</div>
			</div>

		</Dialog>
	)
}
