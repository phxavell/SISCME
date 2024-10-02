import { CaixaAPI } from "@/infra/integrations/caixa/caixa"
import { useAuth } from "@/provider/Auth"
import moment from "moment"
import { useDebounce } from "primereact/hooks"
import { useCallback, useEffect, useMemo, useState } from "react"

const debounceTime = 700

export const useModeloCaixa = () => {
	const { user, toastSuccess, toastError} = useAuth()

	const [showModal, setShowModal] = useState(false)

	const [pesquisando, setPesquisando] = useState(false)

	const [caixas, setCaixas] = useState<any>()
	const [loadingListagemCaixas, setLoadingListagemCaixas] = useState(true)
	const [first, setFirst] = useState(0)

	const [serial, setSerial] = useState<string>(``)
	const [codigo, setCodigo] = useState<string>(``)
	const [fromDate, fromDateDebounce, setFromDate] = useDebounce(undefined, debounceTime)
	const [toDate, toDateDebounce, setToDate] = useDebounce(undefined, debounceTime)

	const [visibleModalDelete, setVisibleModalDelete] = useState(false)
	const [itemParaDeletar, setItemParaDeletar] = useState<any>()
	const [deletando, setDeletando] = useState(false)

	const [showModalDetail, setShowModalDetail] = useState(false)
	const [caixaToShowDetail, setCaixaToShowDetail] = useState<any>()
	const [modoEdicao, setModoEdicao] = useState(false)

	const search = (pesquisando?:boolean) => {
		if(pesquisando){
			setFirst(0)
		}
		setPesquisando(pesquisando??true)
	}

	const paramsMemo = useMemo(()=>{
		return {
			data_de: fromDateDebounce ? moment(fromDateDebounce).format(`YYYY-MM-DD HH:mm`) : undefined,
			data_ate: toDateDebounce ? moment(toDateDebounce).format(`YYYY-MM-DD HH:mm`) : undefined,
			codigo_ou_nome: codigo === null ? `` : codigo,
		}
	}, [fromDateDebounce, toDateDebounce, codigo])


	const prepararParaDeletar = (caixa: any) => {
		setVisibleModalDelete(true)
		setItemParaDeletar(caixa)
	}
	const preparaParaEditar = (caixa: any) => {
		setCaixaToShowDetail(caixa)
		setModoEdicao(true)
		setShowModal(true)
	}

	const onPageChange = (event: { first: number }) => {
		setFirst(event.first)
	}

	const updateList = useCallback( () => {
		setLoadingListagemCaixas(true)
		if(!pesquisando){
			CaixaAPI.listar(user, {page:first+1}).then(list => {
				setCaixas(list)
				setLoadingListagemCaixas(false)
			})
		} else {
			CaixaAPI.listar(user, paramsMemo).then(list => {
				setCaixas(list)
				setLoadingListagemCaixas(false)
			})
		}
	}, [first, paramsMemo, pesquisando, user])

	useEffect(() => {
		updateList()
	}, [user, first, updateList])


	const handleCloseModalCaixa = (success?: boolean) => {
		if (success) {
			updateList()
		}

		setCaixaToShowDetail(undefined)
		setModoEdicao(false)
		setShowModal(false)
	}

	const handleExcluir = (caixa: any) => {
		setDeletando(true)
		CaixaAPI.excluir(user, caixa).then(async () => {
			toastSuccess(`Caixa excluída!`)
			await updateList()
			setItemParaDeletar(undefined)
			setVisibleModalDelete(false)
			setShowModalDetail(false)
			setDeletando(false)
		}).catch((message) => {
			toastError(message)
			setVisibleModalDelete(false)
			setDeletando(false)
		})
	}

	useEffect(()=> {
		if(fromDate?.length || toDate?.length || codigo?.length){
			search()
		}
		return ()=> {}
	}, [fromDate, toDate, serial, codigo])

	return {
		codigo, serial, fromDate, toDate,
		setCodigo, setSerial, setFromDate, setToDate,
		showModal, setShowModal,
		caixas, setCaixas,
		loadingListagemCaixas, setLoadingListagemCaixas,
		first, setFirst,
		preparaParaEditar, prepararParaDeletar,
		handleCloseModalCaixa, onPageChange, handleExcluir,
		setCaixaToShowDetail, setShowModalDetail,
		setVisibleModalDelete, visibleModalDelete, deletando, itemParaDeletar,
		modoEdicao, caixaToShowDetail, showModalDetail,
		search
	}
}
