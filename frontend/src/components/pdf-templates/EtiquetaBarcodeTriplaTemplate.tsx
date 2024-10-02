import React from 'react'
import {Document, Font, Image, Page, Text, View} from '@react-pdf/renderer'
import LatoBold from './fonts/LatoBold.ttf'
import Lato from './fonts/Lato.ttf'
import OpenSans from './fonts/OpenSans.ttf'
import {IPreparoToTriploPDF} from "@/components/pdf-templates/types.ts"
import {styles} from "@/components/pdf-templates/stylesTriplo.ts"
import {Style} from "@react-pdf/types/style"

const HeaderTemplate = (conteudo: IPreparoToTriploPDF) => {

	const textNaoSeAplica = `N/A`

	let cliente
	let descricao_cx
	let temperatura
	let quantidade

	if (conteudo?.caixa) {
		cliente = conteudo.caixa.cliente ?? textNaoSeAplica
		descricao_cx = conteudo.caixa.descricao ?? textNaoSeAplica
		temperatura = conteudo.caixa.temperatura ?? textNaoSeAplica
		quantidade = conteudo.caixa.quantidade ?? textNaoSeAplica
	}

	let por
	let data_preparo
	let data_validade
	if (conteudo?.recebimento) {
		por = conteudo.recebimento.usuario?.nome ?? textNaoSeAplica
		data_preparo = conteudo.recebimento.data_hora ?? textNaoSeAplica
		data_validade = conteudo.recebimento.data_hora ?? textNaoSeAplica
	}

	const codigo = conteudo?.codigo ?? textNaoSeAplica

	const {
		column,
		rowHeader,
		headerTitleEtiqueta,
		headerLabelEtiqueta,
	} = styles

	const columnBaseline = [
		column,
		{
			alignItems: `baseline`,
			justifyContent: `space-between`
		}
	] as Style[]
	const rowBaseline = [
		styles.row,
		{
			alignItems: `baseline`,

		}
	] as Style[]

	const rowPor = [headerLabelEtiqueta, {
		width: `80px`,
	}] as Style[]

	return (
		<View style={columnBaseline}>
			<View style={rowHeader}>
				<View style={rowBaseline}>
					<Text style={headerTitleEtiqueta}>
                        CLI:
					</Text>
					<Text style={headerLabelEtiqueta}>
						{cliente}
					</Text>
				</View>
				<View style={rowBaseline}>
					<Text style={headerTitleEtiqueta}>
                        CAUTELA:
					</Text>
					<Text style={headerLabelEtiqueta}>
						{codigo}
					</Text>
				</View>
			</View>
			<View style={rowHeader}>
				<View style={rowBaseline}>
					<Text style={headerTitleEtiqueta}>
                        CX:
					</Text>
					<Text style={headerLabelEtiqueta}>
						{descricao_cx}
					</Text>
				</View>
				<View style={rowBaseline}>
					<Text style={headerTitleEtiqueta}>
                        QTD:
					</Text>
					<Text style={headerLabelEtiqueta}>
						{quantidade}
					</Text>
				</View>
				<View style={rowBaseline}>
					<Text style={headerTitleEtiqueta}>
                        TEMP:
					</Text>
					<Text style={headerLabelEtiqueta}>
						{temperatura}
					</Text>
				</View>
			</View>
			<View style={rowHeader}>
				<View style={rowBaseline}>
					<Text style={headerTitleEtiqueta}>
                        POR:
					</Text>
					<Text style={rowPor}>
						{por}
					</Text>
				</View>
			</View>
			<View style={rowHeader}>
				<View style={rowBaseline}>
					<Text style={headerTitleEtiqueta}>
                        PREPARO:
					</Text>
					<Text style={headerLabelEtiqueta}>
						{data_preparo}
					</Text>
				</View>
				<View style={rowBaseline}>
					<Text style={headerTitleEtiqueta}>
                        VALIDADE:
					</Text>
					<Text style={headerLabelEtiqueta}>
						{data_validade}
					</Text>
				</View>

			</View>

		</View>
	)
}

const RodapeTemplate = (conteudo: IPreparoToTriploPDF) => {

	const {
		column,
		headerTitleEtiqueta,
		headerLabelEtiqueta,
	} = styles
	const columnBaseline = [
		column,
		{
			alignItems: `baseline`,
			justifyContent: `space-between`
		}
	] as Style[]
	const rowBaseline = [styles.row,

		{
			alignItems: `baseline`,

		}
	] as Style[]

	return (
		<View
			style={columnBaseline}>
			<View
				style={rowBaseline}>
				<Text style={headerTitleEtiqueta}>
                    RT:
				</Text>
				<Text style={headerLabelEtiqueta}>
					{conteudo.caixa.descricao}
				</Text>
			</View>
			<View style={rowBaseline}>
				<Text style={headerTitleEtiqueta}>
                    COREN:
				</Text>
				<Text style={headerLabelEtiqueta}>
					{conteudo.caixa.descricao}
				</Text>
			</View>
		</View>
	)
}

export const EtiquetaBarcodeTriplaTemplate = (conteudo: IPreparoToTriploPDF) => {
	Font.register({
		family: `Lato`,
		src: Lato,
	})
	Font.register({
		family: `Lato Bold`,
		src: LatoBold,
	})
	Font.register({
		family: `Open Sans`,
		src: OpenSans,
	})

	//@ts-ignore
	const barcode = conteudo?.barcode

	const style: Style = {
		width: `180px`,
		padding: `2px 2px`,
		height: `90px`,
		flexDirection: `column`,
		marginBottom: `6px`,
		marginTop: `6px`,
		marginLeft: `7px`,
		border: `1px solid black`
	}

	const styleRotacao: Style = {
		transformOrigin: `left`,
		transform: `rotate(90deg) translate(-150%, -150%)`,
	}

	const {logoMin} = styles

	// @ts-ignore
	return (
		<Document>
			<Page
				size="A7"
				orientation="landscape"
				wrap={false}
				style={[styles.pageEtiquetaTripla]}>
				<View style={styleRotacao}>
					<View style={style}>
						{HeaderTemplate(conteudo)}
						<Image
							style={logoMin}
							src={barcode}/>
						{RodapeTemplate(conteudo)}
					</View>
					<View style={style}>
						{HeaderTemplate(conteudo)}
						<Image
							style={logoMin}
							src={barcode}/>
						{RodapeTemplate(conteudo)}
					</View>
					<View style={style}>
						{HeaderTemplate(conteudo)}
						<Image
							style={logoMin}
							src={barcode}/>
						{RodapeTemplate(conteudo)}
					</View>
				</View>
			</Page>
		</Document>
	)
}
