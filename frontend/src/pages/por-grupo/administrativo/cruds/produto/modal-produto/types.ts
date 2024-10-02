import { ProdutoProps } from "@/infra/integrations/produto"

export interface ModalProdutoProps {
    visible: boolean
    onClose: (prop: boolean) => void
    produto: any
    setProduto: React.Dispatch<React.SetStateAction<ProdutoProps | undefined>>
    formOptions?: any
}
