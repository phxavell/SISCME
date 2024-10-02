import React, {useCallback, useEffect, useState} from 'react'
import {TabPanel, TabView} from 'primereact/tabview'
import {InProgressTableEntregar} from 'src/pages/por-grupo/motorista/entregas-agendadas/Entregar/TableEntregar'
import {InProgressTableColetar} from 'src/pages/por-grupo/motorista/entregas-agendadas/Coletar/TableColetar'
import {InProgressDriverModalColetar} from 'src/pages/por-grupo/motorista/entregas-agendadas/Coletar/ModalColetar'
import {InProgressDriverModalEntragar} from './Entregar/ModalEntragar'
import {coletasProps, entregasProps, SolicitacoesMotoristasAPI} from '@/infra/integrations/solicitacoes_motoristas.ts'
import {useAuth} from '@/provider/Auth'
import {DataView} from 'primereact/dataview'
import {
	CardDataviewMotoristaColetar
} from '@pages/por-grupo/motorista/entregas-agendadas/Coletar/dataview/CardDataviewMotoristaColetar.tsx'
import {
	CardDataviewMotoristaEntregar
} from '@pages/por-grupo/motorista/entregas-agendadas/Entregar/dataview/CardDataviewMotoristaEntregar.tsx'
import {styleNotShowMobile, styleShowMobile, titleStyle} from '@/util/styles'

export function InProgressDriver() {

	const {user, toastSuccess, toastError} = useAuth()
	const [solicitacoesColetas, setSolicitacoesColetas] = useState<coletasProps[]>()
	const [solicitacoesEntregas, setSolicitacoesEntregas] = useState<entregasProps[]>()
	const [dialogColetar, setDialogColetar] = useState<boolean>(false)
	const [dgEntregar, setDgEntregar] = useState<boolean>(false)
	const [statusAtual, setStatusAtual] = useState(``)
	const [statusASerAtualizado, setStatusASerAtualizado] = useState(``)
	const [idColeta, setIdColeta] = useState(0)
	const [activeIndex, setActiveIndex] = useState(0)
	const [salvando, setSalvando] = useState(false)

	const tostSuccess = (messagem: string) => {
		toastSuccess(messagem)
	}
	const tostError = (messagem: string) => {
		toastError(messagem)
	}
	const listSolicitacoes = useCallback(async () => {
		try {
			const data = await SolicitacoesMotoristasAPI.list(user)

			setSolicitacoesEntregas(data?.entregas)
			setSolicitacoesColetas(data?.coletas)

		} catch (error) {
			console.error(error)
		}
	}, [user])

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
					tostSuccess(`Rota finalizada com sucesso!`)
				}).catch(error => {
					setSalvando(false)
					console.log(`Error =>`, error)
					tostError(error.message)
				})
			break
		case `Em Transporte`:
			SolicitacoesMotoristasAPI.atualizarStatusFinalizarEntrega(user, idColeta)
				.then(async () => {
					return await listSolicitacoes()

				})
				.then(() => {
					setSalvando(false)
					tostSuccess(`Rota finalizada com sucesso!`)
				})
				.catch(error => {
					setSalvando(false)
					console.log(`Error =>`, error)
					tostError(error.message)
				})
			break
		default:
			break
		}
		setDialogColetar(false)
		setDgEntregar(false)
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
					tostSuccess(`Coleta iniciada com sucesso!`)
				}).catch(error => {
					setSalvando(false)
					console.error(`Error =>`, error)
					tostError(error.message)
				})
			break
		case `Em Transporte`:
			SolicitacoesMotoristasAPI.atualizarStatusFinalizarColeta(user, idColeta)
				.then(async () => {
					return await listSolicitacoes()

				}).then(() => {
					setSalvando(false)
					tostSuccess(`Coleta finalizada com sucesso!`)
				})
				.catch(error => {
					setSalvando(false)
					console.log(`Error =>`, error.statusText)
					tostError(error.message)
				})

			break
		default:
			break
		}
		setDialogColetar(false)
		setDgEntregar(false)
	}

	return (<>
		<InProgressDriverModalEntragar
			onConfirmeEntregar={onConfirmeEntregar}
			statusAtual={statusAtual}
			statusASerAtualizado={statusASerAtualizado}
			visible={dgEntregar}
			onClose={() => setDgEntregar(false)}
			salvando={salvando}
		>
		</InProgressDriverModalEntragar>
		<InProgressDriverModalColetar
			onConfirmeColetar={onConfirmeColetar}
			statusAtual={statusAtual}
			statusASerAtualizado={statusASerAtualizado}
			visible={dialogColetar}
			onClose={() => setDialogColetar(false)}
			salvando={salvando}
		>
		</InProgressDriverModalColetar>
		<div className="p-5 flex flex-column align-items-center">
			<h1 className={titleStyle}>
                    Minhas Demandas
			</h1>


			<TabView
				className="w-full flex flex-column lg:px-8"
				activeIndex={activeIndex}
				onTabChange={(e) => setActiveIndex(e.index)}>
				<TabPanel header="A Coletar">
					<div className="w-full flex flex-column">
						<div className={styleNotShowMobile}>
							<InProgressTableColetar
								mudarStatus={mudarStatusColetar}
								solicitacoesColetas={solicitacoesColetas}
							/>
						</div>
						<div className={styleShowMobile}>
							<DataView
								lazy
								paginator
								rows={3}
								value={solicitacoesColetas}
								itemTemplate={CardDataviewMotoristaColetar(mudarStatus)}/>
						</div>
					</div>

				</TabPanel>
				<TabPanel header="A Entregar">
					<div className="w-full flex flex-column">
						<div className={styleNotShowMobile}>
							<InProgressTableEntregar
								mudarStatus={mudarStatus}
								solicitacoesEntrega={solicitacoesEntregas}
							/>
						</div>
						<div className={styleShowMobile}>
							<DataView
								lazy
								paginator
								rows={3}
								value={solicitacoesEntregas}
								itemTemplate={CardDataviewMotoristaEntregar(mudarStatus)}/>
						</div>
					</div>

				</TabPanel>
			</TabView>
		</div>
	</>
	)
}
