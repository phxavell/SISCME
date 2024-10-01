import moment from 'moment'
export interface TimelineEvent {
    status: string
    date: string
    icon: string
    color: string
}
interface Historico {
    situacao: string
    data_atualizacao: string
}
enum CoresEstados {
    Atual = `#bdd517`,
    NaoChegou = `#004877`,
    JaPassou = `#17d520`
}
export enum StatusEvent {
    Pendente = `Pendente`,
    Transporte = `Transporte`,
    EmTransporte = `Em Transporte`,
    Processando = `Processando`,
    Entregue = `Entregue`,
}
enum IconEvent {
    IconPiInBox = `pi pi-inbox`,
    IconPiCar = `pi pi-car`,
    IconPiCog = `pi pi-cog`,
    IconPiCheck = `pi pi-check`
}
export function useModalVisualizar() {
	const events: TimelineEvent[] = [
		{
			status: StatusEvent.Pendente,
			date: ``,
			icon: IconEvent.IconPiInBox,
			color: CoresEstados.NaoChegou,
		},
		{
			status: StatusEvent.Transporte,
			date: ``,
			icon: IconEvent.IconPiCar,
			color: CoresEstados.NaoChegou
		},
		{
			status: StatusEvent.Processando,
			date: ``,
			icon: IconEvent.IconPiCog,
			color: CoresEstados.NaoChegou,
		},

		{
			status: StatusEvent.Transporte,
			date: ``,
			icon: IconEvent.IconPiCar,
			color: CoresEstados.NaoChegou
		},
		{
			status: StatusEvent.Entregue,
			date: ``,
			icon: IconEvent.IconPiCheck,
			color: CoresEstados.NaoChegou
		}
	]
	const mapStatusHistorico = (historioDatas: string[]) => {
		return function (statusObj: TimelineEvent, index: number) {
			if (index < historioDatas.length) {
				const newDate = historioDatas[index]
				const ehAtual = index === historioDatas.length - 1
				let updateCor = ehAtual ? CoresEstados.Atual : CoresEstados.JaPassou
				if (index === 4) updateCor = CoresEstados.JaPassou
				return {
					...statusObj,
					color: updateCor,
					date: newDate
				}
			}
			return statusObj
		}
	}
	const historioDatas = (historicos: Historico[]) => {

		if (Array.isArray(historicos)) {
			return historicos !== undefined ? historicos.filter((historico) => historico.situacao !== `PRONTO`)
				.map((historico) => {
					const dataFormated = moment(historico.data_atualizacao).format(`MM/DD/YYYY HH:mm`)
					return dataFormated
				}) : []
		} else return []

	}

	const eventsAtualizados = (historicos: Historico[]) => {
		return events.map(mapStatusHistorico(historioDatas(historicos)))
	}
	return {
		eventsAtualizados,
	}
}
