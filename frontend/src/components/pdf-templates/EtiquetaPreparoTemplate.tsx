import {Document, Font, Image, Page, Text, View} from '@react-pdf/renderer'
import LatoBold from './fonts/LatoBold.ttf'
import Lato from './fonts/Lato.ttf'
import {IPreparoToPDF} from "@/components/pdf-templates/types.ts"
import {styles} from "@/components/pdf-templates/styles.ts"

const HeaderTemplate = (conteudo: IPreparoToPDF) => {

	const textNaoSeAplica = `Não informado.`

	let cliente
	let caixa
	let cautela
	let temperatura
	const usuario = conteudo?.recebimento?.usuario.nome

	if (conteudo?.caixa) {
		cliente = conteudo.caixa?.cliente ?? textNaoSeAplica
		caixa = conteudo.caixa?.descricao ?? textNaoSeAplica
		cautela = conteudo.caixa?.cautela ?? textNaoSeAplica
		temperatura = conteudo.caixa?.temperatura ?? textNaoSeAplica
	}

	const codigo = conteudo?.codigo ?? textNaoSeAplica


	return (
		<View style={styles.column}>
			<View style={[styles.rowHeader,

			]}>
				<View style={[styles.row, {alignItems: `baseline`}]}>
					<Text style={styles.headerTitle}>
                        Cliente:
					</Text>
					<Text style={styles.headerLabelEtiqueta}>
						{cliente}
					</Text>
				</View>
			</View>
			<View style={[styles.rowHeader,

			]}>
				<View style={[styles.row, {alignItems: `baseline`}]}>
					<Text style={styles.headerTitleEtiqueta}>
                        Caixa:
					</Text>
					<Text style={styles.headerLabelEtiqueta}>
						{caixa}
					</Text>
				</View>
			</View>
			<View style={styles.rowHeader}>
				<View style={[styles.row,
					{
						alignItems: `baseline`,
					}
				]}>
					<Text style={styles.headerTitleEtiqueta}>
                        Cautela:
					</Text>
					<Text style={styles.headerLabelEtiqueta}>
						{cautela}
					</Text>
				</View>
				<View style={[styles.row,
					{
						alignItems: `baseline`,
					}
				]}>
					<Text style={styles.headerTitleEtiqueta}>
                        Qtd:
					</Text>
					<Text style={styles.headerLabelEtiqueta}>
						{codigo}
					</Text>
				</View>
				<View style={[styles.row,
					{
						alignItems: `baseline`,
					}
				]}>
					<Text style={styles.headerTitleEtiqueta}>
                        Temp:
					</Text>
					<Text style={styles.headerLabelEtiqueta}>
						{temperatura}º
					</Text>
				</View>

			</View>
			<View style={styles.rowHeader}>
				<View style={[styles.row,
					{
						alignItems: `baseline`,
					}
				]}>
					<Text style={styles.headerTitleEtiqueta}>
                        Data de preparo:
					</Text>
					<Text style={styles.headerLabelEtiqueta}>
						{conteudo?.recebimento?.data_hora}
					</Text>
				</View>
				<View style={[styles.row,
					{
						alignItems: `baseline`,
					}
				]}>
					<Text style={styles.headerTitleEtiqueta}>
                        Válido até:
					</Text>
					<Text style={styles.headerLabelEtiqueta}>
						{conteudo?.recebimento?.data_recebimento}
					</Text>
				</View>

			</View>
			<View style={styles.rowHeader}>
				<View style={[styles.row,
					{
						alignItems: `baseline`,
					}
				]}>
					<Text style={styles.headerTitleEtiqueta}>
                        Por:
					</Text>
					<Text style={[styles.headerLabelEtiqueta, {
						width: `200px`,
						flexWrap: `wrap`,

					}]}
					orphans={2}

					>
						{usuario}

					</Text>
				</View>
			</View>
		</View>
	)
}

const RodapeTemplate = (conteudo: IPreparoToPDF) => {

	return (
		<View
			fixed
			style={[styles.row,

				{
					alignItems: `baseline`,
					justifyContent: `space-evenly`
				}
			]}>
			<View
				style={[styles.row,

					{
						alignItems: `baseline`,

					}
				]}>
				<Text style={styles.headerTitleEtiqueta}>
                    RT:
				</Text>
				<Text style={styles.headerLabelEtiqueta}

				>
					{conteudo.responsavel_tecnico_nome}
				</Text>
			</View>
			<View
				style={[styles.row,
					{
						alignItems: `baseline`,

					}
				]}>
				<Text style={styles.headerTitleEtiqueta}>
                    COREN:
				</Text>
				<Text style={styles.headerLabelEtiqueta}>
					{conteudo.responsavel_tecnico_coren}
				</Text>
			</View>
		</View>
	)
}

export const EtiquetaPreparoTemplate = (conteudo: IPreparoToPDF) => {
	Font.register({
		family: `Lato`,
		src: Lato,
	})
	Font.register({
		family: `Lato Bold`,
		src: LatoBold,
	})

	//@ts-ignore
	const barcode = conteudo?.barcodeSrc

	return (
		<Document>
			<Page size="B8"
				orientation="landscape"
				style={styles.pageEtiqueta} wrap>
				{HeaderTemplate(conteudo)}
				<Image
					style={styles.logo}
					src={barcode}
				/>
				{RodapeTemplate(conteudo)}
			</Page>
		</Document>
	)
}
