import {EmbalagemObjProps} from "@infra/integrations/administrativo/embalagem/types.ts"

export interface ModalEdicaoEmbalagemProps {
    visible: boolean
    onClose: (prop: boolean) => void
    EmbalagemData: EmbalagemObjProps
}

export interface EditarEmbalagemProps {
    id: number,
    descricao: string,
    valorcaixa: string,
}

export interface ModalEmbalagemProps {
    visible: boolean
    onClose: (prop: boolean) => void
    onRetornoDataSetor?: (data: any) => void
    onAtualizarTable?: (prop: boolean) => void
}

export interface ModalPropsEmbalagem {
    visible: boolean
    onClose: (prop: boolean) => void
    embalagemData: EmbalagemObjProps
}
