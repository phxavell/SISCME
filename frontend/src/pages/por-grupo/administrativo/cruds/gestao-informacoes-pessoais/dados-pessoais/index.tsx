import { ContainerFlexColumnDiv, titleStyle } from '@/util/styles'
import { SubMenu } from '../sub-menu'
import { InputText } from 'primereact/inputtext'
import { Card } from 'primereact/card'
import { Divider } from 'primereact/divider'
import { Button } from 'primereact/button'
import { Dropdown } from 'primereact/dropdown'
import { useDadosPessoais } from './useDadosPessoais'
import { InputMask } from 'primereact/inputmask'
import { Errors } from '@/components/Errors'

interface SexoProps {
    sexo: string
}
export const DadosPessoais = ()=>  {
	const { Controller, control, register, handleSubmit, handleSubmitDadosPessoais, errors, usuario } = useDadosPessoais()
	const sexos: SexoProps[] = [{ sexo: `Masculino` }, { sexo: `Feminino` }]
	const Coren = () => {
		const termosProcurados = [`ENFERMAGEM`, `ENFERMAGEM`, `ENFERMAGEM`]
		const grupos = usuario?.grupos || []
		const validarGrupos = termosProcurados.some(termo => grupos.includes(termo))

		if (validarGrupos) {
			return (
				<>
					<div className="col-4 md:col-4">
						<label className="flex justify-content-start text-white">Contato*:</label>
						<Controller
							control={control}
							name='contato'
							render={({ field }) => {
								return (
									<div className="text-left">
										<span className="p-float-label">
											<InputMask
												className="w-full"
												mask="(99)99999-9999"
												id={field.name}
												value={field.value == null ? `` : field.value}
												onChange={(e) => field.onChange(e.target.value)}
											/>
										</span>
									</div>
								)
							}}
						/>

					</div>
					<div className="col-2 md:col-2">
						<label className="flex justify-content-start text-white">COREN*:</label>
						<InputText
							placeholder="COREN"
							{...register(`coren`)}
						/>
					</div>
				</>
			)
		} else {
			return (
				<div className="col-4 md:col-6">
					<label className="flex justify-content-start text-white">Contato*:</label>
					<Controller
						control={control}
						name='contato'
						render={({ field }) => {
							return (
								<div className="text-left">
									<span className="p-float-label">
										<InputMask
											className="w-full"
											mask="(99)99999-9999"
											id={field.name}
											value={field.value == null ? `` : field.value}
											onChange={(e) => field.onChange(e.target.value)}
										/>
									</span>
								</div>
							)
						}}
					/>

				</div>
			)
		}
	}
	return (
		<div className={ContainerFlexColumnDiv}>
			<h1 className={titleStyle}>Configurações de conta</h1>
			<Card className="container-dados-pessoais bg-gradiente-maximum-compatibility-reverse">
				<div className="flex flex-row gap-3 w-full ">
					<div className="h-full ">
						<SubMenu />
					</div>

					<div className="pl-5 border-left-1 border-white border-600">
						<div className="flex flex-column justify-content-start mb-2">
							<strong className="text-left text-white">Dados Pessoais</strong>
							<Divider />
						</div>
						<form onSubmit={handleSubmit(handleSubmitDadosPessoais)} className="grid p-fluid" >
							<div className="col-6 md:col-6">
								<label className="flex justify-content-start text-white">Nome*:</label>
								<InputText
									placeholder="Nome"
									{...register(`nome`)}
								/>
								{errors.nome && <Errors message={errors.nome.message} />}
							</div>

							<Coren />
							<div className="col-6 md:col-6">
								<label className="flex justify-content-start text-white">E-Mail*:</label>
								<InputText
									placeholder="E-mail"
									{...register(`email`)}
								/>
							</div>
							<div className="col-3 md:col-3 text-left">
								<label className="flex justify-content-start text-white">Sexo*:</label>
								<Controller
									name="sexo"
									control={control}
									render={({ field }) => {
										return (
											<Dropdown
												className="flex justify-content-start"
												id={field.name}
												value={field.value}
												optionLabel="sexo"
												placeholder="Sexo"
												options={sexos}
												onChange={(e) => field.onChange(e.value)}
											/>
										)
									}}
								/>
							</div>
							<div className="col-3 md:col-3">
								<label className="flex justify-content-start text-white">Data Nascimento*:</label>
								<Controller
									name="dtnascimento"
									control={control}
									render={({ field }) => {
										return (
											<div className="text-left">
												<InputMask
													className="w-full"
													id={field.name}
													value={field.value}
													onChange={(e) => field.onChange(e.target.value)}
													mask="99/99/9999"
													slotChar="dd/mm/aaaa"
												/>
												{/* {errors.dtnascimento && <Errors message={errors.dtnascimento.message} />} */}

											</div>
										)
									}}
								/>
							</div>
							<div className="col-6 md:col-6">
								<label className="flex justify-content-start text-white">Profissão:</label>
								<InputText
									className="bg-blue-100"
									readOnly
									placeholder="Profissão"
									{...register(`profissao`)}
								/>
							</div>

							<div className="col-6 md:col-6">
								<label className="flex justify-content-start text-white">CPF:</label>
								<InputText
									className="bg-blue-100"
									readOnly
									placeholder="CPF"
									{...register(`cpf`)}
								/>
							</div>
							<div className="col-6 md:col-6">
								<label className="flex justify-content-start text-white">Cliente:</label>
								<InputText
									className="bg-blue-100"
									readOnly
									{...register(`cliente`)}
								/>
							</div>
							<div className="col-3 md:col-3">
								<label className="flex justify-content-start text-white">Data de Admissão:</label>
								<InputText
									className="bg-blue-100"
									readOnly
									placeholder="Data de Admissão"
									{...register(`dtadmissao`)}
								/>
							</div>
							<div className="col-3 md:col-3">
								<label className="flex justify-content-start text-white">Data de Cadastro:</label>
								<InputText
									className="bg-blue-100"
									readOnly
									placeholder="Data de Cadastro"
									{...register(`dtcadastro`)}
								/>
							</div>
							<div className="col-3 md:col-3">
								<label className="flex justify-content-start text-white">Matrícula:</label>
								<InputText
									className="bg-blue-100"
									readOnly
									placeholder="Matrícula"
									{...register(`matricula`)}
								/>
							</div>
							<div className="col-3 md:col-3">
								<label className="flex justify-content-start text-white">Responsável técnico:</label>
								<InputText
									className="bg-blue-100"
									readOnly
									placeholder="Responsável técnico"
									{...register(`responsável_tecnico`)}
								/>
							</div>
							<div className="col-6 md:col-6"></div>
							<div className="mt-4">
								<Button type="submit" label="Salvar" severity="success" />
							</div>
						</form>

					</div>

				</div>
			</Card>
		</div>
	)
}
