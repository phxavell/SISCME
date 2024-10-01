import {MiniModal} from '@/components/MiniModal'
import {Dialog} from 'primereact/dialog'
import {Controller} from 'react-hook-form'
import {Button} from 'primereact/button'
import {Input} from '@/components/Input'
import {styleForm} from '@/pages/general/Login/style'
import {divSectionForm} from '@/util/styles'
import {RadioButton} from 'primereact/radiobutton'
import {Errors} from '@/components/Errors'
import {useModalEquipamentos} from './useModalEquipamentos'
import {InputText} from "primereact/inputtext"
import {DropdownSearch} from "@/components/DropdownSeach/DropdownSearch.tsx"
import {Calendar} from 'primereact/calendar'
import React, {useCallback, useMemo} from 'react'
import moment from 'moment'
import {InputNumber} from "primereact/inputnumber"
import {
	ModalUsuarioEquipamentoProps
} from "@pages/por-grupo/administrativo/cruds/equipamento/ModalEquipamentos/types.ts"
import {
	styleBlocoFormBorderR,
	styleRadiosSemMargem,
	styleResponsiveForm
} from "@pages/por-grupo/administrativo/cruds/equipamento/ModalEquipamentos/style.ts"
import { styleHeaderModal, styleSizeDialog } from '../../produto/modal-produto/styles'

export function ModalEquipamentos(props: ModalUsuarioEquipamentoProps) {
	const {
		visible,
		onClose,
		equipamento
	} = props
	const {
		miniModalVisible, setMiniModalVisible,
		salvando,
		control,
		handleSubmit,
		errors,
		confirmarFecharModal,
		handleEquipamentos,
		opcoes,
		handlerMiniModal
	} = useModalEquipamentos(props)

	const today = new Date()

	const labelBotaoSubmit = useMemo(() => {
		if (equipamento) {
			return `Atualizar`
		} else {
			return `Cadastrar`
		}
	}, [equipamento])

	const headerModal = useCallback( () => {
		return (
			<div className={styleHeaderModal}>
				<h3 className='m-0'>Novo Equipamento</h3>
				<div className="flex justify-content-center">
					<Button
						loading={salvando}
						data-testid="botao-cadastrar-equipamento"
						label={labelBotaoSubmit}
						className='w-8rem mr-3'
						severity={`success`}
						icon={`pi pi-save`}
						type='submit'
						onClick={handleSubmit(handleEquipamentos)}
					/>
				</div>

			</div>

		)
	}, [handleEquipamentos, handleSubmit, labelBotaoSubmit, salvando])

	return (
		<>
			<MiniModal
				miniModalVisible={miniModalVisible}
				setMiniModalVisible={setMiniModalVisible}
				reset={handlerMiniModal}
				onClose={() => onClose(false)}
			/>

			<Dialog
				header={headerModal}
				visible={visible}
				data-testid="modal-equipamento"
				style={styleSizeDialog}
				onHide={() => {
					confirmarFecharModal()
				}}
				blockScroll={false}
				draggable={false}
				closeOnEscape={true}
				dismissableMask={true}
				resizable={false}
			>
				<form
					className={styleForm}
					onSubmit={handleSubmit(handleEquipamentos)}>
					<div className={styleResponsiveForm}>
						<div className={styleBlocoFormBorderR}>
							<div className="text-left">
								<Controller
									control={control}
									name='numero_serie'
									render={({field}) => {
										return (
											<>
												<span className="p-float-label">
													<InputText
														maxLength={90}
														id={field.name}
														value={field.value}
														className='w-full'
														onChange={(e) => field.onChange(e.target.value.toUpperCase())}
													/>
													<label htmlFor="numero_serie">Número de Série</label>
												</span>
											</>
										)
									}}
								/>
								{errors.numero_serie && <Errors message={errors.numero_serie.message}/>}

							</div>

							<div className="text-left">
								<Controller
									control={control}
									name='descricao'
									render={({field}) => {
										return (
											<Input
												placeholder="Descrição"
												id={field.name}
												value={field.value}
												onChange={(e) => field.onChange(e.target.value)}
											/>
										)
									}}
								/>
								{errors.descricao && <Errors message={errors.descricao.message}/>}

							</div>

							<div className="text-left">
								<Controller
									control={control}
									name='data_fabricacao'
									render={({field}) => {
										return (
											<span className='p-float-label w-full'>
												<Calendar
													mask="99/99/9999"
													value={field.value ? moment(field.value).toDate() : null}
													onChange={(e) => field.onChange(e.target.value)}
													className='w-full'
													showIcon
													hideOnDateTimeSelect={true}
													dateFormat="dd/mm/yy"
													locale="pt"
													maxDate={today}
													showOnFocus={false}
												/>
												<label>
                                                    Dt. de Fabricação
												</label>
											</span>
										)
									}}
								/>
								{errors.data_fabricacao && <Errors message={errors.data_fabricacao.message as string}/>}
							</div>

						</div>
						<div className={styleBlocoFormBorderR}>
							<Controller
								name="registro_anvisa"
								control={control}
								render={({field}) => (
									<span className="p-float-label">
										<InputNumber
											className="w-full"
											id={field.name}
											value={field.value}
											useGrouping={false}
											min={0}
											onChange={(e) => field.onChange(e.value)}

										/>
										<label htmlFor="registro_anvisa">Registro ANVISA</label>
										<div className="text-left">
											{errors.registro_anvisa && <Errors
												message={errors.registro_anvisa.message}/>}
										</div>
									</span>

								)}
							/>

							<div className={styleRadiosSemMargem}>
								<Controller
									name="ativo"
									control={control}
									render={({field}) => (
										<div className="flex-column">
											<div className="flex">
												<h3 className="m-0 mr-3 text-gray-200">Situação:</h3>
												<div className="flex align-items-center">
													<RadioButton
														inputId="habilitado"
														{...field}
														inputRef={field.ref}
														value={true}
														checked={field.value === true}/>
													<label
														htmlFor="habilitado"
														className="ml-1 mr-6 text-gray-200">
                                                        Habilitado
													</label>

													<RadioButton
														inputId="desabilitado"
														{...field}
														inputRef={field.ref}
														value={false}
														checked={field.value === false}/>
													<label
														htmlFor="desabilitado"
														className="ml-1 text-gray-200">
                                                        Desabilitado
													</label>
												</div>
											</div>
											{errors.ativo && <Errors message={errors.ativo.message}/>}
										</div>
									)}
								/>
							</div>

							<DropdownSearch
								label="Tipo"
								keyItem="tipo"
								control={control}
								errors={errors}
								filter={false}
								showAdd={false}
								loadingOptions={false}
								listOptions={opcoes?.tipos ?? []}
								optionsObject={{optionValue: `id`, optionLabel: `valor`}}

							/>
						</div>
						<div className={divSectionForm}>
							<div className="text-left">
								<Controller
									name="capacidade"
									control={control}
									render={({field}) => (
										<>
											<span className="p-float-label">
												<InputNumber
													className="w-full"
													id={field.name}
													value={field.value}
													useGrouping={false}
													onChange={(e) => field.onChange(e.value)}
												/>
												<label htmlFor="capacidade">Capacidade (em litros)</label>
												<div className="text-left">
													{errors.capacidade && <Errors message={errors.capacidade.message}/>}
												</div>
											</span>
										</>
									)}
								/>
							</div>

							<div className="text-left">
								<Controller
									name="fabricante"
									control={control}
									render={({field}) => (
										<div className="text-left">
											<Input
												placeholder="Fabricante"
												id={field.name}
												value={field.value}
												onChange={(e) => field.onChange(e.target.value)}
											/>
										</div>
									)}
								/>
							</div>
						</div>
					</div>
				</form>

			</Dialog>

		</>
	)
}
