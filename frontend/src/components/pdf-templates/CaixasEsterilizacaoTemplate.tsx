import {Document, Font, Page, Text, View} from "@react-pdf/renderer"
import LatoBold from './fonts/LatoBold.ttf'
import Lato from './fonts/Lato.ttf'
import {styles} from "@/components/pdf-templates/styles.ts"
import React from "react"
import {Style} from "@react-pdf/types/style"
import {RodapeTemplate} from "@/components/pdf-templates/components/RodapeTemplate.tsx"
import {CabecalhoIcones} from "@/components/pdf-templates/components/CabecalhoIcones.tsx"

//@ts-ignore
const HeaderTemplate = (conteudo) => {

	const textNaoInformado = `Não informado.`
	const header = {
		profissional: conteudo?.usuario ?? textNaoInformado,
		data_inicio: conteudo?.data_hora_inicio ?? textNaoInformado,
		data_fim: conteudo?.data_hora_fim ?? textNaoInformado,
		maquina: conteudo?.equipamento ?? textNaoInformado,
		ciclo: conteudo?.ciclo ?? textNaoInformado,
		programacao: conteudo?.programacao ?? textNaoInformado,
		lote: conteudo?.lote ?? textNaoInformado,
	}
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
                        Profisional:
					</Text>
					<Text style={styles.headerLabel}>
						{header.profissional}
					</Text>
				</View>
				<View style={[styles.row,
					{
						alignItems: `baseline`,
					}
				]}>
					<Text style={styles.headerTitle}>
                        Início:
					</Text>
					<Text style={styles.headerLabel}>
						{header.data_inicio}
					</Text>
				</View>
				<View style={[styles.row,
					{
						alignItems: `baseline`,
					}
				]}>
					<Text style={styles.headerTitle}>
                        Fim:
					</Text>
					<Text style={styles.headerLabel}>
						{header.data_fim}
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
					<Text style={styles.headerLabel}>
						{header.maquina}
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
					<Text style={styles.headerLabel}>
						{header.ciclo}
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
					<Text style={styles.headerLabel}>
						{header.programacao}
					</Text>
				</View>
				<View style={[styles.row,
					{
						alignItems: `baseline`,
					}
				]}>
					<Text style={styles.headerTitle}>
                        Lote:
					</Text>
					<Text style={styles.headerLabel}>
						{header.lote}
					</Text>
				</View>
			</View>
		</View>
	)
}

const headerItens = () => {
	const styleheader: Style[] = [
		styles.itemHeader,
		styles.flex30p,
		{
			fontFamily: `Lato Bold`,
			marginTop: `8px`
		}
	]
	return (
		<View style={[
			styles.row,
			styles.baseLine,
		]}>
			<Text style={styleheader}>Cliente</Text>
			<Text style={[

				styles.itemHeader,
				styles.flex30p,
				{
					fontFamily: `Lato Bold`
				}
			]}>Serial</Text>
			<Text style={[
				styles.itemHeader,
				styles.flex30p,
				{
					fontFamily: `Lato Bold`
				}
			]}>Caixa</Text>
		</View>
	)
}

// @ts-ignore
const PageItensTemplate = (conteudo) => {
	const {itens_por_cliente} = conteudo
	const pages = itens_por_cliente ?? []

	const styleheader: Style[] = [
		styles.row,
		styles.flex30p,
		{
			color: `black`,
			fontSize: `9px`,
			fontFamily: `Lato`,
			textTransform: `uppercase`,
			fontWeight: `normal`,
			width: `auto`
		}
	]

	const styleRow: Style[] = [
		{marginTop: `10px`},
		styles.row,
		styles.baseLine,
		{
			justifyContent: `space-between`
		}

	]

	const pagesTemplates = pages.map((pageItens: {
        cliente: string
        itens: {
            serial: string
            caixa: string
        }[]
    }, index: number) => {

		return (
			<View
				key={index + 1}
				style={styles.column}
				wrap={false}>

				{headerItens()}
				<View
					style={styleRow}>
					<Text style={styleheader}>
						{pageItens?.cliente}
					</Text>
					<Text style={styleheader}>

					</Text>
					<Text style={styleheader}>
					</Text>
				</View>

				{pageItens.itens.map((item) => {
					return (
						<View
							key={item.serial}
							style={styleRow}>
							<Text style={styleheader}>

							</Text>
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
const TotalItens = (conteudo?: ITermoToPDF) => {
	let size = 0
	if (conteudo?.total_itens) {
		size = conteudo?.total_itens
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
				// styles.borderBottom
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
					// backgroundColor:`red`,
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
                caixas
			</Text>

		</View>
	)
}

export const CaixasEsterilizacaoTemplate = (conteudo: any) => {
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
				{CabecalhoIcones(`Relatório de Caixas Esterilizadas`)}
				{HeaderTemplate(conteudo)}
				{PageItensTemplate(conteudo)}
				{TotalItens(conteudo)}
				{RodapeTemplate()}
			</Page>
		</Document>
	)
}
