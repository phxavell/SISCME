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
	const {data, setVisibleRelatorioEficiencia, setVisibleFiltros} = props

	const dadosGrafico = data?.data?.por_equipamento?.reduce((acc: any, dado: any) => {
		if (dado?.ciclos_em_andamento !== 0 || dado?.ciclos_finalizados !== 0 || dado?.ciclos_abortados) {
			acc.push(dado)
		}
		return acc
	}, [])
	const {
		chartRef
	} = useGraficoGeral({...props, dadosGrafico})

	const {
		divVerde, bordaVerde,
		divVermelho, bordaVermelho,
		divAzulEsverdeado, bordaAzulEsverdeado,
		divAzul, bordaAzul,
		divAmarelo, bordaAmarelo,
		divRoxo, bordaRoxo
	} = messagesColors()

	const dados = data?.data

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

	const exibirDadosOuMessagem = useCallback(() => {
		if(dados?.por_equipamento?.length > 0) {
			return (
				<div style={{height: `32rem`}}>
					<canvas ref={chartRef} className='h-full w-full' />
				</div>
			)
		} else {
			return <h2 className='text-gray-800'>Não há dados!</h2>
		}

	}, [dados, chartRef])

	return (
		<div>
			<div className='flex gap-2'>
				<Button
					icon="pi pi-search"
					className="bg-teal-500 ml-auto"
					label="Filtros"
					onClick={() => setVisibleFiltros(true)}
				/>
				<Button
					label='Visualizar em tabela'
					onClick={() => setVisibleRelatorioEficiencia(true)}
					className={styleActionHeader(`blue`, `600`, `800`)}
				/>

			</div>
			<div className="flex flex-col justify-content-center">

				<div className="flex flex-col gap-5 ">
					<div>
						<div className={grafico}>
							<Message
								style={styleMessageChart(divVerde, bordaVerde)}
								className={graficoMessege}
								severity="info"
								content={`Total de Ciclos: ${dados?.total?.ciclos ?? `0`}`}
							/>
							<Message
								style={styleMessageChart(divAzulEsverdeado, bordaAzulEsverdeado)}
								className={graficoMessege}
								severity="info"
								content={`Ciclos em Andamento: ${dados?.total?.ciclos_em_andamento ?? `0`}`}
							/>
							<Message
								style={styleMessageChart(divAzul, bordaAzul)}
								className={graficoMessege}
								severity="info"
								content={`Ciclos Finalizados: ${dados?.total?.ciclos_finalizados ?? `0`}`}
							/>
							<Message
								style={styleMessageChart(divVermelho, bordaVermelho)}
								className={graficoMessege}
								severity="info"
								content={`Ciclos Abortados: ${dados?.total?.ciclos_abortados ?? `0`}`}
							/>
							<Message
								style={styleMessageChart(divAmarelo, bordaAmarelo)}
								className={graficoMessege}
								severity="info"
								content={`Aproveitamento: ${dados?.total?.aproveitamento ?? `0`}%`}
							/>
						</div>
						<div className={stylesDivMessages}>
							<Message
								style={styleMessageChart(divRoxo, bordaRoxo)}
								className={graficoMessege}
								severity="info"
								content={`Tempo Funcionando: ${tempoTotalFormatado(dados?.total?.tempo_total) ?? `0`}s`}
							/>
							<Message
								style={styleMessageChart(divVermelho, bordaVermelho)}
								className={graficoMessege}
								severity="info"
								content={`Tempo Parado: ${tempoTotalFormatado(dados?.total?.tempo_parado_total) ?? `0`}s`}
							/>

						</div>

					</div>
				</div>
			</div>
			<div className="flex flex-column align-items-center gap-3">

				{exibirDadosOuMessagem()}
			</div>
		</div>
	)
}
