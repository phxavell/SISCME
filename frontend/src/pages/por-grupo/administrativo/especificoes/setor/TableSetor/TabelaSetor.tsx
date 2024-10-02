import { rowClassName } from "@/components/RowTemplate.tsx"
import { headerTableStyle } from "@/util/styles"

import { DataTable } from "primereact/datatable"
import { styleLinhaMinimaTabela2 } from "../../../cruds/caixa/styles-caixa.ts"
import { Column } from "primereact/column"
import { PaginatorAndFooter } from "@/components/table-templates/Paginator/PaginatorAndFooter.tsx"
import { useTableEmSetor } from "@pages/por-grupo/administrativo/especificoes/setor/TableSetor/useTableEmSetor.ts"
import { AcoesSetorTemplate } from "@pages/por-grupo/administrativo/especificoes/setor/TableSetor/AcoesSetorTemplate.tsx"

export const TabelaSetor = () => {
	const { isLoading, setores, first, onPageChange } = useTableEmSetor()
	return (
		<>
			<DataTable
				loading={isLoading}
				dataKey="id"
				value={setores?.data?? []}
				className="w-full text-sm"
				scrollable
				scrollHeight="450px"
				stripedRows
				rowClassName={rowClassName}
				rowHover
				emptyMessage="Nenhum resultado encontrado"
			>
				<Column
					header="#"
					field="id"
					headerStyle={headerTableStyle}
					className={`${styleLinhaMinimaTabela2} w-1`}
				/>
				<Column
					header="Descrição"
					field="descricao"
					headerStyle={headerTableStyle}
					className={`${styleLinhaMinimaTabela2}`}
				/>

				<Column
					header="Ações"
					headerStyle={headerTableStyle}
					body={AcoesSetorTemplate}
					className={`${styleLinhaMinimaTabela2} w-14rem`}
				/>
			</DataTable>
			<PaginatorAndFooter
				first={first}
				onPageChange={onPageChange}
				meta={setores?.meta}
			/>

		</>
	)
}
