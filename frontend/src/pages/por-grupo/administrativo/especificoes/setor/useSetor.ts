import { useState } from "react"

export function useSetor() {
	const [visibleModalCreate, setVisibleModalCreate] = useState(false)

	const openModalCreate = () => {
		setVisibleModalCreate(true)
	}
	const closeModalCreate = () => {
		setVisibleModalCreate(false)
	}
	return {
		openModalCreate,
		closeModalCreate,
		visibleModalCreate,
	}
}
