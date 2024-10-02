import {
	styleContentDetail,
	styleLinhaMinimaTabela3,
	styleTable3, styleTable4
} from "@pages/por-grupo/administrativo/cruds/caixa/styles-caixa.ts"
import {PDFDownloadLink} from "@react-pdf/renderer"
import 'primeicons/primeicons.css'
import {Dialog} from "primereact/dialog"
import * as React from "react"
import {useCallback} from "react"
import moment from "moment"
import {headerTableStyle, heigthTable2, styleContentHeader, styleMessage} from "@/util/styles"
import {Message} from "primereact/message"
import {DataTable} from "primereact/datatable"
import {Column} from "primereact/column"
import {rowClassName} from "@/components/RowTemplate"
import {Button} from "primereact/button"
import {ModalDetailRecebimentoFotos} from "./ModalFotos"
import {usePesquisarRecebimentos} from "../PesquisarRecebimentos/usePesquisarRecebimentos"
import {stylePDFButtonDownloadEsterilizacao} from "@/components/modal-pdf/styles"
import {messageTemplate} from "@pages/por-grupo/tecnico-cme/processos/recebimento/modal/HelperModal.tsx"
import {
	styleBtnImgs,
	styleTitleDetalheRecebimento
} from "@pages/por-grupo/tecnico-cme/processos/recebimento/modal/style-modal-detail.ts"
import {IModalBaixarPDF} from "@pages/por-grupo/tecnico-cme/processos/recebimento/modal/types.ts"
import {styleRecebimento4} from "@pages/por-grupo/tecnico-cme/processos/recebimento/style.ts"


const showButton = ({loading}: { loading: boolean }) => {
	return loading ? `Carregando documento...` :
		<span className="font-bold
		text-sm
		md:text-base
		"
		> <i className="pi pi-download"/> Exportar para PDF </span>
}

export const ModalDetailRecebimento: React.FC<IModalBaixarPDF> = (props) => {

	const {
		showModal,
		closeModal,
		documentoPDF,
		nomeArquivo,
		dadosPDF,
		fotos
	} = props

	const fileName = `${nomeArquivo ?? `pdf`}_${moment().format(`YYYY-MM-DD_HH:mm`)}`

	const headerTemplate = () => {
		return (
			<div className={styleContentHeader}>
				<h3 className={styleTitleDetalheRecebimento}>
                    Detalhes do Recebimento: Serial {dadosPDF?.serial}
				</h3>
				<div className="flex gap-2 h-3rem mr-5">
					{showButtonDownload()}
					<Button
						icon='pi pi-camera'
						className={styleBtnImgs}
						onClick={() => {
							setVisibleModalDetails(true)
						}}
						label="Visualizar Fotos"
					/>
				</div>
			</div>
		)
	}

	const {
		visibleModalDetails,
		setVisibleModalDetails,
	} = usePesquisarRecebimentos()

	const footer = React.useMemo(() => {
		const quantidadeTotal = dadosPDF ? dadosPDF.itens.reduce((preV: any, newV: { quantidade: any }) =>
			preV + newV.quantidade
		, 0) : 0
		return `Total de  ${quantidadeTotal} itens.`
	}, [dadosPDF])


	const showButtonDownload = useCallback(() => {
		return (
			<PDFDownloadLink
				style={stylePDFButtonDownloadEsterilizacao}
				document={documentoPDF}
				fileName={fileName}>
				{showButton}
			</PDFDownloadLink>
		)
	}, [documentoPDF, fileName])


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
			onHide={() => closeModal()}
			visible={showModal}
		>
			<ModalDetailRecebimentoFotos
				visible={visibleModalDetails}
				onClose={() => setVisibleModalDetails(false)}
				fotos={fotos}
			/>
			<div className="grid">
				<div className="col-6">

					<Message
						style={styleMessage}
						className={styleContentDetail + ` col-6 text-xl`}
						severity="info"
						content={() => messageTemplate(`Cliente`, dadosPDF?.cliente)}
					/>
					<Message
						style={styleMessage}
						className={styleContentDetail + ` col-6 text-xl`}
						severity="info"
						content={() => messageTemplate(`Data e Hora do Recebimento`, dadosPDF?.datarecebimento)}
					/>
					<Message
						style={styleMessage}
						className={styleContentDetail + ` col-6 text-xl`}
						severity="info"
						content={() => messageTemplate(`Profissional`, dadosPDF?.profissional)}
					/>
					<Message
						style={styleMessage}
						className={styleContentDetail + ` col-6 text-xl`}
						severity="info"
						content={() => messageTemplate(`Descrição`, dadosPDF?.descricao)}
					/>
					<Message
						style={styleMessage}
						className={styleContentDetail + ` col-6 text-xl`}
						severity="info"
						content={() => messageTemplate(`Temperatura`, dadosPDF?.temperatura + `°C`)}
					/>
					<Message
						style={styleMessage}
						className={styleContentDetail + ` col-6 text-xl`}
						severity="info"
						content={() => messageTemplate(`Barreira Esteril`, dadosPDF?.embalagem)}
					/>
				</div>

				<div className="col-6">
					<h4 className={styleRecebimento4}>Itens da caixa</h4>
					<DataTable
						scrollHeight={heigthTable2}
						style={styleTable4}
						dataKey="descricao"
						value={dadosPDF?.itens}
						paginator
						rows={10}
						scrollable={false}
						rowHover
						stripedRows

						emptyMessage="Buscando..."
						rowClassName={rowClassName}
						footer={footer}
						paginatorClassName={`p-0 mt-0`}
						tableClassName={`p-0`}
						size={`small`}
					>
						<Column
							field="descricao"
							header="Descrição"
							colSpan={1}
							className={styleLinhaMinimaTabela3}
							style={{width: `50%`}}
							headerStyle={headerTableStyle}
						/>
						<Column
							field="quantidade"
							header="Quantidade"
							colSpan={1}
							className={styleLinhaMinimaTabela3}
							style={{width: `50%`}}
							headerStyle={headerTableStyle}
						/>
					</DataTable>
				</div>
			</div>
		</Dialog>
	)
}
