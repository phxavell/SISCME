import {ModalN} from "@pages/por-grupo/tecnico-cme/processos/recebimento/types.ts"
import React, {useRef} from "react"
import {Dialog} from "primereact/dialog"
import {styleCard} from "@pages/por-grupo/administrativo/cruds/caixa/styles-caixa.ts"
import {DropdownSearch} from "@/components/DropdownSeach/DropdownSearch.tsx"
import {Card} from "primereact/card"
import {
	useModalOcorrencias
} from "@pages/por-grupo/enfermagem/ocorrencias/modal-ocorrencias-criar/useModalOcorrencias.ts"
import {Calendar} from "primereact/calendar"
import {Button} from "primereact/button"
import {Editor, EditorTextChangeEvent} from "primereact/editor"
import {styleActionHeader} from "@/components/RowTemplate.tsx"
import {Controller} from "react-hook-form"
import {Errors} from "@/components/Errors.tsx"
import { styleCardFile } from "../styles"

const HeaderModalRecebimento: ModalN.THeaderOcorrencia = (conteudoPrevio, submitHandle) => () => {

	const label = conteudoPrevio ? `Edição de Ocorrência` : `Nova Ocorrência`
	return (
		<div className="flex  w-full justify-content-end">
			<div className="text-md md:text-2xl">
				{label}
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
export const ModalOcorrencias: ModalN.TPropsOcorrencia = (props) => {
	const {openDialog, closeDialog, conteudo} = props
	const {
		clientes,
		loadingOption,
		control,
		register,
		errors,
		opcoes,
		handlesalvar,
		handleClose
	} = useModalOcorrencias(openDialog, closeDialog, conteudo)

	const myRef = useRef<Calendar>(null)

	const margemEntreFormatadores = `mr-4`

	const paramChaveValor = {
		optionValue: `id`,
		optionLabel: `value`
	}

	// @ts-ignore
	return (
		<Dialog
			className="text-xs w-full  flex flex-column"
			header={HeaderModalRecebimento(conteudo, handlesalvar)}
			visible={openDialog}
			onHide={handleClose}
			resizable={false}
			draggable={false}
			closeOnEscape
			dismissableMask
			position="left"
		>

			<Card
				className={styleCard}>
				<div className={styleCardFile}>
					<div className={`flex-row flex gap-1 mb-5`}>
						<div className={`w-3`}>
							<DropdownSearch
								autoFocus={true}
								showAdd={false}
								control={control}
								errors={errors}
								keyItem="tipo"
								label="Origem de Ocorrência:"
								listOptions={opcoes?.tipo_de_ocorrencia ?? []}
								optionsObject={paramChaveValor}
								filter={false}
								loadingOptions={loadingOption}
							/>
						</div>
						<div className={`w-4`}>
							<DropdownSearch
								autoFocus={true}
								showAdd={false}
								control={control}
								errors={errors}
								keyItem="setor"
								label="Setor:"
								listOptions={opcoes?.setores ?? []}
								optionsObject={paramChaveValor}
								filter={true}
								loadingOptions={loadingOption}
							/>
						</div>
						<div className={`w-5`}>
							<DropdownSearch
								autoFocus={true}
								showAdd={false}
								control={control}
								errors={errors}
								keyItem="indicador"
								label="Tipo de Ocorrência:"
								listOptions={opcoes?.indicadores ?? []}
								optionsObject={paramChaveValor}
								filter={true}
								loadingOptions={loadingOption}
							/>
						</div>
					</div>
					<div className={`flex-row flex gap-1 mb-2`}>
						<div className={`w-4`}>
							<DropdownSearch
								autoFocus={true}
								showAdd={false}
								control={control}
								errors={errors}
								keyItem="cliente"
								label="Cliente"
								listOptions={clientes}
								optionsObject={paramChaveValor}
								filter={true}
								loadingOptions={loadingOption}
							/>
						</div>
						<div className={`w-4 flex-column`}>
							<DropdownSearch
								autoFocus={true}
								showAdd={false}
								control={control}
								errors={errors}
								keyItem="profissional"
								label="Profissional:"
								listOptions={opcoes?.users ?? []}
								optionsObject={paramChaveValor}
								filter={true}
								loadingOptions={loadingOption}
							/>

						</div>
						<div className={`w-4`}>
							<Controller
								control={control}
								name="datetime_ocorrencia"
								render={({field}) => {
									return (
										<span className="p-float-label">
											<Calendar
												locale="pt"
												onChange={(e) => {
													e.preventDefault()
													e.stopPropagation()
													field.onChange(e.value)
												}}
												id={field.name}
												value={field.value}

												style={{width: `100%`}}
												ref={myRef}
												footerTemplate={() => {
													return (
														<div className={`flex justify-content-end`}>
															<Button
																label={`Confirmar`}
																onClick={() => {
																	myRef?.current?.hide()
																}}
															/>
														</div>
													)
												}}
												hideOnDateTimeSelect={true}
												placeholder="Dt. Início"
												showTime
												showIcon
												dateFormat="dd/mm/yy"
												className={`h-3rem`}
											/>
											<label htmlFor={field.name} className="">Dt. Início</label>
										</span>
									)
								}}
							/>
							{errors[`datetime_ocorrencia`] &&
                                <Errors message={errors[`datetime_ocorrencia`]?.message}/>}
						</div>
					</div>

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

							<Button
								aria-label="Templates"
								icon="pi pi-book"
								label={`Templates`}
								text
								className={`text-0 ml-auto p-2 mr-1`}
								onClick={() => {
									// @ts-ignore
								}}/>
						</div>
						<Controller
							control={control}
							name="descricao"
							render={({field}) => {
								return (
									<Editor
										placeholder={`Descrição da ocorrência, acesse uma opção de template 👉`}
										id={field.name}
										value={field.value}
										onTextChange={(e: EditorTextChangeEvent) => {
											const value = e?.htmlValue !== null ? e?.htmlValue : ``
											field.onChange(value)
										}}
										showHeader={false}
										{...register(`descricao`)}
										style={{height: `320px`}}
									/>
								)
							}}
						/>
						{errors[`descricao`] && <Errors message={errors[`descricao`]?.message}/>}
					</div>

				</div>
			</Card>

		</Dialog>
	)
}
