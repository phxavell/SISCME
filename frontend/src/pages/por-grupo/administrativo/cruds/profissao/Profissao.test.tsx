import React from 'react'
import { fireEvent, render, renderHook, screen, waitFor } from '@testing-library/react'
import { Profissao} from '.'
import RemoteAccessClient from '@/infra/api/axios-s-managed'
import { useProfissao } from './useProfissao'
import { useAuth } from '@/provider/Auth'
import { act } from 'react-dom/test-utils'
import { vi } from 'vitest'
import MockedContextProvider from '@/provider/Auth/MockedContextProvider.tsx'

const arrayNaoVazio = {
	data: [
		{
			id: 1,
			criado_por: null,
			criado_em: `2023-11-27T09:28:31.379714-04:00`,
			atualizado_por: null,
			atualizado_em: `2023-11-27T09:28:31.379714-04:00`,
			descricao: `ANALISTA DE SISTEMAS`
		},
		{
			id: 2,
			criado_por: null,
			criado_em: `2023-11-27T09:28:31.391072-04:00`,
			atualizado_por: null,
			atualizado_em: `2023-11-27T09:28:31.391072-04:00`,
			descricao: `TECNICO ENFERMAGEM`
		}
	],
	meta: {
		currentPage: 1,
		totalItems: 4,
		firstItem: 1,
		lastItem: 4,
		itemsPerPage: 4,
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
			<Profissao />
		</MockedContextProvider>
	)

}

describe(`Profissao [caixa preta]`, () => {
	it(`Abrir tela com listagem vazia => permanecer estável`, async () => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`profissoes/`).reply(200, mock_cenarios.cenario1)

		renderComponente()

		await waitFor(() => {
			expect(screen.getByText(`Nenhum resultado encontrado`)).toBeInTheDocument()
		})


	})
	it(`Abrir tela com objeto e array undefined => Permanecer estável`, async () => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`profissoes/`).reply(200, mock_cenarios.cenario2)

		renderComponente()
		await waitFor(() => {
			expect(screen.getByText(`Nenhum resultado encontrado`)).toBeInTheDocument()
		})

	})
	it(`Abrir tela com objeto e array não vazio => Permanecer estável`, async () => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`profissoes/`).reply(200, mock_cenarios.cenario3)

		renderComponente()
		await waitFor(() => {
			expect(screen.getByText(`ANALISTA DE SISTEMAS`)).toBeInTheDocument()
		})

	})
	afterEach(() => {
		RemoteAccessClient.limparCenariosDeTeste()
	})

	afterAll(() => {
		RemoteAccessClient.DesfazerModoTeste()
	})
})

describe(`Profissao [caixa branca]`, () => {
	it(`Abrir tela com listagem não vazia, ao clicar no botão Nova Profissão abrir modal. `, async() => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`profissoes/`).reply(200, mock_cenarios.cenario3)

		renderComponente()
		await waitFor(() => {
			expect(screen.getByText(`ANALISTA DE SISTEMAS`)).toBeInTheDocument()
		})

		const botaoNovoProfissao = screen.getByRole(`button`, {name: /Nova Profissão/i})
		fireEvent.click(botaoNovoProfissao)

		await waitFor(() => {
			expect(screen.getByTestId(`modal-profissao` )).toBeDefined()
		})

	})
	it(`Abrir tela com listagem não vazia, ao clicar no botão visualizar modal abrir modal com a lista`, async() => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`profissoes/`).reply(200, mock_cenarios.cenario3)

		renderComponente()
		await waitFor(() => {
			expect(screen.getByText(`ANALISTA DE SISTEMAS`)).toBeInTheDocument()
		})

		const botaoModalVisualizarLista = screen.getAllByTestId(`botao-visualizar-profissao`)[0]

		fireEvent.click(botaoModalVisualizarLista)
		expect(screen.getAllByText(`ANALISTA DE SISTEMAS`)[0]).toBeInTheDocument()

	})
	it(`Abrir tela com listagem não vazia, ao clicar no botão editar modal abrir modal`, async() => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`profissoes/`).reply(200, mock_cenarios.cenario3)

		renderComponente()
		await waitFor(() => {
			expect(screen.getByText(`ANALISTA DE SISTEMAS`)).toBeInTheDocument()
		})

		const botaoModalEditar = screen.getAllByTestId(`botao-editar-profissao`)[0]
		fireEvent.click(botaoModalEditar)

		expect(screen.getByText(`Editar Profissão`)).toBeInTheDocument()

	})
	it(`Abrir tela com listagem não vazia, ao clicar no botão excluir modal abrir modal`, async() => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`profissoes/`).reply(200, mock_cenarios.cenario3)

		renderComponente()
		await waitFor(() => {
			expect(screen.getByText(`ANALISTA DE SISTEMAS`)).toBeInTheDocument()
		})

		const botaoModalExcluir = screen.getAllByTestId(`botao-excluir`)[0]
		fireEvent.click(botaoModalExcluir)

		expect(screen.getByRole(`button`, {name: /Não/i})).toBeInTheDocument()

	})
	afterEach(() => {
		RemoteAccessClient.limparCenariosDeTeste()
	})

	afterAll(() => {
		RemoteAccessClient.DesfazerModoTeste()
	})
})
describe(`Profissao => Modal excluir [caixa branca]`, () => {
	it(`Fechar modal ao clicar no botão close`, async() => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`profissoes/`).reply(200, mock_cenarios.cenario3)

		renderComponente()

		await waitFor(() => {
			const botaoAbrirModalExcluir = screen.getAllByTestId(`botao-excluir`)[0]
			fireEvent.click(botaoAbrirModalExcluir)
		})

		const botaoModalFechar = screen.getByRole(`button`, {name: /Close/i})
		fireEvent.click(botaoModalFechar)

		await waitFor(() => {
			expect(screen.queryByRole(`button`, {name: /Não/i})).not.toBeInTheDocument()
		})

	})
	it(`Fechar modal ao clicar no botão não`, async() => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`profissoes/`).reply(200, mock_cenarios.cenario3)

		renderComponente()

		await waitFor(() => {
			const botaoAbrirModalExcluir = screen.getAllByTestId(`botao-excluir`)[0]
			fireEvent.click(botaoAbrirModalExcluir)
		})

		const botaoModalNao = screen.getByRole(`button`, {name: /Não/i})
		fireEvent.click(botaoModalNao)

		await waitFor(() => {
			expect(screen.queryByRole(`button`, {name: /Não/i})).not.toBeInTheDocument()
		})

	})
	it(`Excluir item e Fechar modal ao clicar no confirmar [Sim, tenho certeza] `, async() => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`profissoes/`).reply(200, mock_cenarios.cenario3)
		mock.onDelete(`profissoes/${mock_cenarios.cenario3.data[0].id}/`).reply(204)
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
				<Profissao />
			</MockedContextProvider>
		)
		await waitFor(() => {
			const botaoAbrirModalExcluir = screen.getAllByTestId(`botao-excluir`)[0]
			fireEvent.click(botaoAbrirModalExcluir)
		})

		await waitFor(() => {
			const botaoConfirmarExclusao = screen.getByRole(`button`, {name: /Sim/i})
			fireEvent.click(botaoConfirmarExclusao)

		})
		await waitFor(() => {
			expect(result.current.toastSuccess).toHaveBeenCalled()
		})
	})

	afterEach(() => {
		RemoteAccessClient.limparCenariosDeTeste()
	})
	afterAll(() => {
		RemoteAccessClient.DesfazerModoTeste()
	})
})
describe(`useProfissao [caixa branca]`, () => {
	it(`Verificar estado inicial => retornar valores iniciais dos useState `, () => {
		const { result } = renderHook(() => useProfissao())

		expect(result.current.first).toEqual(0)
		expect(result.current.loading).toEqual(true)
		expect(result.current.visibleModalDelete).toEqual(false)
		expect(result.current.visibleModalCreate).toEqual(false)
		expect(result.current.visibleModalEditar).toEqual(false)
		expect(result.current.visibleModalPreview).toEqual(false)
	})

	afterEach(() => {
		RemoteAccessClient.limparCenariosDeTeste()
	})

	afterAll(() => {
		RemoteAccessClient.DesfazerModoTeste()
	})
})
