import { CaixasEsterilizacaoTemplate } from "@/components/pdf-templates/CaixasEsterilizacaoTemplate"
import { styleColumnCaixa } from "@pages/por-grupo/administrativo/cruds/caixa/styles-caixa.ts"
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer"
import 'primeicons/primeicons.css'
import { Dialog } from "primereact/dialog"
interface IModalEsterilizacaoPDF {
    setShowModal: any
    showModal: boolean
    esterilizacaoToPDF: any
    // setEsterilizacaoToPDF: any
}

export const ModalPDF: React.FC<IModalEsterilizacaoPDF> = (props) => {
	const { showModal, setShowModal, esterilizacaoToPDF} = props
	return (
		<Dialog
			style={{
				minWidth: `50vw`,
			}}
			draggable={false}
			resizable={false}
			onHide={() => setShowModal(false)}
			visible={showModal}
			position="top"
			dismissableMask={true}
			closeOnEscape={true}
		>
			<div className={styleColumnCaixa}>
				<PDFDownloadLink
					style={{
						textDecoration: `none`,
						padding: `10px`,
						color: `white`,
						backgroundColor: `#326fd1`,
						marginBottom: `10px`,
						position: `absolute`,
						top: `3%`,
						right: `45%`,
						borderRadius: `5px`,
					}}
					document={<CaixasEsterilizacaoTemplate {...esterilizacaoToPDF} />}
					fileName="RelatorioEsterilizacao.pdf">
					{({ loading }: { loading: boolean }) => {
						return loading ? `Carregando documento...` :
							<span> Download <i className="pi pi-download" /></span>
					}}
				</PDFDownloadLink>
				<PDFViewer
					style={{
						flex: 1,
						width: `100%`,
						height: `75vh`,
					}}
					showToolbar={true}
				>
					<CaixasEsterilizacaoTemplate {...esterilizacaoToPDF} />
				</PDFViewer>
			</div>
		</Dialog >
	)
}
