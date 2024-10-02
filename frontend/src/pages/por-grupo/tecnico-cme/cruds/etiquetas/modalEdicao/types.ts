import { DataEtiqueta } from "@/infra/integrations/processo/types-etiquetas"

export interface ModalEdicaoProps {
    visibleEdicao: boolean
    onClose: () => void
    etiquetaEdicao: any
    setEtiquetaEdicao: React.Dispatch<React.SetStateAction<DataEtiqueta | undefined>>
}
