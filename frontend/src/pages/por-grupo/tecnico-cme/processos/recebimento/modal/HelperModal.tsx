import {styleContent1} from "@pages/por-grupo/administrativo/cruds/caixa/styles-caixa.ts"
import * as React from "react"

export const messageTemplate = (title: string, label: string | number | undefined,) => {
	let labelFinal: string | number | undefined
	switch (title) {
	default:
		labelFinal = label
	}
	return (
		<div className={`w-12`}>
			<h4 className="p-0 m-0">{title}</h4>
			<div className={styleContent1}>{labelFinal}</div>
		</div>
	)
}
