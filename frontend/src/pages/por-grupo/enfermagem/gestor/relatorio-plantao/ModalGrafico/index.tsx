import {Dialog} from "primereact/dialog"
import {Chart} from 'primereact/chart'
import {useEffect, useState} from "react"
import {chartLineStyle} from "../../plantao-supervisor/styles"

interface ModalGrafico {
    onClose: () => void
    visible: boolean
    dados: any[]
}

export function ModalGrafico({visible, onClose, dados}: ModalGrafico) {
	const [chartData, setChartData] = useState({})
	const [chartOptions, setChartOptions] = useState({})
	const [chartData2, setChartData2] = useState({})
	const [chartOptions2, setChartOptions2] = useState({})

	function converterDuracaoParaMinutos(duracao: any) {
		const [horas, minutos, segundos] = duracao.split(`:`).map(Number)
		return horas * 60 + minutos + segundos / 60
	}

	useEffect(() => {
		const data = {
			labels: dados.map((dado) => {
				const partes = dado.nome.split(` `)
				if (partes.length >= 2) {
					return `${partes[0]} ${partes[1].charAt(0)}.`
				}
				return dado.nome
			}),
			datasets: [
				{
					label: `Plantões Fechados`,
					data: dados.map((dado) => dado.quantidade_fechados),
					backgroundColor: [
						`rgba(0, 47, 255, 0.4)`,
					],
					borderColor: [
						`rgb(0, 47, 255)`,

					],
					borderWidth: 1,
				}
			]
		}
		const options = {
			scales: {
				x: {
					title: {display: true, text: `Profissionais`}
				},

				y: {
					beginAtZero: true,
					title: {display: true, text: `Quantidade de Plantões Fechados`}
				}
			},
		}

		setChartData(data)
		setChartOptions(options)

		const documentStyle = getComputedStyle(document.documentElement)
		const textColor = documentStyle.getPropertyValue(`--text-color`)
		const textColorSecondary = documentStyle.getPropertyValue(`--text-color-secondary`)
		const surfaceBorder = documentStyle.getPropertyValue(`--surface-border`)

		const data2 = {
			labels: dados?.map((dado) => {
				const partes = dado?.nome.split(` `)
				if (partes.length >= 2) {
					return `${partes[0]} ${partes[1].charAt(0)}.`
				}
				return dado.nome
			}),
			datasets: [
				{
					label: `Duração Média`,
					data: dados.map((dado) => converterDuracaoParaMinutos(dado.media_duracao)),
					fill: false,
					borderColor: documentStyle.getPropertyValue(`--blue-500`),
					tension: 0.4
				},
			]
		}

		const options2 = {
			maintainAspectRatio: false,
			aspectRatio: 0.6,
			plugins: {
				legend: {
					labels: {
						color: textColor
					}
				}
			},
			scales: {
				x: {
					ticks: {
						color: textColorSecondary
					},
					grid: {
						color: surfaceBorder
					},
					title: {display: true, text: `Profissionais`}
				},
				y: {
					ticks: {
						color: textColorSecondary
					},
					grid: {
						color: surfaceBorder
					},
					title: {display: true, text: `Minutos`}

				}
			}
		}

		setChartData2(data2)
		setChartOptions2(options2)
	}, [dados])

	return (
		<Dialog
			onHide={onClose}
			header='Análise de Dados'
			visible={visible}
			style={{width: `90vw`, padding: `0`}}
			pt={{
				content: {className: `p-0`}
			}}
		>
			<div className="bg-gray-100 flex flex-column align-items-center justify-content-center">
				<Chart
					className="bg-gray-100 p-5 w-full h-30rem flex justify-content-center"
					type="bar"
					data={chartData}
					options={chartOptions}
				/>
				<Chart className={chartLineStyle} type="line" data={chartData2} options={chartOptions2}/>

			</div>
		</Dialog>
	)
}
