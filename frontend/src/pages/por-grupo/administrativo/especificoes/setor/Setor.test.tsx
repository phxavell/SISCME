import React from 'react'
import { fireEvent, render, renderHook, screen, waitFor } from '@testing-library/react'
import { Setor} from './index.tsx'
import RemoteAccessClient from '@infra/api/axios-s-managed.ts'
import { useAuth } from '@/provider/Auth'
import { act } from 'react-dom/test-utils'
import { vi } from 'vitest'
import MockedContextProvider from '@/provider/Auth/MockedContextProvider.tsx'

const arrayNaoVazio = {
	data: [
		{
			id: 2,
			descricao: `UTI ADULTO CARDIO`
		}
	],
	meta: {
		currentPage: 1,
		totalItems: 1,
		firstItem: 1,
		lastItem: 1,
		itemsPerPage: 1,
		totalPages: 1,
		next: null,
		previous: null
	}
}
const arrayVazio: any = {
	data: [	],
	meta: {
		currentPage: 1,
		totalItems: 1,
		firstItem: 0,
		lastItem: 0,
		itemsPerPage: 0,
		totalPages: 0,
		next: null,
		previous: null
	}
}
const arrayUndefined: any = {
	data: undefined,
	meta: {
		currentPage: 1,
		totalItems: 1,
		firstItem: 0,
		lastItem: 0,
		itemsPerPage: 0,
		totalPages: 0,
		next: null,
		previous: null
	}
}
const mock_cenarios = {
	cenario1: arrayVazio,
	cenario2: arrayUndefined,
	cenario3: arrayNaoVazio,
	// cenario4: arrayColetaVazia,
	// cenario5: arrayProfissionalEDataUndefined
}
describe(`Setor [caixa preta]`, () => {
	it(`Abrir tela com listagem vazia => permanecer estável`, async () => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`setores/`).reply(200, mock_cenarios.cenario1)

		render(<Setor />)

		await waitFor(() => {
			expect(screen.getByText(`Nenhum resultado encontrado`)).toBeInTheDocument()
		})


	})
	it(`Abrir tela com objeto e array undefined => Permanecer estável`, async () => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`setores/`).reply(200, mock_cenarios.cenario2)

		render(<Setor />)
		await waitFor(() => {
			expect(screen.getByText(`Nenhum resultado encontrado`)).toBeInTheDocument()
		})

	})
	it(`Abrir tela com objeto e array não vazio => Permanecer estável`, async () => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`setores/`).reply(200, mock_cenarios.cenario3)

		render(<Setor />)
		await waitFor(() => {
			expect(screen.getByText(`UTI ADULTO CARDIO`)).toBeInTheDocument()
		})

	})
	afterEach(() => {
		RemoteAccessClient.limparCenariosDeTeste()
	})

	afterAll(() => {
		RemoteAccessClient.DesfazerModoTeste()
	})
})
describe(`Setor [caixa branca]`, () => {
	it(`Abrir tela com listagem não vazia, ao clicar no botão Novo Setor abrir modal. `, async() => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`setores/`).reply(200, mock_cenarios.cenario3)

		render(<Setor />)
		await waitFor(() => {
			expect(screen.getByText(`UTI ADULTO CARDIO`)).toBeInTheDocument()
		})
		const botaoNovoSetor = screen.getByRole(`button`, {name: /Novo Setor/i})
		fireEvent.click(botaoNovoSetor)

		await waitFor(() => {
			expect(screen.getByTestId(`modal-setor` )).toBeDefined()
		})

	})
	it(`Abrir tela com listagem não vazia, ao clicar no botão visualizar modal abrir modal com a lista`, async() => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`setores/`).reply(200, mock_cenarios.cenario3)

		render(<Setor />)

		await waitFor(() => {
			const botaoModalVisualizarLista = screen.getByTestId(`botao-visualizar`)
			fireEvent.click(botaoModalVisualizarLista)
		})
		expect(screen.getAllByText(`UTI ADULTO CARDIO`)[1]).toBeInTheDocument()

	})
	it(`Abrir tela com listagem não vazia, ao clicar no botão editar modal abrir modal`, async() => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`setores/`).reply(200, mock_cenarios.cenario3)

		render(<Setor />)

		await waitFor(() => {
			const botaoModalEditar = screen.getByTestId(`botao-editar`)
			fireEvent.click(botaoModalEditar)
		})
		expect(screen.getByTestId(`edicao-setor`)).toBeInTheDocument()

	})
	it(`Abrir tela com listagem não vazia, ao clicar no botão excluir modal abrir modal`, async() => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`setores/`).reply(200, mock_cenarios.cenario3)

		render(<Setor />)

		await waitFor(() => {
			const botaoModalExcluir = screen.getByTestId(`botao-excluir`)
			fireEvent.click(botaoModalExcluir)
		})
		expect(screen.getByRole(`button`, {name: /Não/i})).toBeInTheDocument()

	})
	afterEach(() => {
		RemoteAccessClient.limparCenariosDeTeste()
	})

	afterAll(() => {
		RemoteAccessClient.DesfazerModoTeste()
	})
})
describe(`Setor => Modal excluir [caixa branca]`, () => {
	it(`Fechar modal ao clicar no botão close`, async() => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`setores/`).reply(200, mock_cenarios.cenario3)

		render(<Setor />)

		await waitFor(() => {
			const botaoAbrirModalExcluir = screen.getByTestId(`botao-excluir`)
			fireEvent.click(botaoAbrirModalExcluir)
		})

		await waitFor(() => {
			const botaoModalFechar = screen.getAllByRole(`button`, {name: /Close/i})
			fireEvent.click(botaoModalFechar[0])
		})

		await waitFor(() => {
			expect(screen.queryByRole(`button`, {name: /Não/i})).not.toBeInTheDocument()
		})

	})
	it(`Fechar modal ao clicar no botão não`, async() => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`setores/`).reply(200, mock_cenarios.cenario3)

		render(<Setor />)

		await waitFor(() => {
			const botaoAbrirModalExcluir = screen.getByTestId(`botao-excluir`)
			fireEvent.click(botaoAbrirModalExcluir)
		})

		const botaoModalNao = screen.getByRole(`button`, {name: /Não/i})
		fireEvent.click(botaoModalNao)

		await waitFor(() => {
			expect(screen.queryByRole(`button`, {name: /Não/i})).not.toBeInTheDocument()
		})

	})
	it(`Excluir item e Fechar modal ao clicar no confirmar [Sim] `, async() => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`setores/`).reply(200, mock_cenarios.cenario3)
		mock.onDelete(`/setores/${mock_cenarios.cenario3.data[0].id}/`).reply(204)
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
				<Setor />
			</MockedContextProvider>
		)

		await waitFor(() => {
			const botaoAbrirModalExcluir = screen.getByTestId(`botao-excluir`)
			fireEvent.click(botaoAbrirModalExcluir)
		})
		await waitFor(() => {
			const botaoConfirmarExclusao = screen.getByRole(`button`, {name: /Sim/i})
			fireEvent.click(botaoConfirmarExclusao)
		})


	})

	afterEach(() => {
		RemoteAccessClient.limparCenariosDeTeste()
	})
	afterAll(() => {
		RemoteAccessClient.DesfazerModoTeste()
	})
})
