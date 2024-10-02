import { Dialog } from 'primereact/dialog'
import { Button } from 'primereact/button'
import { Input } from '@/components/Input'
import { Errors } from '@/components/Errors'
import { useModalProfissao } from './useModalProfissao'
import { buttonCheck } from '@/util/styles/buttonAction'
export interface ModalProfissaoProps {
    visible: boolean
    onClose: (prop: boolean) => void
}
export function ModalProfissao(props: ModalProfissaoProps) {
	const { register, handleCreateProfissao, handleSubmit, errors, reset } = useModalProfissao()
	const { visible, onClose } = props
	return (
		<Dialog
			header='Nova Profissão'
			visible={visible}
			data-testid="modal-profissao"
			style={{ width: `50vw` }}
			draggable={false}
			resizable={false}
			onHide={() => {
				onClose(false)
				reset()
			}}
		>

			<form className="w-full mt-4">
				<div className="w-full flex flex-row gap-2">
					<div className="w-full">
						<div className="mb-4">
							<Input
								autoFocus
								type="text"
								placeholder='Descrição:'
								{...register(`descricao`)}
							/>
							{errors.descricao && <Errors message={errors.descricao.message} />}
						</div>
					</div>
					<Button
						icon={buttonCheck.icon}
						className={`${buttonCheck.color}`}
						rounded
						aria-label="Filter"
						onClick={handleSubmit(handleCreateProfissao)}
					/>
				</div>
			</form>

		</Dialog>
	)
}
