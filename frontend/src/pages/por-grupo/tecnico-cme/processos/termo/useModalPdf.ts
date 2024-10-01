import {useCallback, useState} from "react"
import {useAuth} from "@/provider/Auth"
import { EsterilizacaoPesquisaAPI } from "@/infra/integrations/esterilizacao-pesquisa"

export const useModalPdf = ()=> {
	const {
		user, toastError
	} = useAuth()

	const [conteudoPDF, setConteudoPDF] = useState(undefined)

	const buscarDadosPdf = useCallback( (id: number) => {
		EsterilizacaoPesquisaAPI.buscarDadosPdf(user, id)
			.then((data) => {
				// @ts-ignore
				setConteudoPDF(data)
			})
			.catch((error) => {
				toastError(error.message, false)
			})
	}, [user, toastError])
	return {
		buscarDadosPdf,
		conteudoPDF, setConteudoPDF
	}
}
