import {expect} from 'vitest'
import {fireEvent, render, screen} from '@testing-library/react'
import React from 'react'
import {act} from "react-dom/test-utils"
import {TemplateEmptyMessage} from "@/components/DropdownSeach/TemplateEmptyMessage.tsx"


describe(`TemplateEmptyFilterMessage [Caixa Preta]`, () => {
	it(`Render com params ok`, () => {
		render(<>{TemplateEmptyMessage(`keyItem`, true,false, () => {
		})({})}</>)
		const btn = screen.getByTestId(`btn-add-item`)
		act(() => {
			fireEvent.click(btn)
			expect(screen.findAllByText(`Nenhum valor encontrado para a pesquisa acima.`)).toBeDefined()
		})
	})
	it(`Render com loading=true`, () => {
		render(<>{TemplateEmptyMessage(`keyItem`, true,true, () => {
		})({})}</>)

		act(() => {

			expect(screen.findAllByText(`Carregando.`)).toBeDefined()
		})
	})
	it(`Render com params de exibir adicionar falso`, async () => {
		render(<>{TemplateEmptyMessage(`keyItem`, false,false,  () => {
		})({})}</>)
		const label = await screen.queryAllByText(`Adicionar item?`)
		expect(label.length).equal(0)

	})
})
