import {expect, vi} from 'vitest'
import {render} from '@testing-library/react'
import React from 'react'
import {EquipamentoDropdown} from './index.tsx'

const mockEquipamentosuuid = [{
	id: 1,
	uuid: `da893c84-1c87-4ad2-b886-6ae9f057fede`,
	value: `Termo`,
}]
const mockField  ={
	name:`equipamento`,
	value: `Termo`,
	onChange: vi.fn(),
	ref: vi.fn()
}
describe(`EquipamentoDropdown `, () => {
	it(`Renderizar componente  params ok`, async() => {
		const { findAllByText } = render(
			<EquipamentoDropdown field={mockField}
				equipamentosuuid={mockEquipamentosuuid}
			/>
		)
		const dropdown = await findAllByText(`Equipamento`)
		expect(dropdown[0]).toBeInTheDocument()
	})
})
