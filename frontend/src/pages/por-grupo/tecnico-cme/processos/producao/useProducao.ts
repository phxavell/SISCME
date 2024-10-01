import {useAuth} from '@/provider/Auth'
import {useCallback, useEffect, useRef, useState} from 'react'
import {CaixaPreaparoPros, ProducaoAPI} from '@infra/integrations/processo/producao.ts'
import {ProducaoSchema, ProducaoSchemaType} from './schema'
import {useDebounce} from "primereact/hooks"
import {
	debounceTime
} from "@pages/por-grupo/tecnico-cme/processos/esterilizacao/PesquisarEsterilizacao/usePesquisarEsterilizacao.ts"
import {IPreparoToPDF} from "@/components/pdf-templates/types.ts"
import {enumFocus} from "@pages/por-grupo/tecnico-cme/processos/producao/types.ts"
import {useHome} from "@pages/general/Home/useHome.ts"
import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import {TcloseDialog} from "@pages/por-grupo/tecnico-cme/processos/recebimento/types.ts"

export const useProducao = () => {

	const {user, toastError, toastSuccess} = useAuth()
	const [caixas, setCaixas] = useState<any>()
	const [caixasWithProducts, setCaixasWithProducts] = useState<CaixaPreaparoPros>()
	const [visible, setVisible] = useState(false)
	const [showModal, setShowModal] = useState(false)
	const [loading, setLoading] = useState(false)
	const [first, setFirst] = useState(0)
	const [cautela, cautelaDebounce, setCautela] = useDebounce(``, debounceTime)
	const [sequencial, setSerial] = useState(``)
	const [pesquisando, setPesquisando] = useState(false)
	const [focusAtual, setFocusAtual] = useState(enumFocus.Ciclo)
	const [caixasTemporarias, setCaixasTemporarias] = useState<any[]>([])

	// @ts-ignore
	const myRef = useRef<InputText>(null)
	// @ts-ignore
	const refCiclo = useRef<InputText>(null)
	useEffect(() => {
		if (!showModal) {
			const timeout = setInterval(() => {
				if (!visible) {
					if (focusAtual === enumFocus.Serial) {
						myRef.current.focus()
					} else {
						refCiclo.current.focus()
					}
				}
			}, 2000)
			return () => {
				// @ts-ignore
				clearTimeout(timeout)
			}
		}

	}, [cautelaDebounce, focusAtual, showModal, visible])

	const [caixaToPDF, setCaixaToPDF] = useState<IPreparoToPDF>()

	const handleCloseModal: TcloseDialog = async (close: any) => {
		myRef.current.focus()
		if (close) {
			const olg= caixasTemporarias
			olg.push(close)
			setCaixasTemporarias(olg)
			if(first!==0){
				setFirst(0)
			} else {
				updateList(true)
			}
			setShowModal(true)
		}
		setVisible(false)
	}

	const {goRouter} = useHome(0)

	const {
		handleSubmit,
		reset,
	} = useForm<ProducaoSchemaType>({
		defaultValues: {
			cautela: undefined,
			serial: ``
		},
		resolver: zodResolver(ProducaoSchema)
	})
	const handleRequest = (data: ProducaoSchemaType) => {
		handleInput(data).then(() => {
			reset()
			myRef.current.focus()
		})
	}
	const handleCloseModalCaixa = () => {
		setFocusAtual(enumFocus.Serial)
		setShowModal(false)
	}
	const onPageChange = (event: { first: number }) => {
		setFirst(event.first)
	}


	useEffect(() => {
		let mounted = true;
		(() => {
			setLoading(true)
			ProducaoAPI
				.listGeral(user, first + 1)
				.then((data) => {
					if (mounted) { // @ts-ignore
						setCaixas(data)
						setLoading(false)
					}
				})
				.catch((e) => {
					if (mounted) {
						setLoading(false)
						toastError(e, false)
					}
				})
		})()

		return () => {
			mounted = false
		}
	}, [user, toastError, first])

	const updateList = useCallback( (mounted?:any) => {
		setLoading(true)
		ProducaoAPI.listGeral(user, first + 1).then((data)=> {
			if(mounted){
				setCaixas(data)
				setLoading(false)
			}

		}).catch(() => {

			setLoading(false)
		})
	}, [user,first ])

	const handleInput = useCallback(async (sequencial: ProducaoSchemaType) => {
		const sequencialUper = sequencial.serial.toUpperCase()
		setPesquisando(true)
		ProducaoAPI
			.bipBox(user, sequencialUper)
			.then((data) => {
				setCaixasWithProducts({
					...data,
					cautela: sequencial.cautela
				})
				setPesquisando(false)
				setVisible(true)
			}).catch((e) => {
				setPesquisando(false)
				toastError(e, false)
			})
		return
	}, [user, toastError])

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
		toastError, toastSuccess,
		first,
		onPageChange,
		showModal,
		setShowModal,
		handleCloseModalCaixa,
		cautela, cautelaDebounce, setCautela,
		sequencial, setSerial,
		myRef,
		caixaToPDF, setCaixaToPDF,
		handleCloseModal,
		handleSubmit,
		reset,
		handleRequest,
		goRouter,
		pesquisando, setPesquisando,
		focusAtual, setFocusAtual,
		refCiclo,
		caixasTemporarias, setCaixasTemporarias

	}
}
