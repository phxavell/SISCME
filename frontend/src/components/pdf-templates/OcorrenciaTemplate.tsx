import React from "react"
import {Document, Font, Page, Text, View} from "@react-pdf/renderer"
import LatoBold from "./fonts/LatoBold.ttf"
import Lato from "./fonts/Lato.ttf"
import OpenSans from "./fonts/OpenSans.ttf"
import ArialItalic from "./fonts/ArialItalic.ttf"

import {styles} from "@/components/pdf-templates/styles.ts"
import {OcorrenciaResponse} from "@infra/integrations/enfermagem/types.ts"

import Html from "react-pdf-html"

import {gerarHtmlTemplate} from "@/components/pdf-templates/helpers.ts"
import {RodapeTemplate} from "@/components/pdf-templates/components/RodapeTemplate.tsx"
import {CabecalhoIcones} from "@/components/pdf-templates/components/CabecalhoIcones.tsx"

//@ts-ignore
const HeaderTemplate = (props) => {
	const {setor, cliente, profissional, dt_ocorrencia, titulo, id} = props

	return (
		<View fixed style={styles.headerBorderAll}>
			<View style={[styles.rowHeader]}>
				<View
					style={[
						styles.rowWithGap,
						{
							alignItems: `baseline`,
						},
					]}
				>
					<View
						style={[
							styles.row,
							{
								alignItems: `baseline`,
							},
						]}
					>
						<Text style={styles.headerTitle}>Setor:</Text>
						<Text style={styles.headerLabel}>{setor}</Text>
					</View>
					<View
						style={[
							styles.row,
							{
								alignItems: `baseline`,
							},
						]}
					>
						<Text style={styles.headerTitle}>Cliente:</Text>
						<Text style={styles.headerLabel}>{cliente}</Text>
					</View>
					<View
						style={[
							styles.row,
							{
								alignItems: `baseline`,
							},
						]}
					>
						<Text style={styles.headerTitle}>N:</Text>
						<Text style={styles.headerLabel}>{id}</Text>
					</View>
				</View>
			</View>
			<View style={styles.rowHeader}>
				<View
					style={[
						styles.row,
						{
							alignItems: `baseline`,
						},
					]}
				>
					<Text style={styles.headerTitle}>Profissional:</Text>
					<Text style={styles.headerLabel}>{profissional}</Text>
				</View>
				<View
					style={[
						styles.row,
						{
							alignItems: `baseline`,
						},
					]}
				>
					<Text style={styles.headerTitle}>Dt. Ocorrência:</Text>
					<Text style={styles.headerLabel}>{dt_ocorrencia}</Text>
				</View>
			</View>
			<View style={styles.rowHeader}>
				<View
					style={[
						styles.row,
						{
							alignItems: `baseline`,
						},
					]}
				>
					<Text style={styles.headerTitle}>Título:</Text>
					<Text style={styles.headerLabel}>{titulo}</Text>
				</View>
			</View>
		</View>
	)
}

const Assinaturas = () => {
	return (
		<View
			style={[
				styles.row,
				{
					paddingHorizontal: `20px`,
					textAlign: `center`,
					fontSize: `10px`,
					color: `#000`,
					marginLeft: `20px`,
					marginTop: `auto`,
					marginBottom: `20px`,
				},
			]}
		>
			<Text
				style={{
					borderTop: `1px solid black`,
					padding: `10px 80px`,
					marginRight: `20px`,
				}}
			>
                Enfermeiro(a)
			</Text>
			<Text
				style={{borderTop: `1px solid black`, padding: `10px 80px`}}
			>
                Cliente
			</Text>
		</View>
	)
}

// @ts-ignore
export const OcorrenciaTemplate = (conteudo: OcorrenciaResponse) => {
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

	const showAssinatura = () => {
		// if (plantao.status == `ATIVO` && index == pages.length - 1) {
		return <>{Assinaturas()}</>
		// }
	}

	let header = {
		setor: `nao informado`,
		cliente: `nao informado`,
		profissional: `nao informado`,
		dt_ocorrencia: `nao informado`,
		titulo: `nao informado`,
		id: `nao informado`,
	}
	if (conteudo) {
		// @ts-ignore
		header = {
			setor: conteudo?.setor?.nome ?? `nao informado`,
			cliente: conteudo?.cliente?.nome ?? `nao informado`,
			profissional: conteudo?.usuario?.nome ?? `nao informado`,
			dt_ocorrencia: conteudo?.dataabertura ?? `nao informado`,
			titulo: conteudo?.indicador?.nome ?? `nao informado`,
			id: conteudo?.id + `` ?? `nao informado`,
		}
	}

	return (
		<Document>
			<Page size="A4" style={styles.page} wrap>
				{CabecalhoIcones(`SINALIZAÇÃO DE NÃO CONFORMIDADE`)}
				{HeaderTemplate(header)}

				<View wrap={false}>
					<View style={styles.bottomBorderBlack}>
						<Text>Descrição</Text>
					</View>
					<Html style={styles.fonte10}>
						{gerarHtmlTemplate(conteudo.descricao ?? ``)}
					</Html>
				</View>
				<View wrap={false}>
					<View style={styles.bottomBorderBlack}>
						<Text>Ação</Text>
					</View>
					<Html style={styles.fonte10}>
						{gerarHtmlTemplate(conteudo.acao ?? ``)}
					</Html>
				</View>
				{showAssinatura()}
				{RodapeTemplate()}
			</Page>
		</Document>
	)
}
