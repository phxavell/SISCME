import Chart from 'chart.js/auto'
import {useEffect, useRef, useState} from "react"
import {makeChart, mapLabelsCliente} from "@pages/por-grupo/gerente/relatorio-processos/graficos/helper.ts"

export const useGraficoGeral = (props: any) => {
	const { data, turno, dados } = props
	const chartRef = useRef<HTMLCanvasElement>(null)
	const [chartInstance, setChartInstance] = useState<Chart | null>(null)

	useEffect(() => {
		if (chartInstance) {
			chartInstance.destroy()
		}

		const baseDataset = [
			{
				label: `Recebidos`,
				keyValue: `qtd_recebimento`
			},
			{
				label: `Distribuidos`,
				keyValue: `qtd_distribuicao`
			}
		]

		let maiorNumero = Number.NEGATIVE_INFINITY

		dados?.forEach((cliente: any) => {
			maiorNumero = Math.max(maiorNumero, cliente.qtd_recebimento, cliente.qtd_distribuicao)
		})

		const chartData = makeChart(mapLabelsCliente, dados, baseDataset)

		const options: any = {
			plugins: {
				legend: {
					display: false,
				},
				title: {
					display: true,
					text: `Total de aproveitamento por cliente`,
					font: {
						size: 20
					}
				}
			},
			scales: {
				y: {
					stacked: false,
					beginAtZero: true,

				},
				x: {
					max: maiorNumero * 1.25,
				}
			},
			indexAxis: `y`,
			elements: {
				bar: {
					borderWidth: 0,
				}
			},
			responsive: true,
		}

		const ctx = chartRef.current?.getContext(`2d`)
		if (ctx) {
			const newChartInstance = new Chart(ctx, {
				type: `bar`,
				data: chartData,
				options: options
			})
			setChartInstance(newChartInstance)
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data, turno])

	return {
		chartRef
	}
}
