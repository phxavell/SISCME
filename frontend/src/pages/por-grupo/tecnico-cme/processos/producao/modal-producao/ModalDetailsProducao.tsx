import { Dialog } from "primereact/dialog"
import { Image } from "primereact/image"

export function ModalDetailsProducao({ visible, onClose, fotos }: any) {
	const ExibirFotos = () => {
		if(fotos?.length > 0) {
			return fotos.map((foto: any) => {
				return (
					<Image src={foto} key={foto} alt="foto" width="300" preview />
				)
			})
		} else {
			return <h3>Nenhuma foto foi tirada nesta etapa!</h3>
		}
	}
	return (
		<Dialog
			visible={visible}
			onHide={onClose}
			style={{width: `50vw`}}
			dismissableMask={true}
			closeOnEscape={true}
			header='Fotos da produção'
			blockScroll={false}
			draggable={false}
		>
			<div className="grid gap-2 justify-content-center">
				{ExibirFotos()}
			</div>

		</Dialog>
	)
}
