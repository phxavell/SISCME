import { Dialog } from 'primereact/dialog'

import { DataMotorista } from '@/infra/integrations/motorista'
import { Button } from 'primereact/button'
import { Message } from 'primereact/message'
import moment from 'moment'
import { useMotorista } from '../useMotorista'
import {ModalProps} from "@pages/por-grupo/enfermagem/plantao/ModalPlantao"
import { styleMessage } from '@/util/styles'
import { messageTemplate } from '@/components/TextFields/messager'

interface ModalDetailsProps extends ModalProps {
    motorista: DataMotorista
    deleteMotorista: any
    editarMotorista: any
    editarSenhaMotorista: any
}

export function ModalDetails({ visible, onClose, motorista, deleteMotorista, editarMotorista, editarSenhaMotorista }: ModalDetailsProps) {
	const {
		visibleModalDelete ,setVisibleModalDelete
	} = useMotorista()

	const dataFormated = () => {
		if(motorista?.dtnascimento) {
			return moment(motorista?.dtnascimento).format(`DD/MM/YYYY`)
		}
	}

	const headerTemplate = () => {
		return (
			<div className="flex justify-content-between align-content-center">
				<h3 className="m-0 p-0">Detalhes: {motorista?.nome}</h3>
				<div className="flex gap-2 h-2rem mr-5">
					<Button
						icon='pi pi-trash'
						className="bg-red-600 border-none border-round-sm hover:bg-red-500"
						onClick={() => {setVisibleModalDelete(true)}}

					/>
					<Button
						icon='pi pi-pencil'
						className="bg-green-600 border-none border-round-sm hover:bg-green-500"
						onClick={() => {editarMotorista(motorista)}}
					/>
					<Button
						icon='pi pi-lock'
						className="bg-gray-600 border-none border-round-sm hover:bg-gray-500"
						onClick={() => {editarSenhaMotorista(motorista)}}
					/>
				</div>
			</div>
		)
	}

	const templateSexo = () => {
		if(motorista?.sexo == `F`) {
			return `Feminino`
		} else if (motorista?.sexo == `M`){
			return `Masculino`
		}
	}

	return (
		<>
			<Dialog
				header=':"&#40;'
				onHide={() => setVisibleModalDelete(false)}
				visible={visibleModalDelete}
			>
				<h2 className="m-0 mb-3">Tem certeza que deseja excluir?</h2>

				<div className="flex gap-2">
					<Button label="Não" onClick={() => setVisibleModalDelete(false)} />
					<Button label="Sim, tenho certeza" onClick={() => {deleteMotorista(motorista); setVisibleModalDelete(false)}} />
				</div>
			</Dialog>
			<Dialog
				onHide={() => onClose(false)}
				visible={visible}
				header={headerTemplate}
				style={{ width: `50vw` }}
			>
				<div className="flex justify-content-between align-items-center">
					<div className="grid mt-5 gap-5 justify-content-between">
						<Message
							style={styleMessage}
							className="border-primary h-4rem"
							severity="info"
							content={() => messageTemplate(`Nome`, motorista?.nome)}
						/>
						<Message
							style={styleMessage}
							className="border-primary h-4rem"
							severity="info"
							content={() => messageTemplate(`CPF`, motorista?.cpf)}
						/>
						<Message
							style={{
								borderLeft: `6px solid #1d1f97`,
								borderWidth: `0 0 0 6px`,
								color: `#fff`,
								backgroundColor: `transparent`
							}}
							className="border-primary h-4rem"
							severity="info"
							content={() => messageTemplate(`Matrícula`, motorista?.matricula)}
						/>
						<Message
							style={styleMessage}
							className="border-primary h-4rem"
							severity="info"
							content={() => messageTemplate(`Contato`, motorista?.contato)}
						/>
						<Message
							style={styleMessage}
							className="border-primary h-4rem"
							severity="info"
							content={() => messageTemplate(`Dt.Nascimento`, dataFormated())}
						/>
						<Message
							style={styleMessage}
							className="border-primary h-4rem"
							severity="info"
							content={() => messageTemplate(`Sexo`, templateSexo())}
						/>
						<Message
							style={styleMessage}
							className="border-primary h-4rem"
							severity="info"
							content={() => messageTemplate(`Email`, motorista?.email)}
						/>
					</div>
				</div>
			</Dialog>

		</>
	)
}
