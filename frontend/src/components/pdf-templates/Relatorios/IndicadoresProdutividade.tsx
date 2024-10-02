import {Document, Font, Page, Text, View} from "@react-pdf/renderer"
import LatoBold from '../fonts/LatoBold.ttf'
import Lato from '../fonts/Lato.ttf'
import {styles} from "../styles"
import moment from "moment"
import {RodapeTemplate} from "@/components/pdf-templates/components/RodapeTemplate.tsx"
import {CabecalhoIcones2} from "@/components/pdf-templates/components/CabecalhoIcones2.tsx"

const HeaderTemplate:  React.FC<any> = (props) => {
	const dateRange = () => {
		if(props?.data_deDebounce && props?.data_ateDebounce) {
			return `De ${moment(props?.data_de).format(`DD/MM/YYYY`)} até ${moment(props?.data_ate).format(`DD/MM/YYYY`)}`
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

			styles.rowMargin,
			styles.baseLine,

		]}>
			<Text style={[
				styles.itemHeaderMin,
				styles.flex80p,
			]}>Hospital</Text>
			<Text style={[
				styles.itemHeaderMin,
				styles.flex30p,
			]}>Qtd. Recebidos</Text>
			<Text style={[
				styles.itemHeaderMin,
				styles.flex30p,
			]}>Qtd. Distribuídos</Text>
			<Text style={[
				styles.itemHeaderMin,
				styles.flex30p,
			]}>Aproveitamento</Text>
		</View>
	)
}

const PageItensTemplate = (props: any) => {
	const itens = props?.data?.data?.por_cliente ?? []
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
					const fontSizeCliente = () => {
						if (item.cliente.nome.length > 30) {
							return `10px`
						} else {
							return `12px`
						}

					}
					const abreviarNomeHospital = (nome:any, limiteCaracteres:any) => {
						if (nome.length <= limiteCaracteres) {
							return nome
						} else {
							return nome.substring(0, limiteCaracteres) + `...`
						}
					}
					return (
						<View
							key={index + 1}
							style={[
								styles.row,
								styles.baseLine,
								styles.borderBottom,
								{
									justifyContent: `space-between`,
									marginTop: `10px`
								}
							]}>

							<Text style={[
								styles.flex80p,
								styles.itemLabel,
								{
									width: `410px`,
									fontSize: fontSizeCliente()
								}

							]}>
								{abreviarNomeHospital(item.cliente.nome, 45)}
							</Text>
							<Text style={[
								styles.flex20p,
								styles.itemLabel,

							]}>
								{item.qtd_recebimento}
							</Text>
							<Text style={[
								styles.flex20p,
								styles.itemLabel,

							]}>
								{item.qtd_distribuicao}
							</Text>
							<Text style={[
								styles.flex20p,
								styles.itemLabel,

							]}>
								{item.aproveitamento + `%`}
							</Text>

						</View>
					)

				})}
			</View>
		)
	})

	return pagesTemplates
}

export const IndicadoresProdutividadePDF: React.FC<any> = (props) => {

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
