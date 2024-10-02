import { vi } from 'vitest'
import {ModalConferenciaRecebimento} from './ModalConferenciaRecebimento.tsx'
import { render } from '@testing-library/react'

const mock_response = [
	{
		'serial': `CXVASV-HGP002`,
		'descricao_caixa': `CAIXA VASCULAR VENOSA I II`,
		'codigo_caixa': `CXVASV-HGP`,
		'total_itens': 2,
		'produtos': [
			{
				'id': 3244,
				'produto': `CAIXA.`,
				'quantidade': 1
			},
			{
				'id': 3255,
				'produto': `AFASTADOR FARABEUF PEQUENO`,
				'quantidade': 2
			}
		]
	}
]
const mock_cenarios_caixa_preta = {
	cenario1: {
		closeDialog: vi.fn(),
		conteudo: mock_response[0],
		openDialog: true
	},
	cenario2: {
		closeDialog: vi.fn(),
		conteudo: {
			...mock_response[0],
			total_itens: undefined
		},
		openDialog: true
	},
	cenario3: {
		closeDialog: vi.fn(),
		conteudo: {
			...mock_response[0],
			produtos: undefined
		},
		openDialog: true
	},
	cenario4: {
		closeDialog: vi.fn(),
		conteudo: {
			...mock_response[0],
			produtos: [
				{
					produto: undefined,
					quantidade: 1
				}
			]
		},
		openDialog: true
	},
	cenario5: {
		closeDialog: vi.fn(),
		conteudo: {
			...mock_response[0],
			produtos: [
				{
					produto: `item`,
					quantidade: undefined
				}
			]
		},
		openDialog: true
	},
}

const renderModal = (props: any) => {
	render(<ModalConferenciaRecebimento
		{...props}></ModalConferenciaRecebimento>)
}

describe(`ModalRecebimento [Caixa Preta]`, () => {
	it(`Abrir modal-caixa com todos params ok`, () => {
		renderModal(mock_cenarios_caixa_preta.cenario1)
	})
	it(`Abrir modal-caixa com total_itens = undefined => permanecer estável.`, () => {
		renderModal(mock_cenarios_caixa_preta.cenario2)
	})
	it(`Abrir modal-caixa com produtos = undefined => permanecer estável.`, () => {
		renderModal(mock_cenarios_caixa_preta.cenario3)
	})
	it(`Abrir modal-caixa com produtos[i].produto = undefined => permanecer estável.`, () => {
		renderModal(mock_cenarios_caixa_preta.cenario4)
	})
	it(`Abrir modal-caixa com produtos[i].quantidade = undefined => permanecer estável.`, () => {
		renderModal(mock_cenarios_caixa_preta.cenario5)
	})
})
