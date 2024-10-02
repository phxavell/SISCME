import { styleColumnCaixa } from "@pages/por-grupo/administrativo/cruds/caixa/styles-caixa.ts"
import { Dialog } from "primereact/dialog"
import { EtiquetaUnitariaTemplate } from "@/components/pdf-templates/EtiquetaUnitariaTemplate.tsx"
import { EtiquetaTriplaTemplate } from "@/components/pdf-templates/EtiquetaTriplaTemplate.tsx"
import { EtiquetaUnitariaRoupariaTemplate } from "@/components/pdf-templates/EtiquetaUnitariaRoupariaTemplate"
import { EtiquetaUnitariaTermoTemplate } from "@/components/pdf-templates/EtiquetaUnitariaTermoTemplate"
import { EtiquetaUnitariaRespiratorioTemplate } from "@/components/pdf-templates/EtiquetaUnitariaRespiratorioTemplate"
import { EtiquetaUnitariaInstrumentalTemplate } from "@/components/pdf-templates/EtiquetaUnitariaInstrumentalTemplate"
import { useCallback } from "react"
import { PDFViewer } from "@react-pdf/renderer"

const identificarPDF = (etiqueta: any) => {
	if (
		etiqueta?.tipoetiqueta === `INSUMO` ||
        etiqueta?.tipoetiqueta === `CONTEINER`
	) {
		return <EtiquetaTriplaTemplate {...etiqueta} />
	} else if (etiqueta?.tipoetiqueta === `ROUPARIA`) {
		return <EtiquetaUnitariaRoupariaTemplate {...etiqueta} />
	} else if (etiqueta?.tipoetiqueta === `TERMODESINFECCAO`) {
		return <EtiquetaUnitariaTermoTemplate {...etiqueta} />
	} else if (etiqueta?.tipoetiqueta === `RESPIRATORIO`) {
		return <EtiquetaUnitariaRespiratorioTemplate {...etiqueta} />
	} else if (etiqueta?.tipoetiqueta === `INSTRUMENTAL AVULSO`) {
		return <EtiquetaUnitariaInstrumentalTemplate {...etiqueta} />
	} else return <EtiquetaUnitariaTemplate {...etiqueta} />
}

export function ModalEtiquetaPdf({ etiqueta, visible, onClose }: any) {
	const renderPDF = useCallback(() => {
		if (etiqueta && visible) {
			identificarPDF(etiqueta)
			return (
				<PDFViewer
					height={`400px`}
					width={`400px`}
					style={{
						width: `100vw`,
						height: `45vh`,
					}}
					showToolbar={true}
				>
					{identificarPDF(etiqueta)}
				</PDFViewer>
			)
		}
		return <></>
	}, [etiqueta, visible])
	return (
		<Dialog
			dismissableMask={true}
			blockScroll={false}
			closeOnEscape={true}
			draggable={false}
			resizable={false}
			onHide={() => onClose(false)}
			visible={visible}
			style={{ width: `80vw` }}
		>
			<div className={styleColumnCaixa + `flex justify-content-center`}>
				{renderPDF()}
			</div>
		</Dialog>
	)
}
