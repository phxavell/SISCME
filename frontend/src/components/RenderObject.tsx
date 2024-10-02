import { Tag } from 'primereact/tag'
import React from 'react'

type IRenderObject = {
    data: any
    keyObject: string
}
const RenderObject = (props: IRenderObject) => {
	const { data, keyObject } = props

	let value = data && keyObject && data[keyObject]

	const keys = keyObject.length ? keyObject.split(`.`) : null

	if (keys && keys?.length > 1) {
		value = keys.reduce((dataValueCurrent, keyCurrent) => {
			if (dataValueCurrent) {
				return dataValueCurrent[keyCurrent]
			}
		}, data)
	}

	if (typeof value === `object` && value !== null) {
		const objStr = JSON.stringify(value).toString()
		return (
			<Tag
				className="p-0"
				icon="pi pi-info-circle"
				severity="info"
				value={objStr} />
		)
	}
	const valorNaoConsitente = value === null || value === undefined || value.length === 0

	if (valorNaoConsitente) {
		return (
			<Tag
				className="p-0 px-2 my-1"
				icon="pi pi-exclamation-triangle"
				severity="warning"
				value="Não informado." />
		)
	}

	return (
		<div>
			{value}
		</div>
	)
}

export default RenderObject
