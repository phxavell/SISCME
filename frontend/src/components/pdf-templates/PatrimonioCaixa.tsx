import {Document, Font, Image, Page, Text, View} from '@react-pdf/renderer'
import LatoBold from './fonts/LatoBold.ttf'
import Lato from './fonts/Lato.ttf'
import {styles} from "@/components/pdf-templates/styles.ts"

import {Style} from "@react-pdf/types/style"

const HeaderTemplate = (conteudo: any) => {

	const textNaoSeAplica = `Não informado.`

	let cliente
	let caixa

	if (conteudo) {
		cliente = conteudo?.cliente ?? textNaoSeAplica
		caixa = conteudo?.descricao ?? textNaoSeAplica
	}

	const fontSizeCliente = () => {
		if (cliente.length > 30) {
			return `8px`
		} else {
			return `9px`
		}

	}

	const fontSizeCaixa= () => {
		if (caixa.length > 30) {
			return `7px`
		} else {
			return `8px`
		}

	}


	const style1: Style = {
		display: `flex`,
		flexDirection: `row`,
		alignItems: `baseline`,
		justifyContent: `space-between`,
		//border: '1px solid orange',
		width: `100%`
	}


	return (
		<View style={[styles.column, {
			width: `100%`,
			marginBottom: `3px`
		}]}>
			<View style={[style1,
				{alignItems: `baseline`}
			]}>
				<Text style={{
					color: `black`,
					fontSize: fontSizeCliente(),

					fontFamily: `Lato Bold`,
					fontWeight: `bold`,
					fontStyle: `normal`,
				}}>
					{cliente}
				</Text>

			</View>
			<View style={[style1]}>
				<Text style={{
					color: `black`,
					fontSize: fontSizeCaixa(),
					fontFamily: `Lato`,
					textTransform: `uppercase`,
					fontWeight: `normal`,
					width: `100%`
				}}>
					{caixa}
				</Text>
			</View>

		</View>
	)
}

export const PatrimonioCaixa = (conteudo: any) => {
	Font.register({
		family: `Lato`,
		src: Lato,
	})
	Font.register({
		family: `Lato Bold`,
		src: LatoBold,
	})

	//@ts-ignore
	const barcode = conteudo?.barcodeSrc

	const milimetro = (numero: number) => {
		return numero * 2.83465
	}

	const style1:Style = {
		display: `flex`,
		padding: `4px`,
		flexDirection: `column`,
		justifyContent:`space-between`,
		alignContent: `flex-start`,
		alignItems: `flex-start`,
		backgroundColor: `#ffffff`,
	}

	return (
		<Document >
			<Page size={{
				width: milimetro(24),
				height: 170
			}}
			orientation="landscape"
			style={style1}>
				{HeaderTemplate(conteudo)}
				<Image
					style={{ width: `100%`, height: `60%` }}
					src={barcode}
				/>
			</Page>
		</Document>
	)
}
