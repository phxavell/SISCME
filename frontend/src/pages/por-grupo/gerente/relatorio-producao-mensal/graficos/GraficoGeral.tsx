import {styleMessageChart} from '@/util/styles'
import {Message} from 'primereact/message'
import {Button} from 'primereact/button'
import { useGraficoGeral } from './useGraficoGeral'
import { styleActionHeader } from '@/components/RowTemplate'
import { messagesColors } from '@/util/styles/graficos'
import { useCallback } from 'react'
import { grafico, graficoMessege } from '../../relatorio-processos/graficos/styles'

export function GraficoGeral(props: any) {
	const {data, setVisibleRelatorioProducaoMensal, setVisibleFiltros} = props

	const dados = data?.data?.preparos_por_cliente?.reduce((acc: any, dado: any) => {
		if (dado?.quantidade !== 0) {
			acc.push(dado)
		}
		return acc
	}, [])
	const {
		chartRef
	} = useGraficoGeral({...props, dados})

	const {
		divVerde, bordaVerde,
	} = messagesColors()

	const exibirDadosOuMessagem = useCallback(() => {
		if(dados?.length > 0) {
			return (
				<div style={{height: `36rem`}}>
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
					onClick={() => setVisibleRelatorioProducaoMensal(true)}
					className={styleActionHeader(`blue`, `600`, `800`)}
				/>

			</div>
			<div className="flex flex-col justify-content-center">
				<div className={grafico}>
					<Message
						style={styleMessageChart(divVerde, bordaVerde)}
						className={graficoMessege}
						severity="info"
						content={`Total de Etiquetas Geradas no Preparo: ${data?.data?.total ?? `0`}`}
					/>
				</div>
			</div>
			<div className="flex flex-column align-items-center gap-3">

				{exibirDadosOuMessagem()}
			</div>
		</div>
	)
}
