import { Dialog } from 'primereact/dialog'
import {useState} from 'react'
import { Button } from 'primereact/button'
import { Input } from '@/components/Input.tsx'
import { Errors } from '@/components/Errors.tsx'
import { useAuth } from '@/provider/Auth'
import { useTipoProdutoModal } from '../useTipoProdutoModal.ts'
import { TipoProdutoModalModalAPI } from '@infra/integrations/administrativo/tipo-produto-modal/tipo-produto-modal.ts'
import { MiniModal } from '@/components/MiniModal'
import {ModalEmbalagemProps} from "@pages/por-grupo/administrativo/especificoes/embalagem/types.ts"
import { buttonCheck } from '@/util/styles/buttonAction.ts'

export function ModalTipoProduto(props: ModalEmbalagemProps) {
	const { visible, onClose } = props
	const [miniModalVisible, setMiniModalVisible] = useState<boolean>(false)
	const { handleSubmit, register, errors, reset, isDirty, handleErrorReturnApi } = useTipoProdutoModal()

	const { user, toastSuccess } = useAuth()

	const handleTipoProduto = async (data: any) => {
		try {
			await TipoProdutoModalModalAPI.onSave(user, data)
			toastSuccess(`Tipo produto salvo!`)
			onClose(true)
			reset()
		} catch (error: any) {
			handleErrorReturnApi(error.data)
		}
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
				header='Novo Tipo de Produto'
				visible={visible}
				data-testid="modal-tipo-produto"
				dismissableMask={true}
				closeOnEscape={true}
				draggable={false}
				resizable={false}
				focusOnShow={false}
				style={{ width: `50vw` }}
				onHide={() => {confirmarFecharModal()}}
			>
				<form className="w-full mt-4">
					<div className="w-full flex flex-row gap-2">
						<div className="w-full">
							<div className="mb-4">
								<Input
									dataTestId="input-descricao"
									type="text"
									autoFocus={true}
									placeholder='Descrição:'
									{...register(`descricao`)}
								/>
								{errors.descricao && <Errors message={errors.descricao.message} />}
							</div>
						</div>
						<Button
							role="botao-submit"
							icon={buttonCheck.icon}
							className={buttonCheck.color}
							rounded
							aria-label="Filter"
							onClick={handleSubmit(handleTipoProduto)}
						/>
					</div>
				</form>

			</Dialog>
		</>
	)
}
