import {zodResolver} from '@hookform/resolvers/zod'
import {Controller, useForm} from 'react-hook-form'
import {Button} from 'primereact/button'
import {Input} from '@/components/Input.tsx'
import {Errors} from '@/components/Errors.tsx'
import {RadioButton} from 'primereact/radiobutton'
import {DriverAPI} from '@/infra/integrations/motorista.ts'
import {useEffect, useState} from 'react'
import {useAuth} from '@/provider/Auth'
import {Dialog} from 'primereact/dialog'
import {MiniModal} from '@/components/MiniModal/index.tsx'
import {divContainerForm, divSectionForm} from '@/util/styles/index.ts'
import {InputMask} from 'primereact/inputmask'
import {defaultValuesMotorista} from '../useMotorista.ts'
import moment from 'moment'
import {driverFormSchemaEdit, DriverFormSchemaEditType} from './schemasEdit.ts'
import { ModalMotoristaProps } from './interfaces.ts'
import { styleForm, styleRadios } from './styles.ts'


export function ModalEditMotorista({visible, onClose, motorista, setVisibleModalDetail}: ModalMotoristaProps) {
	const {
		control,
		handleSubmit,
		reset,
		setError,
		formState: {errors, isDirty, isLoading}
	} = useForm<DriverFormSchemaEditType>({
		resolver: zodResolver(driverFormSchemaEdit),
		defaultValues: defaultValuesMotorista
	})
	const { user, toastError, toastSuccess } = useAuth()

	useEffect(() => {
		if (motorista) {
			const formatDN = moment(motorista.dtnascimento).format(`DD/MM/YYYY`)
			reset({
				...motorista,
				nome: motorista.nome ?? ``,
				cpf: motorista.cpf ?? ``,
				matricula: motorista.matricula ?? ``,
				contato: motorista.contato ?? ``,
				dtnascimento: formatDN ?? ``,
				sexo: motorista.sexo ?? ``,
				email: motorista.email ?? ``,
			})
		}
	}, [reset, motorista])

	const [miniModalVisible, setMiniModalVisible] = useState<boolean>(false)

	const handleErrorReturnApi = (data: any) => {
		if (data.errors && typeof data.errors === `object`) {
            type nameItem = `nome` | `cpf` | `dtnascimento` | `email` | `matricula` | `sexo`
            // @ts-ignore
            Object.keys(data.errors).map((key: nameItem) => {
            	if (key === `nome` || key === `cpf` || key == `dtnascimento` || key == `email` || key == `matricula` || key == `sexo`) {
            		setError(key, {
            			type: `manual`,
            			message: data.errors[key][0],
            		})
            	}
            })
		} else {
			toastError(data.status)
		}
	}

	function handleDriverEdit(data: DriverFormSchemaEditType) {
		DriverAPI.atualizar(user, data).then(() => {
			setVisibleModalDetail(false)
			onClose(true)
			toastSuccess(`Motorista atualizado com sucesso`)
			reset()
		}).catch((error: any) => {
			if (error.data) {
				handleErrorReturnApi(error.data)
			} else {
				toastError(`Não foi possível atualizar motorista!!`)
			}
		})
	}

	const confirmarFecharModal = () => {
		if (isDirty) {
			setMiniModalVisible(true)
		} else {
			onClose(false)
		}
	}

	return (
		<>
			<MiniModal
				miniModalVisible={miniModalVisible}
				setMiniModalVisible={setMiniModalVisible}
				reset={reset}
				onClose={() => {
					onClose(false)
				}}
			/>

			<Dialog
				header='Atualizar Motorista'
				visible={visible}
				style={{width: `90vw`}}
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
					onSubmit={handleSubmit(handleDriverEdit)}>
					<div className={`${divContainerForm} w-full`}>
						<div className={`${divSectionForm} pr-5 border-right-1 border-600`}>
							<h4 className="m-0">Dados pessoais</h4>
							<Controller
								name="nome"
								control={control}
								render={({field}) => (
									<div className="text-left">
										<Input
											type="text"
											placeholder="Nome"
											autoFocus
											id={field.name}
											value={field.value}
											onChange={(e) => field.onChange(e.target.value)}
										/>
										{errors.nome && <Errors message={errors.nome.message}/>}
									</div>
								)}
							/>

							<Controller
								name="cpf"
								control={control}
								render={({field}) => (
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
										{errors.cpf && <Errors message={errors.cpf.message}/>}
									</div>
								)}
							/>

							<Controller
								name="matricula"
								control={control}
								render={({field}) => (
									<div className="text-left">
										<Input
											placeholder="Matrícula"
											type="number"
											id={field.name}
											value={field.value}
											onChange={(e) => field.onChange(e.target.value)}
										/>
										{errors.matricula && <Errors message={errors.matricula.message}/>}
									</div>
								)}
							/>

						</div>

						<div className={`${divSectionForm} pr-5 border-right-1 border-600`}>
							<h4 className="m-0">Dados Adicionais</h4>
							<Controller
								name="contato"
								control={control}
								render={({field}) => (
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
								render={({field}) => (
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
										{errors.dtnascimento && <Errors message={errors.dtnascimento.message}/>}

									</div>
								)}
							/>

							<div className={styleRadios}>
								<Controller
									name="sexo"
									control={control}
									render={({field}) => (
										<div className="flex-column">
											<div className="flex">
												<h3 className="m-0 mr-3 text-gray-200">Sexo:</h3>
												<div className="flex align-items-center">
													<RadioButton
														inputId="sexoM"
														{...field}
														inputRef={field.ref}
														value="M"
														checked={field.value === `M`}/>
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
														checked={field.value === `F`}/>
													<label
														htmlFor="sexoF"
														className="ml-1 text-gray-200">
                                                        Feminino
													</label>
												</div>
											</div>
											{errors.sexo && <Errors message={errors.sexo.message}/>}
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
								render={({field}) => (
									<div className="text-left">
										<Input
											type="text"
											placeholder="Email"
											id={field.name}
											value={field.value}
											onChange={(e) => field.onChange(e.target.value)}
										/>
										{errors.email && <Errors message={errors.email.message}/>}

									</div>
								)}
							/>

						</div>
					</div>
					<Button
						loading={isLoading}
						label="Atualizar"
						className='w-2 mt-5'
						type='submit'
					/>

				</form>
			</Dialog>
		</>
	)
}
