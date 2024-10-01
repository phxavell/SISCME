import React from "react"
import {ModalSubmitSchemaType} from "@pages/por-grupo/tecnico-cme/processos/producao/schema.ts"

import {CaixaPreaparoPros} from "@infra/integrations/processo/producao.ts"
import {IPreparoToPDF} from "@/components/pdf-templates/types"
import {TcloseDialog} from "@pages/por-grupo/tecnico-cme/processos/recebimento/types.ts"

export interface InputModalSubmitCaixaProps {
    handleInput: (prop: ModalSubmitSchemaType) => Promise<void>
    modalOpen: boolean
}


export interface IModalPreparoProps {
    closeDialog: TcloseDialog,
    conteudo: any,
    openDialog: boolean
    setCaixaToPDF: (pdfPreparo: IPreparoToPDF | undefined ) => void
}

export namespace ModalProducaoConferencia {
    export type THeader = React.FC<{
        conteudo: any
        openDialog: boolean
        hadleSubmitInput: any
        itensCaixaChecada: any[]
    }>
    export type ModalPreparoType = React.FC<IModalPreparoProps>
}

export interface IModalProducaoToPDF {
    setShowModal: any
    showModal: boolean
    caixaToPDF: any
    // setCaixaToPDF: any
}
export interface IModalPreparoEtiquetaToPDF {
    setShowModal: any
    showModal: boolean
    preparoEtiquetaToPDF: any
}

export enum enumFocus {
    Ciclo,
    Serial

}
