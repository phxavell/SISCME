export interface TipoProdutoProps {
    id: number,
    descricao: string,
    situacao: boolean
}

export interface ModalTipoProdutoProps {
    modalTipoVisible: boolean
    onClose: () => void,
    titulo: string,
    onRetornoData?: (data: any) => void
    onPut?: (newData: { id: number, valor: string }) => void
}
