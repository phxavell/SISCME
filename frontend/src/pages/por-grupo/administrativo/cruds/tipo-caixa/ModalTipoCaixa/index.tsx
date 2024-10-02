import { Dialog } from 'primereact/dialog'
import { Button } from 'primereact/button'
import { Input } from '@/components/Input'
import { Errors } from '@/components/Errors'
import { useAuth } from '@/provider/Auth'
import { useTipoCaixa } from '../useTipoCaixa'
import { useState } from 'react'
import { MiniModal } from '@/components/MiniModal'
import { TiposCaixaModalAPI } from '@/infra/integrations/administrativo/tipo-caixa/tipos-caixa-modal'
import {ModalEmbalagemProps} from "@pages/por-grupo/administrativo/especificoes/embalagem/types.ts"
import { buttonCheck } from '@/util/styles/buttonAction'

export function ModalTipoCaixa(props: ModalEmbalagemProps) {
	const { visible, onClose } = props
	const [miniModalVisible, setMiniModalVisible] = useState<boolean>(false)
	const { handleSubmit, register, errors, reset, isDirty, handleErrorReturnApi } = useTipoCaixa()

	const { user, toastSuccess } = useAuth()

	const handleTipoCaixa = (data: any) => {
		TiposCaixaModalAPI.salvar(user, data).then(() => {
			onClose(true)
			reset()
			toastSuccess(`Tipo caixa salvo!`)
		}).catch((error) => {
			handleErrorReturnApi(error.data)
		})
	}
	const confirmarFecharModal = () => {
		if (isDirty) {
			setMiniModalVisible(true)
		} else {
			onClose(false)
			reset()
		}
	}
	return (
		<>
			<MiniModal
				miniModalVisible={miniModalVisible}
				setMiniModalVisible={setMiniModalVisible}
				reset={reset}
				onClose={() => onClose(false)}
			/>
			<Dialog
				header='Novo Tipo'
				visible={visible}
				data-testid="modal-tipo-caixa"
				draggable={false}
				resizable={false}
				style={{ width: `50vw` }}
				onHide={() => {
					confirmarFecharModal()
				}}
			>
				<form className="w-full mt-4">
					<div className="w-full flex flex-row gap-2">
						<div className="w-full">
							<div className="mb-4">
								<Input
									type="text"
									placeholder='Descrição:'
									autoFocus={true}
									{...register(`descricao`)}
								/>
								{errors.descricao && <Errors message={errors.descricao.message} />}
							</div>
						</div>
						<Button
							icon={buttonCheck.icon}
							className={buttonCheck.color}
							rounded
							aria-label="Filter"
							onClick={handleSubmit(handleTipoCaixa)}
						/>
					</div>
				</form>

			</Dialog>
		</>
	)
}
