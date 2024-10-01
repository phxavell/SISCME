import React from "react"
import { Document, Font, Page, Text, View } from "@react-pdf/renderer"
import LatoBold from "./fonts/LatoBold.ttf"
import Lato from "./fonts/Lato.ttf"
import OpenSans from "./fonts/OpenSans.ttf"
import { styles } from "@/components/pdf-templates/stylesTriplo.ts"
import { Style } from "@react-pdf/types/style"
import ArialItalic from "@/components/pdf-templates/fonts/ArialItalic.ttf"
import moment from "moment"

import {ShowTemperaturaStyle2} from "@/components/pdf-templates/ShowTemperaturaStyle2.tsx"

const rowBaseline = [styles.row, { alignItems: `baseline` }] as Style[]
const rowStart = [styles.row, { alignItems: `start` }] as Style[]

const showSetor = (setor: any) => {
	const { headerTitleEtiquetaTripla, headerLabelEtiqueta } = styles
	if (setor?.descricao) {
		return (
			<View style={rowBaseline}>
				<Text style={headerTitleEtiquetaTripla}>Setor:</Text>
				<Text style={headerLabelEtiqueta}>{setor?.descricao}</Text>
			</View>
		)
	} else {
		return <></>
	}
}
const HeaderTemplate = (conteudo: any) => {
	const {
		column,
		headerTitleEtiquetaTripla,
		headerLabelEtiqueta,
		headerLabelEtiquetaTripla,
	} = styles
	const columnBaseline = [
		column,
		{ alignItems: `baseline`, justifyContent: `space-between` },
	] as Style[]

	const textNaoSeAplica = `Não informado.`

	let cliente
	if (conteudo?.cliente) {
		cliente = conteudo?.cliente?.nome ?? textNaoSeAplica
	}

	const dataLancamentoFormatada = () => {
		if (conteudo?.datalancamento) {
			return moment(conteudo?.datalancamento).format(`DD/MM/YYYY`)
		} else {
			return ``
		}
	}

	const dataValidadeFormatada = () => {
		if (conteudo?.datavalidade) {
			return moment(conteudo?.datavalidade).format(`DD/MM/YYYY`)
		} else {
			return ``
		}
	}

	const exibirProduto = () => {
		if (conteudo?.produto?.descricao) {
			const texto = conteudo?.produto?.descricao
			const tamanhoLimite = 35

			if (texto.length > tamanhoLimite) {
				let quebraDeLinhaIndex = texto.lastIndexOf(` `, tamanhoLimite)
				if (quebraDeLinhaIndex === -1) {
					quebraDeLinhaIndex = tamanhoLimite
				}

				const primeiraParte = texto.substring(0, quebraDeLinhaIndex)
				const segundaParte = texto.substring(quebraDeLinhaIndex).trim()
				return primeiraParte + `\n` + segundaParte
			} else {
				return texto
			}
		} else {
			return ``
		}
	}

	return (
		<View style={columnBaseline}>
			<View style={[styles.row, { alignItems: `baseline` }]}>
				<Text
					style={{
						fontSize: `8px`,
						fontWeight: `bold`,
						marginBottom: `3px`,
					}}
				>
					{cliente}
				</Text>
			</View>

			<View style={rowStart}>
				<Text style={headerTitleEtiquetaTripla}>PRODUTO:</Text>
				<Text style={headerLabelEtiquetaTripla}>{exibirProduto()}</Text>
			</View>
			<View style={rowBaseline}>
				<Text style={headerTitleEtiquetaTripla}>COMPLEMENTO:</Text>
				<Text style={headerLabelEtiqueta}>
					{conteudo?.complemento?.descricao ?? ``}
				</Text>
			</View>
			<View style={[styles.row, { gap: `6px` }]}>
				<View style={rowBaseline}>
					<Text style={headerTitleEtiquetaTripla}>TIPO:</Text>
					<Text style={headerLabelEtiqueta}>
						{conteudo?.produto?.tipoproduto ?? ``}
					</Text>
				</View>
				{showSetor(conteudo?.setor)}
			</View>
			<View style={[styles.row, { gap: `6px` }]}>
				<View style={rowBaseline}>
					<Text style={headerTitleEtiquetaTripla}>Nº PEÇAS:</Text>
					<Text style={headerLabelEtiqueta}>
						{conteudo?.qtd ?? ``}
					</Text>
				</View>
				{ShowTemperaturaStyle2(conteudo?.temperatura, 4)}
			</View>

			<View style={[styles.row, { gap: `6px` }]}>
				<View style={rowBaseline}>
					{/*<Text style={headerTitleEtiquetaTripla}>*/}
					{/*	AUTOCLAVE.:*/}
					{/*</Text>*/}
					<Text style={headerLabelEtiqueta}>
						{conteudo?.autoclave?.descricao ?? ``}
					</Text>
				</View>
				<View style={rowBaseline}>
					<Text style={headerTitleEtiquetaTripla}>CICLO:</Text>
					<Text style={headerLabelEtiqueta}>
						{conteudo?.ciclo_autoclave ?? ``}
					</Text>
				</View>
			</View>
			<View style={rowBaseline}>
				<Text style={headerTitleEtiquetaTripla}>
                    DATA DA ESTERILIZAÇÃO:
				</Text>
				<Text style={headerLabelEtiqueta}>
					{dataLancamentoFormatada()}
				</Text>
			</View>
			<View style={rowBaseline}>
				<Text style={headerTitleEtiquetaTripla}>DATA DE VALIDADE:</Text>
				<Text style={headerLabelEtiqueta}>
					{dataValidadeFormatada()}
				</Text>
			</View>
		</View>
	)
}

const RodapeTemplate = (conteudo: any) => {
	const { column, headerTitleEtiquetaTripla, headerLabelEtiqueta } = styles
	const columnBaseline = [
		column,
		{
			alignItems: `baseline`,
			justifyContent: `space-between`,
		},
	] as Style[]

	const styleCoren = [
		headerLabelEtiqueta,
		{
			width: `15px`,
			textOverflow: `ellipsis`,
			maxWidth: `15px`,
		},
	] as Style[]
	const styleRT = [
		headerLabelEtiqueta,
		{
			width: `100px`,
		},
	] as Style[]

	return (
		<View style={columnBaseline}>
			<View style={rowBaseline}>
				<Text style={headerTitleEtiquetaTripla}>TEC.:</Text>
				<Text
					style={[
						headerLabelEtiqueta,
						{
							width: `94.5px`,
						},
					]}
				>
					{conteudo?.profissional?.nome ?? ``}
				</Text>
				<Text style={headerTitleEtiquetaTripla}>COREN:</Text>
				<Text style={styleCoren}>
					{conteudo?.profissional?.coren ?? ``}
				</Text>
			</View>
			<View style={rowBaseline}>
				<Text style={headerTitleEtiquetaTripla}>RT:</Text>
				<Text style={styleRT}>
					{conteudo.responsavel_tecnico_nome ?? ``}
				</Text>
				<Text style={headerTitleEtiquetaTripla}>COREN:</Text>
				<Text style={styleCoren}>
					{conteudo.responsavel_tecnico_coren ?? ``}
				</Text>
			</View>
		</View>
	)
}
export const EtiquetaTriplaTemplate = (conteudo: any) => {
	console.log(`EtiquetaTriplaTemplate`, conteudo)
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
	Font.register({
		family: `Arial Italic`,
		src: ArialItalic,
		fonts: [
			{
				src: Lato,
			},
			{
				src: LatoBold,
				fontWeight: `bold`,
			},
			{
				src: LatoBold,
				fontWeight: 900,
			},
			{
				src: ArialItalic,
				fontWeight: `normal`,
				fontStyle: `italic`,
			},
			{
				src: ArialItalic,
				fontWeight: 900,
				fontStyle: `italic`,
			},
			{
				src: ArialItalic,
				fontWeight: `bold`,
				fontStyle: `italic`,
			},
		],
	})

	Font.register({
		family: `Lato`,
		fonts: [
			{
				src: Lato,
			},
			{
				src: LatoBold,
				fontWeight: `bold`,
			},
			{
				src: LatoBold,
				fontWeight: 900,
			},
			{
				src: ArialItalic,
				fontWeight: `normal`,
				fontStyle: `italic`,
			},
			{
				src: ArialItalic,
				fontWeight: 900,
				fontStyle: `italic`,
			},
			{
				src: ArialItalic,
				fontWeight: `bold`,
				fontStyle: `italic`,
			},
		],
		// format: 'truetype',
	})

	//@ts-ignore

	const style: Style = {
		width: `170px`,
		padding: `2px 2px`,
		height: `90px`,
		flexDirection: `column`,
		marginBottom: `6px`,
		marginTop: `6px`,
		// marginLeft: `7px`,
		border: `1px solid black`,
	}

	// @ts-ignore
	return (
		<Document>
			<Page
				size="A7"
				orientation="landscape"
				wrap={false}
				style={[styles.pageEtiquetaTripla]}
			>
				<View
					// style={styleRotacao}
				>
					<View style={style}>
						{HeaderTemplate(conteudo)}

						{RodapeTemplate(conteudo)}
					</View>
					<View style={style}>
						{HeaderTemplate(conteudo)}

						{RodapeTemplate(conteudo)}
					</View>
					<View style={style}>
						{HeaderTemplate(conteudo)}

						{RodapeTemplate(conteudo)}
					</View>
				</View>
			</Page>
		</Document>
	)
}
