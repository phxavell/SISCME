import {ColumnBodyOptions} from "primereact/column"
import React from "react"
import DateTimeFormatter from "@/components/table-templates/formatters/DateTimeFormatter.tsx"
import {findValueForTable} from "@/components/table-templates/helper.ts"

const DatetimeTemplate = (
	data: any,
	optionsTable: ColumnBodyOptions,
) => {
	const value = findValueForTable(data, optionsTable)
	return <DateTimeFormatter date={value}/>
}

export default DatetimeTemplate
