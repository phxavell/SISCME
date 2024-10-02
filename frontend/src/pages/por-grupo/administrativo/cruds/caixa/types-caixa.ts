export namespace NModalTipoCaixa {
    export interface IProps {
        onClose: (id: number) => void,
        visible: boolean
    }
}

export interface IModalSerial {
    setShowModal: any
    showModal: boolean
    data: any
    setConteudoParaPdf: any
}

export namespace NModalEmbalagem {
    export interface IProps {
        onClose: (id: number) => void,
        visible: boolean
    }
}

export interface ModalDetailsProps {
    visible: boolean
    onClose: () => void
    caixa: any
    onDelete: (caixa: any) => void
    onEdit: (caixa: any) => void
    seriais: any
    setConteudoParaPdf: any
}
