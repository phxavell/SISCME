import {styleColumnCaixa} from "@pages/por-grupo/administrativo/cruds/caixa/styles-caixa.ts"
import {PDFViewer} from "@react-pdf/renderer"
import 'primeicons/primeicons.css'
import {Dialog} from "primereact/dialog"
import {IModalPreparoEtiquetaToPDF} from "@pages/por-grupo/tecnico-cme/processos/producao/types.ts"
import { useEffect, useState } from "react"
import { EtiquetaPreparoIntraHospitalarTemplate } from "@/components/pdf-templates/EtiquetaPreparoIntraHospitalarTemplate"
import JsBarcode from "jsbarcode"

export const ModalPreparoEtiquetaPDF: React.FC<IModalPreparoEtiquetaToPDF> = (props) => {
	const { showModal, setShowModal, preparoEtiquetaToPDF} = props
	const [imagemToPDF, setImagemToPDF] = useState<any>(undefined)
	useEffect(() => {
		if(preparoEtiquetaToPDF?.caixa?.sequencial && showModal){
			JsBarcode(`#barcode`, preparoEtiquetaToPDF.caixa.sequencial, {
				height: 52,
				fontSize: 32,
				// background:"green"
				//background:"transparent",
			}
			)
			setTimeout(() => {
				const node2 = document.getElementById(`barcode`)
				//@ts-ignore
				setImagemToPDF(node2?.src)
			}, 200)
		}

	}, [preparoEtiquetaToPDF, showModal])
	return (
		<Dialog
			style={{
				minWidth: `50vw`,
			}}
			draggable={false}
			resizable={false}
			data-testid='modal-preparo-etiqueta'
			showHeader={false}
			onHide={() => setShowModal(false)}
			visible={showModal}
			dismissableMask={true}
			closeOnEscape={true}
			position="center"
		>

			<div className={styleColumnCaixa}>

				{imagemToPDF && <PDFViewer
					style={{
						flex: 1,
						width: `100%`,
						height: `75vh`,
					}}
					showToolbar={true}
				>
					<EtiquetaPreparoIntraHospitalarTemplate {
						...{...preparoEtiquetaToPDF,
							barcodeSrc:imagemToPDF } } />
				</PDFViewer>}
			</div>
		</Dialog >
	)
}
