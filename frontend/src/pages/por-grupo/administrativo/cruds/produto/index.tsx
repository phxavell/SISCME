import {ModalProduto} from './modal-produto'
import {DataTable} from 'primereact/datatable'
import {Column} from 'primereact/column'
import {ContainerFlexColumnDiv, headerTableStyle, titleStyle} from '@/util/styles'
import {useProduto} from './useProduto.ts'
import {Button} from 'primereact/button'
import {ProdutoProps} from '@infra/integrations/produto.ts'
import {ModalConfirmDelete} from './ModalConfirmDelete.tsx'
import {useState} from 'react'
import {rowClassName, styleActionHeader, styleActionTable} from '@/components/RowTemplate.tsx'
import {styleLinhaMinimaTabela2} from '@pages/por-grupo/administrativo/cruds/caixa/styles-caixa.ts'
import {InputText} from 'primereact/inputtext'
import {Dropdown} from 'primereact/dropdown'
import {
	ModalVisualizarProduto
} from '@pages/por-grupo/administrativo/cruds/produto/modal-produto/ModalVisualizarProduto.tsx'
import {Image} from 'primereact/image'
import {useProdutoFormOptions} from './useProdutoForm.ts'
import {PaginatorAndFooter} from "@/components/table-templates/Paginator/PaginatorAndFooter.tsx"
import {
	styleInputIsolado,
	styleInputsFilter,
	styleToolbarTable
} from "@pages/por-grupo/administrativo/cruds/styles-crud.ts"

export const Product = () => {
	const [produtoEdit, setProdutoEdit] = useState<ProdutoProps>()

	const {
		produtos,
		onPageChange,
		first, setFirst,
		visible,
		setVisible,
		loading,
		setId,
		visibleDelete,
		setVisibleDelete,
		handleDeletar,
		handleBuscarProdutos,
		refreshTable,
		descricao, setDescricao,
		embalagem, setEmbalagem,
		tipoProduto, setTipoProduto,
		subTipoProduto, setSubTipoProduto,
		visibleModalVisualizar, setVisibleModalVisualizar
	} = useProduto()

	const styleFilter = `
		text-left
		md:w-7
		lg:w-9
		flex
		align-items-top
		w-6
		mr-2
	`

	const {formOptions, formOptionsData} = useProdutoFormOptions()

	const [produto, setProduto] = useState<any>()

	const bodyFotoTemplate = ({foto}: ProdutoProps) => {
		if (foto) {
			return (
				<Image
					src={`${foto}`}
					alt="foto"
					width="64px"
					className="shadow-4"
					preview/>
			)
		} else {
			return <div/>
		}
	}
	const ExcluirProduto = (id: number | undefined) => {
		if (id) {
			setId(id)
			setVisibleDelete(true)
		}
	}

	const visualizarProduto = (data: any) => {
		setProduto(data)
		setVisibleModalVisualizar(true)
	}

	const handleConfirmarDelecao = () => {
		handleDeletar().then(async () => {
			handleBuscarProdutos()
			setVisibleDelete(false)
		})
	}
	const handleReshTableFormOptions = (success: boolean) => {
		refreshTable(success)
		formOptionsData()
	}
	const editProduct = (produto: ProdutoProps) => {
		setProdutoEdit(produto)
		setVisible(true)
	}

	const AcoesEditDelete = (produto: ProdutoProps) => {
		return (
			<div className='flex gap-2 h-2rem'>
				<Button
					icon="pi pi-eye"
					outlined
					className={styleActionTable(`green`, 600)}
					onClick={() => visualizarProduto(produto)}
				/>
				<Button
					icon="pi pi-pencil"
					outlined
					className={styleActionTable(`blue`, 500)}
					onClick={() => editProduct(produto)}
				/>
				<Button
					icon="pi pi-trash"
					outlined
					className={styleActionTable(`red`, 700)}
					onClick={() => ExcluirProduto(produto.id)}
				/>
			</div>
		)
	}

	const resetFilter = () => {
		handleBuscarProdutos()
		setDescricao(``)
		setEmbalagem(``)
		setTipoProduto(``)
		setSubTipoProduto(``)
	}

	return (
		<div className={ContainerFlexColumnDiv}>
			<h1 className={titleStyle}>Produtos</h1>
			<div className={styleToolbarTable}>
				<div className={styleFilter}>
					<div className={styleInputsFilter}>
						<InputText
							className={styleInputIsolado}
							placeholder="Descrição"
							value={descricao}
							onChange={(e) => {
								setDescricao(e.target.value)
								setFirst(0)
							}}
						/>
						<Dropdown
							className={styleInputIsolado}
							placeholder="Embalagem"
							value={embalagem}
							options={formOptions?.embalagens}
							optionLabel='valor'
							optionValue='valor'
							onChange={(e) => {
								setEmbalagem(e.value)
								setFirst(0)
							}}
						/>
						<Dropdown
							placeholder="Tipo"
							value={tipoProduto}
							className={styleInputIsolado}
							options={formOptions?.tipos}
							optionLabel='descricao'
							optionValue='descricao'
							onChange={(e) => {
								setTipoProduto(e.value)
								setFirst(0)
							}}
						/>
						<Dropdown
							className={styleInputIsolado}
							placeholder="Subtipo"
							value={subTipoProduto}
							options={formOptions?.subtipos}
							optionLabel='descricao'
							optionValue='descricao'
							onChange={(e) => {
								setSubTipoProduto(e.value)
								setFirst(0)
							}}
						/>
						<Button
							className={styleActionHeader(`gray`, `700`, `500`) + ` h-3rem`}
							icon="pi pi-times"
							tooltip="Limpar pesquisa"
							onClick={resetFilter}
						/>
					</div>

				</div>
				<Button
					onClick={() => setVisible(true)}
					className="w-2 h-3rem hover:bg-blue-300 p-0"
					label="Novo Produto"
				/>
			</div>
			<DataTable
				value={produtos?.data ??[]}
				loading={loading}
				scrollable
				className="w-full text-sm"
				stripedRows
				rowHover
				rowClassName={rowClassName}
				emptyMessage="Nenhum produto cadastrado"
				dataKey={`id`}
				scrollHeight="500px"
				style={{ height: 500}}
				paginatorClassName={`p-0 mt-0`}
				tableClassName={`p-0`}
				paginator={false}
			>
				<Column
					headerStyle={{
						...headerTableStyle,
						padding: `8px`
					}}
					className={styleLinhaMinimaTabela2}
					field="id"
					header="#"
				/>
				<Column
					headerStyle={headerTableStyle}
					className={styleLinhaMinimaTabela2}
					field="descricao"
					header="Descrição"
				/>
				<Column
					headerStyle={headerTableStyle}
					className={styleLinhaMinimaTabela2}
					field="embalagem"
					header="Embalagem"
				/>
				<Column
					headerStyle={headerTableStyle}
					className={styleLinhaMinimaTabela2}
					field="idtipopacote.descricao"
					header="Tipo"
				/>
				<Column
					headerStyle={headerTableStyle}
					className={styleLinhaMinimaTabela2}
					field="idsubtipoproduto.descricao"
					header="Subtipo"
				/>
				<Column
					headerStyle={headerTableStyle}
					className={styleLinhaMinimaTabela2}
					header="Foto"
					body={bodyFotoTemplate}
				/>
				<Column
					headerStyle={headerTableStyle}
					className={styleLinhaMinimaTabela2}
					header="Ações"
					body={AcoesEditDelete}
				/>
			</DataTable>
			<PaginatorAndFooter
				first={first}
				onPageChange={onPageChange}
				meta={produtos?.meta}
			/>
			<ModalProduto
				visible={visible}
				onClose={handleReshTableFormOptions}
				produto={produtoEdit}
				setProduto={setProdutoEdit}
			/>
			<ModalVisualizarProduto
				visible={visibleModalVisualizar}
				onClose={() => setVisibleModalVisualizar(false)}
				produto={produto}
			/>
			<ModalConfirmDelete
				modalTipoVisible={visibleDelete}
				titulo="Confirmar"
				onClose={() => setVisibleDelete(false)}
				onConfirm={handleConfirmarDelecao}
			/>
		</div>
	)
}
