import { useMemo } from 'react'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'

// @ts-ignore
export function InProgressDriverModalEntragar(props) {

	const {
		visible,
		onClose,
		onConfirmeEntregar,
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
					onClick={() => onConfirmeEntregar()}
					icon="pi pi-check"
					autoFocus />
			</div>
		</Dialog>
	)
}
