import { Document, Font, Page, Text, View } from "@react-pdf/renderer"
import LatoBold from "./fonts/LatoBold.ttf"
import Lato from "./fonts/Lato.ttf"
import { styles } from "@/components/pdf-templates/styles.ts"
import { DataEtiqueta } from "@/infra/integrations/processo/types-etiquetas"
import moment from "moment"

const showSetor = (setor: any) => {
	if (setor?.descricao) {
		return (
			<View style={styles.row}>
				<View
					style={[
						styles.row,
						{
							alignItems: `center`,
						},
					]}
				>
					<Text style={styles.headerTitleEtiquetaSize}>SETOR:</Text>
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
						{setor.descricao ?? ``}
					</Text>
				</View>
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
			<View
				style={[
					styles.row,
					{
						alignItems: `center`,
					},
				]}
			>
				<Text style={styles.headerTitleEtiquetaSize3}>PROD.:</Text>
				<Text style={[styles.headerLabelEtiqueta3, { width: `200px` }]}>
					{conteudo?.produto?.descricao ?? ``}
				</Text>
			</View>
			<View style={styles.row}>
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
						{conteudo?.complemento?.descricao ?? ``}
					</Text>
				</View>
			</View>
			{showSetor(conteudo?.setor)}
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
				style={[styles.row, { justifyContent: `space-between` }]}
			></View>
			<View style={[styles.row, { justifyContent: `space-between` }]}>
				<View style={[styles.row]}>
					<Text style={styles.headerTitleEtiquetaSize}>TERMO.:</Text>
					<Text
						style={[
							styles.headerLabelEtiqueta,
							{
								flexWrap: `wrap`,
							},
						]}
					>
						{conteudo?.termodesinfectora?.descricao ?? ``}
					</Text>
				</View>
				<View style={[styles.row]}>
					<Text style={styles.headerTitleEtiquetaSize}>MAT.:</Text>
					<Text
						style={[
							styles.headerLabelEtiqueta,
							{
								flexWrap: `wrap`,
							},
						]}
					>
						{conteudo?.produto?.tipoproduto}
					</Text>
				</View>
			</View>

			<View style={[styles.row, { justifyContent: `space-between` }]}>
				<View style={[styles.row]}>
					<Text style={styles.headerTitleEtiquetaSize}>COD.:</Text>
					<Text style={[styles.headerLabelEtiqueta]}>
						{conteudo?.id}
					</Text>
				</View>
				<View style={[styles.row]}>
					<Text style={styles.headerTitleEtiquetaSize}>CICLO.:</Text>
					<Text
						style={[
							styles.headerLabelEtiqueta,
							{
								flexWrap: `wrap`,
							},
						]}
					>
						{conteudo?.ciclo}
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
			</View>
			<View style={[styles.row, { justifyContent: `space-between` }]}>
				<View style={[styles.row]}>
					<Text style={styles.headerTitleEtiquetaSize}>
                        DATA DA ESTERILIZAÇÃO.:
					</Text>
					<Text style={[styles.headerLabelEtiqueta]}>
						{dataFormatadaString(conteudo.datalancamento)}
					</Text>
				</View>

				<View style={[styles.row]}>
					<Text style={styles.headerTitleEtiquetaSize}>TEMP.:</Text>
					<Text style={[styles.headerLabelEtiqueta]}>
						{conteudo?.temperatura}
					</Text>
				</View>
			</View>
			<View style={styles.rowHeader3}>
				<View style={[styles.row]}>
					<Text style={styles.headerTitleEtiquetaSize}>
                        VALIDADE:
					</Text>
					<Text style={[styles.headerLabelEtiqueta]}>
						{dataFormatadaString(conteudo.datavalidade)}
					</Text>
				</View>

				<View style={[styles.row]}>
					<Text style={styles.headerTitleEtiquetaSize}>
                        BIOLÓGICO:
					</Text>
					<Text
						style={[
							styles.headerLabelEtiqueta,
							{
								flexWrap: `wrap`,
							},
						]}
					>
						{conteudo?.biologico}
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
					<Text style={styles.headerTitleEtiquetaSize}>COREN.:</Text>
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
					<Text style={styles.headerTitleEtiquetaSize}>COREN.:</Text>
					<Text
						style={[
							styles.headerLabelEtiqueta,
							{
								flexWrap: `wrap`,
							},
						]}
					>
						{conteudo?.responsavel_tecnico_coren}
					</Text>
				</View>
			</View>
		</>
	)
}

export const EtiquetaUnitariaTemplate = (conteudo: DataEtiqueta) => {
	Font.register({
		family: `Lato`,
		src: Lato,
	})
	Font.register({
		family: `Lato Bold`,
		src: LatoBold,
	})
	// const conteudo2:DataEtiqueta = {
	// 	autoclave: 231321,
	// 	biologico: `QWEQWEQWE`,
	// 	cautela: 0,
	// 	ciclo: 711471,
	// 	ciclo_autoclave: 0,
	// 	ciclo_termodesinfectora: 0,
	// 	cliente: {id: 0, nome: `HPS 28 DE AGOSTO`},
	// 	complemento: {descricao: `CTQ`, id: 0},
	// 	datafabricacao: `16/05/2024`,
	// 	datalancamento: `16/05/2024`,
	// 	datavalidade: `16/05/2024`,
	// 	horalancamento: ``,
	// 	id: 11014,
	// 	numerofaltante: 0,
	// 	obs: `undefined`,
	// 	peso: ``,
	// 	produto: {descricao: `MASCARA COM RESERVATORIO`, id: 0, tipoproduto: `INALATORIOS`},
	// 	profissional: {coren: `451290`, id: 0, nome: `jeane rodrigues serrao`},
	// 	qtd: 2222,
	// 	qtdimpressao: 11111,
	// 	responsavel_tecnico_coren: `747226`,
	// 	responsavel_tecnico_nome: `fracinilda vieria barbisa maciel`,
	// 	seladora: ``,
	// 	setor: {descricao: `2E2E`, id: 0},
	// 	status: ``,
	// 	temperatura: 80,
	// 	termodesinfectora: `TERMODESINFECOTRORA 02`,
	// 	tipoetiqueta: `inalatorios`,
	// 	totalenvelopado: 0,
	// 	turno: `1`
	//
	// }
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
