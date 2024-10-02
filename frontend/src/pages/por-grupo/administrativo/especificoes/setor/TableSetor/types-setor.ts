import { SetorProps } from "@pages/por-grupo/administrativo/especificoes/setor"

export interface PropsTabelaSetor {
    openModalPreview: (data: SetorProps) => void;
    openModalEditar: (data: SetorProps) => void;
    deleteSetor: (id: number) => void;
    atualizarTabela: boolean;
}
