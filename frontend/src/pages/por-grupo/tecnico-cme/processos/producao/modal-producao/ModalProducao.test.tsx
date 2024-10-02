import { vi } from 'vitest'
import {ModalProducao} from './index'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ModalProducaoMock } from '@/infra/integrations/__mocks__/processos/producao/producao-mock'
import RemoteAccessClient from '@/infra/api/axios-s-managed'
import { BrowserRouter } from 'react-router-dom'

export const mockarAPI =  (mock_response: any) => {
	RemoteAccessClient.prepararModoTeste()
	const mock = RemoteAccessClient.mockAdapter

	mock.onAny().reply(() => {

		return [200, mock_response]
	})
}
const mock_response = [
	{
		'serial': `CXVASV-HGP002`,
		'cautela': `541`,
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
	const handleClose = async(trueOfFalse = false) => {vi.fn(() => trueOfFalse)}
	render(<BrowserRouter>
		<ModalProducao
			closeDialog={handleClose}
			openDialog={true}
			conteudo={props}
			setCaixaToPDF={vi.fn()}
		/>
	</BrowserRouter>
	)
}

describe(`ModalProducao [Caixa Preta]`, () => {
	it.skip(`Abrir modal-caixa com todos params ok`, () => {
		renderModal(mock_cenarios_caixa_preta.cenario1)
	})
	it.skip(`Abrir modal-caixa com total_itens = undefined => permanecer estável.`, () => {
		renderModal(mock_cenarios_caixa_preta.cenario2)
	})
	it.skip(`Abrir modal-caixa com produtos = undefined => permanecer estável.`, () => {
		renderModal(mock_cenarios_caixa_preta.cenario3)
	})
	it.skip(`Abrir modal-caixa com produtos[i].produto = undefined => permanecer estável.`, () => {
		renderModal(mock_cenarios_caixa_preta.cenario4)
	})
	it.skip(`Abrir modal-caixa com produtos[i].quantidade = undefined => permanecer estável.`, () => {
		renderModal(mock_cenarios_caixa_preta.cenario5)
	})
})
describe(`ModalProducao [Caixa Branca]`, () => {
	it.skip(`Abrir modal objeto não vazio => permanecer estável `, async() => {

		renderModal(ModalProducaoMock.cenario1.data)
		await waitFor(() => {
			expect(screen.getByText(`HPS 28 DE AGOSTO`)).toBeInTheDocument()
		})

	})
	it.skip(`Fechar modal ao click no botão close => verificar se a função handleClose foi chamada`, async() => {

		const handleClose = vi.fn()
		const props: any = ModalProducaoMock.cenario1.data
		render(<ModalProducao
			closeDialog={handleClose}
			openDialog={true}
			conteudo={props}
			setCaixaToPDF={vi.fn()}
		/>
		)
		const user = userEvent.setup()

		const botaosSubmit = screen.getByRole(`button`, { name: /Close/i })

		await user.click(botaosSubmit)

		expect(handleClose).toHaveBeenCalled()

	})
	it.skip(`Fechar modal apos submit => verificar se a função handleClose foi chamada`, async() => {

		const handleClose = vi.fn()
		const props: any = ModalProducaoMock.cenario1.data
		mockarAPI(ModalProducaoMock.cenario3)
		render(<ModalProducao
			closeDialog={handleClose}
			openDialog={true}
			conteudo={props}
			setCaixaToPDF={vi.fn()}
		/>
		)

		const user = userEvent.setup()
		const input = screen.getByTestId(`serial-modal`)
		const botaosSubmit = screen.getByTestId(`botao-confirmar-serial-producao`)
		await user.type(input, `BAN1004`)

		await user.click(botaosSubmit)

		await waitFor(() => {
			expect(handleClose).toHaveBeenCalledTimes(1)
		})
	})

})
