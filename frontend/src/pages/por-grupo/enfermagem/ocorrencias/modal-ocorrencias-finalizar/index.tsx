import {ModalN} from "@pages/por-grupo/tecnico-cme/processos/recebimento/types.ts"
import React from "react"
import {Dialog} from "primereact/dialog"
import {styleCard} from "@pages/por-grupo/administrativo/cruds/caixa/styles-caixa.ts"
import {Card} from "primereact/card"
import {Button} from "primereact/button"
import {Editor, EditorTextChangeEvent} from "primereact/editor"
import {styleActionHeader} from "@/components/RowTemplate.tsx"
import {Controller} from "react-hook-form"
import {Errors} from "@/components/Errors.tsx"
import {
	useModalOcorrenciasFechar
} from "@pages/por-grupo/enfermagem/ocorrencias/modal-ocorrencias-finalizar/useModalOcorrenciasFechar.ts"
import { styleCardFile } from "../styles"

const HeaderModalRecebimento: ModalN.THeaderOcorrenciaFechar = (submitHandle) => () => {

	return (
		<div className="flex  w-full justify-content-end">
			<div className="text-md md:text-2xl">
                Fechamento de Ocorrência
			</div>
			<Button
				icon="pi pi-save"
				className={styleActionHeader(`green`, `600`, `800`) + ` ml-auto mr-2 `}
				label={`Salvar`}
				onClick={() => {
					submitHandle(``).then(() => {

					})
				}}
			></Button>
		</div>
	)
}
//tornar o templates mais moderno e com mais opções.
export const ModalOcorrenciasFechar: ModalN.TPropsOcorrencia = (props) => {
	const {openDialog, closeDialog, conteudo} = props
	const {
		control,
		register,
		errors,
		handlesalvar,
		handleClose
	} = useModalOcorrenciasFechar(openDialog, closeDialog, conteudo)

	const margemEntreFormatadores = `mr-4`

	// @ts-ignore
	return (
		<Dialog
			className="text-xs w-full  flex flex-column"
			header={HeaderModalRecebimento( handlesalvar)}
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

					<div>
						<div className="
                        toolbar
                        border-2
                        justify-content-left
                        align-content-center
                        align-items-center
                        flex
                        ">
							<Button
								text
								label={`B`}
								className={`font-bold text-0`}
								onClick={() => {
									// @ts-ignore
									document.execCommand(`bold`, false, null)
								}}/>

							<Button

								text
								label={`I`}
								className={`font-italic text-0`}
								onClick={() => {
									// @ts-ignore
									document.execCommand(`italic`, false, null)
								}}/>
							<Button
								className={`underline text-0 ${margemEntreFormatadores}`}
								text
								label={`U`}
								onClick={() => {
									// @ts-ignore
									document.execCommand(`underline`, false, null)
								}}/>

							<Button
								aria-label="Alinhar à Esquerda"
								icon="pi pi-align-left"
								className={`text-0`}
								text
								onClick={() => {
									// @ts-ignore
									document.execCommand(`justifyLeft`, false, null)
								}}/>
							<Button
								aria-label="Centralizar"
								icon="pi pi-align-center"
								text
								className={`text-0`}
								onClick={() => {
									// @ts-ignore
									document.execCommand(`justifyCenter`, false, null)
								}
								}
							/>
							<Button
								aria-label="Alinhar à Direita"
								icon="pi pi-align-right"
								text
								className={`text-0 ${margemEntreFormatadores}`}
								onClick={() => {
									// @ts-ignore
									document.execCommand(`justifyRight`, false, null)
								}}/>
							{/**/}
							<Button
								aria-label="Lista Simples"
								icon="pi pi-list"
								text
								className={`text-0`}
								onClick={() => {
									// @ts-ignore
									document.execCommand(`insertUnorderedList`, false, null)
								}}/>
							<Button
								aria-label="Lista Ordenada"
								icon="pi pi-sort-numeric-down"
								text
								className={`text-0 ${margemEntreFormatadores}`}
								onClick={() => {
									// @ts-ignore
									document.execCommand(`insertOrderedList`, false, null)
								}}/>

							{/*<Button*/}
							{/*    aria-label="Templates"*/}
							{/*    icon="pi pi-book"*/}
							{/*    label={"Templates"}*/}
							{/*    text*/}
							{/*    className={`text-0 ml-auto p-2 mr-1`}*/}
							{/*    onClick={() => {*/}
							{/*        // @ts-ignore*/}
							{/*    }}/>*/}
						</div>
						<Controller
							control={control}
							name="acao"
							render={({field}) => {
								return (
									<Editor
										// placeholder={"Descrição da ocorrência, acesse uma opção de template 👉"}
										id={field.name}
										value={field.value}
										onTextChange={(e: EditorTextChangeEvent) => {
											// @ts-ignore
											const value = e?.htmlValue !== null ? e?.htmlValue : ``
											field.onChange(value)
										}}
										showHeader={false}
										{...register(`acao`)}
										style={{height: `320px`}}
									/>
								)
							}}
						/>
						{errors[`acao`] && <Errors message={errors[`acao`]?.message}/>}
					</div>

				</div>
			</Card>

		</Dialog>
	)
}
