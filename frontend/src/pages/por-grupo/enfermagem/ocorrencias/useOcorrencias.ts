import {useCallback, useEffect, useState} from "react"
import {useAuth} from "@/provider/Auth"
import {OcorrenciasAPI} from "@infra/integrations/enfermagem/ocorrencias.ts"
import {
	OcorrenciaOpcoes,
	OcorrenciaResponse,
	OptionOcorrencia,
	RespostaAPI
} from "@infra/integrations/enfermagem/types.ts"
import moment from "moment/moment"
import {ClientAPI} from "@infra/integrations/client.ts"
import {mapMakeOpcaoListFromCliente} from "@infra/integrations/caixa/caixa.ts"


export const useOcorrencias = () => {
	const {user, toastSuccess, toastError} = useAuth()
	const [loading, setLoading] = useState(true)
	const [paginaAtual, setPaginaAtual] = useState(0)
	const onPageChange = (event: { first: number }) => {
		setPaginaAtual(event.first)
	}
	const [ocorrencias, setOcorrencias] = useState<RespostaAPI<OcorrenciaResponse>>({
		data: [],
		meta: {
			currentPage: 0,
			totalItems: 0,
			itemsPerPage: 0,
			totalPages: 0
		},
		status: ``
	})
	const [showPesquisa, setShowPesquisa] = useState(false)
	const [showModal, setShowModal] = useState(false)
	const [showModalFechar, setShowModalFechar] = useState(false)
	const [showModalAnexar, setShowModalAnexar] = useState(false)
	const [ocorrenciaSelecionada, setOcorrenciaSelecionada] = useState<any>()
	const [excluindoAnexo, setExcluindoAnexo] = useState(false)


	const [fromDate, setFromDate] = useState()
	const [toDate, setToDate] = useState()
	const [status, setStatus] = useState()
	const [setor, setSetor] = useState()
	const [cliente, setCliente] = useState(``)
	const [modoPesquisa, setModoPesquisa] = useState(false)

	const limparPesquisa = () => {
		// @ts-ignore
		setFromDate(``)
		// @ts-ignore
		setToDate(``)
		// @ts-ignore
		setStatus(``)
		// @ts-ignore
		setSetor(``)
		// @ts-ignore
		setCliente(``)
	}

	const pesquisando = useCallback(async () => {
		if (user) {
			setLoading(true)
			const params = {
				page: paginaAtual ? paginaAtual + 1 : 1,
				data_de: fromDate ? moment(new Date(fromDate)).format(`yyyy-MM-DD`) : ``,
				data_ate: toDate ? moment(new Date(toDate)).format(`yyyy-MM-DD`) : ``,
				status: status ?? ``,
				setor: setor ?? ``,
				cliente: cliente ?? ``
			}
			OcorrenciasAPI.filtrarListagem(user, params)
				.then((data) => {
					setOcorrencias(data)
					setLoading(false)
				})
				.catch(() => {
					setLoading(false)
				})
		}
	}, [user, paginaAtual, fromDate, toDate, status, setor, cliente])
	const updateListagem = useCallback(async () => {
		if (user && !modoPesquisa) {
			setLoading(true)
			OcorrenciasAPI.listar(user, paginaAtual + 1)
				.then((data) => {
					setOcorrencias(data)
					setLoading(false)
				})
				.catch(() => {
					setLoading(false)
				})
		}
	}, [user, paginaAtual, modoPesquisa])

	useEffect(() => {
		updateListagem().then(() => {

		})
	}, [updateListagem])

	useEffect(() => {
		pesquisando().then(() => {
			setLoading(false)
		})
	}, [cliente, fromDate, modoPesquisa, pesquisando, setor, status, toDate])

	const [opcoes, setOpcoes] = useState<OcorrenciaOpcoes>()
	const [loadingOption, setLoadingOption] = useState(true)
	const [clientes, setClientes] = useState<OptionOcorrencia[]>([])

	useEffect(() => {
		let mounted = true
		OcorrenciasAPI.listarOpcoes(user)
			.then((data) => {
				setOpcoes(data)
				setLoadingOption(false)
			})
			.catch(() => {
				setLoadingOption(false)
			})
		ClientAPI.listar(user, 1).then(clientes => {
			if (mounted) {
				const clientFormated = clientes.data.map(mapMakeOpcaoListFromCliente)
				setClientes(clientFormated)
			}
		})
		return () => {
			mounted = false
		}
	}, [user])

	return {
		opcoes, loadingOption, clientes,setClientes,
		user, toastSuccess, toastError,
		loading,
		first: paginaAtual, setFirst: setPaginaAtual,
		onPageChange,
		ocorrencias, setOcorrencias,
		showPesquisa, setShowPesquisa,
		showModal, setShowModal,
		updateListagem,
		showModalFechar, setShowModalFechar,
		ocorrenciaSelecionada, setOcorrenciaSelecionada,
		showModalAnexar, setShowModalAnexar,
		excluindoAnexo, setExcluindoAnexo,

		fromDate, setFromDate,
		toDate, setToDate,
		status, setStatus,
		setor, setSetor,
		cliente, setCliente,
		modoPesquisa, setModoPesquisa,
		pesquisando, limparPesquisa
	}
}
