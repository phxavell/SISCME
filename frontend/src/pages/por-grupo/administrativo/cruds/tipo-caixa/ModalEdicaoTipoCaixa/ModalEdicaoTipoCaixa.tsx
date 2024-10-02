import { Errors } from "@/components/Errors"
import { Input } from "@/components/Input"
import { Button } from "primereact/button"
import { Dialog } from "primereact/dialog"
import { useAuth } from "@/provider/Auth"
import { useModalEdicaoTipoCaixa } from "./useModalEdicaoTipoCaixa"
import { TipoCaixaInputs, TipoCaixaProps } from "../schemas"
import { TiposCaixaModalAPI } from '@/infra/integrations/administrativo/tipo-caixa/tipos-caixa-modal'
import { buttonCheck } from "@/util/styles/buttonAction"
export interface ModalEdicaoTipoCaixaProps {
    visible: boolean
    onClose: (prop: boolean) => void
    TipoCaixaData: TipoCaixaProps
}
export function ModalEdicaoTipoCaixa(props: ModalEdicaoTipoCaixaProps){
	const { visible, onClose, TipoCaixaData } = props
	const { user, toastSuccess, toastError } = useAuth()
	const { register, handleSubmit, handleErrorReturnApi, errors, reset } = useModalEdicaoTipoCaixa(TipoCaixaData)
	const handleEditarSubTipoProduto = async (data: TipoCaixaInputs) => {
		try {
			if(data.id){
				await TiposCaixaModalAPI.alterar(user, {descricao: data.descricao, id: data.id})
				toastSuccess(`Tipo caixa atualizado!`)
				onClose(false)
				reset()
			}
		} catch (error: any) {
			if (error.data) {
				handleErrorReturnApi(error.data)
			} else {
				toastError(`Não foi possível atualizar Tipo caixa!`, false)
			}
		}
	}
	return (
		<Dialog
			header='Editar Tipos Caixa'
			visible={visible}
			data-testid="edicao-tipos-caixa"
			style={{ width: `50vw` }}
			draggable={false}
			resizable={false}
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
