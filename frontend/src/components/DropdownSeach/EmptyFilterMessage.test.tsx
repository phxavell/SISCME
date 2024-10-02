import {expect} from 'vitest'
import {fireEvent, render, screen} from '@testing-library/react'
import React from 'react'
import {TemplateEmptyFilterMessage} from "@/components/DropdownSeach/TemplateEmptyFilterMessage.tsx"
import {act} from "react-dom/test-utils"

describe(`TemplateEmptyFilterMessage [Caixa Preta]`, () => {
	it(`Render com params ok`, () => {
		render(<>{TemplateEmptyFilterMessage(`keyItem`, true, () => {
		})({})}</>)
		const btn = screen.getByTestId(`btn-add-item`)
		act(() => {
			fireEvent.click(btn)
			expect(screen.findAllByText(`Nenhum valor encontrado para a pesquisa acima.`)).toBeDefined()
		})
	})
	it(`Render com params de exibir adicionar falso`, async () => {
		render(<>{TemplateEmptyFilterMessage(`keyItem`, false, () => {
		})({})}</>)
		const label = screen.queryAllByText(`Adicionar item?`)
		expect(label.length).equal(0)
	})
})
