import {ModalN} from "@pages/por-grupo/tecnico-cme/processos/recebimento/types.ts"
import {Dialog} from "primereact/dialog"
import { FileUpload} from 'primereact/fileupload'
import {styleCard} from "@pages/por-grupo/administrativo/cruds/caixa/styles-caixa.ts"
import {Card} from "primereact/card"
import {
	useModalOcorrenciasAnexar
} from "@pages/por-grupo/enfermagem/ocorrencias/modal-ocorrencias-anexar/useModalOcorrenciasAnexar.ts"
import { styleCardFile } from "../styles"

export const ModalOcorrenciasAnexar: ModalN.TPropsOcorrencia = (props) => {
	const {openDialog, closeDialog, conteudo} = props
	const {
		handlesalvar,
		handleClose,
	} = useModalOcorrenciasAnexar(openDialog, closeDialog, conteudo)

	const itemTemplate = (data: any) => {
		return (
			<div className="flex flex-column align-items-start">
				{data.name}
				<div className="flex gap-2 align-items-center">
					{data.size.toLocaleString(`pt-BR`)} KB
					<div className="text-xs font-bold text-white bg-green-400 p-1 border-round-lg">Carregado</div>
				</div>
			</div>
		)
	}
	return (
		<Dialog
			className="text-xs w-full  flex flex-column"
			visible={openDialog}
			onHide={handleClose}
			resizable={false}
			draggable={false}
			closeOnEscape
			dismissableMask
		>

			<Card
				className={styleCard}>
				<div className={styleCardFile}>
					<div className="text-left flex-wrap w-full">

						<div className=" p-float-label w-full">
							<FileUpload
								chooseLabel="PDF"
								uploadLabel="Salvar"
								cancelLabel="Cancelar"
								itemTemplate={itemTemplate}
								accept="application/pdf"
								emptyTemplate='Nenhuma imagem carregada'
								customUpload
								uploadHandler={handlesalvar}
							/>
						</div>
					</div>

				</div>
			</Card>

		</Dialog>
	)
}
