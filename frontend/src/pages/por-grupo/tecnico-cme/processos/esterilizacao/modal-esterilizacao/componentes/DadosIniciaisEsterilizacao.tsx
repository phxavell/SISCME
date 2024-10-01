import { Card } from "primereact/card"
import {
	IPropsIniciarCiclo,
	TitlesCards
} from "../types.ts"
import { styleCard, styleSectionBorder } from "@pages/por-grupo/administrativo/cruds/caixa/styles-caixa.ts"
import { InputText } from "primereact/inputtext"
import { DropdownSearch } from "@/components/DropdownSeach/DropdownSearch.tsx"
import {Controller, useFormContext} from "react-hook-form"
import { EquipamentoDropdown } from "../../../components/EquipamentoDropdown"


export const DadosIniciaisEsterilizacao = (props:IPropsIniciarCiclo) => {
	const {formOptions, equipamentouuid} = props

	const { register,control, setValue, formState: { errors } } = useFormContext()
	let equipamentoComponentEsterilizacao
	if(Array.isArray(equipamentouuid) && equipamentouuid.length > 0){
		setValue(`equipamento`, equipamentouuid[0].id)
		equipamentoComponentEsterilizacao = (
			<Controller
				name="equipamento"
				control={control}
				render={({ field }) => (
					<EquipamentoDropdown field={field} equipamentosuuid={equipamentouuid} />
				)}
			/>
		)
	} else {
		equipamentoComponentEsterilizacao=(
			<DropdownSearch
				keyItem="equipamento"
				label="Equipamento"
				listOptions={formOptions?.data.equipamentos}
				optionsObject={{
					optionValue: `id`,
					optionLabel: `valor`
				}}
				errors={errors}
				control={control}
				filter={true}
				loadingOptions={false}
				showAdd={false}
				classNameDropdown="mt-2"
				classNameLabel="text-lg"

			/>
		)
	}

	return (
		<Card
			title={<h4 className="m-0 text-3xl">{TitlesCards.IniciarCiclo}</h4>}
			className={styleCard}>
			<div className={`${styleSectionBorder} flex-grow-1`}>
				{equipamentoComponentEsterilizacao}
				<div className="text-left flex-wrap">
					<Controller
						control={control}
						name="ciclo"
						render={({ field }) => (
							<div className="p-float-label">
								<InputText
									autoFocus
									id={field.name}
									value={field.value}
									className={`w-full mt-2`}
									{...register(`ciclo`)}
									onChange={ (e:any) => {
										if(e.target.value.match(/^[0-9]*$/)){
											field.onChange(e.target.value)
										}
									}}
								/>
								<label htmlFor="in" className="text-lg">Ciclo</label>

							</div>
						)}
					/>
				</div>
				<DropdownSearch
					keyItem="programacao"
					label="Programação"
					listOptions={formOptions?.data?.programacoes?? []}
					optionsObject={{
						optionValue: `id`,
						optionLabel: `valor`
					}}
					errors={errors}
					control={control}
					filter={true}
					loadingOptions={false}
					showAdd={false}
					classNameDropdown="mt-2"
					classNameLabel="text-lg"
				/>
			</div>
		</Card>
	)
}
