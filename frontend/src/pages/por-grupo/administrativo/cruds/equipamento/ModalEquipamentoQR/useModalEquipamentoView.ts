import {EquipamentosAPI} from "@/infra/integrations/administrativo/equipamentos"
import {useAuth} from "@/provider/Auth"
import {useCallback, useState} from "react"

export const useModalEquipamentoView = () => {
	const {user, toastError} = useAuth()
	const [equipamento, setEquipamento] = useState<any>()
	const getEquipamento = useCallback(async (id: number) => {
		EquipamentosAPI.buscar(user, id).then((data) => {
			setEquipamento(data)
		}).catch((e) => {
			toastError(e.message, false)
		})
	}, [toastError, user])

	return {
		getEquipamento,
		equipamento
	}
}
