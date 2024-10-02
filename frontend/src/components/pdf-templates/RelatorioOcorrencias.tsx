import {Document, Font, Page, Text, View} from "@react-pdf/renderer"
import {IRelatorioOcorrenciaToPDF} from "./types"
import LatoBold from './fonts/LatoBold.ttf'
import Lato from './fonts/Lato.ttf'
import {styles} from "./styles"
import moment from "moment"
import {IHospitalData} from "@/pages/por-grupo/gerente/generics/componentes/grafico/types"
import {RodapeTemplate} from "@/components/pdf-templates/components/RodapeTemplate.tsx"
import {CabecalhoIcones2} from "@/components/pdf-templates/components/CabecalhoIcones2.tsx"


const HeaderTemplate: React.FC<IRelatorioOcorrenciaToPDF> = (props) => {
	const dateRange = props.dateInterval && props.dateInterval.length === 2 ?
		`De ${moment(props.dateInterval[0]).format(`DD/MM/YYYY`)} até ${moment(props.dateInterval[1]).format(`DD/MM/YYYY`)}`
		: `Não especificado`

	const selectedClientesArray = Array.isArray(props.selectedClientes) ? props.selectedClientes : []
	const selectedClientesNames = props.clientesDropdown
		.filter(c => selectedClientesArray.includes(c.value))
		.map(c => c.label)
		.join(`, `) || `Nenhum cliente selecionado`


	return (
		<View fixed style={styles.headerWithoutBorder}>
			<View style={[styles.rowHeader,

			]}>
				<View style={[styles.rowWithGap,
					{
						alignItems: `baseline`,
					}
				]}>
					<View style={[styles.row,
						{
							alignItems: `baseline`,

						}
					]}>
						<Text style={styles.headerTitle}>
                            Clientes Selecionados:
						</Text>
						<Text style={styles.headerLabel}>
							{selectedClientesNames}
						</Text>
					</View>
					<View style={[styles.row,
						{
							alignItems: `baseline`,

						}
					]}>
					</View>
				</View>
				<View style={[styles.row,
					{
						alignItems: `baseline`,
					}
				]}>
				</View>
			</View>
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
						{dateRange}
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
				styles.flex20p,
			]}>Qtd.</Text>
		</View>
	)
}

const PageItensTemplate = (props: any) => {
	const rows: IHospitalData[] = []

	if (props.data && props.data.clientes) {
		Object.entries(props.data.clientes).forEach(([hospitalName, clientData]) => {
			props.data.tipos.forEach((tipo: any) => {
				//@ts-ignore
				if (clientData.tipos[tipo.tipo]) {
					rows.push({
						hospitalName,
						//@ts-ignore
						quantidade: clientData.tipos[tipo.tipo],
						tipo: tipo.tipo,
					})
				}
			})
		})
	}

	const pages: any[] = []
	for (let i = 0; i < rows.length; i += 20) {
		const page = rows.slice(i, i + 20)
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
								{item.hospitalName}
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

export const RelatorioOcorrenciasPDF: React.FC<IRelatorioOcorrenciaToPDF> = (props) => {

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
				{HeaderTemplate(props)}
				{PageItensTemplate(props)}
				{RodapeTemplate()}

			</Page>
		</Document>
	)

}
