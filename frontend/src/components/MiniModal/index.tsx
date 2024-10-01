/* eslint-disable @typescript-eslint/no-explicit-any */
import { buttonCheck, buttonTimes } from '@/util/styles/buttonAction'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'

interface MiniModalProps {
    miniModalVisible: boolean
    setMiniModalVisible: React.Dispatch<React.SetStateAction<boolean>>
    reset: any
    onClose: () => void
}


//TODO tornar generico, deixando o reset para a página pai.
export function MiniModal({miniModalVisible, setMiniModalVisible, reset, onClose }: MiniModalProps) {
	return (
		<Dialog
			header='Atenção!'
			dismissableMask={true}
			closeOnEscape={true}
			blockScroll={true}
			focusOnShow={false}
			resizable={false}
			draggable={false}
			visible={miniModalVisible}
			onHide={() => setMiniModalVisible(false)}
		>
			<div className="flex flex-column align-items-center -mt-4">
				<h3 className="w-8 text-center">Tem certeza que deseja fechar o formulário? Existem campos preenchidos!</h3>
				<div className="flex gap-2">
					<Button
						icon={`${buttonTimes.icon}`}
						className={`${buttonTimes.color} `}
						onClick={() => setMiniModalVisible(false)}
						label="Cancelar"
					>

					</Button>
					<Button
						onClick={() => {
							setMiniModalVisible(false)
							reset()
							onClose()
						}}
						icon={buttonCheck.icon}
						className={buttonCheck.color}
						label="Sim, tenho certeza"
					/>

				</div>
			</div>
		</Dialog>

	)
}
