import {Dialog} from "primereact/dialog"
import React, {useMemo} from "react"
import {ModalEditDescricaoProps} from "@pages/por-grupo/enfermagem/plantao/ModalPlantao/ModalEditDescricao.tsx"

export function ModalDescricao({onClose, visible, plantao}: ModalEditDescricaoProps) {
	const descricaoAberturaFormatada = plantao?.descricaoaberto.split(`\r\n`).map((paragrafo, index) => (
		<div key={index}>
			{paragrafo.split(`\n`).map((linha, idx) => (
				<div key={idx}>
					{linha}
					<br/>
				</div>
			))}
		</div>
	))

	const descricaoFechamentoFormatada = plantao?.descricaofechamento ? plantao?.descricaofechamento.split(`\r\n`).map((paragrafo, index) => (
		<div key={index}>
			{paragrafo.split(`\n`).map((linha, idx) => (
				<div key={idx}>
					{linha}
					<br/>
				</div>
			))}
		</div>
	)) : ``

	const titleDescricaoFechamento = useMemo(() => {
		if (plantao?.descricaofechamento) {
			return (
				<>
					<hr/>
					<h3>DESCRIÇÃO DO FECHAMENTO</h3>
					<div>{descricaoFechamentoFormatada}</div>
				</>
			)
		}
	}, [plantao, descricaoFechamentoFormatada])
	return (
		<Dialog
			header='Plantão'
			onHide={() => onClose(false)}
			visible={visible}
			style={{width: `80vw`}}
		>
			<h3 className="mt-0">DESCRIÇÃO DE ABERTURA</h3>
			<div>{descricaoAberturaFormatada}</div>
			{titleDescricaoFechamento}

		</Dialog>
	)
}
