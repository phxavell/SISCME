import {EquipamentosAPI} from "@/infra/integrations/administrativo/equipamentos"
import { Manutencao } from "@/infra/integrations/administrativo/types-equipamentos"
import {useAuth} from "@/provider/Auth"
import {useCallback, useState} from "react"

export const useModalEquipamentoView = () => {
	const {user, toastError} = useAuth()

	const [equipamento, setEquipamento] = useState<any>()
	const [visibleModalHistoricoManutencao, setVisibleModalHistoricoManutencao] = useState(false)
	const [manutencoes, setManutencoes] = useState<Manutencao>()

	const getEquipamento = useCallback(async (id: number) => {
		EquipamentosAPI.buscar(user, id).then((data) => {
			setEquipamento(data)
		}).catch((e) => {
			toastError(e.message, false)
		})
	}, [toastError, user])

	const handleBuscarManutencao = useCallback((idequipamento: any) => {
		try {
			EquipamentosAPI.listarManutencoesPorEquipamento(user, idequipamento).then(data => {
				setManutencoes(data)
			})

		} catch (e: any) {
			toastError(e.message ? e.message : `Não foi possível carregar os dados`, false)
		}
	}, [user, toastError])

	return {
		getEquipamento,
		equipamento, setEquipamento,
		visibleModalHistoricoManutencao, setVisibleModalHistoricoManutencao,
		handleBuscarManutencao,
		manutencoes,
	}
}
