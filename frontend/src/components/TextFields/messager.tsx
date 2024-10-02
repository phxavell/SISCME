import moment from "moment"
import { useMemo } from "react"

export const messageTemplate = (title: string, label: string | undefined) => {
	return (
		<div>
			<h4 className="p-0 m-0">{title}</h4>
			<p className="p-0 m-0">{label !== `` ? label : `Não informado!`}</p>
		</div>
	)
}


export const filenamePdf = (nomeArquivo?: string) => {
	const filename = `${nomeArquivo ?? `pdf`}_${moment().format(`YYYY-MM-DD_HH:mm`)}`

	return filename
}


export const footerPdfProducao = (dadosView: any) => {

	const footer = useMemo(() => {
		const quantidadeTotal = dadosView?.caixa?.itens.length ?? 0
		return `Total de  ${quantidadeTotal} itens.`
	}, [dadosView])


	return footer
}
