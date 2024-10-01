import React from 'react'
import {Document, Font, Page, Text, View} from '@react-pdf/renderer'
import LatoBold from './fonts/LatoBold.ttf'
import Lato from './fonts/Lato.ttf'
import {ITermoToPDF} from "@/components/pdf-templates/types.ts"
import {styles} from "@/components/pdf-templates/styles.ts"
import {Style} from "@react-pdf/types/style"
import {RodapeTemplate} from "@/components/pdf-templates/components/RodapeTemplate.tsx"
import {CabecalhoIcones} from "@/components/pdf-templates/components/CabecalhoIcones.tsx"

const HeaderTemplate = (termo?: ITermoToPDF) => {
	const ciclo = termo?.ciclo ?? ``
	const profissional = termo?.usuario ?? ``
	const programacao = termo?.programacao ?? ``
	const dataInicio = termo?.data_hora_inicio
	const dataFim = termo?.data_hora_fim ?? `Data não informada`
	const maquina = termo?.equipamento ?? ``
	const lote = termo?.lote ?? ``
	return (
		<View style={[styles.headerBorderAll, {marginBottom: `10px`}]}>
			<View style={[styles.rowHeader,

			]}>
				<View style={[styles.row,
					{
						alignItems: `baseline`,
					}
				]}>
					<Text style={styles.headerTitle}>
                        Profissional Início:
					</Text>
					<Text style={styles.headerLabel1}>
						{profissional}
					</Text>
				</View>
				<View style={[styles.row,
					{
						alignItems: `baseline`,
					}
				]}>
					<Text style={styles.headerTitle}>
                        Data Hora Início:
					</Text>
					<Text style={styles.headerLabel1}>
						{dataInicio}
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
                        Máquina:
					</Text>
					<Text style={styles.headerLabel1}>
						{maquina}
					</Text>
				</View>
				<View style={[styles.row,
					{
						alignItems: `baseline`,
					}
				]}>
					<Text style={styles.headerTitle}>
                        Ciclo:
					</Text>
					<Text style={styles.headerLabel1}>
						{ciclo}
					</Text>
				</View>
				<View style={[styles.row,
					{
						alignItems: `baseline`,
					}
				]}>
					<Text style={styles.headerTitle}>
                        Prog.:
					</Text>
					<Text style={styles.headerLabel1}>
						{programacao}
					</Text>
				</View>
				<View style={[styles.row,
					{
						alignItems: `baseline`,
					}
				]}>
					<Text style={styles.headerTitle}>
                        Data Hora Fim:
					</Text>
					<Text style={styles.headerLabel1}>
						{dataFim}
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
					<Text style={styles.headerTitle}>
                        Lote:
					</Text>
					<Text style={styles.headerLabel1}>
						{lote}
					</Text>
				</View>
			</View>
		</View>
	)
}

const headerItens = () => {

	const styleHeaderItens: Style[] = [styles.row,
		{
			paddingLeft: `40px`,
			width: `100%`,
			paddingRight: `10px`
		}]
	const styleHeaderItem: Style[] = [styles.itemHeader, styles.flex40p]
	return (

		<View
			style={styleHeaderItens}>
			<Text style={styleHeaderItem}>Serial:</Text>
			<Text style={styleHeaderItem}>Caixa:</Text>
		</View>
	)
}
const headerCliente = (cliente: string) => {
	return (
		<View style={[

			styles.row,
			styles.baseLine,

		]}>
			<Text style={styles.itemHeader2}>Cliente:</Text>
			<Text style={[styles.headerLabel1]}>
				{cliente}
			</Text>
		</View>
	)
}

// @ts-ignore
const PageItensTemplate = (props) => {


	const {itens} = props
	const pages = itens ?? []
	const styleheader: Style[] = [
		styles.row,
		styles.flex40p,
		{
			color: `black`,
			fontSize: `9px`,
			fontFamily: `Lato`,
			textTransform: `uppercase`,
			fontWeight: `normal`,
			textAlign: `left`
		}
	]

	const styleRow: Style[] = [
		{marginTop: `5px`},
		styles.row,
		styles.baseLine,
		{
			paddingLeft: `50px`,
		}

	]

	const pagesTemplates = pages.map((pageItens: {
        cliente: string,
        itens: {
            serial: string,
            caixa: string
        }[]
    }, index: number) => {


		return (
			<View
				key={index + 1}
				style={styles.column}
				wrap={false}>

				{headerCliente(pageItens?.cliente)}

				{headerItens()}

				{pageItens.itens.map((item) => {

					return (
						<View
							key={item.serial}
							style={styleRow}
						>

							<Text style={styleheader}>
								{item.serial}
							</Text>
							<Text style={styleheader}>
								{item.caixa}
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
const TotalItens = (termo?: ITermoToPDF) => {
	let size = 0
	if (termo?.itens) {
		size = termo?.total_itens
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
                caixas
			</Text>

		</View>
	)

}

export const CaixasTermoDesinfectadasTemplate = (termo?: any) => {
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
				{CabecalhoIcones(`Relatório de Caixas Termodesinfectadas`)}
				{HeaderTemplate(termo)}
				{PageItensTemplate(termo)}
				{TotalItens(termo)}
				{RodapeTemplate()}
			</Page>
		</Document>
	)
}
