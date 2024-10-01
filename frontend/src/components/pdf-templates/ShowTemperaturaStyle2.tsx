import {styles} from "@/components/pdf-templates/styles.ts"
import {Text, View} from "@react-pdf/renderer"
import React from "react"
import {Style} from "@react-pdf/types/style"

export const ShowTemperaturaStyle2 = (temperatura: any, minutes: number) => {
	const rowBaseline = [styles.row, { alignItems: `baseline` }] as Style[]
	if (temperatura) {
		const {headerTitleEtiquetaTripla, headerLabelEtiqueta} = styles
		return (
			<View style={rowBaseline}>
				<Text style={headerTitleEtiquetaTripla}>TEMP.:</Text>
				<Text style={headerLabelEtiqueta}>
					{temperatura ?? ``} / {minutes?? ``}min
				</Text>
			</View>
		)
	} else {
		return <></>
	}
}
