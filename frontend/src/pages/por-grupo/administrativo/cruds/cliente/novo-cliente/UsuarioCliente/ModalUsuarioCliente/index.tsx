import {zodResolver} from "@hookform/resolvers/zod"
import {Controller, useForm} from "react-hook-form"
import {usuarioClienteFormSchema, UsuarioClienteFormSchemaType} from "../schemas.ts"
import {Button} from "primereact/button"
import {Input} from "@/components/Input.tsx"
import {Errors} from "@/components/Errors.tsx"
import {RadioButton} from "primereact/radiobutton"
import React, {useState} from "react"
import {useAuth} from "@/provider/Auth"
import {Dialog} from "primereact/dialog"
import {MiniModal} from "@/components/MiniModal/index.tsx"
import {UsuarioClienteAPI} from "@/infra/integrations/usuario-cliente/usuario-cliente.ts"
import {useLocation} from "react-router-dom"
import {InputMask} from "primereact/inputmask"
import {divContainerForm, divSectionForm} from "@/util/styles/index.ts"
import {Calendar} from 'primereact/calendar'
import {InputNumber} from "primereact/inputnumber"
import { styleForm, styleRadios } from "./styles.ts"
import { ModalUsuarioClienteProps } from "./interfaces.ts"


export const ModalUsuarioCliente = ({visible, onClose}: ModalUsuarioClienteProps) =>{

	const [salvando, setSalvando] = useState(false)
	const [miniModalVisible, setMiniModalVisible] = useState<boolean>(false)
	const { toastError, toastSuccess} = useAuth()

	const {state} = useLocation()

	const {
		control,
		register,
		handleSubmit,
		reset,
		setError,
		formState: {errors, isDirty}
	} = useForm<UsuarioClienteFormSchemaType>({resolver: zodResolver(usuarioClienteFormSchema)})

	const {user} = useAuth()

	const handleErrorReturnApi = (data: any) => {

		if (data.error && typeof data.error.data === `object`) {
            type nameItem = `nome` | `cpf` | `dtnascimento` | `email` | `matricula` | `apelidousu` | `sexo`
            // @ts-ignore
            Object.keys(data.error.data).map((key: nameItem) => {
            	if (key === `nome` || key === `cpf` || key == `dtnascimento` || key == `email` || key == `matricula` || key == `apelidousu` || key == `sexo`) {
            		setError(key, {
            			type: `manual`,
            			message: data.error.data[key][0],
            		})
            	}
            })
		} else {
			toastError(data?.error?.message)
		}
	}

	function handleUsuarioCliente(data: UsuarioClienteFormSchemaType) {
		if (salvando) {
			return
		}
		setSalvando(true)
		data.cliente = state.id
		UsuarioClienteAPI.save(user, data).then(() => {
			setSalvando(false)
			toastSuccess(`Usuário cadastrado com sucesso!`)
			reset()
			onClose(true)
		}).catch((error: any) => {
			setSalvando(false)
			if (error.data) {
				handleErrorReturnApi(error.data)
			} else {
				toastError(`Não foi possível salvar usuário!!`)
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
				onClose={() => onClose(false)}
			/>

			<Dialog
				header='Novo Usuário'
				draggable={false}
				resizable={false}
				dismissableMask={true}
				closeOnEscape={true}
				visible={visible}
				data-testid="modal-usuario-cliente"
				style={{width: `90vw`}}
				onHide={() => {
					confirmarFecharModal()
				}}
			>

				<form
					className={styleForm}
					onSubmit={handleSubmit(handleUsuarioCliente)}>
					<div className={`${divContainerForm} w-full`}>
						<div className={`${divSectionForm} pr-5 border-right-1 border-600`}>
							<h4 className="m-0">Dados pessoais</h4>

							<div className="text-left">
								<Input
									type="text"
									placeholder="Nome"
									{...register(`nome`)}
								/>
								{errors.nome && <Errors message={errors.nome.message}/>}
							</div>

							<div className="text-left">
								<Controller
									control={control}
									name='cpf'
									render={({field}) => {
										return (
											<span className="p-float-label">
												<InputMask
													className="w-full"
													mask="999.999.999-99"
													id={field.name}
													value={field.value}
													onChange={(e) => field.onChange(e.target.value)}
												/>
												<label htmlFor={field.name} className="text-blue-600">CPF</label>
											</span>
										)
									}}
								/>
								{errors.cpf && <Errors message={errors.cpf.message}/>}
							</div>


							<Controller
								name="matricula"
								control={control}
								render={({field}) => (
									<div className="text-left p-float-label">
										<InputNumber
											useGrouping={false}
											min={0}
											id={field.name}
											value={field.value}
											onChange={(e) => field.onChange(e.value)}
										/>
										<label htmlFor="matricula">Matrícula</label>
										{errors.matricula && <Errors message={errors.matricula.message}/>}
									</div>
								)}
							/>

						</div>
						<div className={`${divSectionForm} pr-5 border-right-1 border-600`}>
							<h4 className="m-0">Dados Adicionais</h4>
							<div>
								<span className="p-float-label">
									<InputMask
										id="telefone"
										className="w-full"
										mask='&#40;99&#41;99999-9999'
										{...register(`contato`)}
									/>
									<label htmlFor='telefone' className="text-blue-600">Telefone</label>
								</span>
							</div>

							<Controller
								name="dtnascimento"
								control={control}
								render={({field}) => (
									<div className="text-left">
										<span className="p-float-label">
											<Calendar
												showOnFocus={false}
												showIcon
												className="w-full"
												id={field.name}
												value={field.value}
												onChange={(e) => field.onChange(e.target.value)}
												maxDate={new Date()}
												dateFormat="dd/mm/yy"
												mask="99/99/9999"
											/>
											<label
												htmlFor=""
												className="text-blue-600">Dt. Nascimento
											</label>
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
							<div className="text-left">
								<Input
									type="text"
									placeholder="Email"
									{...register(`email`)} />
								{errors.email && <Errors message={errors.email.message}/>}

							</div>

							<div className="text-left">
								<Input
									type="text"
									placeholder="Usuário"
									{...register(`apelidousu`)} />
								{errors.apelidousu && <Errors message={errors.apelidousu.message}/>}
							</div>

							<div className="text-left mt-3">
								<Input
									type="password"
									placeholder="Senha"
									{...register(`senhausu`)}
								/>
								{errors.senhausu && <Errors message={errors.senhausu.message}/>}
							</div>
							<div className="text-left">
								<Input
									type="password"
									placeholder="Confirme a senha"
									{...register(`confirmasenha`)}

								/>
								{errors.confirmasenha && <Errors message={errors.confirmasenha.message}/>}

							</div>
						</div>
					</div>
					<Button
						loading={salvando}
						data-testid="botao-cadastrar-usuario-cliente"
						label="Cadastrar"
						className='w-2 mt-5'
						type='submit'
					/>

				</form>
			</Dialog>
		</>
	)
}
