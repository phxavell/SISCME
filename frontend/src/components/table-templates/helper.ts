import {ColumnBodyOptions} from "primereact/column"

export const findValueForTable = (data: any,
	optionsTable: ColumnBodyOptions) => {
	const keyObject = optionsTable.field
	let value = data && keyObject && data[keyObject]
	const keys = keyObject.length ? keyObject.split(`.`) : null
	if (keys && keys?.length > 1) {
		value = keys.reduce((dataValueCurrent, keyCurrent) => {
			if (dataValueCurrent) {
				return dataValueCurrent[keyCurrent]
			}
			return null
		}, data)
	}
	return value

}
