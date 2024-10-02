import React from 'react'
import {ColumnBodyOptions} from 'primereact/column'
import RenderObject from '@/components/RenderObject.tsx'

const TableColumn = (
	data: any,
	optionsTable: ColumnBodyOptions,
) => {
	return( <RenderObject data={data} keyObject={optionsTable.field}></RenderObject>)
}
export default TableColumn
