import moment from "moment"
import {Text, View} from "@react-pdf/renderer"
import {styles} from "@/components/pdf-templates/styles.ts"
import React from "react"

export const RodapeTemplate = () => {
	const date: string = moment(new Date()).format(`DD/MM/YYYY`)
	const time = moment(new Date()).format(`HH:mm`)
	return (
		<View
			fixed
			style={[styles.row,
				styles.pageNumber,
				{
					alignItems: `baseline`,
					justifyContent: `space-between`
				}
			]}>
			<Text style={styles.rodapeText}>
				{`Impressão:  ${date}   Hora: ${time}`}
			</Text>
			<Text style={styles.rodapeText}
				render={({pageNumber, totalPages}) => {
					return `Página ${pageNumber} de ${totalPages}`
				}}
			/>
		</View>
	)
}
