import { Errors } from "@/components/Errors"
import { Input } from "@/components/Input"
import { Button } from "primereact/button"
import { Dialog } from "primereact/dialog"
import {SubTipoProdutoProps, SubTipoProdutoModalInputs } from '@/infra/integrations/administrativo/sub-tipo-produto-modal/types'
import { useAuth } from "@/provider/Auth"
import { useModalEdicaoSubTipoProduto } from "./useModalEdicaoSubTipoProduto"
import { SubTipoProdutoModalAPI } from "@/infra/integrations/administrativo/sub-tipo-produto-modal/sub-tipo-produto-modal"
import { buttonCheck } from "@/util/styles/buttonAction"
export interface ModalEdicaoSubTipoProdutoProps {
    visible: boolean
    onClose: (prop: boolean) => void
    subTipoProdutoData: SubTipoProdutoProps
}
export function ModalEdicaoSubTipoProduto(props: ModalEdicaoSubTipoProdutoProps){
	const { visible, onClose, subTipoProdutoData } = props
	const { user, toastSuccess, toastError } = useAuth()
	const { register, handleSubmit, handleErrorReturnApi, errors, reset } = useModalEdicaoSubTipoProduto(subTipoProdutoData)
	const handleEditarSubTipoProduto = async (data: SubTipoProdutoModalInputs) => {
		try {
			if(data.id){
				await SubTipoProdutoModalAPI.onUpdate(user, data, data.id)
				toastSuccess(`Sub tipo produto atualizado!`)
				onClose(false)
				reset()
			}
		} catch (error: any) {
			if (error.data) {
				handleErrorReturnApi(error.data)
			} else {
				toastError(`Não foi possível atualizar sub tipo produto!`, false)
			}
		}
	}
	return (
		<Dialog
			header='Editar Sub Tipo Produto'
			visible={visible}
			data-testid="edicao-sub-tipo-produto"
			style={{ width: `50vw` }}
			draggable={false}
			resizable={false}
			dismissableMask={true}
			closeOnEscape={true}
			onHide={() => {
				onClose(false)
				reset()
			}}

		>
			<form onSubmit={handleSubmit(handleEditarSubTipoProduto)} className="w-full mt-4">
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
						className={buttonCheck.color}
						rounded
						aria-label="Filter"
						type="submit"
					/>
				</div>
			</form>

		</Dialog>
	)
}
