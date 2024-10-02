import { fireEvent, render, renderHook, screen, waitFor, act } from '@testing-library/react'
import { vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import {Esterilizacao } from '.'
import RemoteAccessClient from '@/infra/api/axios-s-managed'
import { useAuth } from '@/provider/Auth'
import MockedContextProvider from '@/provider/Auth/MockedContextProvider.tsx'
import { EquipamentoMock } from '@/infra/integrations/__mocks__/equipamento/equipamento'
import { EsterilizacaoMock } from '@/infra/integrations/__mocks__/esterilizacao/esterilizacao'



const renderComponente = () => {
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
			<Esterilizacao />
		</MockedContextProvider>
	)
}
const mockarAPI =  (mock_response: any) => {
	RemoteAccessClient.prepararModoTeste()
	const mock = RemoteAccessClient.mockAdapter

	mock.onAny().reply(() => {
		return [200, mock_response]
	})
}
describe(`Esterilizacao [caixa preta]`, () => {
	it(`Abrir tela com a listagem não vazia => Permanecer estável`, async () => {
		mockarAPI(EsterilizacaoMock.cenario1)
		renderComponente()
		await waitFor(() => {
			expect(screen.getByText(`CICA TESTE`)).toBeInTheDocument()
		})
	})

	it(`Abrir tela com a listagem vazia => Permanecer estável`, async () => {
		mockarAPI(EsterilizacaoMock.cenario2)
		renderComponente()
		await waitFor(() => {
			expect(screen.getByText(`Nenhum resultado encontrado.`)).toBeInTheDocument()
		})
	})

	it(`Abrir tela com a listagem retornando undefined => Permanecer estável`, async () => {
		mockarAPI(EsterilizacaoMock.cenario3)
		renderComponente()
		await waitFor(() => {
			expect(screen.getByText(`Nenhum resultado encontrado.`)).toBeInTheDocument()
		})
	})
	afterEach(() => {
		RemoteAccessClient.limparCenariosDeTeste()
	})
	afterAll(() => {
		RemoteAccessClient.DesfazerModoTeste()
	})
})

describe(`Esterilizacao [caixa branca]`, () => {

	beforeAll(()=> {
		RemoteAccessClient.prepararModoTeste()
	})
	it(`Abrir tela com listagem não vazia, ao clicar no icon do botão abrir modal. `, async() => {
		mockarAPI(EsterilizacaoMock.cenario1)

		renderComponente()

		await waitFor(() => {
			expect(screen.getByText(`Esterilização`)).toBeInTheDocument()
		})
		const SearchBotao = screen.getByTestId(`esterilizacao-modal`)
		fireEvent.click(SearchBotao)

		await waitFor(() => {
			expect(screen.getByText(`Etapa 1/2: Inserir dados de ciclo` )).toBeDefined()
		})

	})
	it(`Abrir tela com listagem não vazia, ao clicar no botão visualizar modal abrir modal com a lista`, async() => {
		mockarAPI(EsterilizacaoMock.cenario1)
		mockarAPI(EquipamentoMock.QRCode)
		renderComponente()
		const uuid = `da893c84-1c87-4ad2-b886-6ae9f057fede`
		const input = screen.getByTestId(`equipamento`)
		await userEvent.type(input, uuid)
		const form = screen.getByTestId(`form-modal`)
		fireEvent.submit(form)
		await waitFor(() => {
			expect(screen.getByTestId(`esterilizacao-modal`)).toBeInTheDocument()
		})

	})
	afterEach(() => {
		RemoteAccessClient.limparCenariosDeTeste()
	})
	afterAll(() => {
		RemoteAccessClient.DesfazerModoTeste()
	})
})
