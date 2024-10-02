import {PlantaoAPI} from "@/infra/integrations/plantao"
import {useAuth} from "@/provider/Auth"
import {Button} from "primereact/button"
import {Dialog} from "primereact/dialog"
import {InputTextarea} from "primereact/inputtextarea"
import {useState} from "react"
import {useForm} from "react-hook-form"
import {ModalEditDescricaoProps} from "./ModalEditDescricao"

export function ModalFechamentoDescricao({visible, onClose, plantao}: ModalEditDescricaoProps) {
	const [descricaoFechamento, setDescricaoFechamento] = useState(``)

	const {user, toastSuccess, toastError} = useAuth()

	const {
		handleSubmit,
		reset,
	} = useForm()


	const handlePlantaoFechamento = () => {
		PlantaoAPI.fecharPlantao(user, descricaoFechamento, plantao.idplantao).then(() => {
			toastSuccess(`Plantão fechado com sucesso.`)
			reset()
			setDescricaoFechamento(``)
			onClose(true)
		}).catch((e) => {
			toastError(e.data)
		})
	}

	return (
		<>
			<Dialog
				header='Descrição de Fechamento'
				onHide={() => onClose(false)}
				visible={visible}
				style={{width: `80vw`}}
			>
				<form className="flex flex-column gap-2 mt-4" onSubmit={handleSubmit(handlePlantaoFechamento)}>
					<span className="p-float-label">
						<InputTextarea
							className="w-full h-20rem"
							value={descricaoFechamento}
							onChange={(e) => setDescricaoFechamento(e.target.value)}
						/>
						<label>Descrição</label>
					</span>
					<div className="w-full flex justify-content-center">
						<Button
							className="w-3"
							label="Fechar Plantão"
						/>

					</div>
				</form>
			</Dialog>

		</>

	)
}
