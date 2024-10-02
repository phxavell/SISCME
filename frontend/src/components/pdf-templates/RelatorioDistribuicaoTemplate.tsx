import React from "react"
import {Document, Font, Page, Text, View} from "@react-pdf/renderer"
import moment from "moment"
import LatoBold from "./fonts/LatoBold.ttf"
import Lato from "./fonts/Lato.ttf"
import {styles} from "@/components/pdf-templates/styles.ts"
import {Style} from "@react-pdf/types/style"
import {CabecalhoIcones} from "@/components/pdf-templates/components/CabecalhoIcones.tsx"

//@ts-ignore
const HeaderTemplate = (conteudo) => {
	const data = conteudo[0]

	const textNaoSeAplica = `Não informado.`

	const header = {
		cliente: data?.cliente.nome ?? textNaoSeAplica,
		datetime: data?.data_distribuicao ?? ``,
		profissional: data?.usuario ?? textNaoSeAplica,
		setor: () => {
			if (data?.setor) {
				return (
					<View
						style={[
							styles.row,
							{
								alignItems: `baseline`,
							},
						]}
					>
						<Text style={styles.headerTitle}>Setor:</Text>
						<Text style={styles.headerLabel}>{data?.setor}</Text>
					</View>
				)
			}
			return <></>
		},
	}

	return (
		<View
			style={[
				styles.headerBorderAll,
				{
					marginBottom: `10px`,
				},
			]}
		>
			<View style={[styles.rowHeader]}>
				<View
					style={[
						styles.row,
						{
							alignItems: `baseline`,
						},
					]}
				>
					<Text style={styles.headerTitle}>Cliente:</Text>
					<Text style={styles.headerLabel}>{header.cliente}</Text>
				</View>
				<View
					style={[
						styles.row,
						{
							alignItems: `baseline`,
						},
					]}
				>
					<Text style={styles.headerTitle}>
                        Data e Hora da Distribuição:
					</Text>
					<Text style={styles.headerLabel}>{header.datetime}</Text>
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
					<Text style={styles.headerLabel}>
						{header.profissional}
					</Text>
				</View>
				{header.setor()}
			</View>
		</View>
	)
}

const RodapeTemplate = () => {
	const date: string = moment(new Date()).format(`DD/MM/YYYY`)
	const time = moment(new Date()).format(`HH:mm`)
	return (
		<View
			fixed
			style={[
				styles.row,
				styles.pageNumber,
				{
					alignItems: `baseline`,
					justifyContent: `space-between`,
				},
			]}
		>
			<Text style={styles.rodapeText}>
				{`Impressão:  ${date}   Hora: ${time}`}
			</Text>
			<Text
				style={styles.rodapeText}
				render={({pageNumber, totalPages}) => {
					return `Página ${pageNumber} de ${totalPages}`
				}}
			/>
		</View>
	)
}

const TotalItens = (conteudo: any) => {
	const data = conteudo[0]
	let size = 0
	if (data?.caixas?.length) {
		size = data?.caixas?.length
	}
	return (
		<View
			style={[
				{marginTop: `20px`},
				styles.row,
				styles.baseLine,
				{
					justifyContent: `flex-end`,
					paddingRight: `10px`,
				},
			]}
		>
			<Text
				style={[
					styles.itemLabelTotal,
					{
						fontFamily: `Lato Bold`,
					},
				]}
			>
                Total:
			</Text>
			<Text
				style={[
					styles.itemLabel,
					{
						width: `5%`,
						justifyContent: `center`,
						textAlign: `center`,
						alignContent: `center`,
						alignItems: `center`,
					},
				]}
			>
				{size}
			</Text>
			<Text
				style={[
					styles.itemLabelTotal,
					{
						fontFamily: `Lato Bold`,
					},
				]}
			>
                Caixas.
			</Text>
		</View>
	)
}

//ok
const headerItens = () => {
	return (
		<View style={[styles.row, styles.baseLine]}>
			<Text
				style={[
					styles.itemHeader,
					styles.flexGrow2,
					{
						fontFamily: `Lato Bold`,
						fontSize: `14px`,
					},
				]}
			>
                Serial
			</Text>
			<Text
				style={[
					styles.itemHeader,
					styles.flexGrow3,
					{
						fontFamily: `Lato Bold`,
						fontSize: `14px`,
					},
				]}
			>
                Caixa
			</Text>
		</View>
	)
}

// @ts-ignore ok
const PageItensTemplate = (conteudo) => {
	const data = conteudo[0]
	let itens = []
	if (data?.caixas) {
		itens = data?.caixas
	}

	const pages = []
	for (let i = 0; i < itens.length; i += 20) {
		const page = itens.slice(i, i + 20)
		pages.push(page)
	}

	const fontItemListagem: Style = {
		color: `black`,
		fontSize: `9px`,
		fontFamily: `Lato`,
		textTransform: `uppercase`,
		fontWeight: `normal`,
		width: `auto`,
	}

	const pagesTemplates = pages.map((pageItens: any[], index: number) => {
		return (
			<View key={index + 1} style={styles.column} wrap={false}>
				{headerItens()}

				{pageItens.map((item) => {
					return (
						<View
							key={item.id}
							style={[
								{marginTop: `10px`},
								styles.row,
								styles.baseLine,
							]}
						>
							<Text
								style={[
									styles.flexGrow2,
									styles.itemLabel,
									fontItemListagem,
									{
										width: `50%`,
									},
								]}
							>
								{item.serial}
							</Text>
							<Text
								style={[
									styles.flexGrow3,
									styles.itemLabel,
									fontItemListagem,
									{
										width: `40%`,
									},
								]}
							>
								{item.nome_caixa}
							</Text>
						</View>
					)
				})}
			</View>
		)
	})

	return pagesTemplates
}

// @ts-ignore
export const RelatorioDistribuicaoTemplate = (conteudo: any) => {
	Font.register({
		family: `Lato`,
		src: Lato,
	})

	Font.register({
		family: `Lato Bold`,
		src: LatoBold,
	})

	return (
		<Document>
			<Page size="A4" style={styles.page} wrap>
				{CabecalhoIcones(`CabecalhoIcones`)}
				{HeaderTemplate(conteudo)}
				{PageItensTemplate(conteudo)}
				{TotalItens(conteudo)}
				{RodapeTemplate()}
			</Page>
		</Document>
	)
}
