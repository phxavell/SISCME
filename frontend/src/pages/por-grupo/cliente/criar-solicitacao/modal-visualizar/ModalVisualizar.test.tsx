import { expect, vi } from 'vitest'
import ModalVisualizar from './index'
import { render, screen } from '@testing-library/react'
import { ClienteSolicitacoesMock } from 'src/infra/integrations/__mocks__'


const list: any = ClienteSolicitacoesMock.list
const mock_cenarios_caixa_preta = {
	cenario1: {
		closeDialog: vi.fn(),
		solicitacao: list[0],
		openDialog: true
	},
	cenario2: {
		closeDialog: vi.fn(),
		solicitacao: undefined,
		openDialog: true
	},
	cenario3: {
		closeDialog: vi.fn(),
		solicitacao: {
			...list[0],
			caixas: undefined
		},
		openDialog: true
	},
	cenario4: {
		closeDialog: vi.fn(),
		solicitacao: {
			...list[0],
			observacao: undefined
		},
		openDialog: true
	},
	cenario5: {
		closeDialog: vi.fn(),
		solicitacao: {
			...list[0],
			historico: undefined
		},
		openDialog: true
	},
	cenario6: {
		closeDialog: vi.fn(),
		solicitacao: {
			...list[0],
			historico: ``
		},
		openDialog: true
	},
}

const renderModal = (props: any) => {
	render(<ModalVisualizar
		{...props}></ModalVisualizar>)
}

describe(`ModalVisualizar [Caixa Preta]`, () => {
	it(`Abrir modal-caixa com todos dados params ok`, () => {

		renderModal(mock_cenarios_caixa_preta.cenario1)
		//screen.debug();
		const labels = screen.queryAllByText(`Transporte`)
		expect(labels.length).toBeGreaterThanOrEqual(1)
	})
	it(`Abrir modal-caixa com solicitao = undefined, deve permanecer estável.`, () => {
		renderModal(mock_cenarios_caixa_preta.cenario2)
		//screen.debug();
	})
	it(`Abrir modal-caixa com solicitao.caixas = undefined, deve permanecer estável.`, () => {
		renderModal(mock_cenarios_caixa_preta.cenario3)
		const labels = screen.queryAllByText(`Transporte`)
		expect(labels.length).toBeGreaterThanOrEqual(1)
	})
})

describe(`ModalVisualizar [Caixa Branca]`, () => {
	it(`Abrir modal-caixa com solicitao.observacao = undefined, deve permanecer estável.`, () => {
		renderModal(mock_cenarios_caixa_preta.cenario4)
		//screen.debug(undefined, 3000000);
		const labels = screen.queryAllByText(`Não informado.`)
		expect(labels.length).toBeGreaterThanOrEqual(1)
	})
	it(`Abrir modal-caixa com solicitao.historico for uma string, deve permanecer estável.`, () => {
		renderModal(mock_cenarios_caixa_preta.cenario6)
		//screen.debug(undefined, 3000000);
		const labels = screen.queryAllByText(``)
		expect(labels.length).toBeGreaterThanOrEqual(1)
	})

})
