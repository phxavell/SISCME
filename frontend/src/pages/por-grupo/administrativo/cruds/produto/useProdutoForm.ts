import { ProductAPI } from "@infra/integrations/produto.ts"
import { useAuth } from "@/provider/Auth"
import { useCallback, useEffect, useState } from "react"

export function useProdutoFormOptions() {
	const { user,toastError } = useAuth()
	const [formOptions, setFormOptions] = useState<any>()


	const formOptionsData = useCallback(() => {
		ProductAPI.formOptions(user).then((data) => {
			setFormOptions(data.data)
		}).catch((error) => {
			toastError(error.message,false)
		})
	}, [user, toastError])

	useEffect(() => {
		formOptionsData()
	}, [formOptionsData])

	return {
		formOptions,
		formOptionsData
	}




}
