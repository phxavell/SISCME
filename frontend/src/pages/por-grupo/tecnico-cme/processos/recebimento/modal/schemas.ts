import React from "react"

export type THeaderConferenciaRecebimento = React.FC<{
    conteudo: any | undefined
    openDialog: boolean
    hadleSubmitInput: any
    itensCaixaChecada: any[]
    focusAtual: string
    indicadores?: any
    indicador?: any
    setIndicador?: any
    isProducao?: any
}>
