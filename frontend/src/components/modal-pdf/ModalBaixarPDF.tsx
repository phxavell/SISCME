import {styleColumnCaixa} from "@pages/por-grupo/administrativo/cruds/caixa/styles-caixa.ts"
import {PDFDownloadLink, PDFViewer} from "@react-pdf/renderer"
import 'primeicons/primeicons.css'
import {Dialog} from "primereact/dialog"
import * as React from "react"
import {useCallback} from "react"
import moment from "moment"
import {Style} from "@react-pdf/types"
import {stylePDFButtonDownload} from "./styles"
import {IModalBaixarPDF} from "@/components/modal-pdf/types.ts"

const stylePDFViewer: Style = {
	flex: 1,
	width: `100%`,
	height: `75vh`,
}

const showButton = ({loading}: { loading: boolean }) => {
	return loading ? `Carregando documento...` :
		<span> Download <i className="pi pi-download"/></span>
}

export const ModalBaixarPDF: React.FC<IModalBaixarPDF> = (props) => {

	const {
		showModal,
		closeModal,
		documentoPDF,
		nomeArquivo,
		hiddenButtonDownload
	} = props
	const fileName = `${nomeArquivo ?? `pdf`}_${moment().format(`YYYY-MM-DD_HH:mm`)}`


	// TODO Ajustar parametro de children para componente
	const showButtonDownload = useCallback(() => {
		if (!hiddenButtonDownload) {
			return (
				<PDFDownloadLink
					style={stylePDFButtonDownload}
					document={documentoPDF  }
					fileName={fileName}>
					{showButton}
				</PDFDownloadLink>
			)
		}
	}, [hiddenButtonDownload, documentoPDF, fileName])

	// @ts-ignore
	return (
		<Dialog
			style={{
				minWidth: `50vw`,
			}}
			dismissableMask={true}
			closeOnEscape={true}
			focusOnShow={false}
			blockScroll={false}
			resizable={false}
			draggable={false}
			onHide={() => closeModal()}
			visible={showModal}
			position="top"

		>
			<div className={styleColumnCaixa}>
				{showButtonDownload()}
				<PDFViewer
					style={stylePDFViewer}
					showToolbar={true}
				>
					{documentoPDF}
				</PDFViewer>
			</div>
		</Dialog>
	)
}
