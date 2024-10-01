import { buttonCheck, buttonTimes } from '@/util/styles/buttonAction'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { useDeleteSetor } from './useDeleteSetor'

type ModalDeleteProps = {
    titulo: string
}
export const ModalDeleteSetor = ({titulo}: ModalDeleteProps) => {
	const {visibleModalDelete, closeModalDelete, handleConfirmardelecao} = useDeleteSetor()

	const deleteFooter = (
		<>
			<Button label="Não" icon={buttonTimes.icon} className={buttonTimes.color} onClick={closeModalDelete} />
			<Button label="Sim" icon={buttonCheck.icon} className={buttonCheck.color} onClick={handleConfirmardelecao} />
		</>
	)
	return (
		<Dialog
			visible={visibleModalDelete}
			style={{ width: `32rem` }}
			header={titulo}
			modal
			footer={deleteFooter}
			onHide={closeModalDelete}
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
