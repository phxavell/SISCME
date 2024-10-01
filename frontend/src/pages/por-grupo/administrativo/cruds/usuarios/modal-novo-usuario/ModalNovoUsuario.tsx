import { Dialog } from "primereact/dialog"
import { useModalNovoUsuario } from "./useModalNovoUsuario"
import { InputText } from "primereact/inputtext"
import { Calendar } from "primereact/calendar"
import { Button } from "primereact/button"
import {Controller} from 'react-hook-form'
import {styleHeaderTitle} from '@pages/por-grupo/administrativo/cruds/caixa/styles-caixa.ts'
import { RadioButton } from "primereact/radiobutton"
import { InputMask } from "primereact/inputmask"
import { Dropdown } from "primereact/dropdown"
import React, { useRef } from "react"
import { Messages } from "primereact/messages"
import { InputNumber } from "primereact/inputnumber"
import { MultiSelect } from 'primereact/multiselect'
import { ToggleButton } from 'primereact/togglebutton'
import { TabView, TabPanel } from 'primereact/tabview'
import { ETabUsuario, IModalNovoUsuario } from "./types"
import { ptConfig, styleClassResponsavelTecnico, styleForm } from "./style.ts"
import { Errors } from "@/components/Errors.tsx"
import { MiniModal } from "@/components/MiniModal/index.tsx"

export const ModalNovoUsuario = (props: IModalNovoUsuario) => {
	const { showModal , onClose} = props
	const {
		control,
		handleSubmit,
		register,
		errors,
		getValues,
		profissoesList,
		loading,
		gruposUsuarios, handleSubmitUsuario,
		setMiniModalVisible, miniModalVisible,
		confirmarFecharModal, handlerMiniModal,
		setTabAtual, tabAtual
	} = useModalNovoUsuario(showModal, onClose)

	const msgs = useRef<Messages>(null)

	const Header = () => {
		return (
			<div className={styleHeaderTitle}>
				<div className="text-md md:text-2xl">
                    Novo Usuário
				</div>
				<div className="gap-2 flex mr-2 pl-2">
					<Button
						label="Salvar Usuário"
						severity="success"
						autoFocus={true}
						onClick={handleSubmit(handleSubmitUsuario)}
						loading={loading}
					/>
				</div>
			</div>
		)
	}
	const gruposTemplate = (option: any) => {
		return (
			<div className="flex align-items-center">
				<div>{option.descricao}</div>
			</div>
		)
	}

	const gruposFooterTemplate = () => {
		const selectedGrupos = getValues(`Usuario.grupos`)

		const length = selectedGrupos ? selectedGrupos.length : 0

		return (
			<div className="py-2 px-3">
				<b>{length}</b> grupo{length > 1 ? `s` : ``} selecionado.
			</div>
		)
	}
	const myRef= useRef(null)
	const myRef2= useRef(null)

	return(
		<>
			<MiniModal
				miniModalVisible={miniModalVisible}
				setMiniModalVisible={setMiniModalVisible}
				reset={handlerMiniModal}
				onClose={() => onClose()}
			/>
			<Dialog
				draggable={false}
				header={Header}
				visible={showModal}
				style={{ width: `50vw` }}
				breakpoints={{'960px': `75vw`, '640px': `100vw`}}
				onHide={() => {
					confirmarFecharModal()
				}}
				position="top"
				resizable={false}
				closeOnEscape={true}
				dismissableMask={true}

			>

				<Messages ref={msgs} />
				<form>
					<TabView
						panelContainerClassName="bg-transparent"
						activeIndex={tabAtual}
						onTabChange={(e) => setTabAtual(e.index)}
						pt={{
							navContainer: () => ({
								className: `text-sm `
							})
						}}
					>
						<TabPanel header="Dados Pessoais"
							pt={ptConfig(tabAtual === ETabUsuario.DadosPessoais)}

						>
							<div className={styleForm}>
								<Controller
									control={control}
									name="Profissional.cpf"
									render={({field}) => {
										return(
											<span className="p-float-label">
												<InputMask
													ref={myRef}
													className="w-full"
													id={field.name}
													mask="999.999.999-99"
													placeholder="CPF"
													value={field.value}
													autoFocus={true}
													onChange={(e) => field.onChange(e.target.value)}
												/>
												<label htmlFor="cpf">CPF*</label>
												{errors.Profissional?.cpf && <Errors message={errors.Profissional.cpf.message}/>}
											</span>
										)
									}}

								/>

								<Controller
									control={control}
									name="Profissional.nome"
									render={({field}) => {
										return(
											<span className="p-float-label">
												<InputText
													className="w-full"
													id={field.name}
													value={field.value ?? ``}
													onChange={(e) => field.onChange(e.target.value)}
												/>
												<label htmlFor="nome">Nome*</label>
												{errors.Profissional?.cpf && <Errors message={errors.Profissional.cpf.message}/>}
											</span>
										)
									}}

								/>


								<Controller
									control={control}
									name="Profissional.matricula"
									render={({field}) => {
										return(
											<span className="p-float-label">
												<InputNumber
													className="w-full"
													id={field.name}
													value={field.value}
													useGrouping={false}
													min={0}
													onChange={(e) => field.onChange(e.value)} />
												<label htmlFor="matricula">Matricula</label>
											</span>
										)
									}}
								/>

								<Controller
									control={control}
									name="Profissional.coren"
									render={({field}) => {
										return(
											<span className="p-float-label">
												<InputText
													className="w-full"
													id={field.name}
													value={field.value ?? ``}
													onChange={(e) => field.onChange(e.target.value)} />
												<label htmlFor="coren">Coren</label>
											</span>
										)
									}}
								/>

								<div className="flex-column">
									<Controller
										control={control}
										name="Profissional.sexo"
										render={({field}) => {
											return(
												<div className="flex flex-column">
													<div className="flex">
														<h3 className="m-0 mr-3 text-gray-200">Sexo*:</h3>
														<div className="flex align-items-center"></div>
														<RadioButton
															inputId="rb1"
															{...field}
															value="M"
															checked={field.value === `M`}
														/>
														<label
															htmlFor="sexoM"
															className={styleClassResponsavelTecnico}>
                                                        Masculino
														</label>
														<RadioButton
															inputId="rb2"
															{...field}
															value="F"
															checked={field.value === `F`}
														/>
														<label
															htmlFor="sexoF"
															className="ml-1 text-gray-200">
														Feminino
														</label>
													</div>
													{errors.Profissional?.sexo && <Errors message={errors.Profissional.sexo.message}/>}
												</div>
											)
										}}
									/>
								</div>
							</div>
						</TabPanel>
						<TabPanel header="Dados Adicionais"
							pt={ptConfig(tabAtual === ETabUsuario.DadosAdicionais)}
						>
							<div className={styleForm}>
								<Controller
									control={control}
									name="Profissional.dtnascimento"
									render={({field}) => {
										return(
											<div className="flex flex-column">
												<Calendar
													id={field.name}
													value={field.value}
													onChange={field.onChange}
													placeholder="Data Nascimento*"
													maxDate={new Date()}
													showIcon
													dateFormat="dd/mm/yy"
													hideOnDateTimeSelect={true}
												/>
												{errors.Profissional?.dtnascimento && <Errors message={errors.Profissional.dtnascimento.message}/>}
											</div>
										)
									}}
								/>
								<Controller
									control={control}
									name="Profissional.dtadmissao"
									render={({field}) => {
										return(
											<div className="flex flex-column">
												<Calendar
													id={field.name}
													value={field.value}
													onChange={field.onChange}
													placeholder="Data Admissão*"
													maxDate={new Date()}
													showIcon
													dateFormat="dd/mm/yy"
													hideOnDateTimeSelect={true}
												/>
												{errors.Profissional?.dtadmissao && <Errors message={errors.Profissional.dtadmissao.message}/>}
											</div>
										)
									}}
								/>
								<Controller
									control={control}
									name="Profissional.contato"
									render={({field}) => {
										return(
											<span className="p-float-label">
												<InputMask
													className="w-full"
													id={field.name}
													mask="(99)99999-9999"
													ref={myRef2}
													value={field.value}
													onChange={(e) => field.onChange(e.target.value)} />
												<label htmlFor="telefone">Telefone</label>
											</span>
										)
									}}
								/>
							</div>
						</TabPanel>
						<TabPanel header="Dados do Usuário" pt={ptConfig(tabAtual === ETabUsuario.DadosUsuario)}	>
							<div className={styleForm}>

								<span className="p-float-label">
									<InputText
										className="w-full"
										{...register(`Profissional.email`)}
									/>
									<label htmlFor="email">E-mail*</label>

								</span>


								<span className="p-float-label">
									<InputText
										className="w-full"
										{...register(`Usuario.username`)}
									/>
									<label htmlFor="usuario">Nome de Usuário*</label>
									{errors.Usuario?.username && <Errors message={errors.Usuario?.username.message}/>}
								</span>

								<Controller
									control={control}
									name="Profissional.idprofissao"
									render={({field}) => {
										return(
											<div className="flex flex-column">
												<Dropdown
													id={field.name}
													placeholder="Profissão*"
													value={field.value}
													options={profissoesList}
													onChange={(e) => field.onChange(e.value)}
													optionLabel="valor"
													optionValue="id"
												/>
												{errors.Profissional?.idprofissao && <Errors message={errors.Profissional.idprofissao.message}/>}
											</div>
										)
									}}
								/>
								<Controller
									control={control}
									name="Usuario.grupos"
									render={({field}) => {

										return(
											<MultiSelect
												id={field.name}
												value={field.value}
												options={gruposUsuarios}
												onChange={(e) => field.onChange(e.value)}
												optionLabel="descricao"
												optionValue="id"
												placeholder="Selecione os grupos"
												panelFooterTemplate={gruposFooterTemplate}
												itemTemplate={gruposTemplate}
												maxSelectedLabels={3}
												display="chip"
												className="w-full"
											/>
										)
									}}
								/>
								<Controller
									control={control}
									name="Profissional.rt"
									render={({field}) => {
										const isChecked = field.value === `S`

										return(
											<div className="flex flex-column">
												<div className="flex  align-items-center">
													<label 	className={styleClassResponsavelTecnico} >
                                            Responsável técnico
													</label>
													<ToggleButton
														id={field.name}
														onLabel="Sim"
														offLabel="Não"
														checked={isChecked}
														onChange={(e) => {
															field.onChange(e.target.value ? `S` : `N`)
														}}
													/>
												</div>
												{errors.Profissional?.rt && <Errors message={errors.Profissional.rt.message}/>}
											</div>
										)
									}}
								/>
							</div>
						</TabPanel>
					</TabView>
				</form>
			</Dialog>
		</>
	)
}
