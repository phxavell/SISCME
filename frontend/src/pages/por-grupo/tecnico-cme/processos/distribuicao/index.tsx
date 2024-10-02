import {DataTable} from 'primereact/datatable'
import {Column} from "primereact/column"
import {useDistribuicao} from "./useDistribuicao"
import {ContainerFlexColumnDiv, headerTableStyle, headerTableStyleError, titleStyle} from '@/util/styles'
import {Button} from 'primereact/button'
import {
	RealizarDistribuicaoModal
} from '@pages/por-grupo/tecnico-cme/processos/distribuicao/modais/RealizarDistribuicaoModal.tsx'
import {useHome} from '@/pages/general/Home/useHome'
import {RoutersPathName} from '@/routes/schemas'
import {rowClassName, rowClassName2} from "@/components/RowTemplate.tsx"
import {ModalSequenciais} from '@pages/por-grupo/tecnico-cme/processos/distribuicao/modais/ModalSequenciais'
import {styleToolbarTable} from "@pages/por-grupo/administrativo/cruds/styles-crud.ts"
import TableColumn from "@/components/table-templates/TableColumn.tsx"
import {Badge} from "primereact/badge"
import {OverlayPanel} from "primereact/overlaypanel"
import React, {useCallback} from "react"
import {TTableExpanded} from "@pages/por-grupo/tecnico-cme/processos/distribuicao/TTableExpanded/TTableExpanded.tsx"
import {DropdownSearch} from "@/components/DropdownSeach/DropdownSearch.tsx"
import {PaginatorAndFooter} from "@/components/table-templates/Paginator/PaginatorAndFooter.tsx"
import {EstoqueDistribuicao} from "@infra/integrations/processo/distribuicao/types-distribuicao.ts"


const classesFooter = `
w-full
flex
justify-content-end
py-2
px-4
mb-2
bg-green-400
text-white
`

const templateClientes = (handleButtonDistribuir: any) => (data: EstoqueDistribuicao) => {
	return (
		<div className="flex justify-content-between align-items-center">

			<Button
				label="Iniciar distribuição"
				icon="pi pi-box"
				onClick={() => {
					if (handleButtonDistribuir) {
						handleButtonDistribuir(data)
					}

				}}
				className=" ml-auto bg-green-600 border-green-600 hover:bg-green-700"
			/>
		</div>
	)
}
export const Distribuicao = () => {
	const {goRouter} = useHome(0)
	const {
		visible,
		setVisible,
		expandedRows,
		setExpandedRows,
		resetFilter,
		clienteSelecionado, setClienteSelecionado,
		sequenciais,
		visibleModalSequenciais, setVisibleModalSequenciais,
		estoques,
		handleButtonDistribuir,
		op,
		caixasCriticasToShow, setCaixasCriticasToShow,
		allowExpansion,
		control,
		formState: {errors},
		reset,
		loadingOption,
		clientes,
		onFilterItens,
		paginaAtualClientes,
		onPageChange,
		buscarEstoque,
		setPaginaAtualClientes,
		loadingEstoqueGeral
	} = useDistribuicao()

	const rowExpansionTemplate = useCallback((data: any, op: any) => {
		return (
			<TTableExpanded
				expandedRows={expandedRows}
				cliente_id={data.cliente_id}
			/>
		)
	}, [expandedRows])

	const TEstoqueCritico = (data: any) => {
		const totalCritico = data?.estoque?.total_critico ?? 0
		if (totalCritico === 0) {
			return (
				<Badge
					value="0"
					severity="success"
					size="large"
				/>
			)
		}
		return (
			<div>
				<Badge
					value={totalCritico}
					severity="danger"
					size="large"
					onClick={(e) => {
						setCaixasCriticasToShow(data?.estoque?.caixas_criticas)
						op?.current?.toggle(e)
					}}
				/>
			</div>
		)
	}

	return (
		<div className={ContainerFlexColumnDiv}>
			<h1 className={titleStyle}>Distribuição</h1>
			<div className={styleToolbarTable}>

				<div className={`flex gap-1 w-full`}>
					<div className={`w-10rem  h-3rem `}>
						<DropdownSearch
							label="Clientes"
							keyItem="clientes"
							control={control}
							errors={errors}
							filter
							showAdd={false}
							loadingOptions={loadingOption}
							listOptions={clientes}
							optionsObject={{
								optionValue: `idcli`,
								optionLabel: `nome`
							}}
							onFilter={onFilterItens}
							multiple
						/>

					</div>
					<Button
						className="hover:bg-blue-600 h-3rem "
						icon="pi pi-times"
						onClick={() => {
							reset()
						}}
					/>

					<Button
						className="hover:bg-blue-600 h-3rem ml-auto"
						icon="pi pi-clock"
						label="Histórico"
						onClick={() => {
							goRouter(RoutersPathName.PesquisarDistribuicao)
						}}
					/>
				</div>

			</div>
			<DataTable
				expandedRows={expandedRows}
				onRowToggle={(e) => {
					setExpandedRows(e.data)
				}}
				rowExpansionTemplate={rowExpansionTemplate}
				value={estoques?.data ?? []}
				loading={loadingEstoqueGeral}
				scrollHeight="600px"
				stripedRows
				rowHover
				style={{height: 600}}
				className="w-full"
				emptyMessage="Nenhum resultado encontrado"
				dataKey={`cliente_id`}
				rowClassName={rowClassName2}
				size={`small`}
			>
				<Column
					expander={allowExpansion}
					style={{width: `4rem`}}
					headerStyle={headerTableStyle}
				/>
				<Column
					header="Cliente"
					field={`nome`}
					headerStyle={headerTableStyle}
				/>
				<Column
					header="Total disponível"
					field={`estoque.total_disponivel`}
					headerStyle={headerTableStyle}
					body={TableColumn}
				/>
				<Column
					header="Estoque crítico"
					field={`estoque.total_critico`}
					headerStyle={headerTableStyle}
					className={`cursor-pointer`}
					body={TEstoqueCritico}
				/>
				<Column
					headerStyle={headerTableStyle}
					body={templateClientes(handleButtonDistribuir)}
				/>
			</DataTable>
			<PaginatorAndFooter
				classesFooterCustom={classesFooter}
				first={paginaAtualClientes}
				onPageChange={onPageChange}
				loading={loadingEstoqueGeral}
				meta={estoques?.meta}/>

			<OverlayPanel ref={op} showCloseIcon>
				<div>

					<DataTable
						value={caixasCriticasToShow}
						rows={5}
						paginator
						stripedRows
						dataKey={`serial`}
						rowHover
						rowClassName={rowClassName}
					>

						<Column
							headerStyle={headerTableStyleError}
							header="Serial"
							field={`serial`}/>

						<Column
							headerStyle={headerTableStyleError}
							header="Dias parado"
							field={`dias_parados`}/>
						<Column
							headerStyle={headerTableStyleError}
							header="Produzido em"
							field={`produzido_em`}/>

					</DataTable>
					<h4 className={`p-0 m-0`}>
                        Caixas acima de 5 dias em estoque
					</h4>

				</div>

			</OverlayPanel>

			<RealizarDistribuicaoModal
				visible={visible}
				onClose={(close?: boolean) => {
					if (close) {
						setPaginaAtualClientes(0)
						buscarEstoque()
					}
					setVisible(false)
					setClienteSelecionado(undefined)
					const ss = expandedRows
					setExpandedRows({})
					setTimeout(() => {
						setExpandedRows(ss)
					}, 10)
				}}
				clienteSelecionado={clienteSelecionado}
			/>
			<ModalSequenciais
				onClose={() => setVisibleModalSequenciais(false)}
				visible={visibleModalSequenciais}
				sequenciais={sequenciais}
			/>
		</div>
	)
}
