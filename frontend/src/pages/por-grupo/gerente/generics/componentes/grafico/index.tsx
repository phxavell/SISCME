import {useEffect, useRef, useState} from "react"
import Chart from 'chart.js/auto'
import { optionsGraph, randomColor } from "../assets/params"

import { Message } from "primereact/message"
import { styleMessageChart } from "@/util/styles"
import { Button } from "primereact/button"
import { styleActionHeader } from "@/components/RowTemplate"
import { graficoMessege } from "../../../relatorio-processos/graficos/styles"

export function GraficoOcorrencia(props: any) {
	const {data, setShowModal, setVisibleFiltros} = props
	const chartRef = useRef<HTMLCanvasElement>(null)
	const [chartInstance, setChartInstance] = useState<Chart | null>(null)

	const visualizarGrafico = () => {
		if(data?.total > 0){
			return <canvas ref={chartRef} className='h-full' />
		} else {
			return <h2 className='text-gray-800'>Não há dados!</h2>
		}
	}
	useEffect(() => {
		if (chartInstance) {
			chartInstance.destroy()
		}

		const tiposOcorrencias = data?.tipos?.map((item: { tipo: any }) => item.tipo)
		const clientes = Object.keys(data?.clientes)
		const cores = randomColor()

		const datasets = tiposOcorrencias?.map((tipo: string, index: number) => ({
			label: tipo,
			data: clientes?.map((cliente: string) => data?.clientes[cliente].tipos[tipo] || 0),
			backgroundColor: cores[index % cores.length],
			borderColor: cores[index % cores.length],
			borderWidth: 1,
		}))

		const chartData = {
			labels: [clientes],
			datasets: datasets
		}

		let maiorNumero = Number.NEGATIVE_INFINITY

		data?.tipos?.forEach((tipo: any) => {
			maiorNumero = Math.max(maiorNumero, tipo.quantidade)
		})

		const ctx = chartRef.current?.getContext(`2d`)
		if (ctx) {
			const newChartInstance = new Chart(ctx, {
				type: `bar`,
				data: chartData,
				// @ts-ignore
				options: optionsGraph(
					`Quantidade de Ocorrências pelo Tipo por Clientes`,
					`Clientes`,
					`Quantidade total de Ocorrências`,
					maiorNumero,
					20
				)
			})
			setChartInstance(newChartInstance)
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data])

	return (
		<div>
			<div className='flex gap-3'>
				<Button
					icon="pi pi-search"
					className="bg-teal-500 ml-auto"
					label="Filtros"
					onClick={() => setVisibleFiltros(true)}
				/>
				<Button
					onClick={() => {
						setShowModal(true)
					}}
					className={styleActionHeader(`blue`, `600`, `800`)}
					label="Visualizar em tabela"
				/>

			</div>
			<div>
				<div className="flex flex-col justify-content-center">
					<div className="flex flex-col gap-5 py-4">
						<Message
							style={styleMessageChart(`#117c38`, `rgba(6, 66, 6, 0.897)`)}
							className={graficoMessege}
							severity="info"
							content={`Total de Ocorrências: ${data?.total ?? `0`}`}
						/>
					</div>
				</div>
				<div className="flex flex-column align-items-center gap-3">

					<div style={{height: `36rem`}}>

						{visualizarGrafico()}
					</div>
				</div>
			</div>
		</div>
	)
}
