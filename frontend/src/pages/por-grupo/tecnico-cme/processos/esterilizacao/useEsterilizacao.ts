import {useCallback, useEffect, useState} from "react"
import {EsterilizacaoAPI} from "@infra/integrations/processo/esterilizacao.ts"
import {useAuth} from "@/provider/Auth"
import {RespostaAPI} from "@infra/integrations/types.ts"
import {IEsterilizacao} from "@infra/integrations/processo/types.ts"

export const useEsterilizacao = () => {
	const {
		user,
		toastError,
	} = useAuth()
	const [loading, setLoading] = useState(true)
	// @ts-ignore
	const [caixas, setCaixas] = useState<RespostaAPI<IEsterilizacao>>(undefined)
	const [paginaAtual, setPaginaAtual] = useState(0)
	const [showModal, setShowModal] = useState(false)
	const onPageChange = (event: { first: number }) => {
		setPaginaAtual(event.first)
	}
	const refreshTable = useCallback(() => {
		setLoading(true)
		EsterilizacaoAPI.listarEsterilizacao(user, paginaAtual).then((data) => {

			// @ts-ignore
			setCaixas(data)
			setTimeout(()=> {
				setLoading(false)
			}, 200)

		}
		).catch((error) => {
			toastError(error.message, false)
			setLoading(false)
		})
	}, [user, toastError, paginaAtual])
	useEffect(() => {
		refreshTable()
	}, [refreshTable])


	const handleClose = useCallback((requerAtualizacao?: boolean) => {
		setShowModal(false)
		if(requerAtualizacao){
			setTimeout(()=> {
				refreshTable()
			}, 1000)
		}

	}, [refreshTable])

	return {
		caixas,
		paginaAtual,
		refreshTable,
		loading,
		onPageChange,
		showModal, setShowModal,
		handleClose
	}
}
