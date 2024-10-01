import {Document, Font, Page, Text, View} from "@react-pdf/renderer"
import LatoBold from '../fonts/LatoBold.ttf'
import Lato from '../fonts/Lato.ttf'
import {styles} from "../styles"
import moment from "moment"
import {RodapeTemplate} from "@/components/pdf-templates/components/RodapeTemplate.tsx"
import {CabecalhoIcones2} from "@/components/pdf-templates/components/CabecalhoIcones2.tsx"

const HeaderTemplate: React.FC<any> = (props) => {
	const dateRange = () => {
		if (props?.length == 2) {
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

			styles.rowMargin,
			styles.baseLine,

		]}>
			<Text style={[
				styles.itemHeaderMin,
				styles.flex40p,
				{fontSize: `8px`}
			]}>Equipamento</Text>
			<Text style={[
				styles.itemHeaderMin,
				styles.flex20p,
				{fontSize: `8px`}

			]}>Ciclos</Text>
			<Text style={[
				styles.itemHeaderMin,
				styles.flex30p,
				{fontSize: `8px`}

			]}>Em andamento</Text>
			<Text style={[
				styles.itemHeaderMin,
				styles.flex25p,
				{fontSize: `8px`}

			]}>Finalizados</Text>
			<Text style={[
				styles.itemHeaderMin,
				styles.flex25p,
				{fontSize: `8px`}

			]}>Abortados</Text>
			<Text style={[
				styles.itemHeaderMin,
				styles.flex30p,
				{fontSize: `8px`}

			]}>Tempo Funcionando</Text>
			<Text style={[
				styles.itemHeaderMin,
				styles.flex30p,
				{fontSize: `8px`}

			]}>Tempo Parado</Text>
		</View>
	)
}

const PageItensTemplate = (props: any) => {
	const itens = props?.data?.data?.por_equipamento ?? []
	const pages: any[] = []
	for (let i = 0; i < itens.length; i += 20) {
		const page = itens.slice(i, i + 20)
		pages.push(page)
	}

	const pagesTemplates: React.JSX.Element[] = pages.map((pageItens: any[], index: number) => {
		const tempoTotalFormatado = (tempoSegundos: any) => {
			const duration = moment.duration(tempoSegundos, `seconds`)
			const dias = Math.floor(duration.asDays())
			const horas = duration.asHours() % 24
			if (duration.asDays() == 1) {
				return `${dias} dia ${Math.floor(horas).toString().padStart(2, `0`)}:${duration.minutes().toString().padStart(2, `0`)}:${duration.seconds().toString().padStart(2, `0`)}`
			} else if (duration.asDays() > 1) {
				return `${dias} dias ${Math.floor(horas).toString().padStart(2, `0`)}:${duration.minutes().toString().padStart(2, `0`)}:${duration.seconds().toString().padStart(2, `0`)}`
			} else {
				return `${Math.floor(duration.asHours()).toString().padStart(2, `0`)}:${duration.minutes().toString().padStart(2, `0`)}:${duration.seconds().toString().padStart(2, `0`)}`
			}
		}

		return (
			<View
				key={index + 1}
				style={styles.column}
				wrap={false}>

				{headerItens()}

				{pageItens.map((item) => {
					const fontSizeCliente = () => {
						if (item.equipamento.nome.length > 30) {
							return `8px`
						} else {
							return `9px`
						}

					}
					const abreviarNomeEquipamento = (nome: any, limiteCaracteres: any) => {
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
									alignItems: `center`,
									marginTop: `10px`
								}
							]}>

							<Text style={[
								styles.flex40p,
								styles.itemLabel,
								{
									fontSize: fontSizeCliente()
								}

							]}>
								{abreviarNomeEquipamento(item.equipamento.nome, 45)}
							</Text>
							<Text style={[
								styles.flex20p,
								styles.itemLabel,
								{fontSize: `8px`}

							]}>
								{item.ciclos}
							</Text>
							<Text style={[
								styles.flex30p,
								styles.itemLabel,
								{fontSize: `8px`}

							]}>
								{item.ciclos_em_andamento}
							</Text>
							<Text style={[
								styles.flex25p,
								styles.itemLabel,
								{fontSize: `8px`}

							]}>
								{item.ciclos_finalizados}
							</Text>
							<Text style={[
								styles.flex25p,
								styles.itemLabel,
								{fontSize: `8px`}

							]}>
								{item.ciclos_abortados}
							</Text>
							<Text style={[
								styles.flex30p,
								styles.itemLabel,
								{fontSize: `8px`}

							]}>
								<Text>
									{tempoTotalFormatado(item?.tempo_total)}
								</Text>
								<Text style={{textTransform: `lowercase`}}>
                                    s
								</Text>

							</Text>
							<Text style={[
								styles.flex30p,
								styles.itemLabel,
								{fontSize: `8px`}

							]}>
								<Text>
									{tempoTotalFormatado(item?.tempo_parado)}
								</Text>
								<Text style={{textTransform: `lowercase`}}>
                                    s
								</Text>

							</Text>

						</View>
					)

				})}
			</View>
		)
	})

	return pagesTemplates
}

export const RelatorioEficienciaPDF: React.FC<any> = (props) => {

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
