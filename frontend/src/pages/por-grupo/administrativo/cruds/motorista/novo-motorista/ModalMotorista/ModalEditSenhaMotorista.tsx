import {Button} from "primereact/button"
import {DriverAPI} from "@/infra/integrations/motorista.ts"
import {useAuth} from "@/provider/Auth"
import {Dialog} from "primereact/dialog"
import moment from "moment"
import { ModalEditSenhaMotoristaProps } from "./interfaces"


export const ModalEditSenhaMotorista = ({
	visible,
	onClose,
	motorista,
	setVisibleModalDetail
}: ModalEditSenhaMotoristaProps) => {
	const {toastSuccess, toastError} = useAuth()
	const {user} = useAuth()

	function handleDriverResetSenha() {
		DriverAPI.resetarSenha(user, motorista?.idprofissional).then(() => {
			setVisibleModalDetail(false)
			onClose(true)
			toastSuccess(`Senha alterada com sucesso.`)
		}).catch((error: any) => {
			if (error.data) {
				toastError(`Não foi possível resetar a senha!`)
			} else {
				toastError(`Não foi possível atualizar motorista!!`)
			}
		})
	}

	const anoAtual = moment().format(`yyyy`)
	return (
		<>
			<Dialog
				dismissableMask={true}
				closeOnEscape={true}
				blockScroll={true}
				focusOnShow={false}
				resizable={false}
				draggable={false}
				header='Resetar Senha'
				visible={visible}
				style={{width: `50vw`}}
				onHide={() => onClose(false)}
				closeIcon='pi pi-times'
			>
				<h2>
                    Tem certeza que deseja resetar a senha de {motorista?.nome} para uma senha
                    padrão? &quot;Bringel@{anoAtual}&quot;
				</h2>
				<div className="flex gap-2">
					<Button label="Não" onClick={() => onClose(false)}/>
					<Button label="Sim, tenho certeza" onClick={() => {
						onClose(false)
						handleDriverResetSenha()
					}}/>
				</div>
			</Dialog>
		</>
	)
}
