import { Dialog } from 'primereact/dialog'
import { Button } from 'primereact/button'
import { Input } from '@/components/Input'
import { Errors } from '@/components/Errors'

import { useComplemento } from '../useComplemento'

import { Controller } from 'react-hook-form'
import { Dropdown } from 'primereact/dropdown'

export function ModalComplemento({ visible, onClose }: any) {
	const { handleSubmit, register, errors, reset, control, status, handleCreateComplemento } = useComplemento(onClose)

	const onCloseModalRestarIput = () => {
		onClose(false)
		reset()
	}
	return (
		<Dialog
			header='Novo Complemento'
			visible={visible}
			data-testid="modal-complemento"
			style={{ width: `50vw` }}
			onHide={() => {
				onCloseModalRestarIput()
			}}
			dismissableMask={true}
			closeOnEscape={true}
			focusOnShow={false}
			blockScroll={false}
			resizable={false}
			draggable={false}
		>
			<form className="w-full mt-4">
				<div className="w-full flex flex-column gap-2 align-items-center">
					<div className="w-full">
						<div className="mb-4">
							<Input
								data-testid="input-descricao"
								type="text"
								placeholder='Descrição:'
								{...register(`descricao`)}
								autoFocus
							/>
							{errors.descricao && <Errors message={errors.descricao.message} />}
						</div>
						<Controller
							name="status"
							control={control}
							render={({ field }) => (
								<div className="text-left">
									<span className="p-float-label">
										<Dropdown
											className={`w-full h-3rem`}
											id={field.name}
											options={status}
											value={field.value}
											onChange={(e) => field.onChange(e.value)}
										/>
										<label htmlFor="">
                          					Status
										</label>
									</span>
									{errors.status && <Errors message={errors.status.message} />}

								</div>
							)}
						/>
					</div>
					<Button
						className='w-5 mt-3 h-3rem'
						role="botao-submit"
						icon="pi pi-check"
						aria-label="Filter"
						onClick={handleSubmit(handleCreateComplemento)}
					/>
				</div>
			</form>

		</Dialog>
	)
}
