import {EquipamentosAPI} from "@infra/integrations/administrativo/equipamentos.ts"
import {useAuth} from "@/provider/Auth"
import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import {useState} from "react"
import {
	EquipamentoProps,
	QRCodeSchema,
	QRCodeSchemaType
} from "@pages/por-grupo/tecnico-cme/processos/components/EquipamentoDropdown/types.ts"

const infor = `Equipamento não habilitado para este setor.`
export function useQRCodeEquipamento(tipoEquipamento: string){
	const {
		register,
		handleSubmit,
		setValue,
		setFocus,
		control,
		reset
	} = useForm<QRCodeSchemaType>({
		defaultValues: {qrEquipamento: ``},
		resolver: zodResolver(QRCodeSchema),
	})

	const {user, toastError, toastInfor} = useAuth()
	const [equipamento, setEquipamento] = useState<EquipamentoProps[]>([])

	const handleSubmitQRCode = async (data: QRCodeSchemaType ) => {
		try {
			const equip = await EquipamentosAPI.listEquipamentoUuid(user, data.qrEquipamento, tipoEquipamento)
			setEquipamento(equip)
			return true

		} catch (error: any) {
			if(error?.message ===infor){
				toastInfor(error.message)
			} else{
				toastError(error?.message)
			}
		} finally {
			setValue(`qrEquipamento`, ``)
		}
	}
	const handleClearEquipamentoUuid = () => {
		setEquipamento([])
		reset()
		setTimeout(()=> {
			setFocus(`qrEquipamento`)
		}, 300)
	}

	return {
		handleSubmit ,
		equipamento,
		handleSubmitQRCode,
		register,
		handleClearEquipamentoUuid,
		control
	}
}
