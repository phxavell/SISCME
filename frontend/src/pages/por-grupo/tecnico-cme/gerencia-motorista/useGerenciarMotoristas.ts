import {GereciamentoMotoristaTecnicoAPI, SolicitacaoProps} from "@/infra/integrations/gerenciamento-motorista-tecnico"
import {SolicitacoesMotoristasAPI} from "@/infra/integrations/solicitacoes_motoristas"
import {useAuth} from "@/provider/Auth"
import {DataTableExpandedRows, DataTableValueArray} from "primereact/datatable"
import {useCallback, useEffect, useState} from "react"


export const useGerenciarMotoristas = () => {
	const {user, toastSuccess, toastError} = useAuth()
	const [expandedRows, setExpandedRows] = useState<DataTableExpandedRows | DataTableValueArray | undefined>(undefined)
	const [solicitacoes, setSolicitacoes] = useState<SolicitacaoProps[] | undefined>([])
	const [visible, setVisible] = useState<boolean>(false)
	const [statusAtual, setStatusAtual] = useState(``)
	const [statusASerAtualizado, setStatusASerAtualizado] = useState(``)
	const [idColeta, setIdColeta] = useState(0)
	const [activeIndex, setActiveIndex] = useState(0)
	const [salvando, setSalvando] = useState(false)
	const [loading, setLoading] = useState(true)
	const [dialogColetar, setDialogColetar] = useState<boolean>(false)
	const [dgEntregar, setDgEntregar] = useState<boolean>(false)

	const listSolicitacoes = useCallback(async () => {
		try {
			const data = await GereciamentoMotoristaTecnicoAPI.listGereciamentoTecnico(user)
			setSolicitacoes(data)
			setLoading(false)
		} catch (error) {
			toastError(`Não foi possível carregar os dados!`, false)
			setLoading(false)
		}
	}, [user, toastError])

	useEffect(() => {
		listSolicitacoes()
	}, [listSolicitacoes, activeIndex])

	// @ts-ignore
	const mudarStatus = (statusAtual: string, statusASerAtualizado: string, id: number) => {
		setStatusAtual(statusAtual)
		setStatusASerAtualizado(statusASerAtualizado)

		setIdColeta(id)
		setTimeout(() => {
			setDgEntregar(true)
		}, 250)
	}
	const mudarStatusColetar = (statusAtual: string, statusASerAtualizado: string, id: number) => {
		setStatusAtual(statusAtual)
		setStatusASerAtualizado(statusASerAtualizado)

		setIdColeta(id)
		setTimeout(() => {
			setDialogColetar(true)
		}, 250)
	}

	const onConfirmeEntregar = () => {
		setSalvando(true)
		switch (statusAtual) {
		case `Aguardando Coleta`:
			SolicitacoesMotoristasAPI.atualizarStatusFinalizarEntrega(user, idColeta)
				.then(async () => {
					return await listSolicitacoes()
				}).then(() => {
					setSalvando(false)
					toastSuccess(`Rota finalizada com sucesso!`)
				}).catch(error => {
					setSalvando(false)
					console.log(`Error =>`, error)
					toastError(error.message)
				})
			break
		case `Em Transporte`:
			SolicitacoesMotoristasAPI.atualizarStatusFinalizarEntrega(user, idColeta)
				.then(async () => {
					return await listSolicitacoes()

				})
				.then(() => {
					setSalvando(false)
					toastSuccess(`Rota finalizada com sucesso!`)
				})
				.catch(error => {
					setSalvando(false)
					console.log(`Error =>`, error)
					toastError(error.message)
				})
			break
		default:
			break
		}
		setVisible(false)
	}
	const onConfirmeColetar = () => {
		setSalvando(true)
		switch (statusAtual) {
		case `Aguardando Coleta`:

			SolicitacoesMotoristasAPI.atualizarStatusIniciarColetar(user, idColeta)
				.then(async () => {
					return await listSolicitacoes()
				}).then(() => {
					setSalvando(false)
					toastSuccess(`Coleta iniciada com sucesso!`)
				}).catch(error => {
					setSalvando(false)
					console.error(`Error =>`, error)
					toastError(error.message)
				})
			break
		case `Em Transporte`:
			SolicitacoesMotoristasAPI.atualizarStatusFinalizarColeta(user, idColeta)
				.then(async () => {
					return await listSolicitacoes()

				}).then(() => {
					setSalvando(false)
					toastSuccess(`Coleta finalizada com sucesso!`)
				})
				.catch(error => {
					setSalvando(false)
					console.log(`Error =>`, error.statusText)
					toastError(error.message)
				})

			break
		default:
			break
		}
		setVisible(false)
	}

	return {
		dialogColetar, setDialogColetar,
		dgEntregar, setDgEntregar,
		onConfirmeEntregar,
		onConfirmeColetar,
		setActiveIndex,
		activeIndex,
		mudarStatus,
		statusAtual,
		statusASerAtualizado,
		visible,
		setVisible,
		salvando,
		solicitacoes,
		expandedRows,
		setExpandedRows,
		loading,
		mudarStatusColetar
	}
}
