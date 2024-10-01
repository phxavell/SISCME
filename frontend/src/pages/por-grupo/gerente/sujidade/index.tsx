import { styleActionHeader } from "@/components/RowTemplate"
import { ContainerFlexColumnDiv, titleStyle } from "@/util/styles"
import { Button } from "primereact/button"
import { Calendar } from "primereact/calendar"
import { GraficoOcorrencia } from "../generics/componentes/grafico"
import { useRelatorioOcorrencia } from "../generics/useRelatorioOcorrencia"
import { ProgressSpinner } from "primereact/progressspinner"
import { useCallback, useEffect, useState } from "react"
import { useCliente } from "../../administrativo/cruds/cliente/novo-cliente/useCliente"
import { style1 } from "../generics/styles"

import { MultiSelect } from 'primereact/multiselect'
import { ModalDadosGrafico } from "../generics/componentes/modal-opcoes/ModalDadosGrafico"


export const RelatorioSujidade = () => {
	const [showData, setShowData] = useState(false)
	const [showModal, setShowModal] = useState(false)
	const {
		relatorios,
		cliente, setCliente,
		dateInterval, setDateInterval,
		clearFilters
	} = useRelatorioOcorrencia()

	const {
		clientes,
	} = useCliente()

	useEffect(() => {
		if (relatorios.length !== 0) {
			setShowData(true)
		}
	}, [relatorios])

	const loading = useCallback((data:any) => {
		if (!showData && relatorios ) {
			return <ProgressSpinner/>
		}
		return <GraficoOcorrencia data={data}/>
	}, [relatorios, showData])

	const clientesDropdown = clientes?.data?.map((cliente: any) => ({
		label: cliente.nomecli,
		value: cliente.idcli
	}))


	const handleSetSevenDays = () => {
		const date = new Date()
		const sevenDaysAgo = new Date(date.setDate(date.getDate() - 7))
		setDateInterval([sevenDaysAgo, new Date()])
	}

	const handleSetThirtyDays = () => {
		const date = new Date()
		const thirtyDaysAgo = new Date(date.setDate(date.getDate() - 30))
		setDateInterval([thirtyDaysAgo, new Date()])
	}

	return (
		<div className={ContainerFlexColumnDiv}>
			<h1 className={titleStyle}>Relatório de Ocorrências - Sujidade</h1>
			<ModalDadosGrafico
				showModal={showModal}
				closeModal={() => setShowModal(false)}
				data={relatorios}
				dateInterval={dateInterval}
				selectedClientes={cliente || []}
				clientesDropdown={clientesDropdown || []}
				titulo="Material com Sujidade"
			/>
			<div className={style1}>
				<div className="flex gap-2">
					<Calendar
						value={dateInterval}
						id="fromDate"
						onChange={(e) => {
							setDateInterval(e.value)
						}}
						placeholder="Intervalo de datas"
						selectionMode="range"
						showIcon
						dateFormat="dd/mm/yy"/>

					<Button
						icon="pi pi-calendar"
						onClick={() => {
							handleSetSevenDays()
						}}
						className={styleActionHeader(`blue`, `600`, `800`)}
						label="7 dias"
						tooltip="Últimos 7 dias"
					/>
					<Button
						icon="pi pi-calendar"
						onClick={() => {
							handleSetThirtyDays()
						}}
						className={styleActionHeader(`blue`, `600`, `800`)}
						label="30 dias"
						tooltip="Últimos 30 dias"
					/>
					<MultiSelect
						value={cliente}
						options={clientesDropdown}
						onChange={(e) => {
							setCliente(e.value)
						}}
						placeholder="Selecione um ou mais clientes"
						className="w-72"
					/>
					<Button
						icon="pi pi-times"
						tooltip={`Limpar pesquisa`}
						onClick={() => {
							clearFilters()
						}}
						className={styleActionHeader(`blue`, `600`, `800`)}
					/>
					<Button
						icon="pi pi-table"
						onClick={() => {
							setShowModal(true)
						}}
						className={styleActionHeader(`blue`, `600`, `800`)}
						label="Visualizar Detalhes"
					/>
				</div>
			</div>

			<div className="h-full w-full">
				{loading(relatorios)}
			</div>
		</div>

	)
}
