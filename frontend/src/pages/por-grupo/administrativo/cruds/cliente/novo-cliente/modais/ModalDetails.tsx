import { ClientAPI } from "@/infra/integrations/client"
import { useAuth } from "@/provider/Auth"
import { styleMessage } from "@/util/styles"
import moment from "moment"
import {Dialog} from "primereact/dialog"
import {Message} from "primereact/message"
import { ProgressSpinner } from "primereact/progressspinner"
import { useCallback, useEffect, useState } from "react"

const messageTemplate = (title: string, label: string | undefined) => {
	const exibirLabel = () => {
		if (label == `` || label == null) {
			return `Não informado!`
		} else {
			return label
		}
	}

	return (
		<div>
			<h4 className="p-0 m-0">{title}</h4>
			<p className="p-0 m-0">{exibirLabel()}</p>
		</div>
	)
}
const dataFormated = (cliente: any) => {
	if (cliente?.datacadastrocli) {
		return moment(cliente?.datacadastrocli).format(`DD/MM/YYYY`)
	}
}


export const ModalDetailsCliente = ({visible, onClose, idCliente}: any) => {
	const [options, setOptions] = useState<any>()
	const [cliente, setCliente] = useState<any>()
	const {user, toastError} = useAuth()
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		if(idCliente && visible) {
			ClientAPI.optionsCliente(user).then(data => {
				setOptions(data)
			})

		} else {
			return () => {}
		}
	}, [idCliente, user, toastError, visible])

	useEffect(() => {
		if(idCliente && visible) {
			ClientAPI.buscarClientePorId(user, idCliente).then((data)=> {
				setCliente(data)
				setLoading(false)
			}).catch((e) => {
				toastError(e)
				setLoading(false)
			})

		} else {
			return () => {}
		}
	}, [idCliente, user, toastError, visible])

	const exibirComponente = useCallback(() => {
		if(loading) {
			return (
				<div className="w-full flex justify-content-center">
					<ProgressSpinner />

				</div>
			)
		} else {
			return (
				<div className="flex justify-content-between align-items-center">
					<div className="grid mt-5 gap-5 justify-content-between">
						<Message
							style={styleMessage}
							className="border-primary h-4rem"
							severity="info"
							content={() => messageTemplate(options?.nomecli?.label, cliente?.nomecli)}
						/>
						<Message
							style={styleMessage}
							className="border-primary h-4rem"
							severity="info"
							content={() => messageTemplate(options?.cnpjcli?.label, cliente?.cnpjcli)}
						/>
						<Message
							style={styleMessage}
							className="border-primary h-4rem"
							severity="info"
							content={() => messageTemplate(options?.nomeabreviado?.label, cliente?.nomeabreviado)}
						/>
						<Message
							style={styleMessage}
							className="border-primary h-4rem"
							severity="info"
							content={() => messageTemplate(options?.nomefantasiacli?.label, cliente?.nomefantasiacli)}
						/>
						<Message
							style={styleMessage}
							className="border-primary h-4rem"
							severity="info"
							content={() => messageTemplate(options?.ruacli?.label, cliente?.ruacli)}
						/>
						<Message
							style={styleMessage}
							className="border-primary h-4rem"
							severity="info"
							content={() => messageTemplate(options?.numerocli?.label, cliente?.numerocli)}
						/>
						<Message
							style={styleMessage}
							className="border-primary h-4rem"
							severity="info"
							content={() => messageTemplate(options?.bairrocli?.label, cliente?.bairrocli)}
						/>
						<Message
							style={styleMessage}
							className="border-primary h-4rem"
							severity="info"
							content={() => messageTemplate(options?.cepcli?.label, cliente?.cepcli)}
						/>
						<Message
							style={styleMessage}
							className="border-primary h-4rem"
							severity="info"
							content={() => messageTemplate(options?.cidadecli?.label, cliente?.cidadecli)}
						/>
						<Message
							style={styleMessage}
							className="border-primary h-4rem"
							severity="info"
							content={() => messageTemplate(options?.ufcli?.label, cliente?.ufcli)}
						/>
						<Message
							style={styleMessage}
							className="border-primary h-4rem"
							severity="info"
							content={() => messageTemplate(options?.inscricaoestadualcli?.label, cliente?.inscricaoestadualcli)}
						/>
						<Message
							style={styleMessage}
							className="border-primary h-4rem"
							severity="info"
							content={() => messageTemplate(options?.inscricaomunicipalcli?.label, cliente?.inscricaomunicipalcli)}
						/>

						<Message
							style={styleMessage}
							className="border-primary h-4rem"
							severity="info"
							content={() => messageTemplate(options?.telefonecli?.label, cliente?.telefonecli)}
						/>
						<Message
							style={styleMessage}
							className="border-primary h-4rem"
							severity="info"
							content={() => messageTemplate(`Dt. Cadastro`, dataFormated(cliente))}
						/>
						<Message
							style={styleMessage}
							className="border-primary h-4rem"
							severity="info"
							content={() => messageTemplate(options?.emailcli?.label, cliente?.emailcli)}
						/>
					</div>
				</div>
			)
		}
	}, [options, cliente, loading])

	return (
		<Dialog
			onHide={onClose}
			dismissableMask={true}
			closeOnEscape={true}
			visible={visible}
			draggable={false}
			resizable={false}
			header='Detalhes'
			style={{width: `70vw`}}
		>
			{exibirComponente()}

		</Dialog>
	)
}
