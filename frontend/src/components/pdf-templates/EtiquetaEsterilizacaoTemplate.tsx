import { Document, Font, Page, Text, View } from '@react-pdf/renderer'
import Lato from './fonts/Lato.ttf'
import LatoBold from './fonts/LatoBold.ttf'
import { styles } from './styles'
import { DadosPdfEtiquetaEsterilizacao } from '@/pages/por-grupo/tecnico-cme/processos/esterilizacao/PesquisarEsterilizacao/modal-etiqueta-esterilizacao'

interface ModalEtiquetaEsterilizacaoProps {
	dadosEtiqueta: DadosPdfEtiquetaEsterilizacao;
}

const currentDateTime = new Date().toLocaleString(`pt-BR`, {
	day: `2-digit`,
	month: `2-digit`,
	year: `numeric`,
	hour: `2-digit`,
	minute: `2-digit`,
	second: `2-digit`,
	hour12: false,
})

const RodapeTemplate = (
	dadosEtiqueta: DadosPdfEtiquetaEsterilizacao,
	currentIndex: number,
	totalItems: number
) => {
	const numeradorSequencial = `${currentIndex} de ${totalItems}`
	return (
		<View style={{
			display: `flex`,
			flexDirection: `column`,
			alignItems: `baseline`,
			height: `80%`,
			justifyContent: `space-evenly`,
			width: `100%`,
		}}>
			<View style={{
				display: `flex`,
				flexDirection: `column`,
				alignItems: `baseline`,
				height: `auto`,
				width: `100%`,
			}}>
				<View style={[styles.row]}>
					<Text style={{fontSize: `10px`}}>
						<Text style={[styles.headerTitle]}>
							EQUIPAMENTO:
						</Text>
						{`  ${dadosEtiqueta?.equipamento}`}
					</Text>
				</View>
				<View style={[styles.row, {
					marginBottom: `3vh`
				}]}>
					<Text style={styles.headerTitle}>
						CICLO:
					</Text>
					<Text style={{ marginLeft: `3px`, fontSize: 10}}>
						{dadosEtiqueta?.ciclo}
					</Text>
				</View>
			</View>
			<View style={{ display: `flex`, flexDirection: `column` }}>
				<Text style={[styles.headerTitle]}>
					{currentDateTime.toUpperCase()} - {numeradorSequencial.toUpperCase()}
				</Text>

			</View>
		</View>
	)
}

export const EtiquetaEsterilizacaoTemplate = ({ dadosEtiqueta }: ModalEtiquetaEsterilizacaoProps) => {
	Font.register({
		family: `Lato`,
		src: Lato,
		fontWeight: `bold`
	})
	Font.register({
		family: `Lato Bold`,
		src: LatoBold,
		fontWeight: `bold`
	})

	const mountData = () => {
		const defaultMessage = (
			<View style={[styles.rowHeader3, { marginBottom: `15px` }]}>
				<View style={[styles.row, { alignItems: `baseline` }]}>
					<Text style={{
						fontSize: `10px`,
					}}>
						Erro ao buscar detalhes da Esterilização
					</Text>
				</View>
			</View>
		)

		if (!dadosEtiqueta) {
			return defaultMessage
		}

		if (!dadosEtiqueta) {
			return defaultMessage
		}

		return dadosEtiqueta.itens.map((item: any, index: any) => {
			return (
				<Page key={index} size="B9"
					orientation="landscape"
					style={[styles.pageEtiqueta, {
						padding: `10px`,
						justifyContent: `flex-start`
					}]} wrap>
					<View style={{ display: `flex`, alignItems: `baseline`, height: `8px`, marginBottom: `8px`, }}>
						<View style={{ alignItems: `baseline` }}>
							<Text style={styles.headerTitle}>
								{dadosEtiqueta.cliente}
							</Text>
						</View>
					</View>
					{RodapeTemplate(dadosEtiqueta, index + 1, dadosEtiqueta.itens.length)}
				</Page>
			)
		})
	}

	return (
		<Document>
			{mountData()}
		</Document>
	)
}
