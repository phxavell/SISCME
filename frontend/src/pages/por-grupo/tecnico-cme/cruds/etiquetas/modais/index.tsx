import { Errors } from "@/components/Errors"
import { Input } from "@/components/Input"
import { MiniModal } from "@/components/MiniModal"

import { Button } from "primereact/button"
import { Dialog } from "primereact/dialog"
import { Controller } from "react-hook-form"
import { useModalEtiqueta } from "./useModalEtiqueta"
import {useCallback, useEffect} from "react"

import { Dropdown } from "primereact/dropdown"
import { RadioButton } from "primereact/radiobutton"
import { validityMonth } from "../helps"
import { ModalComplemento } from "./ModalComplemento"
import ImpressaoDividida from "@/assets/impressao_tripla_250h.png"
import ImpressaoUnica from "@/assets/impressao_unitaria_250h.png"
import { DropdownSearch } from "@/components/DropdownSeach/DropdownSearch"
import { styleActionHeader } from "@/components/RowTemplate.tsx"
import { Image } from "primereact/image"
import { ModalEtiquetaPdf } from "./ModalEtiquetaPdf"
import { ProgressSpinner } from "primereact/progressspinner"
import { InputNumber } from "primereact/inputnumber"
import { ModalSetor } from "@/pages/por-grupo/administrativo/especificoes/setor/ModalSetor"
import { ModalProps } from "./types"
import { styleRadios } from "@/pages/por-grupo/administrativo/cruds/motorista/novo-motorista/ModalMotorista/styles"
import { EMensagensNulas } from "@pages/por-grupo/tecnico-cme/cruds/etiquetas/schemas.ts"

export const ModalEtiqueta: React.FC<ModalProps> = (props) => {
	const { visible, onClose } = props

	const {
		miniModalVisible,
		setMiniModalVisible,
		reset,
		errors,
		handleSubmit,
		control,
		isLoading,
		clientes,
		formOptions,
		itensParaSelecao,
		loadingOption,
		onFilterItens,
		cliente,
		setCliente,
		complementos,
		onFilterComplementos,
		handleEtiqueta,
		tipoImpressaoEtiqueta,
		setTipoImpressaoEtiqueta,
		visibleModalComplemento,
		setVisibleModalComplemento,
		handleAtualizarComplemento,
		visibleModalPdf,
		setVisibleModalPdf,
		etiqueta,
		visibleModalSetor,
		setVisibleModalSetor,
		handleAtualizarSetor,
		confirmarFecharModal,
		setores,
		handleCloseMiniModal,
	} = useModalEtiqueta(visible, onClose)

	const headerModalTemplate = () => {
		return (
			<div className="flex  w-full justify-content-end h-3rem">
				<h3 className="text-md md:text-2xl my-auto">Nova Etiqueta</h3>
				<Button
					loading={isLoading}
					label="Cadastrar"
					icon="pi pi-save"
					className={
						styleActionHeader(`green`, `600`, `800`) +
                        `h-3rem ml-auto mr-2 my-auto `
					}
					severity={`success`}
					onClick={handleSubmit(handleEtiqueta)}
				/>
			</div>
		)
	}
	const TipoImpressaoPreview = useCallback(() => {
		let imgPrevia = ImpressaoUnica
		if (
			tipoImpressaoEtiqueta == `INSUMO` ||
            tipoImpressaoEtiqueta == `CONTEINER`
		) {
			imgPrevia = ImpressaoDividida
		}
		return <Image src={imgPrevia} height={`200`} />
	}, [tipoImpressaoEtiqueta])

	const FilterMessage = (
		loading: boolean,
		message: string,
		handleChamarModal: () => void,
	) => {
		if (loading) {
			return (
				<ProgressSpinner className="flex justify-content-center w-4rem h-2rem" />
			)
		} else {
			return (
				<div className="flex justify-content-center">
					<Button
						label={message}
						className="flex justify-content-end align-items-center h-2rem"
						onClick={handleChamarModal}
					/>
				</div>
			)
		}
	}
	return (
		<>
			<MiniModal
				miniModalVisible={miniModalVisible}
				setMiniModalVisible={setMiniModalVisible}
				reset={reset}
				onClose={handleCloseMiniModal}
			/>

			<ModalComplemento
				visible={visibleModalComplemento}
				onClose={() => setVisibleModalComplemento(false)}
				setComplemento={handleAtualizarComplemento}
			/>
			<ModalEtiquetaPdf
				visible={visibleModalPdf}
				onClose={() => setVisibleModalPdf(false)}
				etiqueta={etiqueta}
			/>
			<ModalSetor
				visible={visibleModalSetor}
				onClose={() => setVisibleModalSetor(false)}
				onRetornoDataSetor={handleAtualizarSetor}
			/>
			<Dialog
				header={headerModalTemplate()}
				visible={visible}
				style={{ width: `95vw` }}
				onHide={() => {
					confirmarFecharModal()
				}}
				blockScroll={false}
				draggable={false}
				dismissableMask={true}
				closeOnEscape={true}
				resizable={false}
				focusOnShow={true}
			>
				<div className="formgrid grid mt-6">
					<div className="field col-12 md:col-6 gap-2">
						<div className="w-full flex flex-column gap-4">
							<div className="text-left">
								<span className="p-float-label">
									<Dropdown
										className={`w-full`}
										filter
										options={clientes}
										value={cliente}
										onChange={(e) => setCliente(e.value)}
										optionLabel="nomecli"
										optionValue="idcli"
									/>
									<label htmlFor="">Cliente</label>
								</span>
							</div>
							<DropdownSearch
								label="Produtos"
								keyItem="idproduto"
								control={control}
								errors={errors}
								filter
								autoFocus
								showAdd={false}
								loadingOptions={loadingOption}
								listOptions={itensParaSelecao}
								optionsObject={{
									optionValue: `id`,
									optionLabel: `descricao`,
								}}
								onFilter={onFilterItens}
							/>
							<div className="text-left">
								<Controller
									control={control}
									name="datavalidade"
									render={({ field }) => {
										return (
											<>
												<span className="p-float-label">
													<Dropdown
														className="w-full"
														id={field.name}
														options={validityMonth}
														value={field.value}
														onChange={(e) =>
															field.onChange(
																e.value,
															)
														}
														optionLabel="dateFormat"
														optionValue="amount"
													/>
													<label htmlFor="">
                                                        Validade (em meses)
													</label>
												</span>
												{errors.datavalidade && (
													<Errors
														message={
															errors.datavalidade
																.message
														}
													/>
												)}
											</>
										)
									}}
								/>
							</div>

							<div className="text-left flex w-full gap-1">
								<Controller
									control={control}
									name="idcomplemento"
									rules={{ required: `Campo obrigatório` }}
									render={({ field }) => {
										return (
											<div className="flex flex-column w-full">
												<span className="p-float-label w-full">
													<Dropdown
														className="w-full text-left"
														id={field.name}
														options={complementos}
														value={field.value}
														onChange={(e) =>
															field.onChange(
																e.value,
															)
														}
														optionLabel="descricao"
														optionValue="id"
														filter
														emptyFilterMessage={FilterMessage(
															loadingOption,
															`Adicionar novo Complemento?`,
															() => {
																setVisibleModalComplemento(
																	true,
																)
															},
														)}
														onFilter={
															onFilterComplementos
														}
													/>
													<label htmlFor="">
                                                        Complemento
													</label>
												</span>
											</div>
										)
									}}
								/>
							</div>
							<div className="flex gap-2">
								<Controller
									control={control}
									name="servico"
									render={({ field }) => {
										return (
											<div className="flex flex-column w-5">
												<span className="p-float-label w-full">
													<Dropdown
														id={field.name}
														className={`w-full text-left`}
														options={
															formOptions?.servicos
														}
														value={field.value}
														onChange={(e) =>
															field.onChange(
																e.value,
															)
														}
														optionLabel="valor"
														optionValue="id"
													/>
													<label htmlFor="">
                                                        Integrador
													</label>
												</span>
												{errors.servico && (
													<Errors
														message={
															errors.servico
																.message
														}
													/>
												)}
											</div>
										)
									}}
								/>

								<Controller
									control={control}
									name="setor"
									render={({ field }) => {
										return (
											<div className="flex flex-column w-full">
												<span className="p-float-label w-full">
													<Dropdown
														className="w-full "
														id={field.name}
														options={setores?.data}
														value={field.value}
														onChange={(e) =>
															field.onChange(
																e.value,
															)
														}
														optionLabel="descricao"
														optionValue="id"
														filter
														emptyFilterMessage={FilterMessage(
															loadingOption,
															`Adicionar novo Setor?`,
															() => {
																setVisibleModalSetor(
																	true,
																)
															},
														)}
														onFilter={
															onFilterComplementos
														}
													/>
													<label htmlFor="">
                                                        Setor
													</label>
												</span>
												{errors.setor && (
													<Errors
														message={
															errors.setor.message
														}
													/>
												)}
											</div>
										)
									}}
								/>
							</div>
							<div className="flex gap-2 w-full -mb-1">
								<Controller
									name="peso"
									control={control}
									render={({ field }) => (
										<div className="text-left w-full">
											<Input
												placeholder="Peso"
												id={field.name}
												value={field.value}
												onChange={(e) =>
													field.onChange(
														e.target.value,
													)
												}
											/>
											{errors.peso && (
												<Errors
													message={
														errors.peso.message
													}
												/>
											)}
										</div>
									)}
								/>

								<Controller
									name="cautela"
									control={control}
									render={({ field }) => (
										<div className="p-float-label text-left">
											<InputNumber
												placeholder="Cautela"
												id={field.name}
												value={
													field.value === undefined
														? null
														: Number(field.value)
												}
												onValueChange={(e) => {
													field.onChange(e.value)
												}}
												useGrouping={false}
											/>
											{errors.cautela && (
												<Errors
													message={
														errors.cautela.message
													}
												/>
											)}
											<label htmlFor="">Cautela</label>
										</div>
									)}
								/>
							</div>
						</div>
					</div>

					<div className={`field col-12 md:col-6`}>
						<div className="w-full flex flex-column gap-4">
							<div className="flex gap-2 w-full -mt-5">
								<div className="w-ful">
									<h4 className="m-0 text-gray-200">
                                        Temperatura:
									</h4>

									<div className={`mb-0 ` + styleRadios}>
										<Controller
											name="temperatura"
											control={control}
											render={({ field }) => (
												<div className="flex flex-column">
													<div className="flex">
														<div className="flex align-items-center">
															<RadioButton
																inputId="134"
																{...field}
																inputRef={
																	field.ref
																}
																value="134"
																checked={
																	field.value ===
                                                                    `134`
																}
															/>
															<label
																htmlFor="134"
																className="ml-1 mr-3 text-gray-200"
															>
                                                                134°C
															</label>

															<RadioButton
																inputId="121"
																{...field}
																inputRef={
																	field.ref
																}
																value="121"
																checked={
																	field.value ===
                                                                    `121`
																}
															/>
															<label
																htmlFor="121"
																className="ml-1 mr-3 text-gray-200"
															>
                                                                121°C
															</label>
															<RadioButton
																inputId="90"
																{...field}
																inputRef={
																	field.ref
																}
																value="90"
																checked={
																	field.value ===
                                                                    `90`
																}
															/>
															<label
																htmlFor="134"
																className="ml-1 mr-3 text-gray-200"
															>
                                                                90°C
															</label>
															<RadioButton
																inputId="80"
																{...field}
																inputRef={
																	field.ref
																}
																value="80"
																checked={
																	field.value ===
                                                                    `80`
																}
															/>
															<label
																htmlFor="80"
																className="ml-1 text-gray-200"
															>
                                                                80°C
															</label>
														</div>
													</div>
													{errors.temperatura && (
														<Errors
															message={
																errors
																	.temperatura
																	.message
															}
														/>
													)}
												</div>
											)}
										/>
									</div>
								</div>
								<div className="w-full">
									<h4 className="m-0  text-gray-200">
                                        Biológico:
									</h4>
									<div className={`mt-0 ` + styleRadios}>
										<Controller
											name="biologico"
											control={control}
											render={({ field }) => (
												<div className="flex flex-column">
													<div className="flex">
														<div className="flex align-items-center">
															<RadioButton
																inputId="sim"
																{...field}
																inputRef={
																	field.ref
																}
																value="Sim"
																checked={
																	field.value ===
                                                                    `Sim`
																}
															/>
															<label
																htmlFor="sim"
																className="ml-1 mr-3 text-gray-200"
															>
                                                                Sim
															</label>

															<RadioButton
																inputId="nao"
																{...field}
																inputRef={
																	field.ref
																}
																value="Nao"
																checked={
																	field.value ===
                                                                    `Nao`
																}
															/>
															<label
																htmlFor="nao"
																className="ml-1 text-gray-200"
															>
                                                                Não
															</label>
														</div>
													</div>
													{errors.biologico && (
														<Errors
															message={
																errors.biologico
																	.message
															}
														/>
													)}
												</div>
											)}
										/>
									</div>
								</div>
							</div>

							<div className="flex gap-2">
								<Controller
									control={control}
									name="termodesinfectora"
									render={({ field }) => {
										return (
											<div className="w-full">
												<span className="p-float-label">
													<Dropdown
														className={`w-full`}
														id={field.name}
														options={
															formOptions?.termodesinfectoras
														}
														value={field.value}
														onChange={(e) =>
															field.onChange(
																e.value,
															)
														}
														optionValue="id"
														optionLabel="valor"
													/>
													<label htmlFor="">
                                                        Termodesinfectora
													</label>
												</span>
												{errors.termodesinfectora && (
													<Errors
														message={
															errors
																.termodesinfectora
																.message
														}
													/>
												)}
											</div>
										)
									}}
								/>

								<Controller
									control={control}
									name="ciclo_termodesinfectora"
									render={({ field }) => {
										return (
											<div className="text-left w-4">
												<Input
													placeholder="Ciclo Termo"
													keyfilter="int"
													inputClassName="h-3rem"
													id={field.name}
													value={field.value}
													onChange={(e) =>
														field.onChange(
															e.target.value,
														)
													}
												/>
												{errors.ciclo_termodesinfectora && (
													<Errors
														message={
															errors
																.ciclo_termodesinfectora
																.message
														}
													/>
												)}
											</div>
										)
									}}
								/>
							</div>
							<div className="flex gap-2">
								<div className="text-left w-full">
									<Controller
										control={control}
										name="autoclave"
										render={({ field }) => {
											return (
												<>
													<span className="p-float-label">
														<Dropdown
															className={`w-full h-3rem`}
															id={field.name}
															options={
																formOptions?.autoclaves
															}
															value={field.value}
															onChange={(e) =>
																field.onChange(
																	e.value,
																)
															}
															optionValue="id"
															optionLabel="valor"
														/>
														<label htmlFor="">
                                                            AutoClave
														</label>
													</span>
													{errors.autoclave && (
														<Errors
															message={
																errors.autoclave
																	.message
															}
														/>
													)}
												</>
											)
										}}
									/>
								</div>
								<div className="text-left w-4">
									<Controller
										control={control}
										name="ciclo_autoclave"
										render={({ field }) => {
											return (
												<div className="text-left w-full">
													<Input
														placeholder="Ciclo Autoclave"
														keyfilter="int"
														inputClassName="h-3rem"
														id={field.name}
														value={field.value}
														onChange={(e) =>
															field.onChange(
																e.target.value,
															)
														}
													/>
													{errors.ciclo_autoclave && (
														<Errors
															message={
																errors
																	.ciclo_autoclave
																	.message
															}
														/>
													)}
												</div>
											)
										}}
									/>
								</div>
							</div>
							<div className="flex gap-4">
								<div className="flex flex-column gap-4 w-full ">
									<div className="flex gap-2 w-full">
										<Controller
											name="seladora"
											control={control}
											render={({ field }) => (
												<div className="text-left w-full">
													<span className="p-float-label">
														<Dropdown
															className={`w-full`}
															id={field.name}
															options={
																formOptions?.seladoras
															}
															value={field.value}
															emptyMessage={
																EMensagensNulas.ZeroSeladoras
															}
															onChange={(e) =>
																field.onChange(
																	e.value,
																)
															}
															optionLabel="valor"
															optionValue="id"
														/>
														<label htmlFor="">
                                                            Seladora / Tipo
														</label>
													</span>
													{errors.seladora && (
														<Errors
															message={
																errors.seladora
																	.message
															}
														/>
													)}
												</div>
											)}
										/>
									</div>

									<Controller
										name="qtd"
										control={control}
										render={({ field }) => {
											return (
												<div className="w-full">
													<span className="p-float-label w-full">
														<InputNumber
															id={field.name}
															value={
																field.value ===
                                                                undefined
																	? null
																	: Number(
																		field.value,
																	)
															}
															onValueChange={(
																e,
															) =>
																field.onChange(
																	e,
																)
															}
															useGrouping={false}
															className="w-full"
														/>
														<label htmlFor="">
                                                            Qtd. Itens no Pacote
														</label>
													</span>
													{errors.qtd && (
														<Errors
															message={
																errors.qtd
																	.message
															}
														/>
													)}
												</div>
											)
										}}
									/>

									<Controller
										control={control}
										name="tipoetiqueta"
										render={({ field }) => {
											return (
												<div className="w-full">
													<span className="p-float-label">
														<Dropdown
															className={`w-full`}
															id={field.name}
															options={
																formOptions?.tipos_etiquetas
															}
															value={field.value}
															onChange={(e) => {
																field.onChange(
																	e.value,
																)
																setTipoImpressaoEtiqueta(
																	e.value,
																)
															}}
															optionLabel="valor"
															optionValue="id"
														/>
														<label htmlFor="">
                                                            Tipo de Impressao de
                                                            Etiqueta
														</label>
													</span>
													{errors.tipoetiqueta && (
														<Errors
															message={
																errors
																	.tipoetiqueta
																	.message
															}
														/>
													)}
												</div>
											)
										}}
									/>
								</div>
								<div className="h-3rem">
									{TipoImpressaoPreview()}
								</div>
							</div>
						</div>
					</div>
				</div>
			</Dialog>
		</>
	)
}
