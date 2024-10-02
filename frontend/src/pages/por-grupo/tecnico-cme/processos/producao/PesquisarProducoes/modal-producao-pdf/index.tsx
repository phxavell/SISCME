import {ItensPraparoTemplate} from "@/components/pdf-templates/ItensPreparoTemplate"
import {styleContentDetail, styleLinhaMinimaTabela3, styleTableTermo} from "@pages/por-grupo/administrativo/cruds/caixa/styles-caixa.ts"
import 'primeicons/primeicons.css'
import {Dialog} from "primereact/dialog"
import {IModalProducaoToPDF} from "@pages/por-grupo/tecnico-cme/processos/producao/types.ts"
import { Message } from "primereact/message"
import { headerTableStyle, styleContentHeader, styleMessage } from "@/util/styles"
import { filenamePdf, footerPdfProducao, messageTemplate } from "@/components/TextFields/messager"
import { useCallback } from "react"
import { PDFDownloadLink } from "@react-pdf/renderer"
import { stylePDFButtonDownloadEsterilizacao } from "@/components/modal-pdf/styles"
import { DataTable } from "primereact/datatable"
import { rowClassName } from "@/components/RowTemplate"
import { Column } from "primereact/column"


export const ModalDetalhesProducao: React.FC<IModalProducaoToPDF> = (props) => {
	const { showModal, setShowModal, caixaToPDF} = props


	const showButton = ({loading}: { loading: boolean }) => {
		return loading ? `Carregando documento...` :
			<span className="font-bold text-xl"
			> <i className="pi pi-download"/> Exportar para PDF </span>
	}



	const showButtonDownload = useCallback(() => {
		return (
			<PDFDownloadLink
				style={stylePDFButtonDownloadEsterilizacao}
				document={<ItensPraparoTemplate {...caixaToPDF} />}
				fileName={filenamePdf(`Preparo`)}>
				{showButton}
			</PDFDownloadLink>
		)
	}, [caixaToPDF])

	const headerTemplate = () => {
		return (
			<div className={styleContentHeader}>
				<h3 className="m-0 p-0 text-xl md:text-2lg">Detalhes da Produção: Serial {caixaToPDF?.caixa?.sequencial}</h3>
				<div className="flex mr-5">
					{showButtonDownload()}
				</div>
			</div>
		)
	}

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
			<div className="grid">
				<div className="col-12">
					<Message
						style={styleMessage}
						className={styleContentDetail + ` col-4 text-lg`}
						severity="info"
						content={() => messageTemplate(`Cliente`, caixaToPDF?.caixa?.cliente)}
					/>
					<Message
						style={styleMessage}
						className={styleContentDetail + `col-4 text-lg`}
						severity="info"
						content={() => messageTemplate(`Data Hora Preparo`, caixaToPDF?.data_preparo)}
					/>
					<Message
						style={styleMessage}
						className={styleContentDetail + ` col-4 text-lg`}
						severity="info"
						content={() => messageTemplate(`Codigo`, caixaToPDF?.codigo)}
					/>
					<Message
						style={styleMessage}
						className={styleContentDetail + ` col-4 text-lg`}
						severity="info"
						content={() => messageTemplate(`Profissional`, caixaToPDF?.recebimento?.usuario?.nome)}
					/>

					<Message
						style={styleMessage}
						className={styleContentDetail + ` col-3 text-lg`}
						severity="info"
						content={() => messageTemplate(`Caixa`, caixaToPDF?.caixa?.descricao)}
					/>
					<Message
						style={styleMessage}
						className={styleContentDetail + ` col-2 text-lg`}
						severity="info"
						content={() => messageTemplate(`Temperatura`, caixaToPDF?.caixa?.temperatura + `°C`)}
					/>
					<Message
						style={styleMessage}
						className={styleContentDetail + ` col-3 text-lg`}
						severity="info"
						content={() => messageTemplate(`Barreira Esteril`, caixaToPDF?.caixa?.tipo)}
					/>
				</div>
				<div className="col-12">
					<DataTable
						style={styleTableTermo}
						dataKey="descricao"
						value={caixaToPDF?.caixa?.itens}
						paginator
						rows={5}
						scrollable={true}
						rowHover
						stripedRows
						emptyMessage="Buscando..."
						rowClassName={rowClassName}
						footer={footerPdfProducao(caixaToPDF)}
						paginatorClassName={`p-0 mt-0`}
						tableClassName={`p-0`}
					>
						<Column
							field="descricao"
							header="Itens"
							colSpan={1}
							className={styleLinhaMinimaTabela3}
							style={{ width: `50%` }}
							headerStyle={headerTableStyle}
						/>
						<Column
							field="quantidade"
							header="Quantidade"
							colSpan={1}
							className={styleLinhaMinimaTabela3}
							style={{ width: `50%` }}
							headerStyle={headerTableStyle}
						/>

					</DataTable>
				</div>


			</div>
		</Dialog >
	)
}
