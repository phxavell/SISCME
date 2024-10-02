import {useAuth} from "@/provider/Auth"
import moment from "moment"
import {useCallback, useEffect, useMemo, useState} from "react"
import {DistribuicaoPesquisaAPI} from "@infra/integrations/processo/distribuicao/distribuicao-pesquisa.ts"

import { useDebounce } from 'primereact/hooks'
import {useForm} from "react-hook-form"
import {
	DistribuicaoInputs,
	DistribuicaoSchema
} from "@pages/por-grupo/tecnico-cme/processos/distribuicao/modais/schema.ts"
import {zodResolver} from "@hookform/resolvers/zod"
import {DropdownFilterEvent} from "primereact/dropdown"
import {SetorAPI} from "@infra/integrations/setor.ts"

const debounceTime=700

export const usePesquisarDistribuicao = () => {
	const {user, toastSuccess, toastError} = useAuth()
	const [distribuidos, setDistribuidos] = useState<any>({
		data: [],
		meta: {
			"currentPage": 1,
			"totalItems": 0,
			"itemsPerPage": 0,
			"totalPages": 0,
		}
	})

	const [fromDate, setFromDate] = useState<Date | any>()
	const [toDate, setToDate] = useState<Date | any>()

	const [showModalBaixarPDF, setShowModalBaixarPDF] = useState(false)
	const [conteudoSelecionado, setConteudoSelecionado] = useState<any>(undefined)
	const [conteudoParaPDF, setConteudoParaPDF] = useState<any>(undefined)

	const [paginaAtual, setPaginaAtual] = useState(0)
	const [sequencial, sequencialDebounce, setSerial] = useDebounce(``, debounceTime)
	const [cliente, clienteDebounce, setCliente] = useDebounce(``, debounceTime)
	const [loading, setLoading] = useState(false)
	const [usandoPesquisa, setUsandoPesquisa] = useState(false)

	const {
		control,
		handleSubmit,
		formState: {errors},
		reset,
		getValues,
		watch
	} = useForm<DistribuicaoInputs>({
		resolver: zodResolver(DistribuicaoSchema)
	})

	const [loadingOption, setLoadingOption] = useState(true)
	const [setores, setSetores] = useState<any>()

	const onFilterItens = useCallback((event: DropdownFilterEvent) => {
		if (event.filter) {
			setLoadingOption(true)
			SetorAPI.filtrar(user, {descricao: event.filter}).then(r => {
				if (r?.data.length) {
					setSetores(r.data)
				}
				setLoadingOption(false)
			}).catch(() => {
				setLoadingOption(false)
			})
		}
	}, [user])

	useEffect(()=> {
		setLoadingOption(true)
		SetorAPI.filtrar(user, {}).then(r => {
			if (r?.data.length) {
				setSetores(r.data)
			}
			setLoadingOption(false)
		}).catch(() => {
			setLoadingOption(false)
		})
	}, [user])

	const onPageChange = (event: { first: number }) => {
		setPaginaAtual(event.first)
	}

	const paramsMemo = useMemo(()=>{
		const params:any = {
			cliente: clienteDebounce === undefined ? `` : clienteDebounce,
			serial: sequencialDebounce === undefined ? `` : sequencialDebounce,
			data_de: fromDate ? moment(fromDate).format(`YYYY-MM-DD HH:mm`) : ``,
			data_ate: toDate ? moment(toDate).format(`YYYY-MM-DD HH:mm`) : ``,
			page: paginaAtual + 1,
			setor: watch(`setor`) ?? ` `,
		}
		return params
	}, [
		clienteDebounce,
		sequencialDebounce,
		fromDate,
		toDate,
		paginaAtual,
		watch(`setor`)
	])

	useEffect(() => {
		(() => {
			if (user) {
				setLoading(true)
				DistribuicaoPesquisaAPI.listarDistribuicao(user, paramsMemo).then((data) => {
					setDistribuidos(data)
					setLoading(false)
				}).catch((e) => {
					toastError(e.data ?? `Não foi possível baixar dados`, false)
					setLoading(false)
				})

			}

		})()
	}, [user, paginaAtual, usandoPesquisa, toastError, paramsMemo])



	const handleGerarPDF = useCallback((item: any) => {
		DistribuicaoPesquisaAPI.DadosParaPDF(user, item.distribuicao).then((dados) => {
			setConteudoParaPDF(dados)
		}).catch((messageError) => {
			console.error(messageError)
			setConteudoParaPDF({})
			toastError(messageError, false)
		})

	}, [user, toastError])

	useEffect(() => {
		if (conteudoParaPDF) {
			setShowModalBaixarPDF(true)
		}
	}, [conteudoParaPDF])

	return {
		distribuidos,
		setDistribuidos,
		toastSuccess,
		toastError,
		paginaAtual, setPaginaAtual,
		onPageChange,
		sequencial, setSerial,
		fromDate, setFromDate,
		toDate, setToDate,
		handleGerarPDF,
		cliente, setCliente,
		showModalBaixarPDF, setShowModalBaixarPDF,
		conteudoSelecionado, setConteudoSelecionado,
		conteudoParaPDF, setConteudoParaPDF,
		loading, setLoading,
		setUsandoPesquisa,
		loadingOption, setLoadingOption,
		setores, setSetores,
		onFilterItens,
		control,
		handleSubmit,
		formState: {errors},
		reset,
		getValues,

	}

}
