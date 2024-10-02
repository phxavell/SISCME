import {render, screen} from '@testing-library/react'
import React from 'react'
import {ModalMessageApi} from "@/components/modals/ModalMessagemApi/ModalMessageApi.tsx"
import {TMessageAlert} from "@/components/modals/ModalMessagemApi/types.ts"


const mocks = {
	cenario1: {
		visibleModalError: undefined,
		setVisibleModalError: undefined,
		valueProgressBar: undefined,
		messageErrorApi: undefined,
	},
	cenario2: {
		visibleModalError: true,
		setVisibleModalError: undefined,
		valueProgressBar: 50,
		messageErrorApi: {
			type: undefined,
			description: undefined
		},
	},
	cenario3: {
		visibleModalError: true,
		setVisibleModalError: undefined,
		valueProgressBar: 50,
		messageErrorApi: {
			type: `desconhecido`,
			description: 123123
		},
	},
	cenario4: {
		visibleModalError: true,
		setVisibleModalError: undefined,
		valueProgressBar: 50,
		messageErrorApi: {
			type: TMessageAlert.Alert,
			description: `Alerta teste`
		},
	},
	cenario5: {
		visibleModalError: true,
		setVisibleModalError: undefined,
		valueProgressBar: 50,
		messageErrorApi: {
			type: TMessageAlert.Error,
			description: `Erro em tela`
		},
	},
	cenario6: {
		visibleModalError: true,
		setVisibleModalError: ()=>{},
		valueProgressBar: 50,
		messageErrorApi: {
			type: TMessageAlert.Success,
			description: `Sucesso em tela`
		},
	},
}

const renderModal = (props: any) => {
	render(<ModalMessageApi {...props} />)
}

describe(`ModalMessageApi.tsx [Caixa Preta]`, () => {
	it(`Render com params  undefined`, async () => {
		renderModal(mocks.cenario1)
	})
	it(`Render somente com 'messageErrorApi' errado. v1 `, async () => {
		renderModal(mocks.cenario2)
	})
	it(`Render somente com 'messageErrorApi' errado. v2`, async () => {
		renderModal(mocks.cenario3)
	})
})
describe(`ModalMessageApi.tsx [Caixa Branca]`, () => {
	it(`com type=Alert, exibir título='ALERTA!' `, async () => {
		renderModal(mocks.cenario4)
		expect(screen.queryAllByText(`Alerta!`).length).toBeGreaterThan(0)
		expect(screen.queryAllByText(
			mocks.cenario4.messageErrorApi.description
		).length).toBeGreaterThan(0)
	})
	it(`com type=Alert, exibir título='ERRO!' `, async () => {
		renderModal(mocks.cenario5)
		expect(screen.queryAllByText(`Erro!`).length).toBeGreaterThan(0)
		expect(screen.queryAllByText(
			mocks.cenario5.messageErrorApi.description
		).length).toBeGreaterThan(0)
	})
	it(`com type=Alert, exibir título='SUCESSO!' `, async () => {
		renderModal(mocks.cenario6)
		expect(screen.queryAllByText(`Sucesso!`).length).toBeGreaterThan(0)
		expect(screen.queryAllByText(
			mocks.cenario6.messageErrorApi.description
		).length).toBeGreaterThan(0)
	})
})
