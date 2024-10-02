import { Dialog } from 'primereact/dialog'
import { Button } from 'primereact/button'
import { Input } from '@/components/Input.tsx'
import { Errors } from '@/components/Errors.tsx'
import { useModalSetor } from './useModalSetor.ts'
import {ModalEmbalagemProps} from "@pages/por-grupo/administrativo/especificoes/embalagem/types.ts"
import { buttonCheck } from '@/util/styles/buttonAction.ts'


export const ModalSetor:React.FC<ModalEmbalagemProps> = (props)=> {
	const { register, handleCreateSetor, handleSubmit, errors, reset } = useModalSetor()
	const { visible, onClose, onRetornoDataSetor } = props
	const handleSetor = (data: any) => {
		handleCreateSetor(data).then((data) => {
			if(onRetornoDataSetor) onRetornoDataSetor(data)
		})
	}
	return (
		<Dialog
			header='Novo Setor'
			visible={visible}
			data-testid="modal-setor"
			style={{ width: `50vw` }}
			draggable={false}
			resizable={false}
			onHide={() => {
				onClose(false)
				reset()
			}}
		>
			<form onSubmit={handleSubmit(handleSetor)} className="w-full mt-4">
				<div className="w-full flex flex-row gap-2">
					<div className="w-full">
						<div className="mb-4">
							<Input
								autoFocus
								type="text"
								placeholder='Descrição:'
								dataTestId='input-descricao-setor'
								{...register(`descricao`)}
							/>
							{errors.descricao && <Errors message={errors.descricao.message} />}
						</div>
					</div>
					<Button
						icon={buttonCheck.icon}
						className={`${buttonCheck.color}`}
						rounded
						data-testid='botao-salvar-setor'
						aria-label="Filter"
						type="submit"
					/>
				</div>
			</form>

		</Dialog>
	)
}
