import * as React from 'react'
import {Controller} from 'react-hook-form'
import {Dropdown, DropdownFilterEvent} from 'primereact/dropdown'
import {Errors} from '@/components/Errors.tsx'
import {IOptionToSelect} from '@infra/integrations/caixa/types.ts'
import {TemplateEmptyFilterMessage} from "@/components/DropdownSeach/TemplateEmptyFilterMessage.tsx"
import {TemplateEmptyMessage} from "@/components/DropdownSeach/TemplateEmptyMessage.tsx"
import {useCallback} from "react"
import {MultiSelect} from "primereact/multiselect"

export namespace DropdownSearch {

    export interface PropsI {
        control: any
        errors: any
        keyItem: string
        label: string
        listOptions: IOptionToSelect[] | any[] |  undefined
        showAdd: boolean
        optionsObject: {
            optionLabel: `valor` | string
            optionValue: `id` | string
        },
        filter: boolean
        loadingOptions: boolean
        handleClickAdd?: (keyItem: string) => void
        onFilter?: (e: DropdownFilterEvent) => void
        autoFocus?: boolean
		isFloatLabel?: boolean,
        clearErrors?: any
        multiple?: boolean
		classNameLabel?: string
		classNameSpan?: string
		classNameDropdown?: string
    }
}

export const DropdownSearch: React.FC<DropdownSearch.PropsI> = (props) => {

	const {
		control,
		errors,
		keyItem,
		label,
		listOptions,
		showAdd,
		optionsObject,
		classNameDropdown = ``,
		filter,
		classNameLabel = ``,
		loadingOptions,
		handleClickAdd,
		onFilter,
		autoFocus,
		isFloatLabel = true,
		clearErrors,
		multiple =false
	} = props

	let showFilterMemo = filter
	if (onFilter) {
		showFilterMemo = true
	} else {
		showFilterMemo = loadingOptions ? false : filter
	}

	const showErros = useCallback(()=> {
		if(errors[keyItem]){
			return <Errors message={errors[keyItem]?.message}/>
		}
		return <></>
	}, [errors, keyItem])

	if(multiple){
		return (
			<div className="text-left flex-wrap w-full">
				<Controller
					control={control}
					name={keyItem}
					render={({field}) => {
						return (
							<span className={isFloatLabel ? `p-float-label` : ``}>
								<MultiSelect
									data-testid="dropdown-multiple-custom"
									autoFocus={autoFocus}
									className='w-full text-left h-dropdown'
									resetFilterOnHide
									filterPlaceholder=" "
									maxSelectedLabels={2}
									selectAll={true}
									emptyFilterMessage={TemplateEmptyFilterMessage(keyItem, showAdd, handleClickAdd)}
									filter={showFilterMemo}
									id={field.name}
									options={listOptions}
									value={field.value}
									onChange={(e) => {
										field.onChange(e.value)
										if(clearErrors){
											clearErrors(keyItem)
										}

									}}
									optionLabel={optionsObject.optionLabel}
									optionValue={optionsObject.optionValue}
									inputId={field.name}
									onFilter={onFilter}
									placeholder={isFloatLabel ? `` : label}
								/>
								<label htmlFor={field.name} className="">{isFloatLabel ? label : ``}</label>
							</span>
						)
					}}
				/>
				{showErros()}
			</div>
		)
	}

	return (
		<div className="text-left flex-wrap w-full">
			<Controller
				control={control}
				name={keyItem}
				render={({field}) => {
					return (
						<span className={isFloatLabel ? `p-float-label` : ``}>
							<Dropdown
								data-testid="dropdown-custom"
								autoFocus={autoFocus}
								className={`w-full text-left h-dropdown ${classNameDropdown}`}
								showFilterClear
								resetFilterOnHide
								filterPlaceholder=" "
								emptyMessage={TemplateEmptyMessage(keyItem, showAdd, loadingOptions, handleClickAdd)}
								emptyFilterMessage={TemplateEmptyFilterMessage(keyItem, showAdd, handleClickAdd)}
								filter={showFilterMemo}
								id={field.name}
								options={listOptions}
								value={field.value}
								onChange={(e) => {
									field.onChange(e.value)
									if(clearErrors){
										clearErrors(keyItem)
									}

								}}
								optionLabel={optionsObject.optionLabel}
								optionValue={optionsObject.optionValue}
								inputId={field.name}
								onFilter={onFilter}
								placeholder={isFloatLabel ? `` : label}
							/>
							<label htmlFor={field.name} className={classNameLabel}>{isFloatLabel ? label : ``}</label>
						</span>
					)
				}}
			/>
			{showErros()}
		</div>
	)
}
