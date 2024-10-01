import {DistribuicaoAPI} from "@infra/integrations/processo/distribuicao/distribuicao.ts"
import {useAuth} from "@/provider/Auth"
import {DataTableExpandedRows, DataTableValueArray} from "primereact/datatable"
import {useCallback, useEffect, useMemo, useRef, useState} from "react"
import {Nullable} from "vitest"
import {useDebounce} from "primereact/hooks"
import {OverlayPanel} from "primereact/overlaypanel"
import {useForm} from "react-hook-form"
import {
	DistribuicaoEstoqueSchema,
	DistribuicaoFiltros
} from "@pages/por-grupo/tecnico-cme/processos/distribuicao/modais/schema.ts"
import {zodResolver} from "@hookform/resolvers/zod"
import {ClientAPI} from "@infra/integrations/client.ts"
import {StatusCliente} from "@infra/integrations/types-client.ts"
import {DropdownFilterEvent} from "primereact/dropdown"
import {EstoqueDistribuicao} from "@infra/integrations/processo/distribuicao/types-distribuicao.ts"

const debounceTime = 700

export const useDistribuicao = () => {
	const {user, toastError} = useAuth()

	const [cliente, clienteDebounce, setCliente] = useDebounce(``, debounceTime)
	const [visibleModalSequenciais, setVisibleModalSequenciais] = useState(false)
	const [clienteSelecionado, setClienteSelecionado] = useState<EstoqueDistribuicao>()
	const [dateInitial, setDateInitial] = useState<Nullable<Date>>(null)
	const [dateFinal, setDateFinal] = useState<Nullable<Date>>(null)
	const [visible, setVisible] = useState<boolean>(false)
	const [sequenciais, setSequenciais] = useState<any>()
	const [serial, setSerial] = useState(``)
	const [expandedRows, setExpandedRows] = useState<
        DataTableExpandedRows | DataTableValueArray | undefined
    >(undefined)
	const [estoques, setEstoque] = useState<any>()
	const op = useRef<OverlayPanel>(null)
	const [caixasCriticasToShow, setCaixasCriticasToShow] = useState<any[]>()
	const [loadingEstoqueGeral, setLoadingEstoqueGeral] = useState(true)

	const handleButtonDistribuir = (data: EstoqueDistribuicao) => {
		setVisible(true)
		setClienteSelecionado(data)
	}
	const [paginaAtualClientes, setPaginaAtualClientes] = useState(0)
	const onPageChange = (event: { first: number }) => {
		setPaginaAtualClientes(event.first)
	}
	const {
		control,
		formState: {errors},
		reset, getValues,
		watch,

	} = useForm<DistribuicaoFiltros>({
		resolver: zodResolver(DistribuicaoEstoqueSchema),
		defaultValues: {
			clientes: []
		}
	})

	useEffect(() => {
		setPaginaAtualClientes(0)
	}, [watch(`clientes`)])

	const paramsClient = useMemo(() => {
		return {
			page: paginaAtualClientes + 1,
			clientes: watch(`clientes`)
		}
	}, [
		paginaAtualClientes,
		watch(`clientes`)
	])

	const buscarEstoque = useCallback(() => {
		setLoadingEstoqueGeral(true)
		DistribuicaoAPI.estoques(user, paramsClient).then(data => {
			setEstoque(data)
			if (data?.data?.length === 1) {
				const _expanded: DataTableExpandedRows = {}
				_expanded[`${data?.data[0].cliente_id}`] = true
				setExpandedRows(_expanded)
			}
			setLoadingEstoqueGeral(false)

		}).catch(e => {
			toastError(e, false)
			setLoadingEstoqueGeral(false)
		})
	}, [user, paramsClient])
	useEffect(() => {
		buscarEstoque()
	}, [buscarEstoque])

	const resetFilter = () => {
		setCliente(``)
		setSerial(``)
	}

	const allowExpansion = (rowData: EstoqueDistribuicao) => {
		return rowData?.estoque?.total_disponivel > 0
	}

	const [loadingOption, setLoadingOption] = useState(true)

	const [clientes, setClientes] = useState<any[]>([])

	const buscarClientes = useCallback((descricao: string) => {
		setLoadingOption(true)
		ClientAPI.buscarCliente(user, descricao, StatusCliente.Ambos).then(r => {
			if (r?.data.length) {

				const clientesF = r.data.map(cli => {
					return {
						...cli,
						nome: `${cli.nomeabreviado ?? ``} - ${cli.nomefantasiacli ?? ``}`
					}
				})
				setClientes(clientesF)
			}
			setLoadingOption(false)
		}).catch(() => {
			setLoadingOption(false)
		})
	}, [user])

	useEffect(() => {
		buscarClientes(``)
	}, [buscarClientes])


	const onFilterItens = useCallback((event: DropdownFilterEvent) => {
		if (event.filter) {
			buscarClientes(event.filter)
		}
	}, [buscarClientes])


	return {
		visible,
		setVisible,
		cliente, setCliente,
		expandedRows,
		setExpandedRows,
		serial, setSerial,
		dateInitial, setDateInitial,
		dateFinal, setDateFinal,
		resetFilter,
		// listClientes,
		clienteSelecionado, setClienteSelecionado,
		sequenciais, setSequenciais,
		visibleModalSequenciais, setVisibleModalSequenciais,
		estoques,
		handleButtonDistribuir,
		op,
		caixasCriticasToShow, setCaixasCriticasToShow,
		allowExpansion,
		control,
		formState: {errors},
		reset,
		loadingOption, setLoadingOption,
		clientes, setClientes,
		buscarClientes,
		onFilterItens,
		paginaAtualClientes, setPaginaAtualClientes,
		onPageChange,
		buscarEstoque,
		loadingEstoqueGeral
	}
}
