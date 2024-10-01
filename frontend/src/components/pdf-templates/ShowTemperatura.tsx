import {Text, View} from "@react-pdf/renderer"
import {styles} from "@/components/pdf-templates/styles.ts"
import React from "react"

export const ShowTemperatura = (temperatura: any, minutes: number) => {
	if (temperatura) {
		return (
			<View style={[styles.row]}>
				<Text style={styles.headerTitleEtiquetaSize}>TEMP.:</Text>
				<Text
					style={[
						styles.headerLabelEtiqueta,
						{flexWrap: `wrap`},
					]}
				>
					{temperatura ??``} / {minutes??``}min
				</Text>
			</View>
		)
	} else {
		return <></>
	}
}
