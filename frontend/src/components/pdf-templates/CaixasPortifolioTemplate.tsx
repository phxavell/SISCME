import React from 'react'
import {Document, Font, Page, Text, View} from '@react-pdf/renderer'
import moment from "moment"
import LatoBold from './fonts/LatoBold.ttf'
import Lato from './fonts/Lato.ttf'
import {IPortifolioToPDF, ITermoToPDF} from "@/components/pdf-templates/types.ts"
import {styles} from "@/components/pdf-templates/styles.ts"
import {Style} from "@react-pdf/types/style"
import {CabecalhoIcones} from "@/components/pdf-templates/components/CabecalhoIcones.tsx"

const HeaderTemplate = (termo?: IPortifolioToPDF) => {
	const serial = termo?.serial ?? ``
	const cliente = termo?.cliente ?? ``
	const caixa = termo?.caixa ?? ``
	const tipo = termo?.tipo
	const embalagem = termo?.embalagem ?? ``

	return (
		<View fixed style={[styles.headerBorderAll, {marginBottom: `10px`}]}>
			<View style={[styles.rowHeader,

			]}>
				<View style={[styles.row,
					{
						alignItems: `baseline`,
					}
				]}>
					<Text style={styles.headerTitle1}>
                        Cliente:
					</Text>
					<Text style={styles.headerLabel3}>
						{cliente}
					</Text>
				</View>
			</View>
			<View style={styles.rowHeader}>
				<View style={[styles.row,
					{
						alignItems: `baseline`,
					}
				]}>
					<Text style={styles.headerTitle1}>
                        Nome:
					</Text>
					<Text style={styles.headerLabel3}>
						{caixa}
					</Text>
				</View>
				<View style={[styles.row,
					{
						alignItems: `baseline`,
					}
				]}>
					<Text style={styles.headerTitle1}>
                        Tipo:
					</Text>
					<Text style={styles.headerLabel3}>
						{tipo}
					</Text>
				</View>
			</View>

			<View style={[styles.rowHeader,

			]}>
				<View style={[styles.row,
					{
						alignItems: `baseline`,
					}
				]}>
					<Text style={styles.headerTitle1}>
                        Serial:
					</Text>
					<Text style={styles.headerLabel3}>
						{serial}
					</Text>
				</View>
				<View style={[styles.row,
					{
						alignItems: `baseline`,
					}
				]}>
					<Text style={styles.headerTitle1}>
                        Barreira Estéril:
					</Text>
					<Text style={styles.headerLabel3}>
						{embalagem}
					</Text>
				</View>
			</View>
		</View>
	)
}

const headerItens = () => {

	const styleHeaderItens: Style[] = [styles.row,
		{
			width: `100%`,
			paddingRight: `10px`
		}]
	const styleHeaderCodigo: Style[] = [styles.itemHeader, styles.flex15p]
	const styleHeaderProduto: Style[] = [styles.itemHeader, styles.flex80p]
	const styleHeaderQuant: Style[] = [styles.itemHeader, styles.flex15p]
	return (

		<View
			fixed
			style={styleHeaderItens}>
			<Text style={styleHeaderCodigo}>Código:</Text>
			<Text style={styleHeaderProduto}>Produto:</Text>
			<Text style={styleHeaderQuant}>Quantidade:</Text>
		</View>
	)
}

const RodapeTemplate = () => {
	const date: string = moment(new Date()).format(`DD/MM/YYYY`)
	const time = moment(new Date()).format(`HH:mm`)
	return (
		<View
			fixed
			style={[styles.row,
				styles.pageNumber1,
				{
					alignItems: `baseline`,
					justifyContent: `space-between`,


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

// @ts-ignore
const PageItensTemplate = (props) => {


	const {itens} = props
	const pages = itens ?? []
	const styleheader: Style = {
		color: `black`,
		fontSize: 12,
		fontFamily: `Lato`,
		textTransform: `uppercase`,
		fontWeight: `normal`,
		textAlign: `left`
	}


	const styleRow: Style[] = [
		{marginTop: `5px`},
		styles.row,
		styles.baseLine,
	]
	return (
		<View>
			{headerItens()}
			{pages.map((item: {
                id: number,
                produto: string,
                quantidade: number
            }) => {
				return (
					<View
						key={item.id}
						style={styleRow}
					>
						<Text style={[styles.row, styles.flex15p, styleheader]}>
							{item.id}
						</Text>
						<Text style={[styles.row, styles.flex80p, styleheader]}>
							{item.produto}
						</Text>
						<Text style={[styles.row, styles.flex15p, styleheader]}>
							{item.quantidade}
						</Text>

					</View>
				)
			})}
		</View>
	)

}
// @ts-ignore
const TotalItens = (termo?: ITermoToPDF) => {
	let size = 0
	if (termo?.itens) {
		size = termo?.itens.length
	}

	const styleRow: Style[] = [
		styles.row,
		styles.baseLine,
		{
			justifyContent: `flex-end`,
			paddingRight: `10px`,
			marginTop: `20px`
		}
	]
	const styleLabelTotal: Style[] = [
		styles.itemLabel,
		{
			width: `5%`,
			justifyContent: `center`,
			textAlign: `center`,
			alignContent: `center`,
			alignItems: `center`
		}
	]
	return (
		<View
			style={styleRow}>

			<Text style={[
				styles.itemLabelTotal,
				{
					fontFamily: `Lato Bold`
				}
			]}>
                Total:
			</Text>
			<Text style={styleLabelTotal}>
				{size}
			</Text>
			<Text style={[
				styles.itemLabelTotal,
				{
					fontFamily: `Lato Bold`
				}

			]}>
                Itens
			</Text>

		</View>
	)

}

export const CaixasPortifolioTemplate = (termo?: any) => {
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
				{CabecalhoIcones(`Portifólio de Instrumental`)}
				{HeaderTemplate(termo)}
				{PageItensTemplate(termo)}
				{TotalItens(termo)}
				{RodapeTemplate()}
			</Page>
		</Document>
	)
}
