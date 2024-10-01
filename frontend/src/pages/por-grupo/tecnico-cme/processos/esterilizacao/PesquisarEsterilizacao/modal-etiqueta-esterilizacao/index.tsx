import { PDFViewer } from "@react-pdf/renderer"
import { Dialog } from "primereact/dialog"
import { Dispatch, SetStateAction, useEffect, useRef } from "react"
import { EtiquetaEsterilizacaoTemplate } from "@/components/pdf-templates/EtiquetaEsterilizacaoTemplate"
import { Toast } from "primereact/toast"

export interface DadosPdfEtiquetaEsterilizacao {
	cliente: string;
	equipamento: string;
	ciclo: string;
	itens: Array<{
		serial: string;
		caixa: string;
	}>
}
interface ModalEtiquetaEsterilizacaoProps {
	showModalEtiqueta: boolean;
	setShowModalEtiqueta: Dispatch<SetStateAction<boolean>>;
	dadosEtiqueta: DadosPdfEtiquetaEsterilizacao;
	finalizado?: boolean;
}

export const ModalEtiquetaEsterilizacao = (
	{ showModalEtiqueta, setShowModalEtiqueta, dadosEtiqueta, finalizado }: ModalEtiquetaEsterilizacaoProps
) => {
	const toast = useRef<Toast>(null)
	const toastFinalizada = (messagem: string) => {
		toast.current?.show({ severity: `success`, summary: `Sucesso`, detail: messagem})
	}

	useEffect(() => {
		if (finalizado) {
			toastFinalizada(`Esterilização finalizada com sucesso`)
		}
	}, [finalizado])

	return (
		<>
			<Dialog
				dismissableMask={true}
				blockScroll={false}
				closeOnEscape={true}
				draggable={false}
				resizable={false}
				onHide={() => setShowModalEtiqueta(false)}
				visible={showModalEtiqueta}
				style={{ width: `80vw` }}
			>
				<div>
					<PDFViewer
						height={`400px`}
						width={`400px`}
						style={{
							width: `75vw`,
							height: `50vh`,
						}}
						showToolbar={true}
					>
						<EtiquetaEsterilizacaoTemplate dadosEtiqueta={dadosEtiqueta} />
					</PDFViewer>
				</div>
			</Dialog>
			<Toast ref={toast} />
		</>
	)
}
