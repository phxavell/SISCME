import React from 'react'
import {Document, Font, Image, Page, Text, View} from '@react-pdf/renderer'
import {LogoBP128, LogoGovAM, SeloBPHalf180} from "@/util/styles"
import moment from "moment"
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
				<Text style={styleTextLabel}>
                    Total de Itens:
				</Text>
				{size}
			</Text>
			<Text style={styleCellTotal2}>
				<Text style={styleTextLabel}>
                    Total esperado:
				</Text>
				{quantidadeTotal}
			</Text>
			<Text style={styleCellTotal2}>
				<Text style={styleTextLabel}>
                    Total recebido:
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

				styles.itemHeader,
				styles.flexGrow1,
				{
					// backgroundColor:`red`
				}
			]}>Nº</Text>
			<Text style={[

				styles.itemHeader,
				styles.flexGrow2,
			]}>Itens</Text>
			<Text style={[

				styles.itemHeaderMin,
				styles.flex20p,

			]}>Qtd. Esperada</Text>
			<Text style={[

				styles.itemHeaderMin,
				styles.flex20p,

			]}>Qtd. Recebida</Text>
		</View>
	)
}

// @ts-ignore
const PageItensTemplate = (props) => {
	const {itens} = props
	const pages = []
	for (let i = 0; i < itens.length; i += 20) {
		const page = itens.slice(i, i + 20)
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
							key={item.id}
							style={[
								{marginTop: `10px`},
								styles.row,
								styles.baseLine,
								styles.borderBottom
							]}>
							<Text style={[

								styles.itemLabel,
								{
									// backgroundColor:`red`,
								},
								styles.flexGrow1,
							]}>
								{item.id}
							</Text>
							<Text style={[
								styles.flexGrow2,
								styles.itemLabel,
								{
									// backgroundColor:`green`,
									width: `50%`
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
export const ItensRecebidosTemplate = (caixa?: any) => {

	function abreviarNomeCompleto(nomeCompleto: string) {
		const partesDoNome = nomeCompleto.split(` `)

		const excecoes = [`da`, `de`, `do`, `das`, `dos`]

		if (partesDoNome.length > 3) {
			const sobrenomesAbreviados = partesDoNome.slice(1).map((sobrenome, index) => {
				return excecoes.includes(sobrenome.toLowerCase()) && index !== partesDoNome.length - 2
					? sobrenome
					: abreviarSobrenome(sobrenome)
			})
			partesDoNome.splice(1, partesDoNome.length - 2, ...sobrenomesAbreviados)
		}

		return partesDoNome.join(` `)
	}

	function abreviarSobrenome(sobrenome: string) {
		return sobrenome.charAt(0) + `.`
	}


	let cliente
	let itens
	let descricao
	let sequencial
	let temperatura
	let tipo
	if (caixa?.caixa) {
		cliente = caixa.caixa.cliente
		itens = caixa.caixa.itens
		descricao = caixa.caixa.descricao
		sequencial = caixa.caixa.sequencial
		temperatura = caixa.caixa.temperatura
		tipo = caixa.caixa.tipo
	}


	let usuario
	let data_recebimento
	let data_hora
	if (caixa?.recebimento) {
		usuario = caixa?.recebimento.usuario
		data_recebimento = caixa?.recebimento.data_recebimento
		data_hora = caixa?.recebimento.data_hora
	}


	Font.register({
		family: `Lato`,
		src: Lato,
	})
	Font.register({
		family: `Lato Bold`,
		src: LatoBold,
	})

	const datetime = moment(`${data_recebimento} ${data_hora}`, `DD-MM-YYYY hh:mm:ss`)
		.format(`DD/MM/YYYY hh:mm`)

	const textNaoSeAplica = `Não informado.`

	return (
		<Document>
			<Page size="A4" style={styles.page} wrap>
				{CabecalhoIcones(`Relatório de Itens Recebidos`)}
				{HeaderTemplate(
					{
						cliente: abreviarNomeCompleto(cliente?.nome ?? textNaoSeAplica),
						datetime: datetime ?? `--/--/-- --:--`,
						profissional: usuario?.nome ?? textNaoSeAplica
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
