import { render, renderHook, screen, waitFor, act } from '@testing-library/react'
import { vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { Producao } from '.'
import RemoteAccessClient from '@/infra/api/axios-s-managed'
import { useProducao} from './useProducao'
import { useAuth } from '@/provider/Auth'
import MockedContextProvider from '@/provider/Auth/MockedContextProvider.tsx'
import { ProducaoMock } from '@/infra/integrations/__mocks__/processos/producao/producao-mock'

const mockarAPI =  (mock_response: any) => {
	RemoteAccessClient.prepararModoTeste()
	const mock = RemoteAccessClient.mockAdapter

	mock.onAny().reply(() => {
		return [200, mock_response]
	})
}
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
			<Producao />
		</MockedContextProvider>
	)
}

describe(`Produção [caixa preta]`, () => {
	it(`Abrir tela com a listagem não vazia => Permanecer estável`, async () => {
		mockarAPI(ProducaoMock.cenario1)
		renderComponente()
		await waitFor(() => {
      		expect(screen.getByText(`Hospital Santo Alber`)).toBeInTheDocument()
		})
	})

	it(`Abrir tela com a listagem vazia => Permanecer estável`, async () => {
		mockarAPI(ProducaoMock.cenario2)
		renderComponente()
		await waitFor(() => {
			expect(screen.getByText(`Não há caixas pendentes.`)).toBeInTheDocument()
		})
	})

	it(`Abrir tela com a listagem retornando undefined => Permanecer estável`, async () => {
		mockarAPI(ProducaoMock.cenario3)
		renderComponente()
		await waitFor(() => {
			expect(screen.getByText(`Não há caixas pendentes.`)).toBeInTheDocument()
		})
	})
	afterEach(() => {
		RemoteAccessClient.limparCenariosDeTeste()
	})
	afterAll(() => {
		RemoteAccessClient.DesfazerModoTeste()
	})
})

describe(`Producao [caixa branca]`, () => {
	it(`Renderiza o componente Producao corretamente`, () => {
		mockarAPI(ProducaoMock.cenario3)
		renderComponente()

		const titulo = screen.getByText(`Produção`)

		expect(titulo).toBeInTheDocument()
	})

	it(`Abrir tela com a listagem não vazia e retornar os dados vindos da api`, async () => {
		mockarAPI(ProducaoMock.cenario1)
		renderComponente()
		await waitFor(() => {
			expect(screen.getByText(`Hospital Santo Alber`)).toBeInTheDocument()
		})

	})

	it(`Abrir modal após bipar o serial`, async () => {
		mockarAPI(ProducaoMock.cenario4)

		renderComponente()
		const user = userEvent.setup()
		const input = screen.getByTestId(`serial`)
		const botaosSubmit = screen.getByTestId(`check-serial-producao`)
		await user.type(input, `RKPLA004`)

		await user.click(botaosSubmit)

		await waitFor(() => {
			const modal = screen.getByTestId(`modal-producao`)
			expect(modal).toBeDefined()
		})
		const botaoFecharModal = screen.getByRole(`button`, {name: /Close/i})

		await user.click(botaoFecharModal)
		await waitFor(() => {
			const titulo = screen.getByText(`Produção`)

			expect(titulo).toBeInTheDocument()
		})

	})

	it(`Abrir tela com a listagem vazia e retornar a mensagem esperada`, async () => {
		RemoteAccessClient.prepararModoTeste()
		mockarAPI(ProducaoMock.cenario2)
		renderComponente()
		await waitFor(() => {
			expect(screen.getByText(`Não há caixas pendentes.`)).toBeInTheDocument()
		})
	})
	it(`Abrir tela com a listagem undefined e retornar a mensagem esperada`, async () => {
		mockarAPI(ProducaoMock.cenario3)
		renderComponente()
		await waitFor(() => {
			expect(screen.getByText(`Não há caixas pendentes.`)).toBeInTheDocument()
		})
	})
	afterEach(() => {
		RemoteAccessClient.limparCenariosDeTeste()
	})
	afterAll(() => {
		RemoteAccessClient.DesfazerModoTeste()
	})
})

describe(`useProducao [caixa branca]`, () => {
	it.skip(`Verificar estado inicial => retornar valores iniciais dos useState `, () => {
		const { result } = renderHook(() => useProducao())

		expect(result.current.visible).toEqual(false)
		expect(result.current.loading).toEqual(true)
		expect(result.current.showModal).toEqual(false)
		expect(result.current.first).toEqual(0)
	})
	it.skip(`Chamar a função onPageChange como parametro event = 1 => a variável first = 1`, async () => {
		mockarAPI(ProducaoMock.cenario1)
		const { result } = renderHook(() =>  useProducao())
		const event = {first:1}
		act(() => {
			result.current.onPageChange(event)
		})
		expect(result.current.first).toBe(1)

	})
	it.skip(`Chamar a função handleCloseModalCaixa => a variável showModal = false`, async () => {
		mockarAPI(ProducaoMock.cenario1)
		const { result } = renderHook(() =>  useProducao())

		act(() => {
			result.current.handleCloseModalCaixa()
		})
		expect(result.current.showModal).toBeFalsy

	})
	it.skip(`Chamar a função updateList => caixas deve retornar um objeto`, async () => {
		mockarAPI(ProducaoMock.cenario1)
		const { result } = renderHook(() =>  useProducao())

		act(() => {
			// result.current.updateList()
		})

		await waitFor(() => {
			expect(result.current.caixas).toEqual(expect.any(Object))
		})

	})

	afterEach(() => {
		RemoteAccessClient.limparCenariosDeTeste()
	})

	afterAll(() => {
		RemoteAccessClient.DesfazerModoTeste()
	})
})
