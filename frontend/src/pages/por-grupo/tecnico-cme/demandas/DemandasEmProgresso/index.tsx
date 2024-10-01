import { useEffect, useState } from 'react'
import { EmProgressoTable } from '@pages/por-grupo/tecnico-cme/demandas/DemandasEmProgresso/table'
import { useLocation, useNavigate } from 'react-router-dom'
import { DriverAPI } from '@/infra/integrations/motorista.ts'
import { ResultVehicle, VeiculoAPI } from '@/infra/integrations/vehicles.ts'
import { useAuth } from '@/provider/Auth'
import { ModalPendingInProgress } from '../componentes/ModalPendingInProgress'
import { Solicitacoes, SterilizationAPI } from '@/infra/integrations/tecnico-demandas.ts'
import {
	styleContentDemandas,
	styleDivNameTableDemandas,
	styleH1Demandas,
	styleH3Demandas
} from '@pages/por-grupo/tecnico-cme/demandas/style.ts'

export function DemandasEmProgresso() {
	const [visible, setVisible] = useState(false)
	const [selectedSE, setSelectedSE] = useState<Solicitacoes>()
	const [optionsVehicles, setOptionsVehicles] = useState<ResultVehicle[]>()
	const [optionsDrivers, setOptionsDrivers] = useState<any[]>()
	const [loading, setLoading] = useState(true)

	const [
		solicitacoes,
		setSolicitacoes
	] = useState<Solicitacoes[]>([])

	const { state } = useLocation()
	const { user } = useAuth()

	const navigate = useNavigate()

	const onSelectRow = (data: Solicitacoes) => {
		setVisible(true)
		setSelectedSE(data)
	}

	useEffect(() => {
		if(state == null) {
			navigate(`/home`)
		}
		DriverAPI
			.getOptions(user, 1)
			.then((data) => {
				setOptionsDrivers(data.data)
			}).catch(e => {
				setOptionsDrivers(e.statusText)
			})
		//TODO checar integração desta tela.
		VeiculoAPI
			.listar(user, 1)
			.then((data) => {
				setOptionsVehicles(data.data)
			}).catch(e => {
				setOptionsVehicles(e.data)
			})
	}, [user, state, navigate])

	useEffect(() => {
		let mounted = true;

		(() => {
			if (user  && state) {
				SterilizationAPI.listForClient(user, state.id, `ANDAMENTO`).then((data) => {
					if (mounted) {
						setLoading(false)
						setSolicitacoes(data)
					}
				}).catch(e => {

					if (mounted) {
						setLoading(false)
						setSolicitacoes(e.data)
					}
				})
			}
		})()
		return () => {
			mounted = false
		}
	}, [user, state])

	const handleCloseModal = (success: boolean)=> {
		setVisible(false)
		if(success){
			setLoading(true)
			SterilizationAPI.listForClient(user, state.id, `ANDAMENTO`).then((data) => {
				setLoading(false)
				setSolicitacoes(data)
			}).catch(e => {
				setLoading(false)
				setSolicitacoes(e.data)
			})

		}
	}

	return (
		<div className={styleContentDemandas}>
			<h1 className={styleH1Demandas}>
                Demandas em Andamento
			</h1>
			<div className={styleDivNameTableDemandas}>
				<h3 className={styleH3Demandas}>
					{state?.nome}
				</h3>
				<div className="flex mt-2 relative">
					<EmProgressoTable
						solicitacoes={solicitacoes}
						loading={loading}
						onSelectRow={onSelectRow}
					></EmProgressoTable>

				</div>
			</div>
			<ModalPendingInProgress
				retorno={true}
				optionsDrivers={optionsDrivers}
				optionsVehicles={optionsVehicles}
				visible={visible}
				onClose={handleCloseModal}
				selectedSE={selectedSE}
			/>
		</div>
	)
}
