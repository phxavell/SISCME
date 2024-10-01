import {
	SterilizationRequestsType
} from "@pages/por-grupo/cliente/criar-solicitacao/modal-create-sterilization/schemas.ts"
import React from "react"
import {BoxWithProducts} from "@infra/integrations/processo/recebimento/types-recebimento.ts"

export interface InputCaixaProps {
    handleInput: (prop: SterilizationRequestsType) => Promise<void>
    ItensCaixaChecada?: any,
    showModal: boolean,
    focusAtual: string
    modalIndicador?:any
}

export type TcloseDialog = (close: any) => void
export interface IModalProps {
    closeDialog: TcloseDialog,
    conteudo: BoxWithProducts | undefined,
    openDialog: boolean
    alertReduced?: boolean
}
export interface PropsOcorrencia {
    closeDialog: TcloseDialog,
    conteudo: any | undefined,
    openDialog: boolean
}

export namespace ModalN {


    export type ModalRecebimentoType = React.FC<IModalProps>
    export type TPropsOcorrencia = React.FC<PropsOcorrencia>
    export type THeaderOcorrencia = (conteudoPrevio: any, submitHandle: (close: any) => Promise<void>) => React.FC
    export type THeaderOcorrenciaFechar = (submitHandle: (close: any) => Promise<void>) => React.FC
}

export interface IModalToPDF {
    setShowModal: any
    showModal: boolean
    caixaToPDF: any
    setCaixaToPDF: any
}
