import { useMemo } from "react"

export const footerTemplate = ({ dadosView}: { dadosView: any}) => {
	const footer = useMemo(() => {
		const quantidadeTotal = dadosView?.data?.itens.length ?? 0
		return `Total de  ${quantidadeTotal} itens.`
	}, [dadosView])

	return footer
}
