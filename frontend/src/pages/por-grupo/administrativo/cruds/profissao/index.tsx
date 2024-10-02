import { ContainerFlexColumnDiv, headerTableStyle, titleStyle } from "@/util/styles"
import { Button } from "primereact/button"
import { Column,} from "primereact/column"
import { DataTable } from "primereact/datatable"
import { ModalProfissao } from "./ModalProfissao"
import { useProfissao } from "./useProfissao"
import { ModalProfissaoVisualizacao } from "./ModalProfissaoVisualizacao/intex.tsx"
import { rowClassName, styleActionTable } from "@/components/RowTemplate"
import { styleLinhaMinimaTabela2 } from "../caixa/styles-caixa.ts"
import { ModalEdicaoProfissao } from "./ModalEdicaoProfissao/ModalEdicaoProfissoa"
import {ModalConfirmDelete} from "@pages/por-grupo/administrativo/cruds/produto/ModalConfirmDelete.tsx"
import {PaginatorAndFooter} from "@/components/table-templates/Paginator/PaginatorAndFooter.tsx"
import { buttonEdit, buttonEye, buttonPlus, buttonTrash } from "@/util/styles/buttonAction.ts"

export type ProfissaoProps = {
    id: number,
    descricao: string,
    criado_por: {
        id: number,
        username: string,
        nome: string,
    }
    criado_em: string,
    atualizado_em: string,
    atualizado_por: {
        id: number,
        username: string,
        nome: string,
    }
}

export function Profissao() {

	const {
		loading,
		profissoes,
		first,
		onPageChange,
		deleteProfissao,
		handleConfirmardelecao,
		visibleModalDelete,
		closeModalDelete,
		closeModalCreate,
		openModalCreate,
		visibleModalCreate,
		openModalPreview,
		visibleModalPreview,
		closeModalPreview,
		closeModalEditar,
		openModalEditar,
		visibleModalEditar,
		profissao
	} = useProfissao()
	const AcoesTemplate = (data: ProfissaoProps) => {
		return (
			<div className="flex gap-2 h-2rem">
				<Button
					icon={buttonEye.icon}
					className={buttonEye.color}
					data-testid='botao-visualizar-profissao'
					outlined
					onClick={() => { openModalPreview(data) }}
				/>
				<Button
					icon={buttonEdit.icon}
					className={buttonEdit.color}
					outlined
					data-testid='botao-editar-profissao'
					onClick={() => {openModalEditar(data)}}
				/>
				<Button
					icon={buttonTrash.icon}
					className={buttonTrash.color}
					outlined
					data-testid='botao-excluir'
					onClick={() => { deleteProfissao(data.id) }}
				/>

			</div>
		)
	}
	return (
		<div className={ContainerFlexColumnDiv}>
			<h1 className={titleStyle}>Profissões</h1>
			<Button
				onClick={() => openModalCreate()}
				icon={buttonPlus.icon}
				className={`${buttonPlus.color} mb-2 ml-auto`}
				label="Nova Profissão"
				data-testid='botao-nova-profissao'
			/>

			<DataTable
				loading={loading}
				dataKey="id"
				value={profissoes?.data}
				className="w-full text-sm"
				scrollable
				scrollHeight="450px"
				stripedRows
				rowClassName={rowClassName}
				rowHover
				emptyMessage='Nenhum resultado encontrado'
			>
				<Column
					header='#'
					field="id"
					headerStyle={headerTableStyle}
					className={`${styleLinhaMinimaTabela2} w-1`}
				/>
				<Column
					header='Descrição'
					field="descricao"
					headerStyle={headerTableStyle}
					className={styleLinhaMinimaTabela2}
				/>
				<Column
					header="Ações"
					headerStyle={headerTableStyle}
					body={AcoesTemplate}
					className={`${styleLinhaMinimaTabela2} w-14rem`}
				/>
			</DataTable>

			<PaginatorAndFooter
				first={first}
				onPageChange={onPageChange}
				meta={profissoes?.meta}/>

			<ModalConfirmDelete
				modalTipoVisible={visibleModalDelete}
				titulo="Confirmar"
				onClose={() => closeModalDelete()}
				onConfirm={() => handleConfirmardelecao()}
			/>

			<ModalProfissao
				visible={visibleModalCreate}
				onClose={closeModalCreate} />

			<ModalProfissaoVisualizacao
				visible={visibleModalPreview}
				onClose={closeModalPreview}
				profissaoData={profissao} />

			<ModalEdicaoProfissao
				visible={visibleModalEditar}
				onClose={closeModalEditar}
				profissaoData={profissao} />

		</div>
	)
}
