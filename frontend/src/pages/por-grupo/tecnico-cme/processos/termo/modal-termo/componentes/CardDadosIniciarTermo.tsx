import {Card} from "primereact/card"
import {IPropsIniciarCiclo, TitlesCards} from "../types.ts"
import {styleCard, styleSectionBorder} from "@pages/por-grupo/administrativo/cruds/caixa/styles-caixa.ts"
import {InputText} from "primereact/inputtext"
import {DropdownSearch} from "@/components/DropdownSeach/DropdownSearch.tsx"
import {Controller, useFormContext} from "react-hook-form"
import {EquipamentoDropdown} from "../../../components/EquipamentoDropdown"
import React from "react"

export const CardDadosInicarTermoTemplate: React.FC<IPropsIniciarCiclo> = (props) => {
	const {
		equipamentosuuid,
		formOptions
	} = props

	const {
		register,
		control,
		setValue,
		formState: {errors}
	} = useFormContext()
	let equipamentoComponent
	if (Array.isArray(equipamentosuuid) && equipamentosuuid.length > 0) {
		setValue(`equipamento`, equipamentosuuid[0].id)
		equipamentoComponent = (
			<Controller
				name="equipamento"
				control={control}
				render={({field}) => (
					<EquipamentoDropdown
						field={field}
						equipamentosuuid={equipamentosuuid}
					/>
				)}
			/>
		)
	} else {
		equipamentoComponent = (
			<DropdownSearch
				keyItem="equipamento"
				label="Equipamento"
				listOptions={formOptions?.data?.equipamentos}
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
			<div className={`${styleSectionBorder} flex-grow-1 gap-5`}>
				{equipamentoComponent}
				<div className="text-left flex-wrap">
					<Controller
						control={control}
						name="ciclo"
						render={({field}) => (
							<div className="p-float-label">
								<InputText
									autoFocus
									id={field.name}
									value={field.value.match(/^[0-9]*$/) ? field.value : ``}
									className={`w-full mt-2`}
									{...register(`ciclo`)}
									onChange={(e: any) => {
										field.onChange(e.target.value)
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
					listOptions={formOptions?.data?.programacoes}
					optionsObject={{
						optionValue: `id`,
						optionLabel: `valor`
					}}
					errors={{}}
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
