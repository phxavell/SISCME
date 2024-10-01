import {ColumnBodyOptions} from 'primereact/column'
import React from 'react'
import moment from "moment/moment"
import {findValueForTable} from "@/components/table-templates/helper.ts"

export const TimeOnly = (
	data: any,
	optionsTable: ColumnBodyOptions,
) => {
	const value = findValueForTable(data, optionsTable)

	if (value) {

		const dataFormated = moment(value, `HH:mm:ss.SSSSSS`)
			.format(`HH:mm`)
		return (
			<div className="flex flex-column">
				{dataFormated}
			</div>
		)
	} else {
		return (
			<div className="flex flex-column">
                --:--
			</div>
		)
	}
}
