import { Errors } from "@/components/Errors"
import { Input } from "@/components/Input"
import { Button } from "primereact/button"
import { Dialog } from "primereact/dialog"
import { useModalEdicaoProfissao} from "./useModalEdicaoProfissao"
import { ProfissaoProps } from ".."
import { ProfissaoInputs } from "../schemas"
import { useAuth } from "@/provider/Auth"
import { ProfissaoAPI } from "@/infra/integrations/profissao"
import { buttonCheck } from "@/util/styles/buttonAction"
export interface ModalEdicaoProfissaoProps {
    visible: boolean
    onClose: (prop: boolean) => void
    profissaoData: ProfissaoProps
}
export function ModalEdicaoProfissao(props: ModalEdicaoProfissaoProps){
	const { visible, onClose, profissaoData } = props
	const { user, toastSuccess, toastError } = useAuth()
	const { register, handleSubmit, handleErrorReturnApi, errors, reset } = useModalEdicaoProfissao(profissaoData)
	const handleEditarProfissao = async (data: ProfissaoInputs) => {
		try {
			if(data.id){
				await ProfissaoAPI.onUpdate(user, data, data.id)
				toastSuccess(`Profissão atualizada!`)
				onClose(false)
				reset()
			}
		} catch (error: any) {
			if (error.data) {
				handleErrorReturnApi(error.data)
			} else {
				toastError(`Não foi possível cadastrar o profissão!`, false)
			}
		}
	}
	return (
		<Dialog
			header='Editar Profissão'
			visible={visible}
			data-testid="editar-profissao"
			style={{ width: `50vw` }}
			draggable={false}
			resizable={false}
			onHide={() => {
				onClose(false)
				reset()
			}}
		>
			<form onSubmit={handleSubmit(handleEditarProfissao)} className="w-full mt-4">
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
