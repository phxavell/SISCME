import {InputNumber, InputNumberValueChangeEvent} from 'primereact/inputnumber'
import {Button} from 'primereact/button'
import * as React from 'react'
import {useCallback} from 'react'
import {Dropdown} from 'primereact/dropdown'
import {IShowItensProps} from '@pages/por-grupo/administrativo/cruds/caixa/nova-caixa/modal-caixa/types-modal.ts'
import {classNameQuantidade, styleCriticidade, styleIdItem, styleQuantidade, styleTdItemsTemplate} from '@pages/por-grupo/administrativo/cruds/caixa/nova-caixa/modal-caixa/style.ts'
import {Badge} from 'primereact/badge'
import {useCaixaStore} from '@/store/store.ts'
import {Tooltip} from 'primereact/tooltip'

export const ShowItemsTemplate: React.FC<IShowItensProps> = (props) => {
	const {handleChange, handleDelete, itensCaixa, criticidadesOptions} = props
	// Ordem: nome do produto, quantidade, criticidade

	const {errosList} = useCaixaStore()

	const style = `

        flex
        flex-column
        justify-content-center
        align-content-center

        text-xs
        text-center
        w-full
        h-3rem
        border-round
        bg-white
        text-blue-900
        px-2
        py-2

    `
	const showId = useCallback((id: number | undefined, index: number) => {
		const showError = () => {
			if (errosList && errosList[index]?.length) {
				return (
					<>
						<Tooltip target=".custom-target-icon"/>
						<i className=" mt-2 pi pi-exclamation-circle custom-target-icon"

							data-pr-tooltip={errosList[index]}
							data-pr-position="right"
							data-pr-at="right+5 top"
							data-pr-my="left center-2"

							style={{color: `#e8a041`, fontSize: `1.5rem`}}
						></i>
					</>

				// <Avatar
				//     icon="pi pi-exclamation-circle"
				//     style={{ backgroundColor: '#e8a041', color: '#ffffff' }} />
				)
			}
		}
		if (id) {
			const value = index + 1 + ``
			return (
				<div>

					<Badge value={value}
						className={`w-min justify-self-center`}
					/>
					{showError()}
				</div>

			)
		} else {
			return (
				<Badge value={`Novo!`}

					severity={`success`}
				></Badge>
			)
		}
	}, [errosList])
	const itens = itensCaixa.map((item, index) => (
		<tr
			key={item.item.id}
			className={` bg-gradiente-maximum-compatibility-reverse`}>
			<td className={styleTdItemsTemplate + ` w-1`}>

				<div className={styleIdItem}>
					{showId(item?.id, index)}
				</div>
			</td>
			<td className={styleTdItemsTemplate + ` w-30rem `}
				style={{
					width: `50px`
				}}>
				<div className={style}>
					{item.item.valor}
				</div>
			</td>
			<td className={styleTdItemsTemplate}>
				<div
					className={classNameQuantidade}
					style={styleQuantidade}
				>
					<InputNumber
						className={`w-full `}
						onChange={e => {
							handleChange(`quantidade`, index)(e as InputNumberValueChangeEvent)
						}}
						value={item.quantidade}
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
				</div>
			</td>
			<td className={`${styleTdItemsTemplate}`}>
				<span
					className="p-float-label"
					style={styleCriticidade}>
					<Dropdown
						className='w-full text-left h-dropdown'
						options={criticidadesOptions}
						value={item.criticidade}
						onChange={handleChange(`criticidade`, index)}
						optionLabel={`valor`}
						optionValue={`id`}
						inputId={`id`}
						name={`id`}
					/>
				</span>
			</td>
			<td className={styleTdItemsTemplate}>
				<Button
					className="
                    mt-0
                    bg-transparent h-3rem"
					icon='pi pi-trash'
					severity={`secondary`}
					size={`large`}
					text
					onClick={handleDelete(index)}/>
			</td>
		</tr>)
	)
	return (<>{itens}</>)
}
