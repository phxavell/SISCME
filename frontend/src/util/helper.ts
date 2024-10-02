

export const fotoValidationCleaner = (foto: any) => {
	if (foto.foto[0].files[0] > 0 || foto.foto[0].files[0] !== undefined) {
		return foto.foto[0].files[0]
	} else {
		return ``
	}
}
