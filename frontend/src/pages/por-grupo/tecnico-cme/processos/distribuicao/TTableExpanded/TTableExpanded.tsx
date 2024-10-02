import React, {useCallback, useEffect, useMemo, useState} from "react"
import {useAuth} from "@/provider/Auth"
import {useDebounce} from "primereact/hooks"
import {DistribuicaoAPI} from "@infra/integrations/processo/distribuicao/distribuicao.ts"
import {InputText} from "primereact/inputtext"
import {Button} from "primereact/button"
import {DataTable} from "primereact/datatable"
import {rowClassName} from "@/components/RowTemplate.tsx"
import {Column} from "primereact/column"
import {headerTableStyle} from "@/util/styles"
import {PaginatorAndFooter} from "@/components/table-templates/Paginator/PaginatorAndFooter.tsx"
import {
	styleBtnDetail,
	styleBtnFilter,
	styleBtnSelected,
	styleRowDetail,
	styleShowTables,
	styleTablesDiv,
	styleTTableDiv
} from "@pages/por-grupo/tecnico-cme/processos/distribuicao/TTableExpanded/style-TTableExpanded.ts"
import {
	CaixaComSerialDistribuicao,
	debounceTime,
	TipoVisualizacao
} from "@pages/por-grupo/tecnico-cme/processos/distribuicao/TTableExpanded/types-TTableExpanded.ts"

const TModelo = (onRowClick:any, paramsDistribuicao:any)=> (data: CaixaComSerialDistribuicao) => {
	return (
		<div className={styleRowDetail}>
			<Button
				icon="pi pi-search"
				rounded
				severity="success"
				text
				className={styleBtnDetail}
				size={`small`}
				onClick={() => {
					if (onRowClick) {
						onRowClick({
							cliente: paramsDistribuicao.cliente_id ?? paramsDistribuicao.cliente,
							modelo: data.modelo
						})
					}
				}}
			/>
			{data.modelo}

		</div>
	)
}
export const TTableExpanded: React.FC<{
    expandedRows: any,
    cliente_id: any
}> = (props) => {
	const {expandedRows, cliente_id} = props

	const [seriasDoCliente, setSeriaisDoCliente] = useState<any>(undefined)
	const [modelosDoCliente, setModelosDoCliente] = useState<any>(undefined)
	const {user} = useAuth()
	const [paginaAtual, setPaginaAtual] = useState(0)
	const [paginaAtualModelos, setPaginaAtualModelos] = useState(0)
	const [search, searchDebounce, setSearch] = useDebounce(``, debounceTime)
	const [loadingTable, setLoadingTable] = useState(true)
	const [loadingTableModelos, setLoadingTableModelos] = useState(true)

	const handleModeloClick = useCallback((params:{
                                   cliente: number,
                                   modelo: string
                               })=>{
		setSearch(params.modelo)
		setPaginaAtual(0)
		setPaginaAtualModelos(0)
	},[setSearch])

	const onPageChangeTable = (event: { first: number }) => {
		setPaginaAtual(event.first)
	}
	const onPageModeloChange = (event: { first: number }) => {
		setPaginaAtualModelos(event.first)
	}

	const paramsDistribuicao = useMemo(() => {
		const params: any = {
			page: paginaAtual + 1,
			cliente_id: cliente_id
		}
		if (searchDebounce?.length) {
			params.search = searchDebounce
		}
		return params
	}, [paginaAtual, cliente_id, searchDebounce])

	const paramsPorModelo = useMemo(() => {
		const params: any = {
			page: paginaAtualModelos + 1,
			cliente: cliente_id
		}
		if (searchDebounce?.length) {
			params.search = searchDebounce
		}
		return params
	}, [paginaAtualModelos, cliente_id, searchDebounce])
	useEffect(() => {
		if (expandedRows[paramsDistribuicao?.cliente_id]) {
			setLoadingTable(true)
			DistribuicaoAPI.seriaisEmEstoque(user, paramsDistribuicao).then(data => {
				setSeriaisDoCliente({...data})
				setLoadingTable(false)
			}).catch(() => {
				setLoadingTable(false)
			})
		}
	}, [user, expandedRows, paramsDistribuicao])
	useEffect(() => {
		if (expandedRows[paramsPorModelo?.cliente]) {
			setLoadingTableModelos(true)
			DistribuicaoAPI.listarPorModelo(user, paramsPorModelo).then(data => {
				setModelosDoCliente(data)
				setLoadingTableModelos(false)
			}).catch(() => {
				setLoadingTableModelos(false)
			})
		}
	}, [user, expandedRows, paramsPorModelo])

	const [tipoDeVisualizacao, setTipoVisualizacao] = useState(TipoVisualizacao.Modelo)
	const tipoVisualizacao = useCallback((tipo:TipoVisualizacao)=> {
		if(tipoDeVisualizacao===tipo){
			return {
				className: styleBtnSelected +` bg-green-500`,
			}
		}
		return {
			className: styleBtnSelected +`  bg-green-700 `,
		}
	}, [tipoDeVisualizacao])


	const showTableSequencias = useCallback(()=> {
		return (
			<div className={`flex w-full flex-column`}>
				<DataTable
					value={seriasDoCliente?.data ?? []}
					dataKey={`serial`}
					rowClassName={rowClassName}
					scrollHeight="300px"
					stripedRows
					rowHover
					loading={loadingTable}
					style={{height: 300}}
					emptyMessage='Nenhum resultado encontrado'

				>
					<Column
						field="serial"
						header="Serial"
						style={{ width: `20%` }}
						headerStyle={headerTableStyle}
					/>
					<Column
						field="nome"
						header="Descrição"
						style={{ width: `40%` }}
						headerStyle={headerTableStyle}
					/>
					<Column
						field="modelo"
						header="Modelo"
						headerStyle={headerTableStyle}
						body={TModelo(handleModeloClick, paramsDistribuicao)}
					/>
					<Column
						field="produzido_em"
						header="Produzido em"
						headerStyle={headerTableStyle}

					/>
				</DataTable>
				<PaginatorAndFooter
					first={paginaAtual}
					onPageChange={onPageChangeTable}
					meta={seriasDoCliente?.meta}/>
			</div>

		)
	}, [
		seriasDoCliente,
		loadingTable,
		handleModeloClick,
		paramsDistribuicao,
		paginaAtual
	])
	const showTableModelos = useCallback(()=> {
		return (
			<div className={`flex w-full flex-column`}>
				<DataTable
					value={modelosDoCliente?.data ?? []}
					dataKey={`modelo`}
					rowClassName={rowClassName}
					scrollHeight="300px"
					stripedRows
					rowHover
					loading={loadingTableModelos}
					style={{height: 300}}
					emptyMessage='Nenhum resultado encontrado'
				>

					<Column
						field="nome"
						header="Descrição"
						headerStyle={headerTableStyle}
						style={{ width: `40%` }}
					/>
					<Column
						field="modelo"
						header="Modelo"
						headerStyle={headerTableStyle}
						body={TModelo(handleModeloClick, paramsPorModelo)}
					/>
					<Column
						field="estoque"
						header="Em estoque"
						headerStyle={headerTableStyle}
					/>
				</DataTable>
				<PaginatorAndFooter
					first={paginaAtualModelos}
					onPageChange={onPageModeloChange}
					meta={modelosDoCliente?.meta}/>
			</div>

		)
	}, [
		modelosDoCliente,
		modelosDoCliente,
		loadingTableModelos,
		handleModeloClick,
		paramsPorModelo,
		paginaAtualModelos
	])


	const showTables = useCallback(()=> {
		if(tipoDeVisualizacao=== TipoVisualizacao.Modelo){
			return showTableModelos()
		}
		if(tipoDeVisualizacao=== TipoVisualizacao.Sequenciais){
			return showTableSequencias()
		}
		return (
			<div className={styleShowTables}>
				{showTableModelos()}
				{showTableSequencias()}
			</div>

		)
	}, [showTableModelos, showTableSequencias, tipoDeVisualizacao])

	return (
		<div
			className="p-3"
			style={styleTTableDiv}
		>
			<div className={styleTablesDiv}>
				<h4 className={`p-0 m-0`}>Caixas em Estoque</h4>
				<Button
					icon="pi pi-tags"
					rounded
					size={`small`}
					className={tipoVisualizacao(TipoVisualizacao.Modelo).className}
					label={`Modelo`}
					onClick={() => {
						setTipoVisualizacao(TipoVisualizacao.Modelo)
					}}
				/>
				<Button
					icon="pi pi-tag"
					rounded
					size={`small`}
					label={`Serial`}
					className={tipoVisualizacao(TipoVisualizacao.Sequenciais).className}
					onClick={() => {
						setTipoVisualizacao(TipoVisualizacao.Sequenciais)
					}}
				/>
				<Button
					icon="pi pi-th-large"
					rounded
					size={`small`}
					label={`Ambos`}
					className={tipoVisualizacao(TipoVisualizacao.Ambos).className}
					onClick={() => {
						setTipoVisualizacao(TipoVisualizacao.Ambos)
					}}
				/>
				<div className=" ml-auto flex gap-2">

					<InputText
						id={`search`}
						placeholder="Pesquisar por descrição, serial ou modelo"
						value={search}
						onChange={(e) => {
							setPaginaAtual(0)
							setSearch(e.target.value)
						}}
						className={styleBtnFilter}/>

					<Button
						icon="pi pi-times"
						className="p-button-raised"
						onClick={() => {
							setPaginaAtual(0)
							setSearch(``)
						}}
					/>
				</div>
			</div>
			{showTables()}

		</div>
	)
}
