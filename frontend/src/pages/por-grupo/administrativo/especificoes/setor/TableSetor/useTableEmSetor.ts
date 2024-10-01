import { useCallback, useEffect } from "react"
import { PaginatorPageChangeEvent } from "primereact/paginator"
import { useAuth } from "@/provider/Auth"
import { useSetorStore } from "../store/useSetorState"

export const useTableEmSetor = () => {
	const { user } = useAuth()
	const {isLoading, setores, getSetores, first, setFirst} = useSetorStore()

	const onPageChange = (event: PaginatorPageChangeEvent) => {
		setFirst(event.first)
	}
	const buscarSetores = useCallback(async() => {
		await getSetores(user)
	}, [user, getSetores])

	useEffect(() => {
		buscarSetores()
	}, [buscarSetores])

	return {
		isLoading,
		setores,
		first,
		onPageChange,
		buscarSetores,
	}
}
