import {styleMessageChart} from '@/util/styles'
import {Message} from 'primereact/message'
import {Button} from 'primereact/button'
import { useGraficoGeral } from './useGraficoGeral'
import { styleActionHeader } from '@/components/RowTemplate'
import { useCallback } from 'react'
import { messagesColors } from '@/util/styles/graficos'
import { grafico, graficoMessege } from './styles'

export function GraficoGeral(props: any) {
	const {data, setVisibleRelatorioProdutividade, turno, loading, setVisibleFiltros} = props

	const dados = data?.data?.por_cliente?.reduce((acc: any, dado: any) => {
		if (dado?.qtd_recebimento !== 0 && dado?.qtd_distribuicao !== 0) {
			if(turno == `diurno`) {
				if (dado?.diurno?.qtd_recebimento !== 0 && dado?.diurno?.qtd_distribuicao !== 0) {
					acc.push(
						{
							...dado?.diurno,
							...dado?.cliente
						}
					)
				}
			} else if (turno == `noturno`) {
				if (dado?.noturno?.qtd_recebimento !== 0 && dado?.noturno?.qtd_distribuicao !== 0) {
					acc.push({
						...dado?.noturno,
						...dado?.cliente
					})
				}
			} else {
				acc.push({
					...dado,
					...dado?.cliente
				})
			}
		}
		return acc
	}, [])
	const {
		chartRef
	} = useGraficoGeral({...props, dados})

	const {
		divVerde, bordaVerde,
		divVermelho, bordaVermelho,
		divAzul, bordaAzul
	} = messagesColors()


	const totalPorTurno = useCallback(() => {
		if(turno == `diurno`) {
			return data?.data?.total?.diurno
		} else if(turno == `noturno`) {
			return data?.data?.total?.noturno

		} else {
			return data?.data?.total
		}
	}, [turno, data])

	const exibirDadosOuMessagem = useCallback(() => {
		if(loading) {
			return <h2 className='text-gray-800'>Carregando...</h2>
		} else {
			if(dados?.length > 0) {
				return (
					<div style={{height: `36rem`}}>
						<canvas ref={chartRef} className='h-full' />
					</div>
				)
			} else {
				return <h2 className='text-gray-800'>Não há dados!</h2>
			}
		}
	}, [dados, chartRef, loading])


	return (
		<div>
			<div className='flex gap-3 w-full '>
				<Button
					icon="pi pi-search"
					className="bg-teal-500 ml-auto"
					label="Filtros"
					onClick={() => setVisibleFiltros(true)} />
				<Button
					label='Visualizar em tabela'
					onClick={() => setVisibleRelatorioProdutividade(true)}
					className={styleActionHeader(`blue`, `600`, `800`)}
				/>

			</div>
			<div className="flex flex-col justify-content-center ">
				<div className={grafico}>
					<Message
						style={styleMessageChart(divVerde, bordaVerde)}
						className={graficoMessege}
						severity="info"
						content={`Recebimentos: ${totalPorTurno()?.recebimento ?? `0`}`}
					/>
					<Message
						style={styleMessageChart(divVermelho, bordaVermelho)}
						className={graficoMessege}
						severity="info"
						content={`Distribuições: ${totalPorTurno()?.distribuicao ?? `0`}`}
					/>
					<Message
						style={styleMessageChart(divAzul, bordaAzul)}
						className={graficoMessege}
						severity="info"
						content={`Aproveitamento: ${totalPorTurno()?.aproveitamento ?? `0`}%`}
					/>
				</div>
			</div>
			<div className="flex flex-column align-items-center gap-3">

				{exibirDadosOuMessagem()}
			</div>
		</div>
	)
}
