import { useAuth } from "@/provider/Auth"
import { useCallback, useEffect, useRef, useState } from "react"
import {
	PreRecebimentoAPI,
} from "@infra/integrations/processo/recebimento/pre-recebimento.ts"
import { SterilizationRequestsType } from "@pages/por-grupo/cliente/criar-solicitacao/modal-create-sterilization/schemas.ts"
import { TcloseDialog } from "@pages/por-grupo/tecnico-cme/processos/recebimento/types.ts"
import {BoxWithProducts} from "@infra/integrations/processo/recebimento/types-recebimento.ts"

export const usePreRecebimento = () => {
	const { user, toastError, toastAlert } = useAuth()
	const [caixas, setCaixas] = useState<any>()
	const [caixasWithProducts, setCaixasWithProducts] =
        useState<BoxWithProducts>()
	const [visible, setVisible] = useState(false)
	const [loading, setLoading] = useState(true)
	const [serial, setSerial] = useState<string>(``)
	const [pesquisando, setPesquisando] = useState(false)
	const [paginaAtual, setPaginaAtual] = useState(0)
	const [caixasTemporarias, setCaixasTemporarias] = useState<any[]>([])


	const onPageChange = (event: { first: number }) => {
		setPaginaAtual(event.first)
	}

	const focusSerial = useCallback(() => {
		// @ts-ignore
		serialRef.current.focus()
		// @ts-ignore
		serialRef.current.select()
	}, [])

	const handleCloseModal: TcloseDialog = (close) => {
		if (close) {
			const olg = caixasTemporarias

			olg.push(close)
			setCaixasTemporarias(olg)
			if (paginaAtual !== 0) {
				setPaginaAtual(0)
			} else {
				updateList(true)
			}
			setVisible(false)
			focusSerial()
		} else {
			setVisible(false)
			focusSerial()
		}
	}

	const pesquisarSerial = () => {
		handleInput({ serial })
	}
	const updateList = useCallback(
		(mounted: any) => {
			PreRecebimentoAPI.listGeral(user, paginaAtual + 1)
				.then((data) => {
					if (mounted) {
						// @ts-ignore
						setCaixas(data)
						setLoading(false)
					}
				})
				.catch((e) => {
					if (mounted) {
						setCaixas([])
						setLoading(false)
						toastError(e)
					}
				})
		},
		[paginaAtual, toastError, user],
	)

	useEffect(() => {
		let mounted = true
		setLoading(true)
		updateList(mounted)
		return () => {
			mounted = false
		}
	}, [user, toastError, updateList])

	const handleInput = useCallback(
		(sequencial: SterilizationRequestsType) => {
			setPesquisando(true)
			const sequencialUper = sequencial.serial.toUpperCase()
			PreRecebimentoAPI.bipBox(user, sequencialUper)
				.then((data) => {
					setCaixasWithProducts(data)
					setTimeout(() => {
						setVisible(true)
					}, 200)
					setTimeout(() => {
						setPesquisando(false)
						setSerial(``)
					}, 400)
				})
				.catch((e) => {
					toastAlert(e)
					setPesquisando(false)
					setSerial(``)
				})
		},
		[user, toastAlert],
	)

	// @ts-ignore
	const serialRef = useRef<HTMLInputElement>(undefined)
	return {
		handleInput,
		caixas,
		setCaixas,
		user,
		caixasWithProducts,
		setCaixasWithProducts,
		visible,
		setVisible,
		updateList,
		loading,
		toastError,
		serialRef,
		serial,
		pesquisando,
		handleCloseModal,
		pesquisarSerial,
		setSerial,
		paginaAtual,
		onPageChange,
		caixasTemporarias,
		setCaixasTemporarias
	}
}
