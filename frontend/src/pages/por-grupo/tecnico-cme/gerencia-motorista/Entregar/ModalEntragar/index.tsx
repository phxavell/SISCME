import { useMemo } from 'react'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'

// @ts-ignore
export function ModalEntragar(props) {

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
			style={{ width: `50vw` }}
			onHide={() => onClose()}
			dismissableMask={false}
			resizable={false}
			closeOnEscape={true}
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
					data-testid='botao-confirmar-entrega'
					onClick={() => onConfirmeEntregar()}
					icon="pi pi-check"
					autoFocus />
			</div>
		</Dialog>
	)
}
