import { render, screen, fireEvent, waitFor, renderHook, act } from "@testing-library/react"
import { vi } from 'vitest'
import RemoteAccessClient from "@infra/api/axios-s-managed.ts"

import { TipoProduto } from "./index.tsx"
import "@testing-library/jest-dom"

import { useTipoProduto } from "@pages/por-grupo/administrativo/cruds/produto/tipo-produto/useTipoProduto.ts"
import { useAuth } from "@/provider/Auth"
import MockedContextProvider from "@/provider/Auth/MockedContextProvider.tsx"




interface Props {
    id: number
    descricao: string
}
const data = {
	descricao: `produto 4`
}
const arrayNaoVazio: Props[] = [
	{
		id: 1,
		descricao: `produto 1`
	},
	{
		id: 2,
		descricao: `produto 2`
	},
	{
		id: 3,
		descricao: `produto 3`
	}
]
const arrayVazio: Props[] = []
const mock_cenarios = {
	cenario1: arrayNaoVazio,
	cenario2: arrayVazio,
	cenario3: undefined,
	cenario4: data
}

beforeAll(()=> {
	RemoteAccessClient.prepararModoTeste()
})
//TODO
describe.skip(`Tela: Tipo de Produto [caixa preta]`, () => {

	it(`Abrir tela com a listagem não vazia => Permanecer estável`, async () => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`tipo-pacote/`).reply(200, { data: mock_cenarios.cenario1 })
		const { result } = renderHook(() => useAuth())
		act(() => {
			// @ts-ignore
			result.current={ user: { id: 1, nome: `ADMIN` },
				toastSuccess: vi.fn(),
				toastError: vi.fn(),
			}
		})
		render(
			<MockedContextProvider contextValue={result.current}>
				<TipoProduto />
			</MockedContextProvider>
		)
		expect(await screen.findByText(`produto 1`)).toBeInTheDocument()

	})

	it(`Abrir tela com lista vazia => Permanecer estável`, async () => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`tipo-pacote/`).reply(200, { data: mock_cenarios.cenario2 })
		const { result } = renderHook(() => useAuth())
		act(() => {
			// @ts-ignore
			result.current={ user: { id: 1, nome: `ADMIN` },
				toastSuccess: vi.fn(),
				toastError: vi.fn(),
			}
		})
		render(
			<MockedContextProvider contextValue={result.current}>
				<TipoProduto />
			</MockedContextProvider>
		)
		expect(await screen.findByText(`Nenhum resultado encontrado`)).toBeInTheDocument()
	})
	it(`Abrir tela com lista undefined => Permanecer estável`, async () => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`tipo-pacote/`).reply(200, { data: mock_cenarios.cenario3 })
		const { result } = renderHook(() => useAuth())
		act(() => {
			// @ts-ignore
			result.current={ user: { id: 1, nome: `ADMIN` },
				toastSuccess: vi.fn(),
				toastError: vi.fn(),
			}
		})
		render(
			<MockedContextProvider contextValue={result.current}>
				<TipoProduto />
			</MockedContextProvider>
		)
		expect(await screen.findByText(`Nenhum resultado encontrado`)).toBeInTheDocument()
	})


	it(`Clicar no botão "Novo Tipo Produto" => Abrir o modal`, async () => {
		const { result } = renderHook(() => useAuth())
		act(() => {
			// @ts-ignore
			result.current={ user: { id: 1, nome: `ADMIN` },
				toastSuccess: vi.fn(),
				toastError: vi.fn(),
			}
		})
		render(
			<MockedContextProvider contextValue={result.current}>
				<TipoProduto />
			</MockedContextProvider>
		)
		const buttonElement = screen.getByText(`Novo Tipo de Produto`)
		fireEvent.click(buttonElement)
		const modal = screen.getByTestId(`modal-tipo-produto`)
		expect(modal).toBeInTheDocument()

	})
	afterEach(() => {
		RemoteAccessClient.limparCenariosDeTeste()
	})

	afterAll(() => {
		RemoteAccessClient.DesfazerModoTeste()
	})
})
describe.skip(`Tela: Tipo de Produto [caixa branca]`, () => {
	it(`Abrir tela => Visualizar label "Tipo de Produto"`, () => {
		const { result } = renderHook(() => useAuth())
		act(() => {
			// @ts-ignore
			result.current={ user: { id: 1, nome: `ADMIN` },
				toastSuccess: vi.fn(),
				toastError: vi.fn(),
			}
		})
		render(
			<MockedContextProvider contextValue={result.current}>
				<TipoProduto />
			</MockedContextProvider>
		)
		expect(screen.getByText(`Tipo de Produto`)).toBeInTheDocument()
	})
	it(`Abrir tela => Visualizar botão "Novo Tipo de Produto"`, () => {
		const { result } = renderHook(() => useAuth())
		act(() => {
			// @ts-ignore
			result.current={ user: { id: 1, nome: `ADMIN` },
				toastSuccess: vi.fn(),
				toastError: vi.fn(),
			}
		})
		render(
			<MockedContextProvider contextValue={result.current}>
				<TipoProduto />
			</MockedContextProvider>
		)
		expect(screen.getByText(`Tipo de Produto`)).toBeInTheDocument()
	})
	it.skip(`Abrir tela com a listagem não vazia => Permanecer estável e visualizar butão excluir `, async () => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`tipo-pacote/`).reply(200, { data: mock_cenarios.cenario1 })
		const { result } = renderHook(() => useAuth())
		act(() => {
			// @ts-ignore
			result.current={ user: { id: 1, nome: `ADMIN` },
				toastSuccess: vi.fn(),
				toastError: vi.fn(),
			}
		})
		render(
			<MockedContextProvider contextValue={result.current}>
				<TipoProduto />
			</MockedContextProvider>
		)
		await waitFor(() => {
			expect(screen.getAllByRole(`butao-excluir`)[0]).toBeInTheDocument()
		})
	})

	//TODO revisar
	it.skip(`Clicar no botão Remover da tabela => Chamar modal de confirmação`, async () => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`tipo-pacote/`).reply(200, { data: mock_cenarios.cenario1 })

		const { result } = renderHook(() => useAuth())
		act(() => {
			// @ts-ignore
			result.current={ user: { id: 1, nome: `ADMIN` },
				toastSuccess: vi.fn(),
				toastError: vi.fn(),
			}
		})
		render(
			<MockedContextProvider contextValue={result.current}>
				<TipoProduto />
			</MockedContextProvider>
		)
		await waitFor(() => {

			const removerItem = screen.queryAllByTestId(`butao-excluir`)[0]
			fireEvent.click(removerItem)
		})
		expect(screen.getByTestId(`modal-confirmar-exclusao`)).toBeInTheDocument()
	})


})

describe.skip(`UseTipoProduto [caixa branca]`, () => {
	it(`Verificar estado inicial => retornar valores iniciais dos useState `, () => {
		const { result } = renderHook(() => useTipoProduto())

		expect(result.current.visible).toEqual(false)
		expect(result.current.loading).toEqual(true)
		expect(result.current.visibleModalDelete).toEqual(false)
		expect(result.current.id).toEqual(0)
		expect(result.current.tipoProdutos).toEqual([])
	})
})
afterEach(() => {
	RemoteAccessClient.limparCenariosDeTeste()
})

afterAll(() => {
	RemoteAccessClient.DesfazerModoTeste()
})
