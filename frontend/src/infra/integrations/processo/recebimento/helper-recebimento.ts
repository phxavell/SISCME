// @ts-ignore
export const makeBodyPreRecebimentoPost = (caixaPura, itensVerificados) => {
	const formData = new FormData()
	// @ts-ignore
	const caixa_completa_ = itensVerificados.findIndex(check => !check.check) === -1
	const produtos = itensVerificados
	formData.append(`caixa_completa`, JSON.stringify(caixa_completa_))
	formData.append(`produtos`, JSON.stringify(produtos))
	formData.append(`serial`, JSON.stringify(caixaPura.serial))
	if (caixaPura.files) {
		caixaPura.files.forEach((foto: any, index: any) => {
			formData.append(`foto${index + 1}`, foto)
		})
	}

	return formData as any

}
export const sortAlfabetico = (caixaA: any, caixaB: any) => {
	return caixaA?.produto?.localeCompare(caixaB?.produto)
}
