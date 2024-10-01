import React from 'react'
import { fireEvent, render, renderHook, screen, waitFor, act } from '@testing-library/react'
import { SubTipoProduto} from '.'
import RemoteAccessClient from '@/infra/api/axios-s-managed'
import { useSubTipoProdutoModal } from './useSubTipoProdutoModal'
import { useAuth } from '@/provider/Auth'

import { vi } from 'vitest'
import MockedContextProvider from '@/provider/Auth/MockedContextProvider.tsx'

const arrayNaoVazio = {
	data: [
		{
			id: 1,
			descricao: `Termodesinfectado`,
			criado_por: {
				id: 1,
				username: `administrador`,
				nome: `Mestre dos Magos`
			},
			atualizado_por: {
				id: 1,
				username: `administrador`,
				nome: `Mestre dos Magos`
			},
			criado_em: `2023-11-23T16:19:44.243988-04:00`,
			atualizado_em: `2023-11-23T16:19:44.243988-04:00`,
			dtcadastro: `2023-11-23T16:19:44.243839-04:00`,
			situacao: true
		},
		{
			id: 2,
			descricao: `Esterilizado`,
			criado_por: {
				id: 1,
				username: `administrador`,
				nome: `Mestre dos Magos`
			},
			atualizado_por: {
				id: 1,
				username: `administrador`,
				nome: `Mestre dos Magos`
			},
			criado_em: `2023-11-23T16:19:40.556766-04:00`,
			atualizado_em: `2023-11-23T16:19:40.556766-04:00`,
			dtcadastro: `2023-11-23T16:19:40.556621-04:00`,
			situacao: true
		},
		{
			id: 3,
			descricao: `Teste 2`,
			criado_por: {
				id: 1,
				username: `ADMIN`,
				nome: `Mestre dos Magos`
			},
			atualizado_por: {
				id: 1,
				username: `ADMIN`,
				nome: `Mestre dos Magos`
			},
			criado_em: `2023-12-14T15:30:14.908745-04:00`,
			atualizado_em: `2023-12-14T15:30:14.908745-04:00`,
			dtcadastro: `2023-12-14T15:30:14.908588-04:00`,
			situacao: true
		},
		{
			id: 4,
			descricao: `Test 4`,
			criado_por: {
				id: 1,
				username: `ADMIN`,
				nome: `Mestre dos Magos`
			},
			atualizado_por: {
				id: 1,
				username: `ADMIN`,
				nome: `Mestre dos Magos`
			},
			criado_em: `2023-12-14T15:30:21.474719-04:00`,
			atualizado_em: `2023-12-14T15:30:21.474719-04:00`,
			dtcadastro: `2023-12-14T15:30:21.474573-04:00`,
			situacao: true
		},
		{
			id: 5,
			descricao: `Test 5`,
			criado_por: {
				id: 1,
				username: `ADMIN`,
				nome: `Mestre dos Magos`
			},
			atualizado_por: {
				id: 1,
				username: `ADMIN`,
				nome: `Mestre dos Magos`
			},
			criado_em: `2023-12-14T15:30:27.851849-04:00`,
			atualizado_em: `2023-12-14T15:30:27.851849-04:00`,
			dtcadastro: `2023-12-14T15:30:27.851712-04:00`,
			situacao: true
		},
		{
			id: 6,
			descricao: `Test6`,
			criado_por: {
				id: 1,
				username: `ADMIN`,
				nome: `Mestre dos Magos`
			},
			atualizado_por: {
				id: 1,
				username: `ADMIN`,
				nome: `Mestre dos Magos`
			},
			criado_em: `2023-12-14T15:30:34.953567-04:00`,
			atualizado_em: `2023-12-14T15:30:34.953567-04:00`,
			dtcadastro: `2023-12-14T15:30:34.953482-04:00`,
			situacao: true
		},
		{
			id: 7,
			descricao: `Test 8`,
			criado_por: {
				id: 1,
				username: `ADMIN`,
				nome: `Mestre dos Magos`
			},
			atualizado_por: {
				id: 1,
				username: `ADMIN`,
				nome: `Mestre dos Magos`
			},
			criado_em: `2023-12-14T15:30:40.180143-04:00`,
			atualizado_em: `2023-12-14T15:30:40.180143-04:00`,
			dtcadastro: `2023-12-14T15:30:40.179991-04:00`,
			situacao: true
		},
		{
			id: 8,
			descricao: `Test 9`,
			criado_por: {
				id: 1,
				username: `ADMIN`,
				nome: `Mestre dos Magos`
			},
			atualizado_por: {
				id: 1,
				username: `ADMIN`,
				nome: `Mestre dos Magos`
			},
			criado_em: `2023-12-14T15:30:46.517446-04:00`,
			atualizado_em: `2023-12-14T15:30:46.517446-04:00`,
			dtcadastro: `2023-12-14T15:30:46.517336-04:00`,
			situacao: true
		},
		{
			id: 9,
			descricao: `Test 10`,
			criado_por: {
				id: 1,
				username: `ADMIN`,
				nome: `Mestre dos Magos`
			},
			atualizado_por: {
				id: 1,
				username: `ADMIN`,
				nome: `Mestre dos Magos`
			},
			criado_em: `2023-12-14T15:30:57.246026-04:00`,
			atualizado_em: `2023-12-14T15:30:57.246026-04:00`,
			dtcadastro: `2023-12-14T15:30:57.245723-04:00`,
			situacao: true
		},
		{
			id: 10,
			descricao: `Test 11`,
			criado_por: {
				id: 1,
				username: `ADMIN`,
				nome: `Mestre dos Magos`
			},
			atualizado_por: {
				id: 1,
				username: `ADMIN`,
				nome: `Mestre dos Magos`
			},
			criado_em: `2023-12-14T15:31:18.769881-04:00`,
			atualizado_em: `2023-12-14T15:31:18.769881-04:00`,
			dtcadastro: `2023-12-14T15:31:18.769767-04:00`,
			situacao: true
		},
		{
			id: 11,
			descricao: `Test 12`,
			criado_por: {
				id: 1,
				username: `ADMIN`,
				nome: `Mestre dos Magos`
			},
			atualizado_por: {
				id: 1,
				username: `ADMIN`,
				nome: `Mestre dos Magos`
			},
			"criado_em": `2023-12-14T15:31:30.709614-04:00`,
			"atualizado_em": `2023-12-14T15:31:30.709614-04:00`,
			"dtcadastro": `2023-12-14T15:31:30.709491-04:00`,
			"situacao": true
		}
	],
	meta: {
		currentPage: 1,
		totalItems: 11,
		firstItem: 1,
		lastItem: 10,
		itemsPerPage: 10,
		totalPages: 2,
		next: `http://localhost:8000/api/subtipoproduto/?page=2`,
		previous: null
	}

}
const arrayVazio: any = {
	data: [	],
	meta: {
		currentPage: 1,
		totalItems: 79,
		firstItem: 1,
		lastItem: 10,
		itemsPerPage: 10,
		totalPages: 8,
		next: null,
		previous: null
	}
}
const arrayUndefined: any = {
	data: undefined,
	meta: {
		currentPage: 1,
		totalItems: 1,
		firstItem: 1,
		lastItem: 1,
		itemsPerPage: 1,
		totalPages: 8,
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
const renderComponent = () => {
	const { result} = renderHook(() => useAuth())

	act(() => {

		    result.current={
			// @ts-ignore
			user: { id: 2, nome: `ADMIN` },
			toastSuccess: vi.fn(),
			toastError: vi.fn(),
		}

	})

	render(
		<MockedContextProvider contextValue={result.current}>
			<SubTipoProduto />
		</MockedContextProvider>
	)
}

describe(`SubTipoProduto [caixa preta]`, () => {
	it(`Abrir tela com listagem vazia => permanecer estável`, async () => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter

		mock.onGet(`subtipoproduto/`).reply(200, mock_cenarios.cenario1)

		renderComponent()

		await waitFor(() => {
			expect(screen.getByText(`Nenhum resultado encontrado`)).toBeInTheDocument()
		})


	})
	it(`Abrir tela com objeto e array undefined => Permanecer estável`, async () => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`subtipoproduto/`).reply(200, mock_cenarios.cenario2)

		renderComponent()
		await waitFor(() => {
			expect(screen.getByText(`Nenhum resultado encontrado`)).toBeInTheDocument()
		})

	})
	it(`Abrir tela com objeto e array não vazio => Permanecer estável`, async () => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`subtipoproduto/`).reply(200, mock_cenarios.cenario3)

		renderComponent()
		await waitFor(() => {
			expect(screen.getByText(`Termodesinfectado`)).toBeInTheDocument()
		})

	})

})
describe(`SubTipoProduto [caixa branca]`, () => {
	it(`Abrir tela com listagem não vazia, ao clicar no botão Novo Subtipo de Produto abrir modal. `, async() => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`subtipoproduto/`).reply(200, mock_cenarios.cenario3)

		renderComponent()
		await waitFor(() => {
			expect(screen.getByText(`Termodesinfectado`)).toBeInTheDocument()
		})
		const botaoNovoSubtipoProduto = screen.getByRole(`button`, {name: /Novo Subtipo de Produto/i})
		fireEvent.click(botaoNovoSubtipoProduto)

		await waitFor(() => {
			expect(screen.getByTestId(`modal-subtipo-produto` )).toBeDefined()
		})

	})
	it(`Abrir tela com listagem não vazia, ao clicar no botão visualizar modal abrir modal com a lista`, async() => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`subtipoproduto/`).reply(200, mock_cenarios.cenario3)

		renderComponent()

		await waitFor(() => {
			const botaoModalVisualizarLista = screen.getAllByTestId(`botao-visualizar-sub-tipo`)[0]
			fireEvent.click(botaoModalVisualizarLista)
		})
		expect(screen.getAllByText(`Termodesinfectado`)[0]).toBeInTheDocument()

	})
	it(`Abrir tela com listagem não vazia, ao clicar no botão visualizar modal abrir modal com a lista logo apos fechar`, async() => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`subtipoproduto/`).reply(200, mock_cenarios.cenario3)

		renderComponent()

		await waitFor(() => {
			const botaoModalVisualizarLista = screen.getAllByTestId(`botao-visualizar-sub-tipo`)[0]
			fireEvent.click(botaoModalVisualizarLista)
		})
		const botaoFecharModalVisualizar = screen.getByRole(`button`, {name: /close/i})
		fireEvent.click(botaoFecharModalVisualizar)
		expect(screen.getAllByText(`Termodesinfectado`)[0]).toBeInTheDocument()

	})
	it(`Abrir tela com listagem não vazia, ao clicar no botão editar modal abrir modal logo depois fechar modal`, async() => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`subtipoproduto/`).reply(200, mock_cenarios.cenario3)

		renderComponent()

		await waitFor(() => {
			const botaoModalEditar = screen.getAllByTestId(`botao-editar`)[0]
			fireEvent.click(botaoModalEditar)
		})
		await waitFor(() => {
			const botaoFecharModalEditar= screen.getByRole(`button`, {name: /close/i})
			fireEvent.click(botaoFecharModalEditar)
		}, {timeout: 3000})

		await waitFor(() => {
			expect(screen.queryByTestId(`edicao-sub-tipo-produto`)).toBeNull()
		})
	})
	it(`Abrir tela com listagem não vazia, ao clicar no botão excluir modal abrir modal`, async() => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`subtipoproduto/`).reply(200, mock_cenarios.cenario3)

		renderComponent()

		await waitFor(() => {
			const botaoModalExcluir = screen.getAllByTestId(`botao-excluir`)[0]
			fireEvent.click(botaoModalExcluir)
		})
		expect(screen.getByRole(`button`, {name: /Não/i})).toBeInTheDocument()

	})

})
describe(`SubTipoProduto => Modal excluir [caixa branca]`, () => {
	it(`Fechar modal ao clicar no botão close`, async() => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`/subtipoproduto/`).reply(200, mock_cenarios.cenario3)

		renderComponent()

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
		mock.onGet(`subtipoproduto/`).reply(200, mock_cenarios.cenario3)

		renderComponent()

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
	//TODO revisar
	it(`Excluir item e Fechar modal ao clicar no confirmar [Sim, tenho certeza] `, async() => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`subtipoproduto/`).reply(200, mock_cenarios.cenario3)
		mock.onDelete(`subtipoproduto/${mock_cenarios.cenario3.data[0].id}/`).reply(204)

		const { result} = renderHook(() => useAuth())

	    act(() => {
			// @ts-ignore
			result.current={ user: { id: 1, nome: `ADMIN` },
				toastSuccess: vi.fn(),
				toastError: vi.fn(),
			}
		})

		const { result:RenderSubtipo } = renderHook(() => useSubTipoProdutoModal())

		act(() => {
			// @ts-ignore
			RenderSubtipo.current={ user: { id: 1, nome: `ADMIN` },
				toastSuccess: vi.fn(),
				toastError: vi.fn(),
			}
		})

		render(
			<MockedContextProvider contextValue={result.current}>
				<SubTipoProduto />
			</MockedContextProvider>
		)
		await waitFor(() => {
			const botaoAbrirModalExcluir = screen.getAllByTestId(`botao-excluir`)[0]
			fireEvent.click(botaoAbrirModalExcluir)
		})

		const botaoConfirmarExclusao = screen.getByRole(`button`, {name: /Sim/i})
		fireEvent.click(botaoConfirmarExclusao)

		await waitFor(() => {
			expect(result.current.toastSuccess).toHaveBeenCalled()
		})

	})
	it.skip(`Excluir item com ID undefined chamar o toastError`, async() => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`subtipoproduto/`).reply(200, mock_cenarios.cenario3)
		mock.onDelete(`subtipoproduto/${undefined}/`).reply(204)

		const { result} = renderHook(() => useAuth())

	    act(() => {
			// @ts-ignore
			result.current={ user: { id: 1, nome: `ADMIN` },
				toastSuccess: vi.fn(),
				toastError: vi.fn(),
			}
		})

		const { result:RenderSubtipo } = renderHook(() => useSubTipoProdutoModal())

		act(() => {
			// @ts-ignore
			RenderSubtipo.current={ user: { id: 1, nome: `ADMIN` },
				toastSuccess: vi.fn(),
				toastError: vi.fn(),
			}
		})

		render(
			<MockedContextProvider contextValue={result.current}>
				<SubTipoProduto />
			</MockedContextProvider>
		)
		await waitFor(() => {
			const botaoAbrirModalExcluir = screen.getAllByTestId(`botao-excluir`)[0]
			fireEvent.click(botaoAbrirModalExcluir)
		})

		const botaoConfirmarExclusao = screen.getByRole(`button`, {name: /Sim, tenho certeza/i})
		fireEvent.click(botaoConfirmarExclusao)

		await waitFor(() => {
			expect(result.current.toastError).toHaveBeenCalled()
		})

	})
})
describe(`useSubTipoProdutoModal [caixa branca]`, () => {
	it(`Verificar estado inicial => retornar valores iniciais dos useState `, () => {
		const { result } = renderHook(() => useSubTipoProdutoModal())

		expect(result.current.first).toEqual(0)
		expect(result.current.loading).toEqual(true)
		expect(result.current.visibleModalDelete).toEqual(false)
		expect(result.current.visible).toEqual(false)
		expect(result.current.visibleModalEditar).toEqual(false)
		expect(result.current.visibleModalPreview).toEqual(false)
	})
	it(`Verificar função handleListSubTipoProdutos, => fazer chamada com url errada `, async() => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`subtipoprodutos/`).reply(200, mock_cenarios.cenario3)

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
				<SubTipoProduto />
			</MockedContextProvider>
		)

		// await waitFor(() => {
		// 	expect(result.current.toastError).toHaveBeenCalled()
		// })
	})

})
