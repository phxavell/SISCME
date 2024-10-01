import React from 'react'
import {Document, Font, Page, Text, View} from '@react-pdf/renderer'
import LatoBold from './fonts/LatoBold.ttf'
import Lato from './fonts/Lato.ttf'
import {styles, stylesHeader2} from "@/components/pdf-templates/styles.ts"
import {Style} from "@react-pdf/types/style"
import {RodapeTemplate} from "@/components/pdf-templates/components/RodapeTemplate.tsx"
import {CabecalhoIcones} from "@/components/pdf-templates/components/CabecalhoIcones.tsx"

const TotalItens = (conteudo: any) => {
	let size = 0
	let quantidadeTotal = 0
	if (conteudo?.itens?.length) {
		size = conteudo?.itens?.length
		if (size) {
			conteudo.itens.forEach((item: any) => {
				quantidadeTotal = quantidadeTotal + parseInt(item.quantidade, 10)
			})
		}
	}

	const fontCell: Style = {
		fontFamily: `Lato`,
		fontSize: 12,
		color: `black`,
	}

	const styleCellTotal1: Style[] = [
		styles.flexGrow2,
		fontCell,
	]
	const styleCellTotal2: Style[] = [
		styles.flex20p,
		fontCell,
	]
	const styleTextLabel: Style[] = [
		styles.itemLabelTotal,
		{
			fontFamily: `Lato Bold`,
			marginRight: `4px`
		}
	]

	return (
		<View
			style={[

				{marginTop: `20px`},
				styles.row,
				styles.baseLine,
			]}>
			<Text style={[
				styles.itemLabel,
				styles.flexGrow1,

			]}>

			</Text>
			<Text style={styleCellTotal1}>

			</Text>
			<Text style={styleCellTotal2}>

			</Text>
			<Text style={styleCellTotal2}>
				<Text style={styleTextLabel}>
                    Total de itens:
				</Text>
				{quantidadeTotal}
			</Text>
		</View>
	)

}

//@ts-ignore
const HeaderTemplate = (props) => {
	const {
		cliente,
		datetime,
		profissional
	} = props
	return (
		<View style={styles.headerBorderAll}>
			<View style={[styles.rowHeader,

			]}>
				<View style={[styles.row,
					{
						alignItems: `baseline`,
					}
				]}>
					<Text style={styles.headerTitle}>
                        Cliente:
					</Text>
					<Text style={[
						styles.headerLabel,
						{
							width: `280px`,
						}
					]}>
						{cliente}
					</Text>
				</View>
				<View style={[styles.row,
					{
						alignItems: `baseline`,
					}
				]}>
					<Text style={styles.headerTitle}>
                        Data e Hora do Recebimento:
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
		</View>
	)
}

// @ts-ignore
const SubHeaderTemplate = (props) => {
	const {
		caixa,
		sequencial,
		temperatura,
		barreira_esteril
	} = props
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

			]}>Qtd.</Text>
		</View>
	)
}

// @ts-ignore
const PageItensTemplate = (props) => {
	const {itens} = props
	const pages = []
	const quantidadeDeItens = 20
	for (let i = 0; i < itens.length; i += quantidadeDeItens) {
		const page = itens.slice(i, i + quantidadeDeItens)
		pages.push(page)
	}

	const pagesTemplates = pages.map((pageItens: any[], index: number) => {

		return (
			<View
				key={index + 1}
				style={styles.column}
				wrap={false}>

				{headerItens()}

				{pageItens.map((item) => {
					return (
						<View
							key={item.descricao}
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

// @ts-ignore
export const RelatorioRecebimento = (caixa?: any) => {

	let cliente
	let itens
	let descricao
	let sequencial
	let temperatura
	let tipo
	let usuario
	if (caixa) {
		cliente = caixa.cliente
		itens = caixa.itens
		descricao = caixa.descricao
		sequencial = caixa.serial
		temperatura = caixa.temperatura
		tipo = caixa.embalagem
		usuario = caixa?.profissional
	}
	Font.register({
		family: `Lato`,
		src: Lato,
	})
	Font.register({
		family: `Lato Bold`,
		src: LatoBold,
	})

	const datetime = caixa?.datarecebimento ?? `--/--/--`

	const textNaoSeAplica = `Não informado.`

	return (
		<Document>
			<Page size="A4" style={styles.page} wrap>
				{CabecalhoIcones(`Relatório de Itens Recebidos`)}
				{HeaderTemplate(
					{
						cliente: cliente ?? textNaoSeAplica,
						datetime: datetime ?? `--/--/-- --:--`,
						profissional: usuario ?? textNaoSeAplica
					}
				)}
				{SubHeaderTemplate({
					caixa: descricao ?? textNaoSeAplica,
					sequencial: sequencial ?? textNaoSeAplica,
					temperatura: temperatura ?? textNaoSeAplica,
					barreira_esteril: tipo ?? textNaoSeAplica
				})}
				{PageItensTemplate({
					itens: itens ?? []
				})}
				{TotalItens({
					itens: itens ?? []
				})}
				{RodapeTemplate()}
			</Page>
		</Document>
	)
}
