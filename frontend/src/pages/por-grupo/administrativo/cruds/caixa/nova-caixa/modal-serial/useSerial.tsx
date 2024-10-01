import { CaixaAPI } from "@/infra/integrations/caixa/caixa"
import { useAuth } from "@/provider/Auth"
import { useState } from "react"


export const useSerial = () => {
	const { user, toastSuccess,toastError , toastAlert} = useAuth()
	const [seriais , setSeriais] = useState<any>([])
	const [loading, setLoading] = useState(false)
	const [quantidade, setQuantidade] = useState<any>()

	const handleEnviarQuantidade = (id:any,body : any) => {
		setLoading(true)
		CaixaAPI.enviarQuantidade(user, body,id).then((data) => {
			toastSuccess(`Quantidade enviada com sucesso!`)
			const arrayBefore = [...seriais].concat(data.data)
			setLoading(false)
			setQuantidade(0)
			setSeriais(arrayBefore)

		}).catch((message) => {
			toastError(message)
			setLoading(false)
			setQuantidade(0)
		})
	}

	const listarSeriais = async (id:any) => {
		setLoading(true)
		CaixaAPI.listarSeriais(user,id).then((data) => {
			setSeriais(data.data)
			setLoading(false)
		}).catch((message) => {
			toastError(message)
			setLoading(false)
		})
	}

	return {
		seriais,
		setSeriais,
		handleEnviarQuantidade,
		loading, quantidade, setQuantidade, listarSeriais,
		toastSuccess,toastError, toastAlert
	}
}
