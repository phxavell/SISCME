import {Errors} from "@/components/Errors.tsx"
import {InputText} from "primereact/inputtext"
import {Button} from "primereact/button"
import {Dialog} from "primereact/dialog"
import {useAuth} from "@/provider/Auth"
import {useModalEdicaoEmbalagem} from "./useModalEdicaoEmbalagem.ts"
import {EmbalagemInputs} from "../ModalEmbalagem/schema.ts"
import {EmbalagemModalAPI} from "@infra/integrations/administrativo/embalagem/embalagem-modal.ts"
import {ModalEdicaoEmbalagemProps} from "@pages/por-grupo/administrativo/especificoes/embalagem/types.ts"
import { buttonCheck } from "@/util/styles/buttonAction.ts"

export function ModalEdicaoEmbalagem(props: ModalEdicaoEmbalagemProps){
	const { visible, onClose, EmbalagemData } = props
	const { user, toastSuccess, toastError } = useAuth()
	const { register, handleSubmit, handleErrorReturnApi, errors, reset } = useModalEdicaoEmbalagem(EmbalagemData)
	const handleEditarEmbalagem = async (data: EmbalagemInputs) => {
		try {
			if(data.id){
				await EmbalagemModalAPI.alterar(user, {
					id: data.id,
					descricao: data.descricao,
					valorcaixa: data.valorcaixa
				})
				toastSuccess(`Embalagem atualizado!`)
				onClose(false)
				reset()
			}
		} catch (error: any) {
			if (error.data) {
				handleErrorReturnApi(error.data)
			} else {
				toastError(`Não foi possível atualizar Embalagem!`, false)
			}
		}
	}
	return (
		<Dialog
			header='Editar Embalagem'
			visible={visible}
			data-testid="edicao-embalagem"
			style={{ width: `50vw` }}
			dismissableMask={true}
			closeOnEscape={true}
			focusOnShow={false}
			draggable={false}
			resizable={false}
			onHide={() => {
				onClose(false)
				reset()
			}}
		>
			<form
				onSubmit={handleSubmit(handleEditarEmbalagem)}
				className="w-full mt-4">
				<div className="w-full flex flex-row gap-2">
					<div className="w-full">
						<div className="mb-4">
							<InputText
								autoFocus
								className="w-full"
								type="text"
								placeholder='Descrição:'
								{...register(`descricao`)}
							/>
							{errors.descricao && <Errors message={errors.descricao.message} />}
						</div>
						<div className="mb-4">
							<InputText
								className="w-full"
								type="text"
								placeholder='valor:'
								{...register(`valorcaixa`)}
							/>
							{errors.valorcaixa && <Errors message={errors.valorcaixa.message} />}
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
