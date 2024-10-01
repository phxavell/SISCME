import * as React from 'react'
import {Button} from 'primereact/button'
import {DataTable, DataTableRowClickEvent} from 'primereact/datatable'
import {Column} from 'primereact/column'
import {ModalNovoVeiculo} from './ModalNovoVeiculo'
import {rowClassName, styleActionTable} from "@/components/RowTemplate.tsx"
import {useVeiculos} from "@pages/por-grupo/administrativo/cruds/veiculos/useVeiculos.ts"
import {ContainerFlexColumnDiv, headerTableStyle, titleStyle} from "@/util/styles"
import {Image} from "primereact/image"
import {VeiculoAPI} from "@infra/integrations/vehicles.ts"
import {useAuth} from "@/provider/Auth"
import {styleImagemTemplate} from "@pages/por-grupo/administrativo/cruds/caixa/styles-caixa.ts"
import {PaginatorAndFooter} from "@/components/table-templates/Paginator/PaginatorAndFooter.tsx"
import {ModalConfirmDelete} from "@pages/por-grupo/administrativo/cruds/produto/ModalConfirmDelete.tsx"

const PreviewImagemTemplate = (keyImg: string) => (data: any) => {
	if (data[keyImg]) {
		return (
			<div className={styleImagemTemplate}>
				<Image
					src={`${data[keyImg]}`}
					alt="Image de caixa"
					preview
					width="100"
					onClick={e => {
						e.preventDefault()
						e.stopPropagation()
					}}
				/>
			</div>
		)
	}
}

export const Veiculos = () =>  {

	const {
		refreshTable,
		onPageChange,
		veiculos,
		visible, setVisible,
		user,
		first,setShowDetail,
		itemSelecionado, setItemSelecionado,
		visibleModalDelete, setVisibleModalDelete,
		itemParaDeletar, setItemParaDeletar,
		setDeletando,
		prepararParaDeletar,
		handleCloseModal,
		preparaParaEditar,
		loading
	} = useVeiculos()

	const { toastSuccess, toastError } = useAuth()

	const templateActions = (caixa: any) => {
		return (
			<div className="flex gap-2 h-2rem">
				<Button
					outlined
					icon='pi pi-pencil'
					className={styleActionTable(`blue`, 500)}
					onClick={(e) => {
						e.preventDefault()
						e.stopPropagation()
						preparaParaEditar(caixa)
					}}
				/>

				<Button
					outlined
					icon='pi pi-trash'
					data-testid='botao-excluir'
					className={styleActionTable(`red`, 700)}
					onClick={() => {
						prepararParaDeletar(caixa)
					}
					}
				/>
			</div>
		)
	}

	const handleExcluir = (item: any) => {
		setDeletando(true)
		VeiculoAPI
			.excluir(user, item)
			.then(async () => {
				toastSuccess(`Veículo excluído!`)
				refreshTable().then(()=>{
					setItemParaDeletar(undefined)
					setVisibleModalDelete(false)
					setItemSelecionado(false)
					setDeletando(false)
				})
			}).catch((message) => {
				toastError(message)
				setVisibleModalDelete(false)
				setDeletando(false)
			})
	}

	return (
		<div className={ContainerFlexColumnDiv}>
			<h1 className={titleStyle}>Veículos</h1>
			<Button
				onClick={() => setVisible(true)}
				icon={`pi pi-car`}
				iconPos={`right`}
				className=" w-11rem ml-auto my-2 h-3rem"
				label="Novo Veículo"
			/>

			<DataTable
				loading={loading}
				onRowClick={(event: DataTableRowClickEvent) => {
					setItemSelecionado(event?.data)
					setShowDetail(true)
				}}
				emptyMessage="Nenhum veículo cadastrado."
				value={veiculos?.data ?? []}
				rows={10}
				dataKey="id"
				scrollHeight="500px"
				style={{minWidth: `100px`, height: 500}}
				className={`w-full`}
				stripedRows
				rowClassName={rowClassName}
				rowHover
			>
				<Column
					headerStyle={headerTableStyle}
					field="placa"
					header="Placa"
				/>
				<Column
					headerStyle={headerTableStyle}
					field="marca"
					header="Marca"
				/>
				<Column
					headerStyle={headerTableStyle}
					field="modelo"
					header="Modelo"
				/>
				<Column
					headerStyle={headerTableStyle}
					header="Foto"
					body={PreviewImagemTemplate(`foto`)}
				/>
				<Column
					header="Ações"
					headerStyle={headerTableStyle}
					body={templateActions}
				/>
			</DataTable>
			<ModalNovoVeiculo
				visible={visible}
				onClose={handleCloseModal}
				veiculoEditando={itemSelecionado}
			/>
			<PaginatorAndFooter
				first={first}
				onPageChange={onPageChange}
				meta={veiculos?.meta}/>

			<ModalConfirmDelete
				modalTipoVisible={visibleModalDelete}
				titulo="Confirmar"
				onClose={() => setVisibleModalDelete(false)}
				onConfirm={() => handleExcluir(itemParaDeletar)}
			/>
		</div>
	)
}
