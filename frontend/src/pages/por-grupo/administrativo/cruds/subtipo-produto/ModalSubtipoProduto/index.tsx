import { Dialog } from 'primereact/dialog'
import { Button } from 'primereact/button'
import { Input } from '@/components/Input'
import { Errors } from '@/components/Errors'
import { SubTipoProdutoAPI } from '@/infra/integrations/sub-tipo-produto'
import { useAuth } from '@/provider/Auth'
import { MiniModal } from '@/components/MiniModal'
import { useState } from 'react'
import { useSubTipoProdutoModal } from '../useSubTipoProdutoModal'
import {ModalEmbalagemProps} from "@pages/por-grupo/administrativo/especificoes/embalagem/types.ts"
import { buttonCheck } from '@/util/styles/buttonAction'

export function ModalSubtipoProduto(props: ModalEmbalagemProps) {
	const { visible, onClose } = props
	const [miniModalVisible, setMiniModalVisible] = useState<boolean>(false)
	const { handleSubmit, register, errors, reset, isDirty, handleErrorReturnApi } = useSubTipoProdutoModal()

	const { user, toastSuccess } = useAuth()

	async function handleSubTipoProduto(data: any) {
		await SubTipoProdutoAPI.onSave(user, data).then(() => {
			onClose(true)
			reset()
			toastSuccess(`Sub tipo produto salvo!`)
		}).catch((e) => {
			handleErrorReturnApi(e.data)
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
				header='Novo Subtipo de Produto'
				visible={visible}
				data-testid="modal-subtipo-produto"

				style={{ width: `50vw` }}
				onHide={() => { confirmarFecharModal()	}}
				draggable={false}
				resizable={false}
				dismissableMask={true}
				closeOnEscape={true}

			>
				<form className="w-full mt-4">
					<div className="w-full flex flex-row gap-2">
						<div className="w-full">
							<div className="mb-4">
								<Input
									type="text"
									autoFocus={true}
									placeholder='Descrição'
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
							onClick={handleSubmit(handleSubTipoProduto)}
						/>
					</div>
				</form>

			</Dialog>
		</>
	)
}
