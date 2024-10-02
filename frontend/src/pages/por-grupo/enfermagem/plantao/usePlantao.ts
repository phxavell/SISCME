import {PlantaoAPI, PlantaoResponse} from "@/infra/integrations/plantao"
import {useAuth} from "@/provider/Auth"
import moment from "moment"
import {DataTableUnselectEvent} from "primereact/datatable"
import {Nullable} from "primereact/ts-helpers"
import {useEffect, useState} from "react"

export const usePlantao = () => {
	const [visible, setVisible] = useState(false)
	const [visibleModalDescricao, setVisibleModalDescricao] = useState(false)
	const [visibleModalEditDescricao, setVisibleModalEditDescricao] = useState(false)
	const [visibleModalFechamentoDescricao, setVisibleModalFechamentoDescricao] = useState(false)
	const [visibleModalPlantaoPdf, setVisibleModalPlantaoPdf] = useState(false)

	const [loading, setLoading] = useState(true)
	const [first, setFirst] = useState(0)

	const [plantoes, setPlantoes] = useState<PlantaoResponse>()
	const [plantaoDescricao, setPlantaoDescricao] = useState<any>()

	const {user, toastError} = useAuth()

	const [status, setStatus] = useState(``)
	const [profissional, setProfissional] = useState(``)
	const [dateInitial, setDateInitial] = useState<Nullable<Date>>(null)
	const [dateFinal, setDateFinal] = useState<Nullable<Date>>(null)

	useEffect(() => {
		let mounted = true;
		(() => {
			if (user) {
				if (dateInitial || dateFinal || status || profissional) {
					const dateInitialFormatada = dateInitial ? moment(dateInitial).format(`YYYY-MM-DD`) : ``
					const dateFinalFormatada = dateFinal ? moment(dateFinal).format(`YYYY-MM-DD`) : ``
					PlantaoAPI.buscaPlantaoFiltro(user, first + 1, dateInitialFormatada, dateFinalFormatada, status, profissional).then((data) => {
						setPlantoes(data)
						setLoading(false)
					}).catch((e) => {
						toastError(e.data)
						setLoading(false)
					})
				} else {
					PlantaoAPI.getOptions(user, first + 1).then((data) => {
						if (mounted) {
							setPlantoes(data)
							setLoading(false)
						}
					}).catch(() => {
						if (mounted) {
							toastError(`Não foi possível baixar dados`)
							setLoading(false)
						}
					})

				}
			}

		})()
		return () => {
			mounted = false
		}
	}, [user, first, dateFinal, dateInitial, profissional, status, toastError])

	const onPageChange = (event: { first: number }) => {
		setFirst(event.first)
	}

	const onRowSelect = (e: DataTableUnselectEvent) => {
		setVisibleModalDescricao(true)
		setPlantaoDescricao(e.data)
	}

	const refreshTable = (success: boolean) => {
		if (visibleModalEditDescricao) {
			setVisibleModalEditDescricao(false)
		} else if (visibleModalDescricao) {
			setVisibleModalDescricao(false)
		} else if (visible) {
			setVisible(false)
		} else if (visibleModalFechamentoDescricao) {
			setVisibleModalFechamentoDescricao(false)
		} else if (visibleModalPlantaoPdf) {
			setVisibleModalPlantaoPdf(false)
		}

		if (success) {
			setLoading(true)
			PlantaoAPI.getOptions(user, first + 1).then((data) => {
				setPlantoes(data)
				setLoading(false)
			}).catch(() => {
				toastError(`Não foi possível baixar dados!`)
				setLoading(false)
			})
		}
	}

	const filterPlantao = () => {
		const dateInitialFormatada = dateInitial ? moment(dateInitial).format(`YYYY-MM-DD`) : ``
		const dateFinalFormatada = dateFinal ? moment(dateFinal).format(`YYYY-MM-DD`) : ``

		PlantaoAPI.buscaPlantaoFiltro(user, 1, dateInitialFormatada, dateFinalFormatada, status, profissional).then((data) => {
			setPlantoes(data)
			setLoading(false)
		}).catch((e) => {
			toastError(`error`, e.data)
			setLoading(false)
		})
	}

	return {
		visible, setVisible,
		loading, setLoading,
		first, setFirst,
		onPageChange,
		plantoes,
		onRowSelect,
		visibleModalDescricao, setVisibleModalDescricao,
		visibleModalEditDescricao, setVisibleModalEditDescricao,
		plantaoDescricao, setPlantaoDescricao,
		refreshTable,
		visibleModalFechamentoDescricao,
		setVisibleModalFechamentoDescricao,
		filterPlantao,
		dateInitial, setDateInitial,
		dateFinal, setDateFinal,
		status, setStatus,
		profissional, setProfissional,
		visibleModalPlantaoPdf, setVisibleModalPlantaoPdf
	}
}
