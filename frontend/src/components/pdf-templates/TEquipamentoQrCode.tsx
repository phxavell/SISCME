import { Document, Font, Image, Page, Text, View } from "@react-pdf/renderer"
import LatoBold from "./fonts/LatoBold.ttf"
import Lato from "./fonts/Lato.ttf"
import { styles } from "@/components/pdf-templates/styles.ts"

const HeaderTemplate = (conteudo: any) => {
	const textNaoSeAplica = `Não informado.`
	let descricao
	let numero_serie
	let fabricante
	let ultima_manutencao
	if (conteudo) {
		descricao = conteudo?.descricao ?? textNaoSeAplica
		numero_serie = conteudo?.numero_serie ?? textNaoSeAplica
		fabricante = conteudo?.fabricante ?? textNaoSeAplica
		ultima_manutencao = conteudo?.ultima_manutencao ?? textNaoSeAplica
	}
	return (
		<View style={styles.column}>
			<View style={[styles.rowHeader3]}>
				<View style={[styles.row, { alignItems: `baseline` }]}>
					<Text style={styles.headerTitle2}>EQUIPAMENTO:</Text>
					<Text style={styles.headerLabel}>{descricao}</Text>
				</View>
			</View>
			<View style={[styles.rowHeader3]}>
				<View style={[styles.row, { alignItems: `baseline` }]}>
					<Text style={styles.headerTitle2}>Nº DE SÉRIE:</Text>
					<Text style={styles.headerLabel}>{numero_serie}</Text>
				</View>
			</View>
			<View style={[styles.rowHeader3]}>
				<View style={[styles.row, { alignItems: `baseline` }]}>
					<Text style={styles.headerTitle2}>FABRICANTE:</Text>
					<Text style={styles.headerLabel}>{fabricante}</Text>
				</View>
			</View>
			<View style={[styles.rowHeader3]}>
				<View style={[styles.row, { alignItems: `baseline` }]}>
					<Text style={styles.headerTitle2}>ÚLT. MANUTENÇÃO:</Text>
					<Text style={styles.headerLabel}>{ultima_manutencao}</Text>
				</View>
			</View>
		</View>
	)
}
/*
* {
    "idequipamento": 9,
    "descricao": "TERMODESINFECTORA 1",
    "numero_serie": "141300210/1",
    "criado_por": {
        "id": 51,
        "username": "JEANE.RODRIGUES",
        "nome": "JEANE RODRIGUES SERRÃO"
    },
    "atualizado_por": {
        "id": 51,
        "username": "JEANE.RODRIGUES",
        "nome": "JEANE RODRIGUES SERRÃO"
    },
    "criado_em": "2024-03-18T22:05:55.598087-04:00",
    "atualizado_em": "2024-03-25T15:39:30.932848-04:00",
    "uuid": "401c9503-d422-4883-845e-07e8733eaf99",
    "data_fabricacao": "2014-04-01",
    "registro_anvisa": "0",
    "capacidade": "0",
    "fabricante": "BAUMER",
    "ativo": true,
    "ultima_manutencao": null,
    "proxima_manutencao": null,
    "disponivel": true,
    "tipo": {
        "id": "TD",
        "valor": "Termodesinfectora"
    }
}*/
export const TEquipamentoQrCode = (conteudo: any) => {
	Font.register({
		family: `Lato`,
		src: Lato,
	})
	Font.register({
		family: `Lato Bold`,
		src: LatoBold,
	})

	//@ts-ignore
	const barcode = conteudo?.imgSrc

	return (
		<Document>
			<Page
				size={`B8`}
				orientation="portrait"
				style={styles.pageQrcode}
				wrap
			>
				{HeaderTemplate(conteudo)}
				<Image style={styles.logoQRCode} src={barcode} />
			</Page>
		</Document>
	)
}
