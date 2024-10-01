import { Document, Font, Page, Text, View } from "@react-pdf/renderer"
import LatoBold from "./fonts/LatoBold.ttf"
import Lato from "./fonts/Lato.ttf"
import { styles } from "@/components/pdf-templates/styles.ts"
import { DataEtiqueta } from "@/infra/integrations/processo/types-etiquetas"
import moment from "moment"

import {ShowTemperatura} from "@/components/pdf-templates/ShowTemperatura.tsx"

const showSetor = (setor: any) => {
	if (setor?.descricao) {
		return (
			<View
				style={[
					styles.row,
					{
						alignItems: `center`,
						marginTop: `-5px`,
					},
				]}
			>
				<Text
					style={[
						styles.headerTitleEtiquetaSize,
						{ fontSize: `8px` },
					]}
				>
                    SETOR:
				</Text>
				<Text
					style={[
						styles.headerLabelEtiqueta,
						{ fontSize: `8px`, marginTop: `-1px` },
					]}
				>
					{setor?.descricao}
				</Text>
			</View>
		)
	} else {
		return <></>
	}
}
const HeaderTemplate = (conteudo: DataEtiqueta) => {
	const textNaoSeAplica = `Não informado.`

	let cliente

	if (conteudo?.cliente) {
		cliente = conteudo?.cliente?.nome ?? textNaoSeAplica
	}

	return (
		<View style={styles.column}>
			<View style={[styles.row, { alignItems: `baseline` }]}>
				<Text
					style={{
						fontSize: `10px`,
					}}
				>
					{cliente}
				</Text>
			</View>

			<View style={styles.rowHeader}>
				<View
					style={[
						styles.row,
						{
							alignItems: `center`,
							marginTop: `5px`,
						},
					]}
				>
					<Text
						style={[
							styles.headerTitleEtiquetaSize,
							{ fontSize: `8px` },
						]}
					>
                        PROD.:
					</Text>
					<Text
						style={[
							styles.headerLabelEtiqueta,
							{
								fontSize: `8px`,
								width: `200px`,
								marginTop: `-1px`,
							},
						]}
					>
						{conteudo?.produto?.descricao}
					</Text>
				</View>
			</View>
			<View style={styles.rowHeader}>
				<View
					style={[
						styles.row,
						{
							alignItems: `center`,
						},
					]}
				>
					<Text
						style={[
							styles.headerTitleEtiquetaSize,
							{ fontSize: `8px` },
						]}
					>
                        COMPL.:
					</Text>
					<Text
						style={[
							styles.headerLabelEtiqueta,
							{
								fontSize: `8px`,
								width: `200px`,
								marginTop: `-1px`,
							},
						]}
					>
						{conteudo?.complemento?.descricao}
					</Text>
				</View>
			</View>
			<View style={[styles.row, { justifyContent: `space-between` }]}>
				<View
					style={[
						styles.row,
						{
							alignItems: `center`,
							marginTop: `-5px`,
						},
					]}
				>
					<Text
						style={[
							styles.headerTitleEtiquetaSize,
							{ fontSize: `8px` },
						]}
					>
                        TIPO:
					</Text>
					<Text
						style={[
							styles.headerLabelEtiqueta,
							{ fontSize: `8px`, marginTop: `-1px` },
						]}
					>
						{conteudo?.produto?.tipoproduto}
					</Text>
				</View>
				{showSetor(conteudo?.setor)}
			</View>
			<View style={[styles.row]}>
				<Text style={styles.headerTitleEtiquetaSize}>TERMO.:</Text>
				<Text style={[styles.headerLabelEtiqueta]}>
					{conteudo?.termodesinfectora?.descricao ?? ``}
				</Text>
			</View>
		</View>
	)
}

const RodapeTemplate = (conteudo: DataEtiqueta) => {
	function abreviarNomeCompleto(nomeCompleto: string) {
		const partesDoNome = nomeCompleto.split(` `)

		const excecoes = [`da`, `de`, `do`, `das`, `dos`]

		if (partesDoNome.length > 4) {
			const sobrenomesAbreviados = partesDoNome
				.slice(1)
				.map((sobrenome, index) => {
					return excecoes.includes(sobrenome.toLowerCase()) &&
                        index !== partesDoNome.length - 2
						? sobrenome
						: abreviarSobrenome(sobrenome)
				})
			partesDoNome.splice(
				1,
				partesDoNome.length - 2,
				...sobrenomesAbreviados,
			)
		}

		return partesDoNome.join(` `)
	}

	function abreviarSobrenome(sobrenome: string) {
		return sobrenome.charAt(0) + `.`
	}

	const dataFormatadaString = (date: string) => {
		const dateF = moment(date).format(`DD/MM/YYYY`)
		if (dateF == `Invalid Date`) {
			return `--/--/--`
		} else {
			return dateF
		}
	}

	return (
		<>
			<View
				style={[
					styles.row,
					{
						justifyContent: `space-between`,
					},
				]}
			>
				<View style={[styles.row]}>
					<Text style={styles.headerTitleEtiquetaSize}>
                        Nº DE PEÇAS:
					</Text>
					<Text
						style={[
							styles.headerLabelEtiqueta,
							{
								flexWrap: `wrap`,
							},
						]}
					>
						{conteudo?.qtd}
					</Text>
				</View>

				<View style={[styles.row]}>
					<Text style={styles.headerTitleEtiquetaSize}>CICLO:</Text>
					<Text
						style={[
							styles.headerLabelEtiqueta,
							{ flexWrap: `wrap` },
						]}
					>
						{conteudo?.ciclo_termodesinfectora}
					</Text>
				</View>
				{ShowTemperatura(conteudo?.temperatura, 10)}
			</View>

			<View
				style={[
					styles.row,
					{
						justifyContent: `space-between`,
					},
				]}
			>
				<View style={[styles.row]}>
					<Text style={styles.headerTitleEtiquetaSize}>
                        DATA DA TERMODESINFECÇÃO:
					</Text>
					<Text
						style={[
							styles.headerLabelEtiqueta,
							{
								flexWrap: `wrap`,
							},
						]}
					>
						{dataFormatadaString(conteudo.datalancamento)}
					</Text>
				</View>
			</View>
			<View style={styles.rowHeader}>
				<View style={[styles.row]}>
					<Text style={styles.headerTitleEtiquetaSize}>
                        DATA DE VALIDADE:
					</Text>
					<Text
						style={[
							styles.headerLabelEtiqueta,
							{
								flexWrap: `wrap`,
							},
						]}
					>
						{dataFormatadaString(conteudo.datavalidade)}
					</Text>
				</View>
			</View>
			<View style={[styles.row, { justifyContent: `space-between` }]}>
				<View style={[styles.row]}>
					<Text style={styles.headerTitleEtiquetaSize}>TEC.:</Text>
					<Text
						style={[
							styles.headerLabelEtiqueta,
							{
								flexWrap: `wrap`,
							},
						]}
					>
						{abreviarNomeCompleto(
							conteudo?.profissional?.nome ?? ``,
						)}
					</Text>
				</View>

				<View style={[styles.row]}>
					<Text style={styles.headerTitleEtiquetaSize}>
                        TEC-COREN:
					</Text>
					<Text
						style={[
							styles.headerLabelEtiqueta,
							{
								flexWrap: `wrap`,
							},
						]}
					>
						{conteudo?.profissional?.coren}
					</Text>
				</View>
			</View>
			<View style={styles.rowHeader}>
				<View style={[styles.row]}>
					<Text style={styles.headerTitleEtiquetaSize}>RT:</Text>
					<Text
						style={[
							styles.headerLabelEtiqueta,
							{
								flexWrap: `wrap`,
							},
						]}
					>
						{abreviarNomeCompleto(
							conteudo?.responsavel_tecnico_nome ?? ``,
						)}
					</Text>
				</View>

				<View style={[styles.row]}>
					<Text style={styles.headerTitleEtiquetaSize}>
                        RT-COREN:
					</Text>
					<Text style={[styles.headerLabelEtiqueta]}>
						{conteudo?.responsavel_tecnico_coren}
					</Text>
				</View>
			</View>
		</>
	)
}

export const EtiquetaUnitariaRespiratorioTemplate = (
	conteudo: DataEtiqueta,
) => {
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
			<Page
				size="B8"
				orientation="landscape"
				style={styles.pageEtiqueta}
				wrap
			>
				{HeaderTemplate(conteudo)}
				{RodapeTemplate(conteudo)}
			</Page>
		</Document>
	)
}
