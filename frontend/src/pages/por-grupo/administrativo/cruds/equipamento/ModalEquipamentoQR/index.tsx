import { Dialog } from "primereact/dialog"
import { useEffect, useState } from "react"
import { PDFViewer } from "@react-pdf/renderer"
import { TEquipamentoQrCode } from "@/components/pdf-templates/TEquipamentoQrCode.tsx"
import { IModalEquipamento } from "./interfaces"

export const ModalEquipamentoQR = (props: IModalEquipamento) => {
	const [imagemToPDF, setImagemToPDF] = useState<any>(undefined)
	const { showModalQR, setShowModalQR, dadosView } = props
	const descricao = dadosView?.data?.descricao

	const handleCloseModal = () => {
		setShowModalQR(false)
	}

	useEffect(() => {
		if (showModalQR) {
			setTimeout(() => {
				setImagemToPDF(dadosView?.img)
			}, 0)
		}
	}, [showModalQR])
	return (
		<Dialog
			id="equipamentoModal"
			header={`QR Code: ${descricao}`}
			visible={showModalQR}
			onHide={handleCloseModal}
			style={{
				minWidth: `50vw`,
			}}
			dismissableMask={true}
			closeOnEscape={true}
			draggable={false}
			resizable={false}
		>
			<div>
				{imagemToPDF && (
					<PDFViewer
						style={{
							flex: 1,
							width: `100%`,
							height: `75vh`,
						}}
						showToolbar={true}
					>
						<TEquipamentoQrCode
							{...{
								...dadosView?.data,
								imgSrc: imagemToPDF,
							}}
						/>
					</PDFViewer>
				)}
			</div>
		</Dialog>
	)
}
