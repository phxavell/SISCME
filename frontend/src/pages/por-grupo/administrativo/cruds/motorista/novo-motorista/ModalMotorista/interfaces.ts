import { DataMotorista } from "@/infra/integrations/motorista"
import { ModalProps } from "@/pages/por-grupo/enfermagem/plantao/ModalPlantao"


export interface ModalMotoristaProps extends ModalProps {
	motorista: DataMotorista | undefined
	setVisibleModalDetail: React.Dispatch<React.SetStateAction<boolean>>
}export interface ModalEditSenhaMotoristaProps extends ModalProps {
	motorista: DataMotorista | undefined
	setVisibleModalDetail: React.Dispatch<React.SetStateAction<boolean>>
}
