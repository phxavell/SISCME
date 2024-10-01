import {useCallback, useState} from "react"
import {EsterilizacaoAPI} from "@infra/integrations/processo/esterilizacao.ts"
import {useAuth} from "@/provider/Auth"

export const useModalPdf = () => {
	const {
		user, toastError
	} = useAuth()

	const [conteudoPDF, setConteudoPDF] = useState(undefined)

	const buscarDadosPdf = useCallback( (id: number) => {
		EsterilizacaoAPI.buscarDadosPdf(user, id)
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
