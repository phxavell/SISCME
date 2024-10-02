import { SetorAPI } from "@/infra/integrations/setor"
import { useAuth } from "@/provider/Auth"
import { useSetorStore } from "../store/useSetorState"

export const useDeleteSetor = () => {
	const { user, toastSuccess, toastError } = useAuth()
	const {setor,
		visibleModalDelete,
		closeModalDelete,
		setFirst,
		getSetores
	} = useSetorStore(state => {
		return {
			setor: state.setor,
			visibleModalDelete: state.visibleModalDelete,
			closeModalDelete: state.closeModalDelete,
			getSetores: state.getSetores,
			setFirst: state.setFirst
		}
	})
	const handleConfirmardelecao = async () => {
		try {
			if(setor?.id){
				await SetorAPI.onDelete(user, setor.id)
				setFirst(0)
				await getSetores(user)
				toastSuccess(`Setor excluído!`)
				closeModalDelete()
			}

		} catch (error: any) {
			toastError(
				error.data?.descricao ?? `Não foi possível excluir setor`,
				false,
			)
		}
	}
	return {
		handleConfirmardelecao,
		visibleModalDelete,
		closeModalDelete
	}
}
