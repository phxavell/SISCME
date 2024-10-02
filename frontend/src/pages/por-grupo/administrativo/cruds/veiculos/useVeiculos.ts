import {useCallback, useEffect, useState} from "react"
import {IVeiculoResponse, VeiculoAPI} from "@infra/integrations/vehicles.ts"
import {useAuth} from "@/provider/Auth"

export const useVeiculos = () => {
	const [veiculos, setVeiculos] = useState<IVeiculoResponse>()
	const [visible, setVisible] = useState(false)
	const {user} = useAuth()
	const [first, setFirst] = useState(0)
	const [loading, setLoading] = useState(true)
	const onPageChange = (event: { first: number }) => {
		setFirst(event.first)
	}
	const [showDetail, setShowDetail] = useState<boolean>()
	const [itemSelecionado, setItemSelecionado] = useState<any>()

	useEffect(() => {
		let mounted = true;
		(() => {
			if (user) {
				setLoading(true)
				VeiculoAPI
					.listar(user, first + 1)
					.then((data) => {
						if (mounted) {
							setVeiculos(data)
							setLoading(false)
						}
					})
					.catch(() => {
						//TODO aplicar toast de falha de conexão.
						if(mounted){
							setLoading(false)
						}
					})
			}
		})()

		return () => {
			mounted = false
		}

	}, [user, first])

	const handleCloseModal = (success: boolean) => {
		setItemSelecionado(undefined)
		setVisible(false)
		if (success) {
			refreshTable().then(()=>{

			})
		}
	}

	const refreshTable = useCallback(async () => {
		setLoading(true)
		await VeiculoAPI
			.listar(user, first + 1)
			.then((data) => {
				setVeiculos(data)
				setLoading(false)
			})
			.catch(() => {
				setLoading(false)
			})
	}, [user, first])
	const [visibleModalDelete, setVisibleModalDelete] = useState(false)
	const [itemParaDeletar, setItemParaDeletar] = useState<any>()
	const [deletando, setDeletando] = useState(false)

	const prepararParaDeletar = (caixa: any) => {
		setVisibleModalDelete(true)
		setItemParaDeletar(caixa)
	}

	const preparaParaEditar = (item: any) => {
		setItemSelecionado(item)
		setVisible(true)
	}

	return {
		loading,
		refreshTable,
		onPageChange,
		veiculos, setVeiculos,
		visible, setVisible,
		user,
		first, setFirst,
		showDetail, setShowDetail,
		itemSelecionado, setItemSelecionado,
		visibleModalDelete, setVisibleModalDelete,
		itemParaDeletar, setItemParaDeletar,
		deletando, setDeletando,
		prepararParaDeletar,
		handleCloseModal,
		preparaParaEditar
	}
}
