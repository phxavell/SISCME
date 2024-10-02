import React from 'react'
import {Document, Font, Page, Text, View} from '@react-pdf/renderer'
import moment from "moment"
import LatoBold from './fonts/LatoBold.ttf'
import Lato from './fonts/Lato.ttf'

import {styles} from "@/components/pdf-templates/styles.ts"
import {DataPlantao} from '@/infra/integrations/plantao'
import {RodapeTemplate} from "@/components/pdf-templates/components/RodapeTemplate.tsx"
import {CabecalhoIcones} from "@/components/pdf-templates/components/CabecalhoIcones.tsx"

//@ts-ignore
const HeaderTemplate = (props) => {
	const {
		idplantao,
		profissional,
		dtAbertura, horaAbertura,
		dtFechamento, horaFechamento
	} = props

	let dtAberturaFormatada = `${moment(dtAbertura).format(`DD/MM/YYYY`)} ${moment(horaAbertura, `HH:mm:ss.SSSSSS`).format(`HH:mm`)}`
	let dtFechamentoFormatada = `${moment(dtFechamento).format(`DD/MM/YYYY`)} ${moment(horaFechamento, `HH:mm:ss.SSSSSS`).format(`HH:mm`)}`
	if (dtAberturaFormatada == `Data inválida Data inválida`) {
		dtAberturaFormatada = `--/--/-- --:--`
	} else if (dtFechamentoFormatada == `Data inválida Data inválida`) {
		dtFechamentoFormatada = `--/--/-- --:--`
	}

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
                            Dt. Abertura:
						</Text>
						<Text style={styles.headerLabel}>
							{dtAberturaFormatada}
						</Text>
					</View>
					<View style={[styles.row,
						{
							alignItems: `baseline`,

						}
					]}>
						<Text style={styles.headerTitle}>
                            Dt. Fechamento:
						</Text>
						<Text style={styles.headerLabel}>
							{dtFechamentoFormatada}
						</Text>
					</View>
				</View>
				<View style={[styles.row,
					{
						alignItems: `baseline`,
					}
				]}>
					<Text style={styles.headerTitle}>
                        N:
					</Text>
					<Text style={styles.headerLabel}>
						{idplantao}
					</Text>
				</View>
			</View>
			<View style={styles.rowHeader}>
				<View style={[styles.row,
					{
						alignItems: `baseline`,
					}
				]}>
					<Text style={styles.headerTitle}>
                        Plantonista:
					</Text>
					<Text style={styles.headerLabel}>
						{profissional}
					</Text>
				</View>
			</View>
		</View>
	)
}

const Assinaturas = () => {
	return (
		<View style={[styles.row,
			{
				paddingHorizontal: `20px`,
				textAlign: `center`,
				fontSize: `10px`,
				color: `#000`,
				marginLeft: `20px`,
			}
		]}>
			<Text style={{borderTop: `1px solid black`, padding: `10px 80px`, marginRight: `20px`}}>Enfermeiro(a)</Text>
			<Text style={{borderTop: `1px solid black`, padding: `10px 80px`}}>Técnico(a)</Text>
		</View>
	)
}

const PageItensTemplate = (plantao: DataPlantao) => {
	let {descricaoaberto: descricao} = plantao

	if (!descricao) {
		descricao = ``
	}

	const flagdePaginacao = 1100
	const flagdePaginacaoMax = 1200
	let iadd = 0
	let flagDinamigo = flagdePaginacao
	const pages = []
	for (let i = 0; i < descricao?.length;) {
		flagDinamigo = flagdePaginacao
		iadd = 0
		let countMax = i + flagdePaginacao + iadd
		while (countMax < descricao.length && ((iadd + flagdePaginacao) < flagdePaginacaoMax) && descricao[countMax] != ` `) {
			countMax = i + flagdePaginacao + iadd
			iadd = iadd + 1
		}
		flagDinamigo = flagDinamigo + iadd + 1
		const page = descricao.slice(i, i + flagDinamigo)
		pages.push(page)
		i += flagDinamigo
	}

	const pagesTemplates = pages.map((pageDescricao: string, index: number) => {

		const showAssinatura = () => {
			if (plantao.status == `ABERTO` && index == pages.length - 1) {
				return (<>{Assinaturas()}</>)
			}
		}

		return (
			<View wrap={false}
				key={index + 1 + pageDescricao.length}
				style={[styles.descricaoPlantao, {
					height: `80%`, padding: `3px`,
				}]}
			>
				<View
					wrap={false}
					style={[styles.descricaoPlantao, {
						height: `100%`, marginBottom: `20px`, padding: `3px`,
					}]}>
					<Text>{pageDescricao}</Text>
				</View>
				{showAssinatura()}

			</View>

		)
	})

	return pagesTemplates
}

const PageItensTemplate2 = (plantao: DataPlantao) => {
	let {descricaofechamento: descricao} = plantao
	if (!descricao) {
		descricao = ` `
	}

	const flagdePaginacao = 1100
	const flagdePaginacaoMax = 1200
	let iadd = 0
	let flagDinamigo = flagdePaginacao
	const pages = []
	for (let i = 0; i < descricao?.length;) {
		flagDinamigo = flagdePaginacao
		iadd = 0
		let countMax = i + flagdePaginacao + iadd
		while (countMax < descricao.length && ((iadd + flagdePaginacao) < flagdePaginacaoMax) && descricao[countMax] != ` `) {
			countMax = i + flagdePaginacao + iadd
			iadd = iadd + 1
		}
		flagDinamigo = flagDinamigo + iadd + 1
		const page = descricao.slice(i, i + flagDinamigo)
		pages.push(page)
		i += flagDinamigo
	}

	const pagesTemplates2 = pages.map((pageDescricao: string, index: number) => {
		const showAssinatura2 = () => {
			if (plantao.status == `FECHADO` && index == pages.length - 1) {
				return (<>{Assinaturas()}</>)
			}
		}
		return (
			<View key={index + 1} style={[styles.descricaoPlantao, {
				height: `80%`, padding: `3px`,
			}]}>
				<View
					style={[styles.descricaoPlantao, {
						height: `100%`, marginBottom: `20px`, padding: `3px`,
					}]}
					wrap={false}
				>
					<Text>{pageDescricao}</Text>
				</View>
				{showAssinatura2()}

			</View>

		)
	})

	return pagesTemplates2
}

// @ts-ignore
export const PlantaoTemplate = (plantao: DataPlantao) => {
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
				{CabecalhoIcones(`REGISTRO DE PLANTÃO DIÁRIO`)}
				{HeaderTemplate({
					idplantao: plantao?.idplantao,
					profissional: plantao?.profissional.nome.toUpperCase(),
					dtAbertura: plantao?.datacadastro,
					dtFechamento: plantao?.datafechamento,
					horaAbertura: plantao?.horacadastro,
					horaFechamento: plantao?.horafechamento
				})}


				<View style={styles.bottomBorderBlack}>
					<Text>DESCRIÇÃO DA ABERTURA</Text>
				</View>
				{PageItensTemplate(plantao)}

				{
					plantao.status == `FECHADO` ? (
						<>
							<View style={styles.bottomBorderBlack}>
								<Text>DESCRIÇÃO DO FECHAMENTO</Text>
							</View>
							{PageItensTemplate2(plantao)}

						</>
					)
						: <View></View>}


				{RodapeTemplate()}
			</Page>
		</Document>
	)
}
