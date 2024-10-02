import {Image, Text, View} from "@react-pdf/renderer"
import {styles} from "@/components/pdf-templates/styles.ts"
import React, {useCallback} from "react"
import {useAuth} from "@/provider/Auth"

export const CabecalhoIcones = (title: string) => {
	const {getHeaderImgs} = useAuth()
	const {prefixo, sufixo} = getHeaderImgs()
	const showPrefixos = useCallback(() => {
		return prefixo?.map((img) => (
			<Image
				key={img.id}
				style={styles.logo}
				src={img.src}
			/>
		))
	}, [prefixo])
	const showSufix = useCallback(() => {
		return sufixo?.map((img) => (
			<Image
				key={img.id}
				style={styles.logo}
				src={img.src}
			/>
		))
	}, [sufixo])
	return (
		<View style={styles.container}>
			<View>
				{showPrefixos()}
			</View>
			<Text style={styles.name16}>
				{title ?? ``}
			</Text>
			<View>
				{showSufix()}
			</View>
		</View>
	)
}
