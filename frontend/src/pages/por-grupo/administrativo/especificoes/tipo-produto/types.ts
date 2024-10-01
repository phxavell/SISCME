import {TipoProdutoProps} from "@infra/integrations/administrativo/tipo-produto-modal/types.ts"

export interface ModalEdicaoTipoProdutoProps {
    visible: boolean
    onClose: (prop: boolean) => void
    tipoProdutoData: TipoProdutoProps
}

export interface EditarTipoProdutoProps {
    id: number,
    descricao: string,
}

export interface ModalPropsTipoProduto {
    visible: boolean
    onClose: (prop: boolean) => void
    tipoProdutoData: TipoProdutoProps
}
