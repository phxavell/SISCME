import {Document, Font, Page, Text, View} from "@react-pdf/renderer"
import LatoBold from './fonts/LatoBold.ttf'
import Lato from './fonts/Lato.ttf'
import {styles} from "@/components/pdf-templates/styles.ts"
import moment from "moment/moment"
import {RodapeTemplate} from "@/components/pdf-templates/components/RodapeTemplate.tsx"
import {CabecalhoIcones} from "@/components/pdf-templates/components/CabecalhoIcones.tsx"

//@ts-ignore
const HeaderTemplate = (conteudo) => {
	const textNaoInformado = `Não informado.`
	const formatarPeriodo = (conteudo: any) => {
		const formatDate = (data: any) => moment(data).format(`DD/MM/YYYY`)
		if (conteudo?.fromDate) {
			return `de ${formatDate(conteudo?.fromDate)} até ${formatDate(conteudo?.toDate)}`
		} else {
			return textNaoInformado
		}
	}
	const header = {
		cliente: conteudo?.dadosParaPDF[0]?.[0]?.nomecliente ?? textNaoInformado,
		periodo: formatarPeriodo(conteudo),
	}
	return (
		<View style={[styles.headerBorderAll, {marginTop: `5px`}]}>
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
					<Text style={styles.headerLabel}>
						{header?.cliente}
					</Text>
				</View>
				<View style={[styles.row,
					{
						alignItems: `baseline`,
					}
				]}>
					<Text style={styles.headerTitle}>
                        Período Selecionado:
					</Text>
					<Text style={styles.headerLabel}>
						{header?.periodo}
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
			{marginTop: `5px`}
		]}>
			<Text style={[

				styles.itemHeader,
				styles.flex50p,
				{
					fontFamily: `Lato Bold`,
					fontSize: `12px`
				}
			]}>Processo</Text>
			<Text style={[
				styles.itemHeader,
				styles.flex70p,
				{
					fontFamily: `Lato Bold`,
					fontSize: `12px`
				}
			]}>Nome</Text>
			<Text style={[
				styles.itemHeader,
				styles.flex30p,
				{
					fontFamily: `Lato Bold`,
					fontSize: `12px`
				}
			]}>Data</Text>
		</View>
	)
}

const PageItensTemplate = (conteudo: any) => {
	const pages = conteudo ?? []

	const pagesTemplates = pages?.map((pageItens: any, index: number) => {
		return (
			<View
				key={index + 1}
				style={styles.column}
				wrap={false}>
				{headerItens()}
				<View style={[
					{
						marginTop: `3px`,
						borderBottom: `1px solid black`,
						paddingBottom: `10px`,
						marginBottom: `10px`
					}
				]}>
					{pageItens?.map((item: any) => {
						const formatarData = (data: any) => {
							return moment(data).format(`DD/MM/YYYY HH:mm`)
						}
						return (

							<View
								key={item?.idevento}
								style={[
									{marginTop: `3px`},
									styles.row,
									styles.baseLine,
								]}>
								<Text style={[
									styles.itemLabel,
									styles.flex50p,
									{fontSize: `10px`}
								]}>
									{item?.status}
								</Text>
								<Text style={[
									styles.itemLabel,
									styles.flex70p,
									{fontSize: `10px`}
								]}>
									{item?.usuario?.nome}
								</Text>
								<Text style={[
									styles.itemLabel,
									styles.flex30p,
									{fontSize: `10px`}
								]}>
									{formatarData(item?.criado_em)}
								</Text>
							</View>


						)

					}).reverse()}
				</View>
			</View>
		)
	})

	return pagesTemplates
}

export const HistoricoSeriaisPDF = (conteudo: any) => {
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
				{CabecalhoIcones(`Histórico do Serial ${conteudo?.serial ?? ``}`)}
				{HeaderTemplate(conteudo)}
				{PageItensTemplate(conteudo?.dadosParaPDF)}
				{RodapeTemplate()}
			</Page>
		</Document>
	)
}
