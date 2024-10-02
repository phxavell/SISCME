import {expect} from 'vitest'
import {render, screen} from '@testing-library/react'
import React from 'react'
import RenderObject from "@/components/RenderObject.tsx"

const mocks = {
	cenario1: {
		data: {nome:`teste`},
		keyObject: `nome`
	},
	cenario2: {
		data: undefined,
		keyObject: `nome`
	},
	cenario3: {
		data: {nome: {
			cliente:`teste`
		}},
		keyObject: `nome.cliente`
	},
	cenario4: {
		data: {nome: {
			cliente:`teste`
		}},
		keyObject: `nome`
	},
	cenario5: {
		data: {nome: {
			cliente:`teste`
		}},
		keyObject: ``
	},
}

const renderModal = (props: any) => {

	render(
		<RenderObject {...props} />
	)
}

describe(`RenderObject [Caixa Preta]`, () => {
	it(`Render component c1`, async () => {
		renderModal(mocks.cenario1)
		const data =screen.queryAllByText(`teste`)
		expect(data.length).toBeGreaterThan(0)
	})
	it(`Render component c2`, async () => {
		renderModal(mocks.cenario2)
		const data =screen.queryAllByText(`Não informado.`)
		expect(data.length).toBeGreaterThan(0)
	})
	it(`Render component c3`, async () => {
		renderModal(mocks.cenario3)
		const data =screen.queryAllByText(`teste`)
		expect(data.length).toBeGreaterThan(0)
	})
	it(`Render component c4`, async () => {
		renderModal(mocks.cenario4)
		const data =screen.queryAllByText(JSON.stringify(mocks.cenario4.data.nome))
		expect(data.length).toBeGreaterThan(0)
	})
	it(`Render component c5`, async () => {
		renderModal(mocks.cenario5)
		const data =screen.queryAllByText(`Não informado.`)
		expect(data.length).toBeGreaterThan(0)
	})
})
