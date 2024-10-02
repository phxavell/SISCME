import { Dialog } from "primereact/dialog"
import { Message } from "primereact/message"
import { Image } from "primereact/image"
import { styleMessage } from "@/util/styles"

export function ModalVisualizarProduto({ onClose, produto, visible }: any) {
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

	const templateImage = () => {
		if(produto?.foto) {
			return (
				<Image src={`${produto?.foto}`} alt="foto" width="250px" className="shadow-4" preview/>
			)
		} else {
			<div />
		}
	}
	return (
		<Dialog
			onHide={onClose}
			dismissableMask={true}
			closeOnEscape={true}
			blockScroll={false}
			focusOnShow={false}
			resizable={false}
			draggable={false}
			visible={visible}
			header='Detalhes'
			style={{width: `70vw`}}
		>
			<div className="flex align-items-center justify-content-center">
				<div className="grid mt-5 gap-5 justify-content-between px-4">
					<Message
						style={styleMessage}
						className="border-primary h-4rem"
						severity="info"
						content={() => messageTemplate(`Nome`, produto?.descricao)}
					/>
					<Message
						style={styleMessage}
						className="border-primary h-4rem"
						severity="info"
						content={() => messageTemplate(`Embalagem`, produto?.embalagem)}
					/>
					<Message
						style={styleMessage}
						className="border-primary h-4rem"
						severity="info"
						content={() => messageTemplate(`Tipo`, produto?.idtipopacote?.descricao)}
					/>
					<Message
						style={styleMessage}
						className="border-primary h-4rem"
						severity="info"
						content={() => messageTemplate(`Subtipo`, produto?.idsubtipoproduto.descricao)}
					/>

				</div>
				{templateImage()}
			</div>

		</Dialog>
	)
}
