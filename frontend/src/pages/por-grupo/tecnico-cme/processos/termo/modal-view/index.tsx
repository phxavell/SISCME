import {rowClassName, styleActionHeader} from "@/components/RowTemplate.tsx"
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
import {useCallback, useMemo} from "react"
import {confirmDialog} from 'primereact/confirmdialog'
import { PDFDownloadLink } from "@react-pdf/renderer"
import { CaixasTermoDesinfectadasTemplate } from "@/components/pdf-templates/CaixasTermoDesinfectadasTemplate"
import { stylePDFButtonDownloadEsterilizacao } from "@/components/modal-pdf/styles"
import { styleContentDetail, styleLinhaMinimaTabela3, styleTableTermo } from "@/pages/por-grupo/administrativo/cruds/caixa/styles-caixa"
import { filenamePdf, messageTemplate } from "@/components/TextFields/messager"
import { IViewTermo } from "./interfaces"
import { showButton } from "@/components/Buttons"
import { footerTemplate } from "@/components/table-templates/Footer/FooterTemplate"

export const ViewTermo: React.FC<IViewTermo> = (props) => {
	const {showModal, setShowModal, dadosView, abortarStatus, finalizarStatus, conteudoPDF} = props

	const dataFim = dadosView?.data?.data_fim ?? `Em Andamento`
	const footer = useMemo(() => {
		const quantidadeTotal = dadosView?.data?.itens.length ?? 0
		return `Total de  ${quantidadeTotal} itens.`
	}, [dadosView])


	const headerTemplate = () => {
		return (
			<div className={styleContentHeader}>
				<h3 className="m-0 p-0">Detalhes da Termodesinfecção: {dadosView?.data?.id}</h3>
				{dadosView?.data.situacao_atual === `TERMO_INICIO` ? (
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
							tooltip="Finalizar Ciclo"
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
		if (conteudoPDF) {
			return (
				<PDFDownloadLink
					style={stylePDFButtonDownloadEsterilizacao}
					document={<CaixasTermoDesinfectadasTemplate {...{...conteudoPDF}}/>}
					fileName={filenamePdf(`TermoDesinfeccao`)}>
					{showButton}
				</PDFDownloadLink>
			)
		}
	}, [conteudoPDF])

	return (
		<Dialog
			header={headerTemplate()}
			style={{ minWidth: `50vw`, width: `90vw` }}
			dismissableMask={true}
			closeOnEscape={true}
			focusOnShow={false}
			blockScroll={false}
			resizable={false}
			draggable={false}
			onHide={() => setShowModal(false)}
			visible={showModal}
		>
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
						className={styleContentDetail + ` col-4 text-xl`}
						severity="info"
						content={() => messageTemplate(`Programação`, dadosView?.data?.programacao)}
					/>
					<Message
						style={styleMessage}
						className={styleContentDetail + ` col-2 text-xl`}
						severity="info"
						content={() => messageTemplate(`Ciclo`, dadosView?.data?.ciclo)}
					/>

				</div>

				<div className="col-12">
					<DataTable
						style={styleTableTermo}
						dataKey="id"
						value={dadosView?.data?.itens}
						paginator
						rows={5}
						rowHover
						stripedRows
						emptyMessage="Buscando..."
						rowClassName={rowClassName}
						footer={footerTemplate({ dadosView })}
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
			</div>
		</Dialog>
	)
}
