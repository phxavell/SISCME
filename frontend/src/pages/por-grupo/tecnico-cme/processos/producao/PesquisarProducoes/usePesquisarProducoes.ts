
import {IPreparoToPDF} from "@/components/pdf-templates/types.ts"
import { useAuth } from "@/provider/Auth"
import moment from "moment"
import { useCallback, useEffect, useMemo, useState } from "react"
import { EsterilizacaoPreparoProps} from "@/infra/integrations/processo/types"
import {PreparoAPI} from "@infra/integrations/processo/preparo"
import { useDebounce } from "primereact/hooks"

export const horasDefault= {
	hours:0,
	minutes:0,
	seconds:0
}
const debounceTime = 700
export const usePesquisarProducoes = () => {
	const { user, toastSuccess, toastError } = useAuth()
	const [preparos, setPreparos] = useState<EsterilizacaoPreparoProps>()
	const [first, setFirst] = useState(0)
	const [serial, serialDebounce, setSerial] = useDebounce(``, debounceTime)
	const [fromDate, fromDateDebounce, setFromDate] = useDebounce(undefined, debounceTime)
	const [toDate, toDateDebounce, setToDate] =  useDebounce(undefined, debounceTime)
	const [caixaToPDF, setCaixaToPDF] = useState<IPreparoToPDF>()
	const [loading, setLoading] = useState(false)
	const [pesquisando, setPesquisando] = useState(false)

	const onPageChange = (event: { first: number }) => {
		setFirst(event.first)
	}

	const search = (pesquisando?:boolean) => {
		if(pesquisando){
			setFirst(0)
		}
		setPesquisando(pesquisando??true)
	}
	const clearFiltroPesquisa = () => {
		search(false)
		setSerial(``)
		setFromDate(undefined)
		setToDate(undefined)
	}
	const paramsMemo = useMemo(() => {
		const params:any = {
			serial: serialDebounce,
			page: first + 1
		}
		if(fromDateDebounce){
			params.data_de=moment(fromDateDebounce).format(`YYYY-MM-DD HH:mm`)
		}
		if(toDateDebounce){
			params.data_ate  = moment(toDateDebounce).format(`YYYY-MM-DD HH:mm`)
		}
		return params
	}, [toDateDebounce, serialDebounce, first, fromDateDebounce])

	const handleGerarPDF = useCallback(async (item: any) => {

		try {
			const data =  await PreparoAPI.preparoReport(user, item.id)
			const etiqueta:any = {
				caixa: {
					id: data.id,
                	cliente: data?.cliente,
                	descricao: data?.caixa,
                	tipo: data.embalagem,
                	cautela: data?.cautela,
                	sequencial: data?.serial,
                	temperatura: data?.temperatura,
                	itens: data?.itens
				},
				cautela: data.cautela,
				codigo: data?.quantidade,
				ciclo_termodesinfeccao: data.ciclo_termodesinfeccao,
				responsavel_tecnico_coren: data?.responsavel_tecnico_coren,
				responsavel_tecnico_nome: data?.responsavel_tecnico_nome,
				usuario_preparo_coren: data?.usuario_preparo_coren,
				data_preparo: data?.data_preparo,
				recebimento: {
                	usuario: {
                		id: 1,
                		nome: data?.usuario_preparo
                	},
					data_hora: data?.data_preparo,
					data_recebimento: data?.data_validade,
				}
			}
			setCaixaToPDF(etiqueta)
		} catch (error) {
			console.log(error)
			toastError(`Erro ao gerar pdf`)
		}
	}, [user, toastError])

	const listProducoes = useCallback(() => {
		if(!pesquisando){
			setLoading(true)
			PreparoAPI.listarPreparos(user, first + 1)
				.then((data) => {
					setPreparos(data)
					setLoading(false)
				})
				.catch((error) => {
					toastError(error.message, false)
					setLoading(false)
				})
		}
	},[user, first, pesquisando, toastError])

	const filtrarPreparos = useCallback(() => {
		if(pesquisando){
			setLoading(true)
			PreparoAPI.filtrarPreparos(user, paramsMemo).then((data) => {
				setPreparos(data)
				setLoading(false)
			}
			).catch((error) => {
				toastError(error.message)
				setLoading(false)
			})
		}
	}, [user, toastError, pesquisando, paramsMemo])

	useEffect(() => {
		listProducoes()
	}, [listProducoes])

	useEffect(() => {
		filtrarPreparos()
	}, [filtrarPreparos])

	return {
		preparos,
		setPreparos,
		toastSuccess,
		toastError,
		first, setFirst,
		onPageChange,
		search,
		serial, setSerial,
		fromDate, setFromDate,
		toDate, setToDate,
		handleGerarPDF,
		caixaToPDF,
		loading,
		clearFiltroPesquisa
	}

}
