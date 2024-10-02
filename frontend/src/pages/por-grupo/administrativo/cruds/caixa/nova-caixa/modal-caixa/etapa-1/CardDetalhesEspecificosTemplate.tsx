import * as React from 'react'
import {useCallback} from 'react'
import {InputTextarea} from 'primereact/inputtextarea'
import {Controller, useFormContext} from 'react-hook-form'
import {DropdownSearch} from '@/components/DropdownSeach/DropdownSearch.tsx'
import {Errors} from '@/components/Errors.tsx'
import {Card} from 'primereact/card'
import {styleCard, styleSectionBorderNoRight} from '../../../styles-caixa.ts'
import {
	IPropsDetalhesEspecificos,
	TitlesCards
} from '@pages/por-grupo/administrativo/cruds/caixa/nova-caixa/modal-caixa/types-modal.ts'

export const CardDetalhesEspecificosTemplate: React.FC<IPropsDetalhesEspecificos> = (props) => {
	const {
		situacoes,
		categorias_uso,
		loadingOption,
	} = props

	const { register,control, formState: { errors } } = useFormContext()

	const showErrorInput = useCallback((keyItem: string) => {
		const message = errors[keyItem]?.message
		if (message) {
			// @ts-ignore
			return <Errors message={message}/>
		}
	}, [errors])
	return (
		<Card
			title={TitlesCards.DetalhesEspecificos}
			className={styleCard + `w-full`}>
			<div className={`${styleSectionBorderNoRight} flex-grow-1`}>

				<DropdownSearch
					control={control}
					errors={errors}
					keyItem="situacao"
					label="Situação"
					listOptions={situacoes}
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
					keyItem="categoria"
					label="Categoria de uso"
					listOptions={categorias_uso}
					showAdd={false}
					optionsObject={{
						optionValue: `id`,
						optionLabel: `valor`
					}}
					filter={true}
					loadingOptions={loadingOption}
					handleClickAdd={undefined}
				/>

				<div className={`
				flex

				flex-column
				md:flex-row
				gap-1
				justify-content-between

				`}>

					<Controller
						control={control}
						name="descricao"
						render={({field}) => (
							<span className="p-float-label md:w-6 w-12">
								<InputTextarea
									rows={10}
									cols={30}
									maxLength={254}
									className='w-12'
									id={field.name}
									value={field.value}
									{...register(`descricao`)}
								/>
								<label htmlFor="descricao">Descrição</label>
								{showErrorInput(`descricao`)}
							</span>
						)}
					/>
					<Controller
						control={control}
						name="instrucoes_uso"
						render={({field}) => (
							<span className="p-float-label  md:w-6 w-12">
								<InputTextarea
									rows={10}
									cols={30}
									maxLength={254}
									className='w-12'
									placeholder="Instruções Especiais"
									id={field.name}
									value={field.value}
									{...register(`instrucoes_uso`)}/>
								<label htmlFor="instrucoes_uso">Instruções Especiais</label>
								{showErrorInput(`instrucoes_uso`)}
							</span>
						)}/>

				</div>

			</div>
		</Card>)
}
