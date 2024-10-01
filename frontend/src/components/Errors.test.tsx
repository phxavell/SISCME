import {expect} from 'vitest'
import {render, screen, waitFor} from '@testing-library/react'
import React from 'react'
import {Errors} from "@/components/Errors.tsx"

const mocks = {
	cenario1: {message: `Required`},
	cenario2: {message: ``}
}

const renderModal = (props: any) => {

	render(
		<Errors {...props} />
	)
}

describe(`DropdownSearch [Caixa Preta]`, () => {
	it(`Render component com params  de erro Required`, async () => {
		renderModal(mocks.cenario1)
		await waitFor(() => {
			const data =screen.queryAllByText(`Este campo é obrigatório.`)
			expect(data.length).toBeGreaterThan(0)
		})
	})
	it(`Render component sem mensagem definida`, async () => {
		renderModal(mocks.cenario2)
		await waitFor( () => {
			const data =screen.queryAllByText(`Campo Obrigatório`)
			console.log(data)
			expect(data.length).equal(0)

		})
	})
})
