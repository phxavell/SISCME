import {Errors} from "@/components/Errors.tsx"
import {Input} from "@/components/Input.tsx"
import {Button} from "primereact/button"
import {Dialog} from "primereact/dialog"
import {useModalEdicaoTipoProduto} from "./useModalEdicaoTipoProduto.ts"
import {TipoProdutoModalInputs} from "@infra/integrations/administrativo/tipo-produto-modal/types.ts"
import {useAuth} from "@/provider/Auth"
import {TipoProdutoModalModalAPI} from "@infra/integrations/administrativo/tipo-produto-modal/tipo-produto-modal.ts"
import {ModalEdicaoTipoProdutoProps} from "@pages/por-grupo/administrativo/especificoes/tipo-produto/types.ts"
import { buttonCheck } from "@/util/styles/buttonAction.ts"

export function ModalEdicaoTipoProduto(props: ModalEdicaoTipoProdutoProps){
	const { visible, onClose, tipoProdutoData } = props
	const { user, toastSuccess, toastError } = useAuth()
	const { register, handleSubmit, handleErrorReturnApi, errors, reset } = useModalEdicaoTipoProduto(tipoProdutoData)
	const handleEditarTipoProduto = async (data: TipoProdutoModalInputs) => {
		try {
			if(data.id){
				await TipoProdutoModalModalAPI.onUpdate(user, data, data.id)
				toastSuccess(`Tipo Produto atualizado!`)
				onClose(false)
				reset()
			}
		} catch (error: any) {
			if (error.data) {
				handleErrorReturnApi(error.data)
			} else {
				toastError(`Não foi possível atualizar tipo produto!`, false)
			}
		}
	}
	return (
		<Dialog
			header='Editar Tipo Produto'
			visible={visible}
			data-testid="edicao-tipo-produto"
			style={{ width: `50vw` }}
			dismissableMask={true}
			closeOnEscape={true}
			draggable={false}
			resizable={false}
			onHide={() => {
				onClose(false)
				reset()
			}}
		>

			<form
				onSubmit={handleSubmit(handleEditarTipoProduto)}
				className="w-full mt-4">
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
