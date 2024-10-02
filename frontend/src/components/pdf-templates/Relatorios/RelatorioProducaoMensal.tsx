import {Document, Font, Page, Text, View} from "@react-pdf/renderer"
import LatoBold from '../fonts/LatoBold.ttf'
import Lato from '../fonts/Lato.ttf'
import {styles} from "../styles"
import moment from "moment"
import {RodapeTemplate} from "@/components/pdf-templates/components/RodapeTemplate.tsx"
import {CabecalhoIcones2} from "@/components/pdf-templates/components/CabecalhoIcones2.tsx"

const HeaderTemplate: React.FC<any> = (props) => {
	const dateRange = () => {
		if (props) {
			return `De ${moment(props[0]).format(`DD/MM/YYYY`)} até ${moment(props[1]).format(`DD/MM/YYYY`)}`
		} else {
			return `Não especificado`
		}
	}

	return (
		<View fixed style={styles.headerWithoutBorder}>
			<View style={styles.rowHeader}>
				<View style={[styles.row,
					{
						alignItems: `baseline`,
					}
				]}>
					<Text style={styles.headerTitle}>
                        Data Selecionada:
					</Text>
					<Text style={styles.headerLabelSemUppercase}>
						{dateRange()}
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
			{marginTop: `15px`}

		]}>
			<Text style={[
				styles.itemHeaderMin,
				styles.flex80p,
			]}>Cliente</Text>
			<Text style={[

				styles.itemHeaderMin,
				styles.flex20p,
			]}>Quantidade</Text>
		</View>
	)
}

const PageItensTemplate = (props: any) => {
	const itens = props?.data?.data?.preparos_por_cliente ?? []
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
								{item?.cliente__nomecli}
							</Text>
							<Text style={[
								styles.flex20p,
								styles.itemLabel,

							]}>
								{item?.quantidade}
							</Text>
						</View>
					)

				})}
			</View>
		)
	})

	return pagesTemplates
}

export const RelatorioProducaoMensalPDF: React.FC<any> = (props) => {

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
				{CabecalhoIcones2(props.titulo)}
				{HeaderTemplate(props.datasRange)}
				{PageItensTemplate(props)}
				{RodapeTemplate()}

			</Page>
		</Document>
	)

}
