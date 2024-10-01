import { DataTableUnselectEvent } from 'primereact/datatable'
import { ModalPendingInProgress } from '../componentes/ModalPendingInProgress'
import { useEffect, useState } from 'react'
import { Solicitacoes, SterilizationAPI } from '@/infra/integrations/tecnico-demandas.ts'
import { useAuth } from '@/provider/Auth'
import { useLocation, useNavigate } from 'react-router-dom'
import { ResultVehicle, VeiculoAPI } from '@/infra/integrations/vehicles.ts'
import { DriverAPI } from '@/infra/integrations/motorista.ts'
import DemandasPendentesTable
	from '@pages/por-grupo/tecnico-cme/demandas/DemandasPendentes/table/DemandasPendentesTable.tsx'
import {
	styleContentDemandas,
	styleDivNameTableDemandas,
	styleH1Demandas
} from '@pages/por-grupo/tecnico-cme/demandas/style.ts'

export const PendingDemands = ()=> {
	const [visible, setVisible] = useState(false)
	const [selectedSE, setSelectedSE] = useState<Solicitacoes | null>()
	const [solicitacoes, setSolicitacoes] = useState<Solicitacoes[]>([])
	const [optionsVehicles, setOptionsVehicles] = useState<ResultVehicle[]>()
	const [optionsDrivers, setOptionsDrivers] = useState<any[]>()
	const [loading, setLoading] = useState(true)

	const { user, toastError } = useAuth()
	const { state } = useLocation()
	const navigate = useNavigate()

	const showError = (message: string) => {
		toastError(message)
	}

	useEffect(() => {
		let mounted = true;
		(() => {
			if (state == null) {
				navigate(`/home`)
			}
			if (user && user?.access?.length > 0 && state?.id) {
				SterilizationAPI
					.listForClient(user, state?.id, `PENDENTECME`)
					.then((data) => {
						setLoading(false)
						if (mounted) setSolicitacoes(data)
					})
					.catch((e) => {
						setLoading(false)
						showError(e.message)
					})

				DriverAPI
					.getOptions(user, 1)
					.then((data) => {
						if (mounted) setOptionsDrivers(data.data)
					}).catch(() => {
						showError(`Falha na busca por motorista no servidor.`)
					})
				//TODO adaptar a paginação nesta tela
				VeiculoAPI
					.listar(user,1)
					.then((data) => {
						if (mounted) setOptionsVehicles(data.data)
					}).catch(() => {
						showError(`Falha na busca por veículos no servidor.`)
					})
			}

		})()

		return () => {
			mounted = false
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user, state, navigate])

	const onSelectRow = (e: DataTableUnselectEvent) => {
		setVisible(true)
		setSelectedSE(e.data)

	}
	const refreshTable = async (success: boolean) => {
		setVisible(false)
		if (success) {
			setLoading(true)
			await SterilizationAPI
				.listForClient(user, state?.id, `PENDENTECME`)
				.then((data) => {
					setLoading(false)
					setSolicitacoes(data)
				})
				.catch(() => {
					setLoading(false)
					showError(`Falha na requisição de demandas.`)
				})
		}
	}

	return (
		<div className={styleContentDemandas}>
			<h1 className={styleH1Demandas}>
                Demandas Pendentes
			</h1>
			<ModalPendingInProgress
				retorno={false}
				optionsDrivers={optionsDrivers}
				optionsVehicles={optionsVehicles}
				visible={visible}
				onClose={refreshTable}
				selectedSE={selectedSE}
			/>
			<div className={styleDivNameTableDemandas}>
				<h3 className="text-left mt-3 mb-0 text-700">{state?.nome}</h3>
				<div className="flex mt-2 relative sm:max-w-screen ">
					<DemandasPendentesTable
						list={solicitacoes}
						loading={loading}
						onSelectRow={onSelectRow}
					></DemandasPendentesTable>
				</div>
			</div>
		</div>
	)
}
