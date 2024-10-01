import React from "react"
import {Message} from "primereact/message"
import {
	efeitoIn,
	efeitoOut,
	styleMessageHeader
} from "@pages/por-grupo/tecnico-cme/processos/recebimento/modal/styles.ts"

export const HeaderShowMessage: React.FC<{
    itensCaixaChecada: any[]
}> = (props) => {
	const {itensCaixaChecada} = props
	let countNConforme = 0
	if (Array.isArray(itensCaixaChecada)) {
		countNConforme = itensCaixaChecada.filter((item: any) => !item.check).length
	}

	if (countNConforme !== 0) {
		let msgCount = `Há ${countNConforme} item não conforme`
		if (countNConforme > 1) {
			msgCount = `Há ${countNConforme} itens não conformes`
		}
		return (
			<Message
				severity="error"
				style={{
					borderLeft: `solid #ff6969`,
					borderWidth: `0 0 0 6px`,
				}}
				icon={`pi pi-exclamation-triangle`}
				className={styleMessageHeader + efeitoIn}
				text={msgCount}/>
		)
	}

	return (
		<Message
			severity="success"
			style={{
				borderLeft: `solid rgb(4 184 71 / 82%)`,
				borderWidth: `0 0 0 6px`,
			}}
			className={styleMessageHeader + efeitoOut}
			text={`Todos os itens estão conforme`}/>
	)
}
