import {Solicitacoes, SterilizationAPI} from '@/infra/integrations/tecnico-demandas.ts'
import {useAuth} from '@/provider/Auth'
import React, {useEffect, useState} from 'react'
import {useLocation, useNavigate} from 'react-router-dom'
import {
	styleContentDemandas,
	styleDivNameTableDemandas,
	styleH1Demandas,
	styleH3Demandas
} from '@pages/por-grupo/tecnico-cme/demandas/style.ts'
import DemandasEntreguesTable
	from '@pages/por-grupo/tecnico-cme/demandas/DemandasEntregues/table/DemandasEntreguesTable.tsx'
import {
	CardDataviewEntregues
} from '@pages/por-grupo/tecnico-cme/demandas/DemandasEntregues/dataview/CardDataviewEntregues.tsx'

import {DataView} from 'primereact/dataview'
import {styleNotShowMobile, styleShowMobile} from '@/util/styles'


export function DemandsDelivered() {
	const [solicitacoes, setSolicitacoes] = useState<Solicitacoes[]>([])
	const [loading, setLoading] = useState<boolean>(true)

	const {user, toastError} = useAuth()

	const {state} = useLocation()

	const navigate = useNavigate()

	const showToastError = (status: string) => {
		toastError(status)
	}


	useEffect(() => {
		let mounted = true;
		(() => {
			if (state == null) {
				navigate(`/home`)
			}
			if (user?.access.length > 0 && state?.id) {
				SterilizationAPI
					.listForClient(user, state?.id, `ENTREGUE`)
					.then((data) => {
						setLoading(false)
						if (mounted) setSolicitacoes(data)
					})
					.catch(e => {
						setLoading(false)
						showToastError(e.message)
					})
			}
		})()

		return () => {
			mounted = false
		}

	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user, state, navigate])

	return (
		<div className={styleContentDemandas}>
			<h1 className={styleH1Demandas}>Demandas Entregues</h1>
			<div className={styleDivNameTableDemandas}>
				<h3 className={styleH3Demandas}>{state?.nome}</h3>
				<div className={styleNotShowMobile}>
					<DemandasEntreguesTable
						list={solicitacoes}
						loading={loading}/>
				</div>
				<div className={styleShowMobile}>
					<DataView
						lazy
						paginator
						rows={3}
						value={solicitacoes}
						itemTemplate={CardDataviewEntregues}/>
				</div>
			</div>
		</div>
	)
}
