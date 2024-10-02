import {ColumnBodyOptions} from "primereact/column"
import DateFormatter from "@/components/table-templates/formatters/DateFormatter.tsx"
import {findValueForTable} from "@/components/table-templates/helper.ts"

const DateTemplate = (formato: string) => (
	data: any,
	optionsTable: ColumnBodyOptions,
) => {
	const value = findValueForTable(data, optionsTable)
	return DateFormatter(formato)({date: value})
}

export default DateTemplate
