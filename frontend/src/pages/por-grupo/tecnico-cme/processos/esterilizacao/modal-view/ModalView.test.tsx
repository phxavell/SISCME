import { render, renderHook, screen, waitFor, act } from '@testing-library/react'
import { vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { ViewEsterilizacao } from '.'
import RemoteAccessClient from '@/infra/api/axios-s-managed'

import { useAuth } from '@/provider/Auth'
import MockedContextProvider from '@/provider/Auth/MockedContextProvider.tsx'

import { ModalViewMock } from '@/infra/integrations/__mocks__/esterilizacao/esterilizacao'


const mockarAPI =  (mock_response: any) => {
	RemoteAccessClient.prepararModoTeste()
	const mock = RemoteAccessClient.mockAdapter

	mock.onAny().reply(() => {
		return [200, mock_response]
	})
}
const renderComponente = (dadosView: any) => {
	const { result} = renderHook(() => useAuth())
	    act(() => {
		// @ts-ignore
		result.current={ user: { id: 1, nome: `ADMIN` },
			toastSuccess: vi.fn(),
			toastError: vi.fn(),
		}
	})
	render(
		<MockedContextProvider contextValue={result.current}>
			<ViewEsterilizacao
				showModal={true}
				finalizarStatus={() => {}}
				abortarStatus={() => {}}
				dadosView={dadosView}
				setShowModal={() => {}}
			/>
		</MockedContextProvider>
	)
}

describe(`ViewEsterilizacao [caixa preta]`, () => {
	it(`Abrir tela com a listagem não vazia e situacao_atual: ESTERILIZACAO_FIM => Permanecer estável`, async () => {
		renderComponente(ModalViewMock.dadosView1)

		await waitFor(() => {
      		expect(screen.getByText(`Detalhes da Esterilização: ${ModalViewMock.dadosView1.data.id}`)).toBeInTheDocument()
		})
	})

	it(`Abrir tela com a listagem de itens vazia => Permanecer estável`, async () => {
		renderComponente(ModalViewMock.dadosView2)
		await waitFor(() => {
			expect(screen.getByText(`Buscando...`)).toBeInTheDocument()
		})
	})
	it(`Abrir tela com a listagem não vazia situacao_atual: ESTERILIZACAO_INICIO => Permanecer estável`, async () => {

		renderComponente(ModalViewMock.dadosView3)
		await waitFor(() => {
			expect(screen.getByText(`Em Andamento`)).toBeInTheDocument()
		})
	})
	it(`Abrir tela com a listagem não vazia situacao_atual: ESTERILIZACAO_INICIO => Visualizar botão finalizar ciclo`, async () => {
		mockarAPI(ModalViewMock.dadosView3)
		renderComponente(ModalViewMock.dadosView3)
		const user = userEvent.setup()

		const botaosSubmit = screen.getByTestId(`finalizar-ciclo`)

		 await user.click(botaosSubmit)

		await waitFor(() => {
			expect(screen.getByText(`Finalizar Ciclo`)).toBeInTheDocument()
		})
	})

	it(`Abrir tela com a listagem não vazia situacao_atual: ESTERILIZACAO_INICIO => Visualizar botão abortar ciclo`, async () => {
		mockarAPI(ModalViewMock.dadosView3)
		renderComponente(ModalViewMock.dadosView3)
		const user = userEvent.setup()

		const botaosSubmit = screen.getByTestId(`abortar-ciclo`)

		 await user.click(botaosSubmit)

		await waitFor(() => {
			expect(screen.getByText(`Abortar Ciclo`)).toBeInTheDocument()
		})
	})
	afterEach(() => {
		RemoteAccessClient.limparCenariosDeTeste()
	})
	afterAll(() => {
		RemoteAccessClient.DesfazerModoTeste()
	})
})
