import {Card} from "primereact/card"
import {BsHospital} from 'react-icons/bs'
import {cardStyle, divContainer} from "./styles.ts"
import {useCallback, useEffect, useMemo, useState} from "react"
import {DemandasDataType, DemandsAPI} from "@/infra/integrations/tecnico-demandas-resumo.ts"
import {useAuth} from "@/provider/Auth"
import {footerCard} from "./FooterCard.tsx"
import {classHeaderCard, titleStyle} from "@/util/styles/index.ts"

export const Demands = () => {
	const {toastError} = useAuth()
	const [demands, setDemands] = useState<DemandasDataType[]>([])
	const [loading, setLoading] = useState(true)

	const {user} = useAuth()

	useEffect(() => {
		let mounted = true;
		(() => {
			if (user?.access.length) {
				DemandsAPI
					.getOptions(user)
					.then((data) => {
						if (mounted) setDemands(data)
					})
					.catch(() => {
						toastError(`Não foi possível carregar os dados`)
					})
			}

		})()

		return () => {
			mounted = false
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user])

	const headerCard = (nome: string) => (
		<div className={classHeaderCard}>
			<h2 className="m-0 text-xl">{nome}</h2>
			<BsHospital className="text-4xl"/>
		</div>
	)

	const LoadingComponent = useCallback(() => {
		setTimeout(() => {
			setLoading(false)
		}, 3000)
		if (loading) {
			return <i className="pi pi-spin pi-spinner" style={{ fontSize: `3rem`, color: `green`}}/>
		} else {
			return <h3 className={titleStyle}>Nenhuma demanda solicitada.</h3>
		}
	}, [loading])

	const renderComponent = useMemo(() => {
		if (demands.length < 1) {
			return <LoadingComponent/>
		} else {
			return demands.map((demanda) => (
				<Card
					key={demanda.id_cliente}
					header={headerCard(demanda.nome_cliente)}
					footer={footerCard(
						demanda.quantidade_pendente,
						demanda.quantidade_andamento,
						demanda.quantidade_finalizado,
						demanda.id_cliente,
						demanda.nome_cliente
					)}
					className={`${cardStyle} bg-gradiente-maximum-compatibility`}
				/>
			))
		}
	}, [demands, LoadingComponent])

	return (
		<div className={divContainer}>
			<div className="grid gap-4 justify-content-center">
				{renderComponent}
			</div>
		</div>
	)
}
