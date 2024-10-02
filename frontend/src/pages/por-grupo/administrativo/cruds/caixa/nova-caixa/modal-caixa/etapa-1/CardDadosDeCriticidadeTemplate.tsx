import * as React from 'react'
import {useCallback} from 'react'
import {Card} from 'primereact/card'
import {styleCard, styleSectionBorder} from '@pages/por-grupo/administrativo/cruds/caixa/styles-caixa.ts'
import {DropdownSearch} from '@/components/DropdownSeach/DropdownSearch.tsx'
import {IPropsDadosDeCriticidade, TitlesCards} from '../types-modal.ts'
import {InputNumber} from 'primereact/inputnumber'
import {Controller, useFormContext} from 'react-hook-form'
import {Errors} from '@/components/Errors.tsx'

export const CardDadosDeCriticidadeTemplate: React.FC<IPropsDadosDeCriticidade> = (props) => {
	const {
		criticidades,
		prioridades,
		temperaturas,
		loadingOption,
	} = props

	const { register,control, formState: { errors } } = useFormContext()

	const showErrorCaixa = useCallback((keyItem: string) => {
		const message = errors[keyItem]?.message
		if (message) {
			// @ts-ignore
			return <Errors message={message}/>
		}
	}, [errors])

	return (
		<Card
			title={TitlesCards.DadosDeCriticidade}
			className={styleCard}>
			<div className={`${styleSectionBorder} flex-grow-1`}>
				<DropdownSearch
					control={control}
					errors={errors}
					keyItem="criticidade"
					label="Criticidade"
					listOptions={criticidades}
					showAdd={false}
					optionsObject={{
						optionValue: `id`,
						optionLabel: `valor`
					}}
					filter={true}
					loadingOptions={loadingOption}
					handleClickAdd={undefined}
				/>
				<DropdownSearch
					control={control}
					errors={errors}
					keyItem="prioridade"
					label="Prioridade"
					listOptions={prioridades}
					showAdd={false}
					optionsObject={{
						optionValue: `id`,
						optionLabel: `valor`
					}}
					filter={true}
					loadingOptions={loadingOption}
					handleClickAdd={undefined}
				/>
				<DropdownSearch
					control={control}
					errors={errors}
					keyItem="temperatura"
					label="Temperatura Padrão (em ºC)"
					listOptions={temperaturas}
					showAdd={false}
					optionsObject={{
						optionValue: `id`,
						optionLabel: `valor`
					}}
					filter={true}
					loadingOptions={loadingOption}
					handleClickAdd={undefined}
				/>

				<Controller
					control={control}
					name='validade'
					render={({field}) => {
						return (
							<div className=" p-float-label w-full">
								<InputNumber
									id={field.name}
									value={field.value}
									{...register(`validade`)}
									className={`w-full`}
									onChange={(e) => field.onChange(e.value)}
									showButtons
									buttonLayout="stacked"
									decrementButtonClassName="p-button-secondary"
									incrementButtonClassName="p-button-success"
									incrementButtonIcon="pi pi-plus"
									decrementButtonIcon="pi pi-minus"
									min={1}
									max={12}
									maxLength={100}
									size={3}
								/>
								<label
									className='
                                        labelInput
                                        withCard
                                        text-sm
                                        '
									htmlFor="validade">
                                    Validade (em meses)
								</label>
								{showErrorCaixa(`validade`)}
							</div>

						)
					}}
				/>

			</div>
		</Card>
	)
}
