import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {plantaoFormSchema, PlantaoFormSchemaType} from '../schemas'
import {Button} from "primereact/button"
import {Input} from "@/components/Input.tsx"
import {Errors} from "@/components/Errors.tsx"
import {useState} from "react"

import {useAuth} from "@/provider/Auth"
import {Dialog} from "primereact/dialog"
import {MiniModal} from "@/components/MiniModal/index.tsx"
import {divContainerForm, divSectionForm} from "@/util/styles/index.ts"
import {PlantaoAPI} from "@/infra/integrations/plantao"
import {InputTextarea} from "primereact/inputtextarea"
import {descricaoFormatadaHelp} from "../../../helpers"

export interface ModalPropsPlantao {
    visible: boolean
    onClose: (prop: boolean) => void
}

const styleForm = `w-full flex flex-column align-items-center mt-4`

export function ModalPlantao({visible, onClose}: ModalPropsPlantao) {
	const {
		register,
		handleSubmit,
		reset,
		formState: {errors, isDirty, isLoading}
	} = useForm<PlantaoFormSchemaType>({resolver: zodResolver(plantaoFormSchema)})

	const [miniModalVisible, setMiniModalVisible] = useState<boolean>(false)
	const [descricaoFormatada, setDescricaoFormatada] = useState(``)
	const [visibleModalPostDescricao, setVisibleModalPostDescricao] = useState(false)

	const {user, toastSuccess, toastError} = useAuth()

	const handlePlantao = (data: PlantaoFormSchemaType) => {
		setDescricaoFormatada(descricaoFormatadaHelp({
			coordenacao: data.coordenacao,
			enfermeiro_expurgo: data.enfermeiro_expurgo,
			enfermeiro_preparo: data.enfermeiro_preparo,
			enfermeiro_distribuicao: data.enfermeiro_distribuicao,
			tecnico_expurgo: data.tecnico_expurgo,
			tecnico_instrumental: data.tecnico_instrumental,
			tecnico_ventilatorio: data.tecnico_ventilatorio,
			tecnico_autoclave: data.tecnico_autoclave,
			tecnico_producao: data.tecnico_producao,
			tecnico_distribuicao: data.tecnico_distribuicao,
			folgas: data.folgas,
			faltas: data.faltas,
			ferias: data.ferias,
			licenca_medica: data.licenca_medica,
			licenca_maternidade: data.licenca_maternidade,
			atestado: data.atestado
		}))

		setVisibleModalPostDescricao(true)
	}

	function handlePlantaoFinal() {
		PlantaoAPI.save(user, descricaoFormatada).then(() => {
			reset()
			setVisibleModalPostDescricao(false)
			onClose(true)
			toastSuccess(`Plantão aberto com sucesso.`)
		}).catch(() => {
			toastError(`Erro ao abrir plantão!`)
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
				header='Novo Plantão'
				visible={visible}
				style={{width: `90vw`}}
				onHide={() => {
					confirmarFecharModal()
				}}
				closeIcon='pi pi-times'
			>
				<form
					className={styleForm}
					onSubmit={handleSubmit(handlePlantao)}
				>
					<div className={`${divContainerForm} w-full align-items-center`}>
						<div className={`${divSectionForm}`}>

							<div className="text-left">
								<Input
									type="text"
									placeholder="Coordenação"
									{...register(`coordenacao`)}
									autoFocus
								/>
								{errors.coordenacao && <Errors message={errors.coordenacao.message}/>}
							</div>

							<h4 className="m-0">ENFERMEIRO POR SETOR:</h4>

							<div className="text-left">
								<span className="p-float-label">
									<Input
										type="text"
										placeholder="Expurgo"
										{...register(`enfermeiro_expurgo`)}
									/>
									{errors.enfermeiro_expurgo && <Errors message={errors.enfermeiro_expurgo.message}/>}
								</span>
							</div>
							<div className="text-left">
								<span className="p-float-label">
									<Input
										type="text"
										placeholder="Preparo"
										{...register(`enfermeiro_preparo`)}
									/>
									{errors.enfermeiro_preparo && <Errors message={errors.enfermeiro_preparo.message}/>}
								</span>
							</div>

							<div className="text-left">
								<span className="p-float-label">
									<Input
										type="text"
										placeholder="Distribuição"
										{...register(`enfermeiro_distribuicao`)}
									/>
									{errors.enfermeiro_distribuicao &&
                                        <Errors message={errors.enfermeiro_distribuicao.message}/>}
								</span>
							</div>

						</div>
						<div className={`${divSectionForm} px-5 border-x-1 border-600`}>
							<h4 className="m-0">TÉCNICOS DE ENFERMAGEM POR SETOR:</h4>
							<div className="text-left">
								<span className="p-float-label">
									<Input
										type="text"
										placeholder="Expurgo"
										{...register(`tecnico_expurgo`)}
									/>
									{errors.tecnico_expurgo && <Errors message={errors.tecnico_expurgo.message}/>}
								</span>
							</div>
							<div className="text-left">
								<span className="p-float-label">
									<Input
										type="text"
										placeholder="Instrumental"
										{...register(`tecnico_instrumental`)}
									/>
									{errors.tecnico_instrumental &&
                                        <Errors message={errors.tecnico_instrumental.message}/>}
								</span>
							</div>
							<div className="text-left">
								<span className="p-float-label">
									<Input
										type="text"
										placeholder="Ventilatório"
										{...register(`tecnico_ventilatorio`)}
									/>
									{errors.tecnico_ventilatorio &&
                                        <Errors message={errors.tecnico_ventilatorio.message}/>}
								</span>
							</div>
							<div className="text-left">
								<span className="p-float-label">
									<Input
										type="text"
										placeholder="Autoclave"
										{...register(`tecnico_autoclave`)}
									/>
									{errors.tecnico_autoclave && <Errors message={errors.tecnico_autoclave.message}/>}
								</span>
							</div>

							<div className="text-left">
								<span className="p-float-label">
									<Input
										type="text"
										placeholder="Produção"
										{...register(`tecnico_producao`)}
									/>
									{errors.tecnico_producao && <Errors message={errors.tecnico_producao.message}/>}
								</span>
							</div>

							<div className="text-left">
								<span className="p-float-label">
									<Input
										type="text"
										placeholder="Distribuição"
										{...register(`tecnico_distribuicao`)}
									/>
									{errors.tecnico_distribuicao &&
                                        <Errors message={errors.tecnico_distribuicao.message}/>}
								</span>
							</div>

						</div>
						<div className={divSectionForm}>
							<div className="text-left">
								<span className="p-float-label">
									<Input
										type="text"
										placeholder="Folgas"
										{...register(`folgas`)}
									/>
									{errors.folgas && <Errors message={errors.folgas.message}/>}
								</span>
							</div>

							<div className="text-left">
								<span className="p-float-label">
									<Input
										type="text"
										placeholder="Faltas"
										{...register(`faltas`)}
									/>
									{errors.faltas && <Errors message={errors.faltas.message}/>}
								</span>
							</div>

							<div className="text-left">
								<span className="p-float-label">
									<Input
										type="text"
										placeholder="Férias"
										{...register(`ferias`)}
									/>
									{errors.ferias && <Errors message={errors.ferias.message}/>}
								</span>
							</div>

							<div className="text-left">
								<span className="p-float-label">
									<Input
										type="text"
										placeholder="Licença Médica"
										{...register(`licenca_medica`)}
									/>
									{errors.licenca_medica && <Errors message={errors.licenca_medica.message}/>}
								</span>
							</div>

							<div className="text-left">
								<span className="p-float-label">
									<Input
										type="text"
										placeholder="Licença Maternidade"
										{...register(`licenca_maternidade`)}
									/>
									{errors.licenca_maternidade &&
                                        <Errors message={errors.licenca_maternidade.message}/>}
								</span>
							</div>

							<div className="text-left">
								<span className="p-float-label">
									<Input
										type="text"
										placeholder="Atestado"
										{...register(`atestado`)}
									/>
									{errors.atestado && <Errors message={errors.atestado.message}/>}
								</span>
							</div>

						</div>
					</div>
					<Button
						loading={isLoading}
						label="Carregar Template"
						className='w-2 mt-5'
						type='submit'
					/>

				</form>

				<Dialog
					header='Descrição'
					onHide={() => setVisibleModalPostDescricao(false)}
					visible={visibleModalPostDescricao}
					style={{width: `80vw`}}
				>
					<form className="flex flex-column gap-2" onSubmit={handleSubmit(handlePlantaoFinal)}>
						<span className="p-float-label">
							<InputTextarea
								className="w-full h-20rem"
								value={descricaoFormatada}
								onChange={(e) => setDescricaoFormatada(e.target.value)}
							/>
							<label>Descrição</label>
						</span>
						<div className="w-full flex justify-content-center">
							<Button
								className="w-3"
								label="Abrir Plantão"
							/>

						</div>
					</form>
				</Dialog>
			</Dialog>
		</>
	)
}
