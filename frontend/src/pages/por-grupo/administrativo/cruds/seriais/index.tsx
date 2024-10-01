import { rowClassName, styleActionHeader } from "@/components/RowTemplate.tsx"
import { ContainerFlexColumnDiv, headerTableStyle, styleColumn, titleStyle } from "@/util/styles"
import { Column } from "primereact/column"
import { DataTable } from "primereact/datatable"
import { useSeriais } from "./useSeriais"
import { InputText } from "primereact/inputtext"
import { Button } from "primereact/button"
import {styleFilter, styleInputsFilter, styleToolbarTable} from "@pages/por-grupo/administrativo/cruds/styles-crud.ts"
import {PaginatorAndFooter} from "@/components/table-templates/Paginator/PaginatorAndFooter.tsx"
import { Link } from "react-router-dom"

export const Seriais = () =>  {
	const {
		seriais,
		serial, setSerial,
		loading, first, setFirst,
		onPageChange,
	} = useSeriais()

	const templateActions = (data: any) => {
		const state = {
			serial: data?.serial
		}
		return (
			<Link type="button"
				to={`/seriais/${data.serial}/historico`}
				state={state}
				className={styleActionHeader(`blue`, `800`, `600`) +
				`p-2 px-3 border-round text-white
				transition-all
				transition-duration-200`}
			>
				<i className="pi pi-search" />
			</Link>

		)
	}

	return (
		<div className={ContainerFlexColumnDiv}>
			<h1 className={titleStyle}>Seriais</h1>
			<div className={styleToolbarTable}>
				<div className={styleFilter}>
					<div className={styleInputsFilter}>
						<InputText
							id="ciclo"
							autoFocus={true}
							placeholder="Serial"
							value={serial}
							onChange={(e) => {setSerial(e.target.value); setFirst(0)}} />
						<Button
							className={styleActionHeader(`gray`, `700`, `500`) + ` h-3rem`}
							icon="pi pi-times"
							tooltip="Limpar pesquisa"
							onClick={() => setSerial(``)}
						/>
					</div>
				</div>
			</div>

			<DataTable
				className="w-full"
				loading={loading}
				scrollHeight="455px"
				rows={5}
				style={{ height: 450 }}
				dataKey="id"
				paginator={false}
				paginatorClassName={`p-0`}
				tableClassName={`p-0`}
				value={seriais?.data}
				emptyMessage='Nenhum resultado encontrado.'
				stripedRows
				rowClassName={rowClassName}
				rowHover
			>
				<Column
					header="Serial"
					headerStyle={headerTableStyle}
					className={styleColumn}
					field="serial"
				/>
				<Column
					header="Descrição"
					headerStyle={headerTableStyle}
					className={styleColumn}
					field="descricao"
				/>
				<Column
					header="Qtd. Itens"
					headerStyle={headerTableStyle}
					className={styleColumn}
					field="quantidade_itens"
				/>
				<Column
					header="Situação Atual"
					headerStyle={headerTableStyle}
					className={styleColumn}
					field="situacao"
				/>
				<Column
					header="Histórico do serial"
					headerStyle={headerTableStyle}
					className={styleColumn}
					body={templateActions}
				/>
			</DataTable>
			<PaginatorAndFooter
				first={first}
				onPageChange={onPageChange}
				meta={seriais?.meta}/>
		</div>
	)
}
