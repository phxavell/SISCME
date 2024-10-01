import { rowClassName, styleActionHeader } from "@/components/RowTemplate.tsx"
import {
	headerTableStyle,
	styleContentHeader,
	styleMessage,
} from "@/util/styles"
import {Button} from "primereact/button"
import {Column} from "primereact/column"
import {DataTable} from "primereact/datatable"
import {Dialog} from "primereact/dialog"
import {Message} from "primereact/message"
import {useCallback, useMemo, useState} from "react"
import {confirmDialog} from 'primereact/confirmdialog'
import { PDFDownloadLink } from "@react-pdf/renderer"
import { stylePDFButtonDownloadEsterilizacao } from "@/components/modal-pdf/styles"
import { styleContentDetail, styleLinhaMinimaTabela3, styleTableTermo } from "@/pages/por-grupo/administrativo/cruds/caixa/styles-caixa"
import { filenamePdf, messageTemplate } from "@/components/TextFields/messager"
import { CaixasEsterilizacaoTemplate } from "@/components/pdf-templates/CaixasEsterilizacaoTemplate"
import { showButton } from "@/components/Buttons"
import { DadosPdfEtiquetaEsterilizacao, ModalEtiquetaEsterilizacao } from "../PesquisarEsterilizacao/modal-etiqueta-esterilizacao"

interface IViewEsterilizacao {
	setShowModal: any
	showModal: boolean
	dadosView: any
	abortarStatus: any
	finalizarStatus: any
	conteudoPDF?: any
	showModalEtiqueta?: boolean
	setShowModalEtiqueta?: any

}

export const ViewEsterilizacao: React.FC<IViewEsterilizacao> = (props) => {
	const { showModal, setShowModal, dadosView, abortarStatus, finalizarStatus, conteudoPDF } = props
	const dataFim = dadosView?.data?.data_fim ?? `Em Andamento`
	const footer = useMemo(() => {
		const quantidadeTotal = dadosView?.data?.itens.length ?? 0
		return `Total de  ${quantidadeTotal} itens.`
	}, [dadosView])
	const dadosEtiqueta = useMemo(() => {
		if (conteudoPDF) {
			return {
				cliente: conteudoPDF.itens_por_cliente[0]?.cliente,
				equipamento: conteudoPDF?.equipamento,
				ciclo: conteudoPDF?.ciclo,
				itens: conteudoPDF.itens_por_cliente[0]?.itens
			}
		}
	}, [conteudoPDF])

	const [showModalEtiqueta, setShowModalEtiqueta] = useState(false)

	const headerTemplate = () => {
		return (
			<div className={styleContentHeader}>
				<h3 className="m-0 p-0">Detalhes da Esterilização: {dadosView?.data?.id}</h3>
				{dadosView?.data.situacao_atual === `ESTERILIZACAO_INICIO` ? (
					<div className="flex gap-2 h-3rem mb-5 mr-3">
						<Button
							icon="pi pi-check-circle"
							className={styleActionHeader(`green`, `600`, `600`)}
							onClick={() => {
								confirmDialog({
									message: `Deseja finalizar o ciclo?`,
									header: `Finalizar Ciclo`,
									icon: `pi pi-exclamation-triangle`,
									accept: () => {
										finalizarStatus(dadosView?.data.id)
										setShowModal(false)
									},
									reject: () => {
									},
									acceptLabel: `Sim`,
									rejectLabel: `Não`,

								})
							}}
							data-testid='finalizar-ciclo'
							label="Finalizar Ciclo"
						/>
						<Button
							text
							icon='pi pi-exclamation-triangle'
							className={styleActionHeader(`red`, `600`, `600`)}
							style={{color: `white`}}
							onClick={() => {
								confirmDialog({
									message: `Deseja abortar o ciclo?`,
									header: `Abortar Ciclo`,
									icon: `pi pi-exclamation-triangle`,
									accept: () => {
										abortarStatus(dadosView?.data.id)
										setShowModal(false)
									},
									reject: () => {
									},
									acceptLabel: `Sim`,
									rejectLabel: `Não`,

								})
							}}
							data-testid='abortar-ciclo'
							label="Abortar Ciclo"
						/>

					</div>
				) : (
					<div className="pr-3">{showButtonDownload()}</div>
				)}
			</div>
		)
	}

	const showButtonDownload = useCallback(() => {
		if (conteudoPDF && dadosView?.data?.indicador == null) {
			return (
				<div className="flex gap-2">
					<PDFDownloadLink
						style={stylePDFButtonDownloadEsterilizacao}
						document={<CaixasEsterilizacaoTemplate {...{ ...conteudoPDF }} />}
						fileName={filenamePdf(`AutoClavagem`)}>
						{showButton}
					</PDFDownloadLink>
					<Button
						className={styleActionHeader(`orange`, `700`, `500`)+` h-3rem`}
						icon='pi pi-tag'
						onClick={() => {
							setShowModalEtiqueta(true)
						}}
						tooltip="Etiqueta Esterilização"
					/>
				</div>
			)
		}
	}, [conteudoPDF, setShowModalEtiqueta, dadosView])

	const exibirTabela = useCallback(() => {
		if(dadosView?.data?.indicador == null) {
			return (
				<div className="col-12">
					<DataTable
						style={styleTableTermo}
						dataKey="id"
						value={dadosView?.data?.itens}
						paginator
						rows={5}
						scrollable={true}
						rowHover
						stripedRows
						emptyMessage="Buscando..."
						rowClassName={rowClassName}
						footer={footer}
						paginatorClassName={`p-0 mt-0`}
						tableClassName={`p-0`}
					>
						<Column
							field="serial"
							header="Serial"
							colSpan={1}
							className={styleLinhaMinimaTabela3}
							style={{ width: `20%` }}
							headerStyle={headerTableStyle}
						/>
						<Column
							field="cliente"
							header="Cliente"
							colSpan={1}
							className={styleLinhaMinimaTabela3}
							style={{ width: `50%` }}
							headerStyle={headerTableStyle}
						/>
						<Column
							field="nome_caixa"
							header="Caixa"
							colSpan={1}
							className={styleLinhaMinimaTabela3}
							style={{ width: `30%` }}
							headerStyle={headerTableStyle}
						/>
					</DataTable>
				</div>
			)
		}
	}, [dadosView, footer])

	const exibirMessageIndicador = useCallback(() => {
		if(dadosView?.data?.indicador) {
			return (
				<Message
					style={styleMessage}
					className={styleContentDetail + ` col-12 text-xl`}
					severity="info"
					content={() => messageTemplate(`Indicador`, `${dadosView?.data?.indicador?.descricao} - ${dadosView?.data?.indicador?.tipo}`)}
				/>
			)
		}
	}, [dadosView])

	return (
		<Dialog
			header={headerTemplate()}
			style={{ width: `90vw` }}
			dismissableMask={true}
			closeOnEscape={true}
			focusOnShow={false}
			blockScroll={false}
			resizable={false}
			draggable={false}
			onHide={() => setShowModal(false)}
			visible={showModal}
		>
			<ModalEtiquetaEsterilizacao
				showModalEtiqueta={showModalEtiqueta}
				setShowModalEtiqueta={setShowModalEtiqueta}
				dadosEtiqueta={dadosEtiqueta as DadosPdfEtiquetaEsterilizacao}
			/>
			<div className="grid">
				<div className="col-12">

					<Message
						style={styleMessage}
						className={styleContentDetail + ` col-4 text-xl`}
						severity="info"
						content={() => messageTemplate(`Profissional`, dadosView?.data?.criado_por)}
					/>
					<Message
						style={styleMessage}
						className={styleContentDetail + ` col-4 text-xl`}
						severity="info"
						content={() => messageTemplate(`Data Hora Início`, dadosView?.data?.data_inicio)}
					/>
					<Message
						style={styleMessage}
						className={styleContentDetail + ` col-4 text-xl`}
						severity="info"
						content={() => messageTemplate(`Data Hora Fim`, dataFim)}
					/>
					<Message
						style={styleMessage}
						className={styleContentDetail + ` col-4 text-xl`}
						severity="info"
						content={() => messageTemplate(`Equipamento`, dadosView?.data?.equipamento)}
					/>
					<Message
						style={styleMessage}
						className={styleContentDetail + ` col-3 text-xl`}
						severity="info"
						content={() => messageTemplate(`Ciclo`, dadosView?.data?.ciclo)}
					/>
					<Message
						style={styleMessage}
						className={styleContentDetail + ` col-3 text-xl`}
						severity="info"
						content={() => messageTemplate(`Programação`, dadosView?.data?.programacao)}
					/>
					{exibirMessageIndicador()}
				</div>
				{exibirTabela()}

			</div>
		</Dialog>
	)
}
