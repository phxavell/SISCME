import { useEffect, useState } from 'react'
import { InputMask } from 'primereact/inputmask'
import { Input } from '@/components/Input.tsx'
import { Errors } from '@/components/Errors.tsx'
import { Button } from 'primereact/button'
import { Dropdown } from 'primereact/dropdown'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { Dialog } from 'primereact/dialog'
import { MiniModal } from '@/components/MiniModal/index.tsx'
import { ClientAPI } from '@/infra/integrations/client.ts'
import { useAuth } from '@/provider/Auth/index.tsx'
import { divContainerForm, divSectionForm } from '@/util/styles/index.ts'
import { UFs } from '@/util/ufs.ts'
import { defaultValuesCliente } from "@infra/integrations/__mocks__"
import { InputNumber } from "primereact/inputnumber"
import { isNumber } from "chart.js/helpers"

import { newClientFormSchema } from '../schemas.ts'
import { NewClientFormInputs } from '@/infra/integrations/usuario-cliente/types.ts'
import { RadioButton } from 'primereact/radiobutton'

export function ModalCliente({ options, visible, onClose, cliente, setClientes }: any) {
	const [UF] = useState(UFs)
	const [miniModalVisible, setMiniModalVisible] = useState<boolean>(false)
	const [typeCellPhone, setTypeCellPhone] = useState<boolean>(false)
	const { user, toastError, toastSuccess } = useAuth()

	useEffect(() => {
		const cellPhoneRegex = new RegExp(`\\(\\d{2}\\)\\d{5}-\\d{4}`)
		if (cliente?.telefonecli && cellPhoneRegex.test(cliente.telefonecli)) {
			setTypeCellPhone(true)
		} else {
			setTypeCellPhone(false)
		}
	}, [cliente?.telefonecli])



	const {
		control,
		handleSubmit,
		setError,
		reset,
		clearErrors,
		formState: { errors, isSubmitting, isDirty }
	} = useForm<NewClientFormInputs>({ resolver: zodResolver(newClientFormSchema) })

	useEffect(() => {
		if (cliente) {
			let inscricaomunicipalcli = 0
			let inscricaoestadualcli = 0
			if (isNumber(cliente?.inscricaomunicipalcli)) {
				inscricaomunicipalcli = parseInt(String(cliente.inscricaomunicipalcli), 10)
			} else if (cliente?.inscricaomunicipalcli !== null && cliente?.inscricaomunicipalcli !== ``) {
				inscricaomunicipalcli = parseInt(cliente?.inscricaomunicipalcli, 10)
			}
			if (isNumber(cliente?.inscricaoestadualcli)) {
				inscricaoestadualcli = parseInt(String(cliente.inscricaoestadualcli), 10)
			} else if (cliente?.inscricaoestadualcli !== null && cliente?.inscricaoestadualcli !== ``) {
				inscricaoestadualcli = parseInt(cliente?.inscricaoestadualcli, 10)
			}
			reset({
				...cliente,
				nomefantasiacli: cliente.nomefantasiacli ?? ``,
				inscricaomunicipalcli: inscricaomunicipalcli ?? 0,
				inscricaoestadualcli: inscricaoestadualcli ?? 0,
				bairrocli: cliente.bairrocli ?? ``,
				cepcli: cliente.cepcli ?? ``,
				cidadecli: cliente.cidadecli ?? ``,
				codigocli: cliente.codigocli ?? ``,
				contatocli: cliente.contatocli ?? ``,
				emailcli: cliente.emailcli ?? ``,
				numerocli: cliente.numerocli ?? ``,
				ruacli: cliente.ruacli ?? ``,
				telefonecli: cliente.telefonecli ?? ``,
				ufcli: cliente.ufcli ?? ``
			})
		}
	}, [reset, cliente])

	const confirmarFecharModal = () => {
		if (isDirty) {
			setMiniModalVisible(true)
		} else {
			onClose(false)
			reset(defaultValuesCliente)
			setClientes(undefined)
		}
	}

	const titleModal = cliente ? `Edição de Cliente` : `Novo Cliente`

	const handleClient = (data: NewClientFormInputs) => {
		if (cliente) {
			data.idcli = cliente?.idcli
			return updateCliente(data)

		}

		return createCliente(data)
	}

	const createCliente = (data: NewClientFormInputs): void => {
		ClientAPI.save(user, data).then(() => {
			toastSuccess(`Cliente cadastrado!`)
			setClientes(undefined)
			reset(defaultValuesCliente)
			onClose(true)
		}).catch((error) => {
			handleErrorReturnApi(error.data, true)
		})
	}

	const updateCliente = (data: NewClientFormInputs): void => {
		ClientAPI.atualizar(user, data).then(() => {
			toastSuccess(`Cliente atualizado!`)
			setClientes(undefined)
			reset(defaultValuesCliente)
			onClose(true)
		}).catch((error) => {
			handleErrorReturnApi(error, false)
		})
	}

	const handleErrorReturnApi = (data: any, create: boolean) => {
		const dataKeys = Object.keys(data)
		const schemaKeys = Object.keys(newClientFormSchema.shape)
		dataKeys.forEach((key: string) => {
			if (schemaKeys.includes(key)) {
				setError(key as keyof NewClientFormInputs, {
					type: `manual`,
					message: data[key][0],
				})
			}
		})
		const message: string = create ? `Erro ao criar cliente` : `Erro ao atualizar cliente`
		toastError(message)
	}

	return (
		<>
			<MiniModal
				miniModalVisible={miniModalVisible}
				setMiniModalVisible={setMiniModalVisible}
				reset={() => {
					reset(defaultValuesCliente)
					setClientes(undefined)
				}}
				onClose={() => onClose(false)}
			/>
			<Dialog
				header={titleModal}
				draggable={false}
				resizable={false}
				focusOnShow={false}
				closeOnEscape={true}
				blockScroll={true}
				dismissableMask={true}
				data-testid='modal-cliente'
				visible={visible}
				style={{ width: `90vw` }}
				onHide={() => {
					confirmarFecharModal()
				}}
			>
				<form
					className="w-full mt-4 flex flex-column gap-5"
					onSubmit={handleSubmit(handleClient)}
				>
					<div className={divContainerForm}>
						<div className={`${divSectionForm} pr-5 border-right-1 border-600`}>
							<h4 className="m-0">Dados principais</h4>
							<Controller
								control={control}
								name='nomecli'
								render={({ field }) => {
									return (
										<div className="text-left">
											<Input
												placeholder={options?.nomecli?.label}
												id={field.name}
												data-testid='input-nomecli'
												value={field.value == null ? `` : field.value}
												onChange={(e) => {
													if (e.target.value.length <= options?.nomecli?.max_length) {
														field.onChange(e.target.value)
														clearErrors(`nomecli`)
													} else {
														setError(`nomecli`, {
															type: `manual`,
															message: `Nome deve ter no máximo ${options?.nomecli?.max_length} caracteres`,
														})
													}
												}}
												dataTestId='input-nomecli'
											/>
											{errors.nomecli && <Errors message={errors.nomecli.message} />}
										</div>
									)
								}}
							/>

							<Controller
								control={control}
								name='cnpjcli'
								render={({ field }) => {
									return (
										<div className="text-left">
											<span className="p-float-label">
												<InputMask
													className="w-full"
													mask="99.999.999/9999-99"
													id={field.name}
													value={field.value == null ? `` : field.value}
													onChange={(e) => field.onChange(e.target.value)}
													data-testid='input-cnpjcli'
												/>
												<label htmlFor={field.name} className="text-blue-600">CNPJ</label>
											</span>
											{errors.cnpjcli && <Errors message={errors.cnpjcli.message} />}
										</div>
									)
								}}
							/>

							<Controller
								control={control}
								name='nomeabreviado'
								render={({ field }) => {
									return (
										<div className="text-left">
											<Input
												placeholder={options?.nomeabreviado?.label}
												id={field.name}
												value={field.value == null ? `` : field.value}
												onChange={(e) => {
													if (e.target.value.length <= options?.nomeabreviado?.max_length) {
														field.onChange(e.target.value)
														clearErrors(`nomeabreviado`)
													} else {
														setError(`nomeabreviado`, {
															type: `manual`,
															message: `Sigla deve ter no máximo ${options?.nomeabreviado?.max_length} caracteres`,
														})
													}
												}
												}
												dataTestId='input-nomeabreviado'
											/>
											{errors.nomeabreviado && <Errors message={errors.nomeabreviado.message} />}
										</div>
									)
								}}
							/>

							<Controller
								control={control}
								name='nomefantasiacli'
								render={({ field }) => {
									return (
										<div>
											<Input
												placeholder={options?.nomefantasiacli?.label}
												id={field.name}
												value={field.value == null ? `` : field.value}
												onChange={(e) => {
													if (e.target.value.length <= options?.nomefantasiacli?.max_length) {
														field.onChange(e.target.value)
														clearErrors(`nomefantasiacli`)
													} else {
														setError(`nomefantasiacli`, {
															type: `manual`,
															message: `Nome fantasia deve ter no máximo ${options?.nomefantasiacli?.max_length} caracteres`,
														})
													}
												}}
												dataTestId='input-nomefantasiacli'
											/>
											{errors.nomefantasiacli &&
												<Errors message={errors.nomefantasiacli.message} />}
										</div>
									)
								}}
							/>

						</div>
						<div className={`${divSectionForm} pr-5 border-right-1 border-600`}>
							<h4 className="m-0">Endereço</h4>
							<div className="flex gap-1 w-full">
								<Controller
									control={control}
									name='ruacli'
									render={({ field }) => {
										return (
											<div>
												<Input
													inputClassName="w-18rem"
													placeholder={options?.ruacli?.label}
													id={field.name}
													value={field.value == null ? `` : field.value}
													onChange={(e) => {
														if (e.target.value.length <= options?.ruacli?.max_length) {
															field.onChange(e.target.value)
															clearErrors(`ruacli`)
														} else {
															setError(`ruacli`, {
																type: `manual`,
																message: `Rua deve ter no máximo ${options?.ruacli?.max_length} caracteres`,
															})
														}
													}}
													dataTestId='input-ruacli'
												/>
												{errors.ruacli && <Errors message={errors.ruacli.message} />}
											</div>
										)
									}}
								/>
								<Controller
									control={control}
									name='numerocli'
									render={({ field }) => {
										return (
											<div>
												<Input
													placeholder={options?.numerocli?.label}
													id={field.name}
													value={field.value == null ? `` : field.value}
													onChange={(e) => {
														if (e.target.value.length <= options?.numerocli?.max_length) {
															field.onChange(e.target.value)
															clearErrors(`numerocli`)
														} else {
															setError(`numerocli`, {
																type: `manual`,
																message: `Número deve ter no máximo ${options?.numerocli?.max_length} caracteres`,
															})
														}
													}}
													dataTestId='input-numerocli'
												/>
												{errors.numerocli && <Errors message={errors.numerocli.message} />}

											</div>
										)
									}}
								/>
							</div>

							<Controller
								control={control}
								name='bairrocli'
								render={({ field }) => {
									return (
										<div>
											<Input
												placeholder={options?.bairrocli?.label}
												id={field.name}
												value={field.value == null ? `` : field.value}
												onChange={(e) => {
													if (e.target.value.length <= options?.bairrocli?.max_length) {
														field.onChange(e.target.value)
														clearErrors(`bairrocli`)
													} else {
														setError(`bairrocli`, {
															type: `manual`,
															message: `Bairro deve ter no máximo ${options?.bairrocli?.max_length} caracteres`,
														})
													}
												}}
												dataTestId='input-bairrocli'
											/>

											{errors.bairrocli && <Errors message={errors.bairrocli.message} />}
										</div>
									)
								}}
							/>

							<Controller
								control={control}
								name='cepcli'
								render={({ field }) => {
									return (
										<span className="p-float-label">
											<InputMask
												className="w-full"
												mask="99999-999"
												id={field.name}
												value={field.value == null ? `` : field.value}
												onChange={(e) => field.onChange(e.target.value)}
												data-testid='input-cepcli'
											/>
											<label htmlFor={field.name} className="text-blue-600">{options?.cepcli?.label}</label>
										</span>
									)
								}}
							/>

							<div className="flex gap-1 w-full">
								<Controller
									control={control}
									name='cidadecli'
									render={({ field }) => {
										return (
											<div>
												<Input
													placeholder={options?.cidadecli?.label}
													inputClassName="w-18rem h-3rem"
													id={field.name}
													value={field.value == null ? `` : field.value}
													onChange={(e) => {
														if (e.target.value.length <= options?.cidadecli?.max_length) {
															field.onChange(e.target.value)
															clearErrors(`cidadecli`)
														} else {
															setError(`cidadecli`, {
																type: `manual`,
																message: `Cidade deve ter no máximo ${options?.cidadecli?.max_length} caracteres`,
															})
														}
													}}
													dataTestId='input-cidadecli'
												/>
												{errors.cidadecli && <Errors message={errors.cidadecli.message} />}
											</div>
										)
									}}
								/>

								<div className="text-left w-full">
									<Controller
										control={control}
										name='ufcli'
										render={({ field }) => {
											return (
												<span className="p-float-label">
													<Dropdown
														className='text-left h-3rem w-full'
														placeholder='UF'
														options={UF}
														id={field.name}
														value={field.value == null ? `` : field.value}
														onChange={(e) => field.onChange(e.value)}
														optionLabel="uf"
														optionValue="uf"
														data-testid='input-ufcli'
													/>
													<label className="text-blue-600">{options?.ufcli?.label}</label>
												</span>
											)
										}}
									/>
								</div>
							</div>
						</div>
						<div className={divSectionForm}>
							<h4 className="m-0">Dados adicionais</h4>
							<Controller
								name="inscricaoestadualcli"
								control={control}
								render={({ field }) => (
									<div className="text-left p-float-label">
										<InputNumber
											useGrouping={false}
											id={field.name}
											value={field.value}
											onChange={(e) =>
												field.onChange(e.value ?? 0)
											}
											maxLength={options?.inscricaoestadualcli?.max_length}
											data-testid='input-inscricaoestadualcli'
										/>
										<label htmlFor="inscricaoestadualcli">{options?.inscricaoestadualcli?.label}</label>
										{errors.inscricaoestadualcli &&
											<Errors message={errors.inscricaoestadualcli.message} />}

									</div>
								)}
							/>

							<Controller
								control={control}
								name='inscricaomunicipalcli'
								render={({ field }) => {
									return (
										<div className="text-left p-float-label">
											<InputNumber
												className="w-full"
												id={field.name}
												value={field.value}
												useGrouping={false}
												min={0}
												onChange={(e) => field.onChange(e.value ?? 0)}
												maxLength={options?.inscricaomunicipalcli?.max_length}
												data-testid='input-inscricaomunicipalcli'
											/>
											<label htmlFor="inscricaomunicipalcli">{options?.inscricaomunicipalcli?.label}</label>
											{errors.inscricaomunicipalcli &&
												<Errors message={errors.inscricaomunicipalcli.message} />}
										</div>
									)
								}}
							/>
							<Controller
								control={control}
								name='telefonecli'
								render={({ field }) => (
									<div>
										<div className="text-left flex gap-2">
											<RadioButton
												inputId="cellphone"
												name="cellphone"
												value="cellphone"
												checked={typeCellPhone}
												onChange={() => {
													setTypeCellPhone(true)
													field.onChange(``)
												}}
											/>
											<label htmlFor="cellphone" className="text-blue-600">Celular</label>
											<RadioButton
												inputId="phone"
												name="phone"
												value="phone"
												checked={!typeCellPhone}
												onChange={() => {
													setTypeCellPhone(false)
													field.onChange(``)
												}}
											/>
											<label htmlFor="phone" className="text-blue-600">Telefone</label>
										</div>
										<br />
										<InputMask
											className="w-full"
											id={field.name}
											placeholder={typeCellPhone ? `Celular` : `Telefone`}
											value={field.value == null ? `` : field.value}
											onChange={(e) => field.onChange(e.target.value)}
											mask={typeCellPhone ? `(99)99999-9999` : `(99)9999-9999`}
											data-testid='input-telefonecli'
											autoClear={false}
										/>
									</div>
								)}
							/>

							<Controller
								control={control}
								name='emailcli'
								render={({ field }) => {
									return (
										<div className="text-left">
											<Input
												placeholder={options?.emailcli?.label}
												id={field.name}
												value={field.value == null ? `` : field.value}
												onChange={(e) => {
													if (e.target.value.length <= options?.emailcli?.max_length) {
														field.onChange(e.target.value)
														clearErrors(`emailcli`)
													} else {
														setError(`emailcli`, {
															type: `manual`,
															message: `E-mail deve ter no máximo ${options?.emailcli?.max_length} caracteres`,
														})
													}
												}}
												dataTestId='input-emailcli'
											/>
											{errors.emailcli && <Errors message={errors.emailcli.message} />}
										</div>
									)
								}}
							/>
						</div>

					</div>
					<div className="w-full flex justify-content-center gap-2">
						<Button
							label={cliente ? `Atualizar` : `Cadastrar`}
							className='w-2 hover:bg-blue-600'
							data-testid='botao-cadastrar'
							type='submit'
							disabled={isSubmitting}
						/>

					</div>
				</form>
			</Dialog>

		</>
	)
}
