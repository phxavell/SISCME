import {expect} from 'vitest'
import {fireEvent, render, renderHook, screen} from '@testing-library/react'
import React from 'react'
import {DropdownSearch} from '@/components/DropdownSeach/DropdownSearch.tsx'
import {CaixaMock} from '@infra/integrations/__mocks__/caixa-mock.ts'

import {TNovaCaixa} from '@pages/por-grupo/administrativo/cruds/caixa/nova-caixa/schemas.ts'
import {FormProvider, useForm} from 'react-hook-form'

const opcoesParaFormulario: any = CaixaMock.opcoesParaFormulario

const mocks = {
	cenario1: {
		control: {},
		errors: {},
		keyItem: `embalagem`,
		label: `Embalagem`,
		listOptions: opcoesParaFormulario.embalagens,
		showAdd: true,
		optionsObject: {
			optionLabel: `valor`,
			optionValue: `id`,
		},
		filter: true,
		isFloatLabel: true,
		loadingOptions: false,
		onFilter:()=> {},
		handleClickAdd: ()=> {}
	} as DropdownSearch.PropsI,
	cenario2: {
		control: {},
		errors: {},
		keyItem: `embalagem`,
		label: `Embalagem`,
		listOptions: opcoesParaFormulario.embalagens,
		showAdd: true,
		optionsObject: {
			optionLabel: `valor`,
			optionValue: `id`,
		},
		filter: false,
		loadingOptions: true,
		onFilter:undefined,
		handleClickAdd: undefined,
		isFloatLabel: undefined,
	} as DropdownSearch.PropsI,
}


const renderModal = (props: any) => {

	const {result} = renderHook(
		() => useForm<TNovaCaixa>({
			defaultValues: {embalagem: 1},
		})
	)
	const methods = result.current
	const {control} = result.current
	return render(
		<FormProvider {...methods}>
			<DropdownSearch {...{...props, control: control}} />
		</FormProvider>
	)
}

describe(`DropdownSearch [Caixa Preta]`, () => {
	it(`Abrir modal-caixa com todos dados params ok`, () => {
		const { container } = renderModal(mocks.cenario1)
		expect(container.getElementsByClassName(`p-float-label`).length).equal(1)
		const btn = screen.getByTestId(`dropdown-custom`)
		fireEvent.click(btn)
		expect(screen.findAllByText(`Embalagem`)).toBeDefined()
	})
	it(`Abrir modal-caixa com dados opcionais vazios`, () => {
		renderModal(mocks.cenario2)
		expect(screen.findAllByText(`Embalagem`)).toBeDefined()
	})
})
