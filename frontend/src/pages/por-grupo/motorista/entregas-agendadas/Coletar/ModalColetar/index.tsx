import { useMemo } from 'react'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'

// @ts-ignore
export function InProgressDriverModalColetar(props) {

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
			className='sm:w-25rem'
			draggable={false}
			resizable={false}
			onHide={() => onClose()}
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
					type="submit"
					onClick={() => onConfirmeColetar()}
					icon="pi pi-check"
					autoFocus />
			</div>
		</Dialog>
	)
}
