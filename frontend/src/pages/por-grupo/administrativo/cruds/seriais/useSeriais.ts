import { SeriaisAPI } from "@/infra/integrations/caixa/seriais"
import { useAuth } from "@/provider/Auth"
import { useCallback, useEffect, useMemo, useState } from "react"

export const horasDefault= {
	hours:0,
	minutes:0,
	seconds:0
}

export const useSeriais = () => {
	const [seriais, setSeriais] = useState<any>(undefined)
	const [first, setFirst] = useState(0)
	const [serial, setSerial] = useState<any>(null)
	const [selectSerial, setSelectSerial] = useState<any>(null)
	const [loading, setLoading] = useState(true)
	const [salvando] = useState(false)
	const [pesquisando, setPesquisando] = useState(false)
	const { user,toastError } = useAuth()


	const onPageChange = (event: { first: number }) => {
		setFirst(event.first)
	}

	const paramsMemo = useMemo(()=>{

		return {
			search: serial === null ? `` : serial,
			page: first+1
		}

	}, [serial, first])

	const listar = useCallback(async () => {
		setLoading(true)
		SeriaisAPI.listar(user, paramsMemo).then((data) => {
			setSeriais(data)
			setLoading(false)
		}).catch((error) => {
			toastError(error.message, false)
			setLoading(false)
		})
	}, [paramsMemo, toastError, user])

	useEffect(() => {
		listar().then(()=> {})
	}, [listar])

	return {
		seriais,
		setSeriais,
		first,
		setFirst,
		serial,
		setSerial,
		selectSerial,
		setSelectSerial,
		loading,
		salvando,
		pesquisando,
		setPesquisando,
		onPageChange,
		paramsMemo,
	}
}
