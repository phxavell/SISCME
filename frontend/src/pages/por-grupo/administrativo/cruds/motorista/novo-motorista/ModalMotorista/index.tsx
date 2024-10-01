import {zodResolver} from '@hookform/resolvers/zod'
import {Controller, useForm} from 'react-hook-form'
import {driverFormSchema, DriverFormSchemaType} from '../schemas.ts'
import {Button} from 'primereact/button'
import {Input} from '@/components/Input.tsx'
import {Errors} from '@/components/Errors.tsx'
import {RadioButton} from 'primereact/radiobutton'
import {DriverAPI} from '@/infra/integrations/motorista.ts'
import React, {useCallback, useEffect, useRef, useState} from 'react'
import {Toast} from 'primereact/toast'
import {useAuth} from '@/provider/Auth'
import {Dialog} from 'primereact/dialog'
import {MiniModal} from '@/components/MiniModal/index.tsx'
import {divSectionForm} from '@/util/styles/index.ts'
import {InputMask} from 'primereact/inputmask'
import {defaultValuesMotorista} from '../useMotorista.ts'
import {InputNumber} from "primereact/inputnumber"
import {
	styleBlocoFormBorderR,
	styleResponsiveForm
} from "@pages/por-grupo/administrativo/cruds/equipamento/ModalEquipamentos/style.ts"
import {
	styleForm,
	styleRadios
} from "@pages/por-grupo/administrativo/cruds/motorista/novo-motorista/ModalMotorista/styles.ts"
import {ModalProps} from "@pages/por-grupo/enfermagem/plantao/ModalPlantao"
import { styleHeaderModal, styleSizeDialog } from '../../../produto/modal-produto/styles.ts'

export function ModalMotorista({ visible, onClose }: ModalProps) {
	const {
		control,
		handleSubmit,
		reset,
		setError,
		formState: { errors, isDirty, isLoading }
	} = useForm<DriverFormSchemaType>({ resolver: zodResolver(driverFormSchema), defaultValues: defaultValuesMotorista })

	const [miniModalVisible, setMiniModalVisible] = useState<boolean>(false)

	const toast = useRef<Toast>(null)
	const showError = (title: string, message: string | undefined) => {
		toast.current?.show({ severity: `error`, summary: title, detail: message })
	}

	function handleErrorReturnApi(data: any) {
		if (data.error && typeof data.error.data === `object`) {
            type nameItem = `nome` | `cpf` | `dtnascimento` | `email` | `matricula` | `apelidousu` | `sexo`
            // @ts-ignore
            Object.keys(data.error.data).map((key: nameItem) => {
            	if (
            		key === `nome` ||
                        key === `cpf` ||
                        key == `dtnascimento` ||
                        key == `email` ||
                        key == `matricula` ||
                        key == `apelidousu` ||
                        key == `sexo`
            	) {
            		setError(key, {
            			type: `manual`,
            			message: data.error.data[key][0],
            		})
            	}
            })
		} else {
			showError(data.status, data.error.message)
		}
	}

	const { user , toastSuccess, toastError} = useAuth()


	const handleDriver = useCallback((data: DriverFormSchemaType) => {
		DriverAPI.save(user, data).then(() => {
			toastSuccess(`Motorista cadastrado com sucesso`)
			onClose(true)
			reset()
		}).catch((error: any) => {
			if (error.data) {
				handleErrorReturnApi(error.data)
			} else {
				toastError(`Não foi possível salvar motorista!!`, false)
			}
		})
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user, toastSuccess, toastError, onClose, reset])

	const confirmarFecharModal = useCallback(()  => {
		if (isDirty) {
			setMiniModalVisible(true)
		} else {
			onClose(false)
		}
	}, [isDirty, onClose])

	useEffect(() => {
		const handleKeyDown = (e: any) => {
			if (e.key === `Escape` && visible) {
				confirmarFecharModal()
			}
		}

		window.addEventListener(`keydown`, handleKeyDown)

		return () => {
			window.removeEventListener(`keydown`, handleKeyDown)
		}
	}, [visible, confirmarFecharModal])

	const headerModal = useCallback( () => {
		return (
			<div className={styleHeaderModal}>
				<h3 className='m-0'>Novo Motorista</h3>
				<div className="flex justify-content-center">
					<Button
						loading={isLoading}
						label="Cadastrar"
						className='w-8rem mr-3'
						severity={`success`}
						icon={`pi pi-save`}
						type='submit'
						onClick={() => {
							handleSubmit(handleDriver)()
						}}
					/>
				</div>
			</div>

		)
	}, [handleDriver, handleSubmit, isLoading])

	return (
		<>
			<MiniModal
				miniModalVisible={miniModalVisible}
				setMiniModalVisible={setMiniModalVisible}
				reset={reset}
				onClose={() => {onClose(false)}}
			/>

			<Dialog
				header={headerModal}
				visible={visible}
				style={styleSizeDialog}
				onHide={() => {
					confirmarFecharModal()
				}}
				closeIcon='pi pi-times'
				dismissableMask={true}
				closeOnEscape={true}
				blockScroll={true}
				focusOnShow={false}
				resizable={false}
				draggable={false}
			>
				<form
					className={styleForm}
					onSubmit={handleSubmit(handleDriver)}>
					<div className={styleResponsiveForm}>
						<div className={styleBlocoFormBorderR}>
							<h4 className="m-0">Dados pessoais</h4>
							<Controller
								name="nome"
								control={control}
								render={({ field }) => (
									<div className="text-left">
										<Input
											type="text"
											placeholder="Nome"
											autoFocus
											id={field.name}
											value={field.value}
											onChange={(e) => field.onChange(e.target.value)}
										/>
										{errors.nome && <Errors message={errors.nome.message} />}
									</div>
								)}
							/>

							<Controller
								name="cpf"
								control={control}
								render={({ field }) => (
									<div className="text-left">
										<span className="p-float-label">
											<InputMask
												className="w-full"
												mask="999.999.999-99"
												id={field.name}
												value={field.value}
												onChange={(e) => field.onChange(e.target.value)}
											/>
											<label className="text-blue-600">CPF</label>
										</span>
										{errors.cpf && <Errors message={errors.cpf.message} />}
									</div>
								)}
							/>

							<Controller
								name="matricula"
								control={control}
								render={({ field }) => (
									<div className="p-float-label text-left">
										<InputNumber
											className="w-full"
											id={field.name}
											value={field.value}
											useGrouping={false}
											min={0}
											onChange={(e) => field.onChange(e.value)}

										/>
										<label htmlFor="matricula">Matrícula</label>
										{errors.matricula && <Errors message={errors.matricula.message} />}
									</div>
								)}
							/>

						</div>

						<div className={styleBlocoFormBorderR}>
							<h4 className="m-0">Dados Adicionais</h4>
							<Controller
								name="contato"
								control={control}
								render={({ field }) => (
									<div>
										<span className="p-float-label">
											<InputMask
												className="w-full"
												mask='&#40;99&#41;99999-9999'
												id={field.name}
												value={field.value}
												onChange={(e) => field.onChange(e.target.value)}
											/>
											<label htmlFor='telefone' className="text-blue-600">Telefone</label>
										</span>
									</div>
								)}
							/>

							<Controller
								name="dtnascimento"
								control={control}
								render={({ field }) => (
									<div className="text-left">
										<span className="p-float-label">
											<InputMask
												className="w-full"
												id={field.name}
												value={field.value}
												onChange={(e) => field.onChange(e.target.value)}
												mask="99/99/9999"
												slotChar="dd/mm/aaaa"
											/>
											<label className="text-blue-600" htmlFor={field.name}>Dt. Nascimento</label>
										</span>
										{errors.dtnascimento && <Errors message={errors.dtnascimento.message} />}

									</div>
								)}
							/>

							<div className={styleRadios}>
								<Controller
									name="sexo"
									control={control}
									render={({ field }) => (
										<div className="flex-column">
											<div className="flex">
												<h3 className="m-0 mr-3 text-gray-200">Sexo:</h3>
												<div className="flex align-items-center">
													<RadioButton
														inputId="sexoM"
														{...field}
														inputRef={field.ref}
														value="M"
														checked={field.value === `M`}
													/>
													<label
														htmlFor="sexoM"
														className="ml-1 mr-6 text-gray-200">
                                                        Masculino
													</label>

													<RadioButton
														inputId="sexoF"
														{...field}
														inputRef={field.ref}
														value="F"
														checked={field.value === `F`} />
													<label
														htmlFor="sexoF"
														className="ml-1 text-gray-200">
                                                        Feminino
													</label>
												</div>
											</div>
											{errors.sexo && <Errors message={errors.sexo.message} />}
										</div>
									)}
								/>
							</div>

						</div>
						<div className={divSectionForm}>
							<h4 className="m-0">Dados de Login</h4>
							<Controller
								name="email"
								control={control}
								render={({ field }) => (
									<div className="text-left">
										<Input
											type="text"
											placeholder="Email"
											id={field.name}
											value={field.value}
											onChange={(e) => field.onChange(e.target.value)}
										/>
										{errors.email && <Errors message={errors.email.message} />}

									</div>
								)}
							/>

							<Controller
								name="apelidousu"
								control={control}
								render={({ field }) => (
									<div className='text-left'>
										<Input
											type="text"
											placeholder="Usuário"
											id={field.name}
											value={field.value}
											onChange={(e) => field.onChange(e.target.value)}
										/>
										{errors.apelidousu && <Errors message={errors.apelidousu.message} />}
									</div>
								)}
							/>

							<Controller
								name="senhausu"
								control={control}
								render={({ field }) => (
									<div className='text-left mt-3'>
										<Input
											type="password"
											placeholder="Senha"
											id={field.name}
											value={field.value}
											onChange={(e) => field.onChange(e.target.value)}
										/>
										{errors.senhausu && <Errors message={errors.senhausu.message} />}
									</div>
								)}
							/>

							<Controller
								name="confirmasenha"
								control={control}
								render={({ field }) => (
									<div className='text-left'>
										<Input
											type="password"
											placeholder="Confirme a senha"
											id={field.name}
											value={field.value}
											onChange={(e) => field.onChange(e.target.value)}
										/>
										{errors.confirmasenha && <Errors message={errors.confirmasenha.message} />}

									</div>
								)}
							/>


						</div>
					</div>


				</form>
			</Dialog>
		</>
	)
}
