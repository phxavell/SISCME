import * as React from 'react'
import {useCallback, useMemo} from 'react'
import {InputText} from 'primereact/inputtext'
import {Card} from 'primereact/card'
import {Errors} from '@/components/Errors.tsx'
import {DropdownSearch} from '@/components/DropdownSeach/DropdownSearch.tsx'
import {InputFile} from '@/components/input-file/InputFile.tsx'
import {styleCard, styleSectionBorder} from '../../../styles-caixa.ts'
import {Controller, useFormContext} from 'react-hook-form'
import {IPropsCardOrigemIdenticacao, TitlesCards} from '../types-modal.ts'

export const CardDadosOrigemIdentificacaoTemplate: React.FC<IPropsCardOrigemIdenticacao> = (props) => {
	const {
		clientesForTheForm,
		loadingOption,
		handleAddTiposDeCaixa,
		tipos_caixa,
		embalagens,
		uploadErro,
	} = props

	const {register, watch, control, formState: {errors}} = useFormContext()

	const showErrorCaixa = useCallback((keyItem: string) => {
		const message = errors[keyItem]?.message
		if (message) {
			// @ts-ignore
			return <Errors message={message}/>
		}
	}, [errors])
	const showErrorUpload = useMemo(() => {
		return uploadErro && <Errors message={uploadErro}/>
	}, [uploadErro])
	return (
		<Card
			title={TitlesCards.OrigemEIdentificacao}
			className={styleCard}>
			<div className={`${styleSectionBorder} flex-grow-1`}>
				<DropdownSearch
					autoFocus={true}
					showAdd={false}
					control={control}
					errors={errors}
					keyItem="cliente"
					label="Cliente"
					listOptions={clientesForTheForm}
					optionsObject={{
						optionValue: `id`,
						optionLabel: `valor`
					}}
					filter={true}
					loadingOptions={loadingOption}
				/>
				<DropdownSearch
					keyItem="tipo_caixa"
					label="Tipo"
					showAdd={true}
					control={control}
					errors={errors}

					listOptions={tipos_caixa}
					optionsObject={{
						optionValue: `id`,
						optionLabel: `valor`
					}}
					filter={true}
					loadingOptions={loadingOption}
					handleClickAdd={handleAddTiposDeCaixa}
				/>

				<div className="text-left flex-wrap w-full">

					<Controller
						control={control}
						name="caixa"
						render={({field}) => (
							<div className=" p-float-label w-full">
								<InputText
									id={field.name}
									value={field.value}
									className={`w-full`}
									{...register(`caixa`)}
									onChange={e => {
										if(e.target.value?.length < 32){
											field.onChange(e.target.value)
										}
									}}
								/>
								<label className='labelInput withCard text-sm'
									htmlFor="caixa">
                                    Nome do Produto
								</label>
								{showErrorCaixa(`caixa`)}
							</div>
						)}
					/>
				</div>
				<DropdownSearch
					keyItem="embalagem"
					label="Embalagem"
					showAdd={true}
					control={control}
					errors={errors}

					listOptions={embalagens}
					optionsObject={{
						optionValue: `id`,
						optionLabel: `valor`
					}}
					filter={true}
					loadingOptions={loadingOption}
					handleClickAdd={handleAddTiposDeCaixa}
				/>

				<div className="text-left flex-wrap w-full">

					<div className=" p-float-label w-full">

						<div>
							<InputFile
								id={`foto`}
								type="image/*"
								name='foto'
								register={register}
								watch={watch}
								control={control}
							/>
							{showErrorUpload}
						</div>

					</div>
				</div>
			</div>
		</Card>
	)
}
