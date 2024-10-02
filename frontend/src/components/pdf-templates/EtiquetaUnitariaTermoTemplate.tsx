import { Document, Font, Page, Text, View } from "@react-pdf/renderer"
import LatoBold from "./fonts/LatoBold.ttf"
import Lato from "./fonts/Lato.ttf"
import { styles } from "@/components/pdf-templates/styles.ts"
import { DataEtiqueta } from "@/infra/integrations/processo/types-etiquetas"
import moment from "moment"

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
					<Text style={styles.headerTitleEtiquetaSize}>PROD.:</Text>
					<Text
						style={[
							styles.headerLabelEtiqueta,
							{
								fontSize: `9px`,
								width: `200px`,
								marginTop: `-3px`,
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
					<Text style={styles.headerTitleEtiquetaSize}>COMPL.:</Text>
					<Text
						style={[
							styles.headerLabelEtiqueta,
							{
								fontSize: `9px`,
								width: `200px`,
								marginTop: `-3px`,
							},
						]}
					>
						{conteudo?.complemento?.descricao}
					</Text>
				</View>
			</View>
		</View>
	)
}

const RodapeTemplate = (conteudo: DataEtiqueta) => {
	const textNaoSeAplica = `Não informado.`

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

	const setor = conteudo?.setor?.descricao ?? textNaoSeAplica
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
			<View style={styles.rowHeader3}>
				<View style={[styles.row]}>
					<Text style={styles.headerTitleEtiquetaSize}>
                        N DE PEÇAS.:
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
					<Text style={styles.headerTitleEtiquetaSize}>AUTO.:</Text>
					<Text
						style={[
							styles.headerLabelEtiqueta,
							{
								flexWrap: `wrap`,
							},
						]}
					>
						{conteudo?.autoclave?.descricao ?? ``}
					</Text>
				</View>

				<View style={[styles.row]}>
					<Text style={styles.headerTitleEtiquetaSize}>COD.:</Text>
					<Text
						style={[
							styles.headerLabelEtiqueta,
							{ flexWrap: `wrap` },
						]}
					>
						{conteudo?.id}
					</Text>
				</View>
			</View>
			<View style={styles.rowHeader4}>
				<View style={[styles.row]}>
					<Text style={styles.headerTitleEtiquetaSize}>CICLO.:</Text>
					<Text
						style={[
							styles.headerLabelEtiqueta,
							{ marginRight: `10px` },
						]}
					>
						{conteudo?.ciclo}
					</Text>
				</View>

				<View style={[styles.row]}>
					<Text style={styles.headerTitleEtiquetaSize}>TIPO.:</Text>
					<Text style={[styles.headerLabelEtiqueta]}>
						{conteudo?.produto?.tipoproduto}
					</Text>
				</View>
				<View style={[styles.row, { marginLeft: `10px` }]}>
					<Text style={[styles.headerTitleEtiquetaSize]}>
                        Setor.:
					</Text>
					<Text
						style={[
							styles.headerLabelEtiqueta,
							{ flexWrap: `wrap` },
						]}
					>
						{setor}
					</Text>
				</View>
			</View>
			<View style={styles.rowHeader3}>
				<View style={[styles.row]}>
					<Text style={styles.headerTitleEtiquetaSize}>
                        DATA DA TERMODESINFECÇÃO.:
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
			<View style={styles.rowHeader3}>
				<View style={[styles.row]}>
					<Text style={styles.headerTitleEtiquetaSize}>
                        Validade.:
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
			<View style={styles.rowHeader3}>
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
                        TEC-COREN.:
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
			<View style={styles.rowHeader3}>
				<View style={[styles.row]}>
					<Text style={styles.headerTitleEtiquetaSize}>RT.:</Text>
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
                        ENF-COREN.:
					</Text>
					<Text style={[styles.headerLabelEtiqueta]}>
						{conteudo?.responsavel_tecnico_coren}
					</Text>
				</View>
			</View>
		</>
	)
}

export const EtiquetaUnitariaTermoTemplate = (conteudo: DataEtiqueta) => {
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
