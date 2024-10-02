import React from 'react'
import {Document, Font, Page, Text, View} from '@react-pdf/renderer'
import LatoBold from './fonts/LatoBold.ttf'
import Lato from './fonts/Lato.ttf'
import {IPreparoToPDF} from "@/components/pdf-templates/types.ts"
import {styles, stylesHeader2} from "@/components/pdf-templates/styles.ts"
import {RodapeTemplate} from "@/components/pdf-templates/components/RodapeTemplate.tsx"
import {CabecalhoIcones} from "@/components/pdf-templates/components/CabecalhoIcones.tsx"


const textNaoSeAplica = `Não informado.`

const headerItens = () => {
	return (
		<View style={[

			styles.row,
			styles.baseLine,

		]}>
			<Text style={[

				styles.itemHeaderMin,
				styles.flex80p,
			]}>Itens</Text>
			<Text style={[

				styles.itemHeaderMin,
				styles.flex20p,
			]}>Qtd</Text>
		</View>
	)
}

const HeaderTemplate = (conteudo: any) => {

	const textNaoSeAplica = `Não informado.`

	let cliente

	if (conteudo?.caixa) {
		cliente = conteudo.caixa?.cliente ?? textNaoSeAplica
	}
	let usuario
	if (conteudo?.recebimento) {
		usuario = conteudo?.recebimento.usuario
	}
	const profissional = usuario?.nome ?? textNaoSeAplica
	const datetime = conteudo?.data_preparo ?? `--/--/--`

	const codigo = conteudo?.codigo ?? textNaoSeAplica


	return (
		<View style={styles.headerBorderAll}>
			<View style={[styles.rowHeader,

			]}>
				<View style={[styles.row, {alignItems: `baseline`}]}>
					<Text style={styles.headerTitle}>
                        Cliente:
					</Text>
					<Text style={styles.headerLabel}>
						{cliente}
					</Text>
				</View>
				<View style={[styles.row, {alignItems: `baseline`}]}>
					<Text style={styles.headerTitle}>
                        Data Hora Preparo:
					</Text>
					<Text style={styles.headerLabel}>
						{datetime}
					</Text>
				</View>
			</View>
			<View style={styles.rowHeader}>
				<View style={[styles.row,
					{
						alignItems: `baseline`,
					}
				]}>
					<Text style={styles.headerTitle}>
                        Profissional:
					</Text>
					<Text style={styles.headerLabel}>
						{profissional}
					</Text>
				</View>
			</View>
			<View style={styles.rowHeader}>
				<View style={[styles.row,
					{
						alignItems: `baseline`,
					}
				]}>
					<Text style={styles.headerTitle}>
                        Código:
					</Text>
					<Text style={styles.headerLabel}>
						{codigo}
					</Text>
				</View>
			</View>
		</View>
	)
}

const SubHeaderTemplate = (conteudo: IPreparoToPDF) => {
	const caixa = conteudo?.caixa?.descricao ?? textNaoSeAplica

	const sequencial = conteudo?.caixa?.sequencial ?? textNaoSeAplica
	const temperatura = conteudo?.caixa?.temperatura ?? textNaoSeAplica
	const barreira_esteril = conteudo?.caixa?.tipo ?? textNaoSeAplica

	const {
		column,
		rowHeader2,
		borderBottom,
		fg5,
		fg2,
		fg3,
		headerLabel,
		headerTitle,
		baseLine
	} = stylesHeader2
	return (
		<View style={[
			column,
			{
				marginBottom: `12px`
			}
		]}>
			<View style={[rowHeader2, borderBottom]}>
				<View style={[
					fg5,
					rowHeader2,
					{
						alignItems: `baseline`,
					},
				]}>
				</View>
				<View style={[
					styles.row,
					{
						alignItems: `baseline`,
					},
					fg2
				]}>
					<Text style={styles.headerTitle}>
                        Serial
					</Text>
				</View>
				<View style={[styles.row,
					{
						alignItems: `baseline`,
					},
					fg2
				]}>
					<Text style={styles.headerTitle}>
                        Temperatura
					</Text>
				</View>
				<View style={[
					fg3,
					rowHeader2
				]}>
					<Text style={styles.headerTitle}>
                        Barreira Estéril
					</Text>

				</View>
			</View>
			<View style={[rowHeader2, borderBottom]}>
				<View style={[
					fg5,
					rowHeader2,
					baseLine,
				]}>
					<Text style={[headerTitle, {
						paddingLeft: `5px`
					}]}>
                        Caixa:
					</Text>
					<Text style={headerLabel}>
						{caixa ?? ``}

					</Text>
				</View>
				<View style={[
					styles.row,
					{
						alignItems: `baseline`,
					},
					fg2
				]}>
					<Text style={headerLabel}>
						{sequencial ?? ``}
					</Text>
				</View>
				<View style={[styles.row,
					{
						alignItems: `baseline`,
					},
					fg2
				]}>
					<Text style={headerLabel}>
						{
							temperatura ?? ``
						}
					</Text>
				</View>
				<View style={[
					fg3,
					rowHeader2
				]}>
					<Text style={headerLabel}>
						{barreira_esteril ?? ``}
					</Text>

				</View>
			</View>
		</View>
	)
}

const TotalItens = (conteudo: IPreparoToPDF) => {
	let size = 0
	if (conteudo?.caixa?.itens) {
		size = conteudo?.caixa?.itens.reduce((accumulator, currentValue) => accumulator + parseInt(currentValue.quantidade, 10), 0)

	}
	return (
		<View
			style={[
				{marginTop: `20px`},
				styles.row,
				styles.baseLine,
				{
					justifyContent: `flex-end`,
					paddingRight: `10px`
				}
			]}>

			<Text style={[
				styles.itemLabelTotal,
				{
					fontFamily: `Lato Bold`
				}
			]}>
                Total:
			</Text>
			<Text style={[
				styles.itemLabel,
				{
					width: `5%`,
					justifyContent: `center`,
					textAlign: `center`,
					alignContent: `center`,
					alignItems: `center`
				}
			]}>
				{size}
			</Text>
			<Text style={[
				styles.itemLabelTotal,
				{
					fontFamily: `Lato Bold`
				}

			]}>
                peças
			</Text>

		</View>
	)

}


// @ts-ignore
const PageItensTemplate = (conteudo: IPreparoToPDF) => {
	const itens = conteudo?.caixa?.itens ?? []
	const pages: any[] = []
	for (let i = 0; i < itens.length; i += 20) {
		const page = itens.slice(i, i + 20)
		pages.push(page)
	}

	const pagesTemplates: React.JSX.Element[] = pages.map((pageItens: any[], index: number) => {

		return (
			<View
				key={index + 1}
				style={styles.column}
				wrap={false}>

				{headerItens()}

				{pageItens.map((item) => {
					return (
						<View
							key={index + 1}
							style={[
								{marginTop: `10px`},
								styles.row,
								styles.baseLine,
								styles.borderBottom, {
									justifyContent: `space-between`
								}
							]}>

							<Text style={[
								styles.flex80p,
								styles.itemLabel,
								{
									width: `410px`
								}

							]}>
								{item.descricao}
							</Text>
							<Text style={[
								styles.flex20p,
								styles.itemLabel,

							]}>
								{item.quantidade}
							</Text>
						</View>
					)

				})}
			</View>
		)
	})

	return pagesTemplates
}

export const ItensPraparoTemplate = (conteudo: any) => {
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
				{CabecalhoIcones(`Relatório de Itens Preparo`)}
				{HeaderTemplate(conteudo)}
				{SubHeaderTemplate(conteudo)}
				{PageItensTemplate(conteudo)}
				{TotalItens(conteudo)}
				{RodapeTemplate()}
			</Page>
		</Document>
	)
}
