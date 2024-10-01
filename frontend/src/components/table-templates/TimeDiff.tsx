import {ColumnBodyOptions} from 'primereact/column'
import React from 'react'
import {TimeDiffFormatter} from '@/components/table-templates/formatters/TimeDiffFormatter.tsx'

const TimeDiff = (
	data: any,
	optionsTable: ColumnBodyOptions,
) => {
	return <TimeDiffFormatter
		datetime={data[optionsTable.field]} />
}

export default TimeDiff
