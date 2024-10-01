import { SetorProps } from "@pages/por-grupo/administrativo/especificoes/setor"
import { Button } from "primereact/button"
import {
	buttonEdit,
	buttonEye,
	buttonTrash,
} from "@/util/styles/buttonAction.ts"

import { useSetorStore } from "../store/useSetorState"

export const AcoesSetorTemplate = (data: SetorProps) => {
	const {openModalPreview, openModalEditar, openModalDelete} = useSetorStore(state => {
		return {
			openModalPreview: state.openModalPreview,
			openModalEditar: state.openModalEditar,
			openModalDelete: state.openModalDelete,
		}
	})
    	return (
    		<div className="flex gap-2 h-2rem">
    			<Button
    				icon={buttonEye.icon}
    				className={buttonEye.color}
    				outlined
    				data-testid="botao-visualizar"
    				onClick={() =>	openModalPreview(data)}
    			/>
    			<Button
    				icon={buttonEdit.icon}
    				className={buttonEdit.color}
    				outlined
    				data-testid="botao-editar"
    				onClick={() => openModalEditar(data)}
    			/>
    			<Button
    				icon={buttonTrash.icon}
    				className={buttonTrash.color}
    				outlined
    				data-testid="botao-excluir"
    				onClick={() => openModalDelete(data)}

    			/>
    		</div>
    	)
}
