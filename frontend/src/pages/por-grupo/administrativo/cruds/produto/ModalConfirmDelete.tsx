import { buttonCheck, buttonTimes } from '@/util/styles/buttonAction'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'

interface ModalConfirmDeleteProps {
    modalTipoVisible: boolean
    onClose: () => void,
    titulo: string,
    onConfirm: () => void
}
export const ModalConfirmDelete: React.FC<ModalConfirmDeleteProps> = (
	{
		onClose,
		modalTipoVisible,
		titulo,
		onConfirm,
	}
) => {

	const closeModal = () => {
		onClose()
	}
	const confirmDelete = () => {
		onConfirm()
	}
	const deleteFooter = (
		<>
			<Button label="Não" icon={buttonTimes.icon} className={buttonTimes.color} onClick={closeModal} />
			<Button label="Sim" icon={buttonCheck.icon} className={buttonCheck.color} onClick={confirmDelete} />
		</>
	)
	return (
		<Dialog
			visible={modalTipoVisible}
			style={{ width: `32rem` }}
			header={titulo}
			modal
			footer={deleteFooter}
			onHide={closeModal}
			dismissableMask={true}
			closeOnEscape={true}
			blockScroll={true}
			focusOnShow={false}
			resizable={false}
			draggable={false}
			headerStyle={{ color: `white` }}
		>
			<div className="text-white">
				<i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: `2rem` }} />
				<span>
                    Tem certeza que deseja excluir este registro?
				</span>
			</div>
		</Dialog>
	)
}
