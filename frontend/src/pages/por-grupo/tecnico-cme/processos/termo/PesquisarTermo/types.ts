enum StatusTermo {
    Inicio = `TERMO_INICIO`,
    Fim = `TERMO_FIM`,
    Abortado = `ABORTADO`
}

export const unfinishedTermos: string[] = [
	StatusTermo.Inicio, StatusTermo.Abortado
]
