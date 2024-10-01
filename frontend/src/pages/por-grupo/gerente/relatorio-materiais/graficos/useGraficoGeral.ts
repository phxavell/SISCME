import Chart from 'chart.js/auto'
import {useEffect, useRef, useState} from "react"
import { makeChart, mapLabelsMateriais } from './helper'

export const useGraficoGeral = (props: any) => {
	const { data, turno, dadosGrafico } = props
	const chartRef = useRef<HTMLCanvasElement>(null)
	const [chartInstance, setChartInstance] = useState<Chart | null>(null)

	useEffect(() => {
		if (chartInstance) {
			chartInstance.destroy()
		}

		const baseDataset = [
			{
				label: `Quantidade`,
				keyValue: `quantidade`
			},
		]

		let maiorNumero = Number.NEGATIVE_INFINITY


		dadosGrafico?.forEach((etiqueta: any) => {
			maiorNumero = Math.max(maiorNumero, etiqueta?.quantidade)
		})

		const chartData = makeChart(mapLabelsMateriais, dadosGrafico, baseDataset)

		const options: any = {
			plugins: {
				legend: {
					display: false,
				},
				title: {
					display: true,
					text: `Quantidade por tipo de etiqueta`,
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
			// @ts-ignore
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
