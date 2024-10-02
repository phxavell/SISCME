import { ContainerFlexColumnDiv, titleStyle } from "@/util/styles"
import { Button } from "primereact/button"
import { ModalSetor } from "./ModalSetor"
import { useSetor } from "./useSetor.ts"
import { ModalSetorVisualizacao } from "@pages/por-grupo/administrativo/especificoes/setor/ModalSetorVisualizacao/intex.tsx"
import { ModalEdicaoSetor } from "@pages/por-grupo/administrativo/especificoes/setor/ModalEdicaoSetor/ModalEdicaoSetor.tsx"
import { buttonPlus } from "@/util/styles/buttonAction.ts"
import { TabelaSetor } from "@pages/por-grupo/administrativo/especificoes/setor/TableSetor/TabelaSetor.tsx"
import { ModalDeleteSetor } from "./ModalDelete/ModalDeleteSetor.tsx"

export type SetorProps = {
    id: number;
    descricao: string;
    criado_por: {
        id: number;
        username: string;
        nome: string;
    };
    criado_em: string;
    atualizado_em: string;
    atualizado_por: {
        id: number;
        username: string;
        nome: string;
    };
};

export const Setor = () => {
	const {
		closeModalCreate,
		openModalCreate,
		visibleModalCreate,
	} = useSetor()

	return (
		<div className={ContainerFlexColumnDiv}>
			<h1 className={titleStyle}>Setores</h1>
			<Button
				onClick={() => openModalCreate()}
				icon={buttonPlus.icon}
				className={`${buttonPlus.color} mb-2 ml-auto`}
				label="Novo Setor"
				data-testid="botao-novo-setor"
			/>
			<TabelaSetor/>
			<ModalDeleteSetor titulo="Confirmar"/>
			<ModalSetor
				visible={visibleModalCreate}
				onClose={closeModalCreate}
			/>
			<ModalSetorVisualizacao	/>
			<ModalEdicaoSetor />
		</div>
	)
}
