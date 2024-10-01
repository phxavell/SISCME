import { PlantaoTemplate } from "@/components/pdf-templates/PlantaoTemplate"
import { DataPlantao } from "@/infra/integrations/plantao"
import { styleColumnCaixa } from "@pages/por-grupo/administrativo/cruds/caixa/styles-caixa.ts"
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer"

import { Dialog } from "primereact/dialog"
import { Button } from "primereact/button"
import {ModalEditDescricaoProps} from "@pages/por-grupo/enfermagem/plantao/ModalPlantao/ModalEditDescricao.tsx"

export function ModalPlantaoPdf({ plantao, visible, onClose }: ModalEditDescricaoProps) {
	const headerDialog = () => {
		return (
			<div className="w-full flex justify-content-center">
				<PDFDownloadLink
					style={{
						textDecoration: `none`,
						color: `white`,
						borderRadius: `5px`,
					}}

					document={<PlantaoTemplate {...plantao as DataPlantao} />}
					fileName="RelatorioRecebimento.pdf">
					{({ loading }) => {
						return loading ? `Carregando documento...` :
							<Button
								className="flex gap-3 p-3 bg-blue-600 hover:bg-blue-500"
							> Download <i className="pi pi-download" /></Button>
					}
					}
				</PDFDownloadLink>

			</div>
		)
	}

	return (
		<Dialog
			draggable={false}
			resizable={false}
			header={headerDialog}
			onHide={() => onClose(false)}
			visible={visible}
			style={{ width: `80vw` }}
		>
			<div className={styleColumnCaixa + `flex`}>
				<PDFViewer
					style={{
						flex: 1,
						width: `50vw`,
						height: `68vh`,
					}}
					showToolbar={true}
				>
					<PlantaoTemplate {...plantao as DataPlantao} />
				</PDFViewer>
			</div>

		</Dialog>
	)
}
