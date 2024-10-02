import * as React from 'react'
import { useMemo, useRef } from 'react'
import { InputNumber } from 'primereact/inputnumber'
import { DropdownSearch } from '@/components/DropdownSeach/DropdownSearch.tsx'
import { ShowItemsTemplate } from './ShowItemsTemplate.tsx'
import { Dropdown } from 'primereact/dropdown'
import { useMountEffect } from 'primereact/hooks'
import { Messages } from 'primereact/messages'
import {
	useItensDinamicos
} from '@pages/por-grupo/administrativo/cruds/caixa/nova-caixa/modal-caixa/useItensDinamicos.ts'
import {
	IIDProps,
	styleTdTitleInputDiv
} from '@pages/por-grupo/administrativo/cruds/caixa/nova-caixa/modal-caixa/types-modal.ts'
import { classNameQuantidade, styleIdItem, styleQuantidade, styleTdItemsTemplate } from '@pages/por-grupo/administrativo/cruds/caixa/nova-caixa/modal-caixa/style.ts'
import { useCaixaStore } from '@/store/store.ts'
import { ProgressSpinner } from 'primereact/progressspinner'
import './style.css'
import { Controller } from 'react-hook-form'

export const ItensDinamicos: React.FC<IIDProps> = (props) => {

	const {
		itensSelecionadosParaCaixa,
		loadingOption,
		itensParaSelecao,
		onFilterItens,
		criticidadesOptions
	} = props

	const { carregandoProdutos } = useCaixaStore()

	const {
		control,
		errors,
		watch,
		getValues,
		setValue,
		handleDelete,
		handleChange,
	} = useItensDinamicos(props)

	const msgs = useRef<Messages>(null)

	useMountEffect(() => {
		msgs?.current?.show(
			{
				sticky: true,
				severity: `info`,

				closable: true,
				content: (
					<React.Fragment>
						<div>
							<ul>
								<li>Adicione um item pesquisando pela descrição do produto.</li>
								<li>Defina os valores para Quantidade, Criticidade, e Valor.</li>
								<li>Salve a configuração.</li>
							</ul>
						</div>
					</React.Fragment>
				)
			}
		)
	})


	const showSpinner = useMemo(() => {
		if (carregandoProdutos) {
			return (
				<div className={`flex flex-column`}>
					<ProgressSpinner />
				</div>
			)
		}

	}, [carregandoProdutos])

	const footer = useMemo(() => {
		const quantidadeTotal = itensSelecionadosParaCaixa?.length ?? 0
		return `Total de  ${quantidadeTotal} itens.`
	}, [itensSelecionadosParaCaixa])

	return (
		<div className={`flex flex-column`}>
			<Messages ref={msgs} />
			{showSpinner}
			<table style={{
				width: `min-content`,

			}}>
				<div className={` w-full pr-2`}>
					<tr
						className={`bg-gradiente-maximum-compatibility-reverse `}
					>
						{/*essas classes de flex nao aplicaram*/}
						<td className={styleTdItemsTemplate + ` text-center flex align-items-center` +
							` justify-items-center justify-self-center ` +
							`flex-column h-full ` +
							` align-items-center`}
						>

							{/*essas classes de flex nao aplicaram*/}
							<div className={styleIdItem}>
								#
							</div>
						</td>
						{/*styleTdItemsTemplate revisado*/}
						<td className={styleTdItemsTemplate}>

							<div className={styleTdTitleInputDiv + ` w-20rem`}>
								<label className="text-lg">Produto</label>
								<DropdownSearch
									label=" "
									keyItem="item"
									control={control}
									errors={errors}
									filter
									showAdd={false}
									loadingOptions={loadingOption}
									listOptions={itensParaSelecao}
									optionsObject={{ optionValue: ``, optionLabel: `valor` }}
									onFilter={onFilterItens}
								/>
							</div>
						</td>
						<td className={styleTdItemsTemplate}>
							<div className={classNameQuantidade}
								style={styleQuantidade}
							>
								<label className="text-lg">Quantidade</label>
								<Controller
									name={`quantidade`}
									control={control}
									render={({ field }) => (
										<InputNumber
											className={`w-full`}
											onChange={e => {
												field.onChange(e.value)
											}}
											value={field.value}
											showButtons

											buttonLayout="stacked"
											decrementButtonClassName="p-button-secondary"
											incrementButtonClassName="p-button-success"
											incrementButtonIcon="pi pi-plus"
											decrementButtonIcon="pi pi-minus"
											min={1}
											max={100}
											maxLength={100}
											size={1}
										/>
									)}
								/>
							</div>

						</td>
						<td className={styleTdItemsTemplate}>
							<div className={`
                            flex
                            flex-column
                            justify-content-center
                            align-content-center
                            justify-self-center

                            `}
							style={{
								width: `160px`
							}}
							>
								<label className="text-lg">Criticidade</label>
								<span className="p-float-label">
									<Dropdown
										value={watch(`criticidade`)}
										className='w-full text-left h-dropdown'
										options={criticidadesOptions}
										onChange={(e) => {
											setValue(`criticidade`, e.value)
											getValues(`criticidade`)
										}}
										optionLabel={`valor`}
										optionValue={`id`}
										inputId={`id`}
									/>
								</span>
							</div>
						</td>
						<td className={styleTdItemsTemplate}>

							<div
								style={{
									width: `48px`
								}}
							>

							</div>
						</td>
					</tr>

				</div>
				<div
					style={{
						height: `42vh`,
					}}
					className={`
                    overflow-y-auto
                    overflow-x-hidden
                    w-full
                    `}
				>

					<ShowItemsTemplate
						criticidadesOptions={criticidadesOptions}
						handleChange={handleChange}
						handleDelete={handleDelete}
						itensCaixa={itensSelecionadosParaCaixa}
					/>
				</div>
				<div>
					{footer}
				</div>
			</table>
		</div>

	)
}
