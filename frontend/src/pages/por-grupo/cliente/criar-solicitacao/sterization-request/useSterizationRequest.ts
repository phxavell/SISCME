import { ClienteSolicitacoes, SolicitacaoDoCliente } from '@/infra/integrations/cliente-solicitacoes.ts'
import { useAuth } from '@/provider/Auth'
import { Toast } from 'primereact/toast'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
interface tableData {
    serial: string
    modelo_caixa: string
    situacao: string
}
export function useSterizationRequest() {
	const { user } = useAuth()
	const toast = useRef<Toast>(null)
	const navigate = useNavigate()
	const [
		solicitacoes,
		setSolicitacoes
	] = useState<SolicitacaoDoCliente[]>([])
	const [loading, setLoading] = useState(false)
	const [rowSelected, setRowSelected] = useState<SolicitacaoDoCliente>()
	const [boxsRegistred, setBoxsRegistred] = useState<tableData[]>([])
	const [openDetail, setOpenDetail] = useState(false)
	const [mensagemErrorForbiden, setMensagemErrorForbiden] = useState<string>(``)
	const [
		openDialog,
		setOpenDialog
	] = useState<boolean>(false)

	const updateList = useCallback(() => {
		setLoading(true)
		ClienteSolicitacoes.list(user).then((data) => {
			setSolicitacoes(data)
			setLoading(false)
		}).catch((erroMsg) => {
			setLoading(false)
			if (solicitacoes) {
				return setOpenDialog(false)
			} else {
				toast.current?.show({
					severity: `error`,
					detail: erroMsg
				})
			}
		})
	}, [solicitacoes, user])
	useEffect(() => {
		let mounted = true;
		(() => {
			if (user) {
				setLoading(true)
				ClienteSolicitacoes.getBoxFromClient(user).then((data) => {
					if (mounted) {
						setBoxsRegistred(data)
					}
				}).catch(erroMsg => {
					if (mounted) {
						if (erroMsg.code === 403) {
							setMensagemErrorForbiden(erroMsg.data.error.message)
							toast.current?.show({ severity: `error`, detail: erroMsg.data.error.message })
							navigate(`/home-solicitacoes`)
							return
						}
						toast.current?.show({ severity: `error`, detail: erroMsg.data.error.message })

					}
				})
				ClienteSolicitacoes.list(user).then((data) => {
					if (mounted) {
						setSolicitacoes(data)
						setLoading(false)
					}
				}).catch(errorMsg => {
					toast.current?.show({ severity: `error`, detail: errorMsg.message })
					setLoading(false)
				})

			}

		})()
		return () => {
			mounted = false
		}
	}, [user, navigate])
	const onConfirmeEntrega = (idColetar: number) => {
		ClienteSolicitacoes.atualizarStatusFinalizarColeta(user, idColetar)
			.then(() => {
				updateList()
				toast.current?.show({ severity: `success`, detail: `Rota Recebida com sucesso!` })
			}).catch((errorMsg) => {
				toast.current?.show({ severity: `error`, detail: errorMsg.message })
			})

	}
	const onRowSelect = (event: SolicitacaoDoCliente) => {
		setRowSelected(event)

		setTimeout(() => {
			setOpenDetail(true)
		}, 200)
	}
	return {
		onConfirmeEntrega,
		openDialog,
		setOpenDialog,
		setOpenDetail,
		openDetail,
		onRowSelect,
		updateList,
		rowSelected,
		loading,
		solicitacoes,
		boxsRegistred,
		mensagemErrorForbiden,
	}
}
