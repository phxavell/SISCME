import {Document, Font, Image, Page, Text, View} from '@react-pdf/renderer'
import LatoBold from './fonts/LatoBold.ttf'
import Lato from './fonts/Lato.ttf'
import {IPreparoToPDF} from "@/components/pdf-templates/types.ts"
import {styles} from "@/components/pdf-templates/styles.ts"

const HeaderTemplate = (conteudo: IPreparoToPDF) => {
	const textNaoSeAplica = `Não informado.`
	let cliente
	let caixa
	let temperatura
	const usuario = conteudo?.recebimento?.usuario.nome

	if (conteudo?.caixa) {
		cliente = conteudo.caixa?.cliente ?? textNaoSeAplica
		caixa = conteudo.caixa?.descricao ?? textNaoSeAplica
		temperatura = conteudo.caixa?.temperatura ?? textNaoSeAplica
	}

	const codigo = conteudo?.codigo ?? textNaoSeAplica
	const ciclo_termodesinfeccao = conteudo.cautela ?? textNaoSeAplica
	const usuario_preparo_coren =conteudo?.usuario_preparo_coren
	return (
		<View style={styles.column}>
			<View style={[styles.rowHeader3]}>
				<View style={[styles.row, {alignItems: `baseline`}]}>
					<Text style={styles.headerTitle}>
						{cliente}
					</Text>
				</View>
			</View>
			<View style={[styles.rowHeader3]}>
				<View style={[styles.row, {alignItems: `baseline`}]}>
					<Text style={styles.headerTitle}>
						{caixa}
					</Text>
				</View>
			</View>
			<View style={styles.rowHeader3}>
				<View style={[styles.row,{alignItems: `baseline`,}]}>
					<Text style={styles.headerTitleEtiqueta1}>
                        Ciclo:
					</Text>
					<Text style={styles.headerLabelEtiqueta1}>
						{ciclo_termodesinfeccao}
					</Text>
				</View>
				<View style={[styles.row,{alignItems: `baseline`,}]}>
					<Text style={styles.headerTitleEtiqueta1}>
                        Qtd:
					</Text>
					<Text style={styles.headerLabelEtiqueta1}>
						({codigo})
					</Text>
				</View>
				<View style={[styles.row,{alignItems: `baseline`, marginRight: `50px`,}]}>
					<Text style={styles.headerTitleEtiqueta1}>
                        Temp:
					</Text>
					<Text style={styles.headerLabelEtiqueta1}>
						{temperatura}º
					</Text>
				</View>

			</View>
			<View style={styles.rowHeader}>
				<View style={[styles.row, {alignItems: `baseline`,}]}>
					<Text style={styles.headerTitleEtiqueta1}>
                        Dt esterilização:
					</Text>
					<Text style={styles.headerLabelEtiqueta1}>
						{conteudo?.recebimento?.data_hora}
					</Text>
				</View>
				<View style={[styles.row,{alignItems: `baseline`, marginRight: `8px`,}]}>
					<Text style={styles.headerTitleEtiqueta1}>
                        Dt validade:
					</Text>
					<Text style={styles.headerLabelEtiqueta1}>
						{conteudo?.recebimento?.data_recebimento}
					</Text>
				</View>

			</View>
			<View style={styles.rowHeader}>
				<View style={[styles.row,{alignItems: `baseline`}]}>
					<Text style={styles.headerTitleEtiqueta1}>
                        Tec.:
					</Text>
					<Text style={[styles.headerLabelEtiqueta1]}	orphans={1}>
						{usuario}
					</Text>
				</View>
				<View style={[styles.row,{alignItems: `baseline`, marginRight: `20px`}]}>
					<Text style={styles.headerTitleEtiqueta1}>
                        COREN-TEC:
					</Text>
					<Text style={[styles.headerLabelEtiqueta1]}>
						{usuario_preparo_coren}
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
				style={[styles.row,{alignItems: `baseline`,}]}>
				<Text style={styles.headerTitleEtiqueta}>
          RT:
				</Text>
				<Text style={styles.headerLabelEtiqueta}>
					{conteudo.responsavel_tecnico_nome}
				</Text>
			</View>
			<View
				style={[styles.row,{alignItems: `baseline`,}]}>
				<Text style={styles.headerTitleEtiqueta}>
          COREN-ENF:
				</Text>
				<Text style={styles.headerLabelEtiqueta}>
					{conteudo.responsavel_tecnico_coren}
				</Text>
			</View>
		</View>
	)
}

export const EtiquetaPreparoIntraHospitalarTemplate = (conteudo: IPreparoToPDF) => {
	Font.register({
		family: `Lato`,
		src: Lato,
	})
	Font.register({
		family: `Lato Bold`,
		src: LatoBold,
	})

	const milimetro = (numero: number) => {return numero * 2.83465}
	//@ts-ignore
	const barcode = conteudo?.barcodeSrc

	return (
		<Document>
			<Page size={{height: milimetro(100), width: milimetro(60)}}
				orientation="landscape"
				style={styles.pageEtiqueta} wrap>
				{HeaderTemplate(conteudo)}
				<Image
					style={styles.logo48}
					src={barcode}
				/>
				{RodapeTemplate(conteudo)}
			</Page>
		</Document>
	)
}
