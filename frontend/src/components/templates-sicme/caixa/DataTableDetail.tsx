import React from "react"
import {DataTable} from "primereact/datatable"
import {rowClassName} from "@/components/RowTemplate.tsx"

import {heigthTableDetail, styleTableDetail} from "@/components/templates-sicme/caixa/style.ts"

interface ITableDetail {
    children: any
    itens: any[],
    footer: string
}

export const DataTableDetail: React.FC<ITableDetail> = (props) => {
	const {itens, footer, children} = props
	return (
		<div className={`col-12 p-0 m-0 flex`}>
			<DataTable
				scrollHeight={heigthTableDetail}
				style={styleTableDetail}
				className={`w-full`}
				dataKey="item.id"
				value={itens}
				paginator
				rows={5}
				scrollable={false}
				rowHover
				stripedRows
				emptyMessage="Buscando..."
				rowClassName={rowClassName}
				footer={footer}
				paginatorClassName={`p-0 mt-0`}
				tableClassName={`p-0`}
			>
				{children}
			</DataTable>
		</div>
	)
}
