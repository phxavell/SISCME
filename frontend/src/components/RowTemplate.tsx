export const rowClassName = () => {
	return `hover:bg-cyan-700 hover:font-bold hover:text-white`
}
// @ts-ignore
export const rowClassName2 = (data, op) => {

	if(op.props.tabIndex %2===1){
		return `CustomHeader2 hover:bg-cyan-700 hover:font-bold hover:text-white`
	}
	return `CustomHeader3 hover:bg-cyan-700 hover:font-bold hover:text-white`

}
//TODO renomear esse cara para refletir ação de controlar cor de botões;
export const styleActionHeader = (color: string, tomAtivo: string, tomHover: string) => {
	return `${color}
    bg-${color}-${tomAtivo}
    border-none
    hover:bg-${color}-${tomHover}
    `
}

export const styleActionTable = (color: string, tomAtivo: number) => {
	return `
    bg-${color}-${tomAtivo}
    border-none
    hover:bg-${color}-${tomAtivo-200}
    text-gray-200
    `
}
