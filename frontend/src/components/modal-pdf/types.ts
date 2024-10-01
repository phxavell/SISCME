import * as React from "react"

export interface IModalBaixarPDF {
    closeModal: () => void
    showModal: boolean
    documentoPDF: React.ReactElement<any>
    nomeArquivo?: string
    hiddenButtonDownload?: boolean
}
