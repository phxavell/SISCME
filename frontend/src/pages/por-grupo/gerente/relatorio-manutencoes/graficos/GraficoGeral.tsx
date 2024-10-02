import {styleMessageChart} from '@/util/styles'
import {Message} from 'primereact/message'
import {Button} from 'primereact/button'
import { useGraficoGeral } from './useGraficoGeral'
import { styleActionHeader } from '@/components/RowTemplate'
import { messagesColors } from '@/util/styles/graficos'
import moment from 'moment'
import { useCallback } from 'react'
import { grafico, graficoMessege } from '../../relatorio-processos/graficos/styles'

export function GraficoGeral(props: any) {
	const stylesDivMessages = `flex gap-3 mb-3 justify-content-center`
	const {data, setVisibleRelatorioManutencoes, setVisibleFiltros} = props

	const dadosGrafico = data?.data?.equipamentos?.reduce((acc: any, dado: any) => {
		if (dado?.manutencoes_previstas !== 0 || dado?.manutencoes_realizadas !== 0) {
			acc.push(dado)
		}
		return acc
	}, [])
	const {
		chartRef
	} = useGraficoGeral({...props, dadosGrafico})

	const {
		divVerde, bordaVerde,
		divAzulEsverdeado, bordaAzulEsverdeado,
		divAzul, bordaAzul,
		divRoxo, bordaRoxo,
		divAmarelo, bordaAmarelo,
		divVermelho, bordaVermelho
	} = messagesColors()

	const tempoTotalFormatado = (tempoSegundos: any) => {
		const duration = moment.duration(tempoSegundos, `seconds`)
		const dias = Math.floor(duration.asDays())
		const horas = duration.asHours() % 24
		if (duration.asDays() == 1) {
			return `${dias} dia ${Math.floor(horas).toString().padStart(2, `0`)}:${duration.minutes().toString().padStart(2, `0`)}:${duration.seconds().toString().padStart(2, `0`)}`
		} else if(duration.asDays() > 1) {
			return `${dias} dias ${Math.floor(horas).toString().padStart(2, `0`)}:${duration.minutes().toString().padStart(2, `0`)}:${duration.seconds().toString().padStart(2, `0`)}`
		} else {
			return `${Math.floor(duration.asHours()).toString().padStart(2, `0`)}:${duration.minutes().toString().padStart(2, `0`)}:${duration.seconds().toString().padStart(2, `0`)}`
		}
	}

	const dados = data?.data

	const exibirDadosOuMessagem = useCallback(() => {
		if(dados?.equipamentos?.length > 0) {
			return (
				<div style={{height: `34rem`}}>
					<canvas ref={chartRef} className='h-full w-full' />
				</div>
			)
		} else {
			return <h2 className='text-gray-800'>Não há dados!</h2>
		}
	}, [dados, chartRef])

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
					label='Visualizar em tabela'
					onClick={() => setVisibleRelatorioManutencoes(true)}
					className={styleActionHeader(`blue`, `600`, `800`)}
				/>

			</div>
			<div className="flex flex-col justify-content-center">
				<div className="flex flex-col gap-5">
					<div>
						<div className={grafico}>
							<Message
								style={styleMessageChart(divVerde, bordaVerde)}
								className={graficoMessege}
								severity="info"
								content={`Realizadas: ${dados?.realizadas ?? `0`}`}
							/>
							<Message
								style={styleMessageChart(divAzulEsverdeado, bordaAzulEsverdeado)}
								className={graficoMessege}
								severity="info"
								content={`Em Andamento: ${dados?.em_manutencao ?? `0`}`}
							/>
							<Message
								style={styleMessageChart(divAzul, bordaAzul)}
								className={graficoMessege}
								severity="info"
								content={`Planejadas: ${dados?.previstas ?? `0`}`}
							/>
							<Message
								style={styleMessageChart(divRoxo, bordaRoxo)}
								className={graficoMessege}
								severity="info"
								content={`Tempo Total: ${tempoTotalFormatado(dados?.tempo_total) ?? `0`}s`}
							/>
						</div>
						<div className={stylesDivMessages}>
							<Message
								style={styleMessageChart(divVermelho, bordaVermelho)}
								className={graficoMessege}
								severity="info"
								content={`Manutenções Preventivas: ${dados?.total_por_tipo?.pr ?? `0`}`}
							/>
							<Message
								style={styleMessageChart(divAmarelo, bordaAmarelo)}
								className={graficoMessege}
								severity="info"
								content={`Manutenções Preditivas: ${dados?.total_por_tipo?.pd ?? `0`}`}
							/>
							<Message
								style={styleMessageChart(divAzul, bordaAzul)}
								className={graficoMessege}
								severity="info"
								content={`Manutenções Corretivas: ${dados?.total_por_tipo?.cr ?? `0`}`}
							/>
						</div>

					</div>
				</div>
			</div>
			<div className="flex flex-column align-items-center gap-1">

				{exibirDadosOuMessagem()}
			</div>
		</div>
	)
}
