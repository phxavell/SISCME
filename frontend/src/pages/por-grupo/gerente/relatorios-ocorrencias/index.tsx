import { titleStyle } from "@/util/styles"
import { ModalDadosGrafico } from "../generics/componentes/modal-opcoes/ModalDadosGrafico"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useRelatorioOcorrencia } from "../generics/useRelatorioOcorrencia"
import { useCliente } from "../../administrativo/cruds/cliente/novo-cliente/useCliente"
import { Calendar } from "primereact/calendar"
import { Sidebar } from 'primereact/sidebar'
import { Button } from "primereact/button"
import { styleActionHeader } from "@/components/RowTemplate"
import { MultiSelect } from "primereact/multiselect"
import { ProgressSpinner } from "primereact/progressspinner"
import { GraficoOcorrencia } from "../generics/componentes/grafico"
import { Dropdown } from "primereact/dropdown"

export const RelatorioOcorrencias = () => {
	const [showData, setShowData] = useState(false)
	const [showModal, setShowModal] = useState(false)
	const [visibleFiltros, setVisibleFiltros] = useState(false)
    	const {
		relatorios,
		cliente, setCliente,
		dateInterval, setDateInterval,
		clearFilters,
		indicadores,
		indicador, setIndicador
	} = useRelatorioOcorrencia()

	useEffect(() => {
		if (relatorios.length !== 0) {
			setShowData(true)
		}
	}, [relatorios])

    	const {
		clientes,
	} = useCliente()

	const clientesDropdown = useMemo(() => clientes?.data?.map((cliente: any) => ({
		label: cliente.nomecli,
		value: cliente.idcli
	})), [clientes?.data])

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

	const exibirDadosOuMessagem = useCallback((data: any) => {
		if(relatorios?.tipos?.length > 0) {
			return (
				<GraficoOcorrencia data={data} setShowModal={setShowModal} setVisibleFiltros={setVisibleFiltros} />
			)
		} else {
			return <GraficoOcorrencia data={data} setShowModal={setShowModal} setVisibleFiltros={setVisibleFiltros} />
		}

	}, [relatorios])

	const loading = useCallback((data:any) => {
		if (!showData && relatorios ) {
			return <ProgressSpinner/>
		}
		return exibirDadosOuMessagem(data)
	}, [relatorios, showData, exibirDadosOuMessagem])

	return (
		<div className="px-8">
			<h1 className={titleStyle}>Relatórios - Ocorrências</h1>
			<div className="flex gap-5">
				<div className="h-full w-full pb-7">
					<ModalDadosGrafico
						showModal={showModal}
						closeModal={() => setShowModal(false)}
						data={relatorios}
						dateInterval={dateInterval}
						selectedClientes={cliente || []}
						clientesDropdown={clientesDropdown || []}
						titulo={`Relatório de ocorrências`}

					/>
					{loading(relatorios)}
				</div>
				<Sidebar
					position="right"
					visible={visibleFiltros}
					onHide={() => setVisibleFiltros(false)}
				>
					<h3 className="m-0 mb-2 text-gray-800 bg-blue-800 border-round-top text-white p-3">Filtros:</h3>
					<div className="flex flex-column gap-2">
						<Calendar
							value={dateInterval}
							id="fromDate"
							onChange={(e) => {
								setDateInterval(e.value)
							}}
							placeholder="Intervalo de datas"
							selectionMode="range"
							showIcon
							maxDate={new Date()}
							dateFormat="dd/mm/yy"
						/>

						<div className="flex gap-1">
							<Button
								icon="pi pi-calendar"
								size="small"
								onClick={() => {
									handleSetSevenDays()
								}}
								className={styleActionHeader(`blue`, `600`, `800`) + `w-full`}
								label="7 dias"
								tooltip="Últimos 7 dias"
							/>
							<Button
								size="small"
								icon="pi pi-calendar"
								onClick={() => {
									handleSetThirtyDays()
								}}
								className={styleActionHeader(`blue`, `600`, `800`) + `w-full`}
								label="30 dias"
								tooltip="Últimos 30 dias"
							/>

						</div>

						<MultiSelect
							value={cliente}
							options={clientesDropdown ?? []}
							onChange={(e) => {
								setCliente(e.value)
							}}
							placeholder="Selecione um ou mais clientes"
							className="text-left"
						/>
						<Dropdown
							placeholder="Tipo de ocorrência"
							value={indicador}
							options={indicadores?.data ?? []}
							optionLabel='descricao'
							className="text-left"
							optionValue='id'
							onChange={(e) => {setIndicador(e.value)}}
						/>
						<Button
							icon="pi pi-times"
							label="Limpar filtros"
							tooltip={`Limpar pesquisa`}
							onClick={() => {
								clearFilters()
							}}
							className={styleActionHeader(`blue`, `600`, `800`)}
						/>
					</div>
				</Sidebar>
			</div>
		</div>
	)
}
