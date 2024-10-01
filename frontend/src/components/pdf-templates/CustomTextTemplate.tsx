import React from 'react'
import {Document, Font, Page, Text, View} from '@react-pdf/renderer'
import LatoBold from './fonts/LatoBold.ttf'
import Lato from './fonts/Lato.ttf'
import OpenSans from './fonts/OpenSans.ttf'
import ArialItalic from './fonts/ArialItalic.ttf'

import {styles} from "@/components/pdf-templates/styles.ts"
import {OcorrenciaResponse} from "@infra/integrations/enfermagem/types.ts"

import Html from 'react-pdf-html'
import {templateDescricao1, templateDescricao2} from "@infra/integrations/__mocks__/ocorrencias_mock.ts"
import {gerarHtmlTemplate, htmlTemplate} from "@/components/pdf-templates/helpers.ts"
import {RodapeTemplate} from "@/components/pdf-templates/components/RodapeTemplate.tsx"
import {CabecalhoIcones} from "@/components/pdf-templates/components/CabecalhoIcones.tsx"

// //@ts-ignore  @typescript-eslint/no-unused-vars
// const HeaderTemplate = (props) => {
// 	const {
// 		setor,
// 		cliente,
// 		profissional,
// 		dt_ocorrencia,
// 		titulo,
// 		id
// 	} = props
//
// 	return (
// 		<View fixed style={styles.headerWithoutBorder}>
// 			<View style={[styles.rowHeader,
//
// 			]}>
// 				<View style={[styles.rowWithGap,
// 					{
// 						alignItems: `baseline`,
// 					}
// 				]}>
// 					<View style={[styles.row,
// 						{
// 							alignItems: `baseline`,
//
// 						}
// 					]}>
// 						<Text style={styles.headerTitle}>
// 							Setor:
// 						</Text>
// 						<Text style={styles.headerLabel}>
// 							{setor}
// 						</Text>
// 					</View>
// 					<View style={[styles.row,
// 						{
// 							alignItems: `baseline`,
//
// 						}
// 					]}>
// 						<Text style={styles.headerTitle}>
// 							Cliente:
// 						</Text>
// 						<Text style={styles.headerLabel}>
// 							{cliente}
// 						</Text>
// 					</View>
// 					<View style={[styles.row,
// 						{
// 							alignItems: `baseline`,
//
// 						}
// 					]}>
// 						<Text style={styles.headerTitle}>
// 							N:
// 						</Text>
// 						<Text style={styles.headerLabel}>
// 							{id}
// 						</Text>
// 					</View>
// 				</View>
// 			</View>
// 			<View style={styles.rowHeader}>
// 				<View style={[styles.row,
// 					{
// 						alignItems: `baseline`,
// 					}
// 				]}>
// 					<Text style={styles.headerTitle}>
// 						Profissional:
// 					</Text>
// 					<Text style={styles.headerLabel}>
// 						{profissional}
// 					</Text>
// 				</View>
// 				<View style={[styles.row,
// 					{
// 						alignItems: `baseline`,
// 					}
// 				]}>
// 					<Text style={styles.headerTitle}>
// 						Dt. Ocorrência:
// 					</Text>
// 					<Text style={styles.headerLabel}>
// 						{dt_ocorrencia}
// 					</Text>
// 				</View>
// 			</View>
// 			<View style={styles.rowHeader}>
// 				<View style={[styles.row,
// 					{
// 						alignItems: `baseline`,
// 					}
// 				]}>
// 					<Text style={styles.headerTitle}>
// 						Título:
// 					</Text>
// 					<Text style={styles.headerLabel}>
// 						{titulo}
// 					</Text>
// 				</View>
// 			</View>
// 		</View>
// 	)
// }

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
			<Text style={{borderTop: `1px solid black`, padding: `10px 80px`}}>Cliente</Text>
		</View>
	)
}


// @ts-ignore
export const CustomTextTemplate = (conteudo: OcorrenciaResponse) => {
	Font.register({
		family: `Lato`,
		src: Lato,
	})
	Font.register({
		family: `Lato Bold`,
		src: LatoBold,
	})
	Font.register({
		family: `Open Sans`,
		src: OpenSans,
	})
	Font.register({
		family: `Arial Italic`,
		src: ArialItalic,
		fonts: [
			{
				src: Lato,
			},
			{
				src: LatoBold,
				fontWeight: `bold`,
			},
			{
				src: LatoBold,
				fontWeight: 900,
			},
			{
				src: ArialItalic,
				fontWeight: `normal`,
				fontStyle: `italic`,
			},
			{
				src: ArialItalic,
				fontWeight: 900,
				fontStyle: `italic`,
			},
			{
				src: ArialItalic,
				fontWeight: `bold`,
				fontStyle: `italic`,
			},
		],
	})

	Font.register({
		family: `Lato`,
		fonts: [
			{
				src: Lato,
			},
			{
				src: LatoBold,
				fontWeight: `bold`,
			},
			{
				src: LatoBold,
				fontWeight: 900,
			},
			{
				src: ArialItalic,
				fontWeight: `normal`,
				fontStyle: `italic`,
			},
			{
				src: ArialItalic,
				fontWeight: 900,
				fontStyle: `italic`,
			},
			{
				src: ArialItalic,
				fontWeight: `bold`,
				fontStyle: `italic`,
			},
		],
		// format: 'truetype',
	})
	//@ts-ignore  @typescript-eslint/no-unused-vars
	const htmlCustomMaximo = `<html>
  <body>
    <style>
      .my-heading4 {
        background: darkgreen;
        color: white;
      }
      pre {
        background-color: #eee;
        padding: 10px;
      }
    </style>
    <h1>Heading 1</h1>
    <h2 style="background-color: pink">Heading 2</h2>
    <h3>Heading 3</h3>
    <h4 class="my-heading4">Heading 4</h4>
    <p>
      Paragraph with <strong>bold</strong>, <i>italic</i>, <u>underline</u>,
      <s>strikethrough</s>,
      <strong><u><s><i>and all of the above</i></s></u></strong>
    </p>
    <p>

      <a href="http://google.com">link</a>
    </p>
    <hr />
    <ul>
      <li>Unordered item</li>
      <li>Unordered item</li>
    </ul>
    <ol>
      <li>Ordered item</li>
      <li>Ordered item</li>
    </ol>
    <br /><br /><br /><br /><br />
    Text outside of any tags
    <table>
      <thead>
        <tr>
          <th>Column 1</th>
          <th>Column 2</th>
          <th>Column 3</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Foo</td>
          <td>Bar</td>
          <td>Foobar</td>
        </tr>
        <tr>
          <td colspan="2">Foo</td>
          <td>Bar</td>
        </tr>
        <tr>
          <td>Some longer thing</td>
          <td>Even more content than before!</td>
          <td>Even more content than before!</td>
        </tr>
      </tbody>
    </table>
    <div style="width: 200px; height: 200px; background: pink"></div>
    <pre>
function myCode() {
  const foo = 'bar';
}
</pre>
  </body>
</html>
`

	const showAssinatura = () => {
		// if (plantao.status == `ATIVO` && index == pages.length - 1) {
		return (<>{Assinaturas()}</>)
		// }
	}

	return (
		<Document>
			<Page size="A4" style={styles.page} wrap>
				{CabecalhoIcones(`SINALIZAÇÃO DE NÃO CONFORMIDADE`)}
				<View style={styles.bottomBorderBlack}>
					<Text>Descrição</Text>
				</View>
				<View style={styles.itemRow8}>
					<Html
						style={styles.itemRow8}
						resetStyles={true}>{conteudo.descricao}</Html>
				</View>
				<View style={styles.bottomBorderBlack}>
					<Text>Ação</Text>
				</View>
				<Text>body dentro de body :</Text>
				<Html style={styles.fonte10}>{gerarHtmlTemplate(htmlTemplate)}</Html>
				<Text>body template 1:</Text>
				<Html style={styles.fonte10}>{gerarHtmlTemplate(templateDescricao1)}</Html>
				<Text>body template 2:</Text>
				<Html style={styles.fonte10}>{gerarHtmlTemplate(templateDescricao2)}</Html>

				<Text>html custom maximo</Text>
				<Html>{htmlCustomMaximo}</Html>
				<Text>Testando não quebrar a pagina com template 2</Text>
				<View wrap={false}>
					<Html style={styles.fonte10}>{gerarHtmlTemplate(templateDescricao2)}</Html>
				</View>
				<Text>Testando com action mesmo</Text>
				<View wrap={false}>
					<Html style={styles.fonte10}>{gerarHtmlTemplate(conteudo.acao ?? ``)}</Html>
				</View>
				{showAssinatura()}
				{RodapeTemplate()}
			</Page>
		</Document>
	)
}
