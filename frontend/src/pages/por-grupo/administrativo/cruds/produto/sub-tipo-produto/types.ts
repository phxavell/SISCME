export interface SubTipoProdutoProps {
    id: number,
    descricao: string,
    situacao: boolean
}
export interface ModalSubTipoProdutoProps {
    modalTipoVisible: boolean
    onClose: () => void,
    onRetornoData?: (data: any) => void
    titulo: string,
    onPut?: (newData: { id: number, valor: string }) => void
}
