import React from 'react'
import moment from 'moment/moment'


type DateFormatterProps = {
    date: string | any,
    label?: `` | string,
    justify?: `start` | string,
    textSize?: `text-xs` | string
}

const DateTimeFormatter = (
	props: DateFormatterProps) => {
	const { date, label, justify, textSize } = props
	const styleDataInfor = `
        flex
        flex-row
        flex-wrap
        ${textSize}
        align-content-${justify}
        justify-content-${justify}
        `

	if (date) {
		const dataFormated = moment(date)
			.format(`DD/MM/YYYY HH:mm`)
		return (
			<div className={styleDataInfor}>
				{dataFormated}
			</div>
		)

	} else {
		return (
			<div className={styleDataInfor}>
				<div className="font-medium mr-2">
					{label}
				</div>
                --/--/----
			</div>
		)
	}
}
export default DateTimeFormatter
