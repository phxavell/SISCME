import { useMemo } from "react"
import { Button } from "primereact/button"
import { Dialog } from "primereact/dialog"

// @ts-ignore
export function ModalColetar(props) {

	const {
		visible,
		onClose,
		onConfirmeColetar,
		statusASerAtualizado,
		salvando
	} = props

	const headerMemo = useMemo(() => {
		return `Confirmar ${statusASerAtualizado}?`
	}, [statusASerAtualizado])

	return (
		<Dialog
			header={headerMemo}
			visible={visible}
			style={{ width: `50vw` }}
			onHide={() => onClose()}
			data-testid="modal-coletar"
			dismissableMask={true}
			closeOnEscape={true}
			resizable={false}
			draggable={false}
		>
			<div className="mt-6 w-full flex justify-content-end">
				<Button
					label="Cancelar"
					icon="pi pi-times"
					onClick={() => onClose()}
					className="p-button-text" />
				<Button
					loading={salvando}
					label="Confirmar"
					data-testid='botao-confirmar-coleta'
					type="submit"
					onClick={() => onConfirmeColetar()}
					icon="pi pi-check"
					autoFocus />
			</div>
		</Dialog>
	)
}
