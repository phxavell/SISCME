import moment from "moment"
import { Dialog } from "primereact/dialog"
import { Timeline } from "primereact/timeline"
import { TimelineEvent } from "@/pages/por-grupo/cliente/criar-solicitacao/modal-visualizar/useModalVisualizar"

export function ModalHistorico({data, visible, onClose}: any) {
	const formatDate = `DD/MM/YYYY HH:mm`

	const timeline = data?.reduce((acc: any, dado: any) => {
		let novoObjeto
		if (dado?.status === `Recebido`) {
			novoObjeto = {
				date: moment(dado?.criado_em).format(formatDate),
				status: `Recebido por ${dado?.usuario?.nome}`,
				icon: `pi pi-check-circle`,
				color: `green`
			}
		} else if (dado?.status === `Em termodesinfecção`) {
			novoObjeto = {
				date: moment(dado?.criado_em).format(formatDate),
				status: `Início do ciclo termodesinfecção feito por ${dado?.usuario?.nome}`,
				icon: `pi pi-sign-in`,
				color: `blue`
			}
		} else if (dado?.status === `Termodesinfecção concluída`) {
			novoObjeto = {
				date: moment(dado?.criado_em).format(formatDate),
				status: `Fim do ciclo termodesinfecção feito por ${dado?.usuario?.nome}`,
				icon: `pi pi-sign-out`,
				color: `purple`
			}
		} else if (dado?.status === `Embalado`) {
			novoObjeto = {
				date: moment(dado?.criado_em).format(formatDate),
				status: `Preparo e embalagem feito por ${dado?.usuario?.nome}`,
				icon: `pi pi-box`,
				color: `#456532`
			}
		} else if (dado?.status === `Em esterilização`) {
			novoObjeto = {
				date: moment(dado?.criado_em).format(formatDate),
				status: `Início do ciclo esterilização feito por ${dado?.usuario?.nome}`,
				icon: `pi pi-sign-in`,
				color: `blue`
			}
		} else if (dado?.status === `Esterilização concluída`) {
			novoObjeto = {
				date: moment(dado?.criado_em).format(formatDate),
				status: `Fim do ciclo esterilização feito por ${dado?.usuario?.nome}`,
				icon: `pi pi-sign-out`,
				color: `purple`
			}
		} else if (dado?.status === `Distribuído`) {
			novoObjeto = {
				date: moment(dado?.criado_em).format(formatDate),
				status: `Distribuido por ${dado?.usuario?.nome}`,
				icon: `pi pi-truck`,
				color: `#0b6366`
			}
		}  else if (dado?.status === `Abortado`) {
			novoObjeto = {
				date: moment(dado?.criado_em).format(formatDate),
				status: `Abortado por ${dado?.usuario?.nome}`,
				icon: `pi pi-times-circle`,
				color: `red`
			}
		}

		if (novoObjeto) {
			acc.push({
				...novoObjeto,
				cliente: dado?.nomecliente
			})
		}

		return acc
	}, [])

	const CustomizedMarker = (item: TimelineEvent) => {
		const style = `
        text-white
        border-circle
		border-2
		border-gray-100
        `
		return (
			<div
				className={style}
				style={{backgroundColor: item.color}}>
				<i style={{height: `15px`}} className={`${item.icon} iconI`}></i>
			</div>
		)
	}

	const CustomizedContent = (item: TimelineEvent) => {
		return (
			<div className="flex flex-column align-items-center justify-content-center mt-1 gray-900 mb-5 border-bottom-1 border-gray-600 pb-3">
				<div>
					{item?.status}
				</div>
				<div>
					Em {item?.date}
				</div>
			</div>
		)
	}

	const events = timeline.reverse()
	return (
		<Dialog
			onHide={() => onClose()}
			visible={visible}
			style={{
				minWidth: `50vw`,
			}}
			dismissableMask={true}
			header={data[0]?.nomecliente}
			closeOnEscape={true}
			draggable={false}
			resizable={false}
		>
			<div className="w-full">
				<Timeline
					value={events}
					className="text-white"
					content={CustomizedContent}
					marker={CustomizedMarker}
				/>
			</div>

		</Dialog>
	)
}
