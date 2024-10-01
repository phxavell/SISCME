import { render, renderHook, screen, waitFor, act } from '@testing-library/react'
import { Distribuicao } from '.'
import RemoteAccessClient from '@/infra/api/axios-s-managed'
import { useDistribuicao } from './useDistribuicao'
import { useAuth } from '@/provider/Auth'
import MockedContextProvider from '@/provider/Auth/MockedContextProvider.tsx'
import { vi } from 'vitest'

const arrayNaoVazio = {
	data: [
		{
			id: 5,
			nome: `HPS 28 DE AGOSTO`,
			estoque_de_caixas: [
				{
					modelo: `CXPC-HIP`,
					idcaixa: 2,
					nome: `CAIXA DE PEQUENA CIRURGIA`,
					estoque: 1
				},
				{
					modelo: `CXOT-HIP`,
					idcaixa: 7,
					nome: `CAIXA OTORRINO`,
					estoque: 2
				},
			]
		},
	],
	meta: {
		currentPage: 1,
		totalItems: 1,
		itemsPerPage: 10,
		totalPages: 1,
		next: null,
		previous: null
	}
}


const arrayEstoqueVazio = {
	data: [
		{
			"cliente_id": 1,
			"nome": `HPS 28 DE AGOSTO`,
			"estoque": {
				"total_disponivel": 113,
				"total_critico": 112,
				"caixas_criticas": []
			}
		},
	],
	meta: {
		currentPage: 1,
		totalItems: 1,
		itemsPerPage: 10,
		totalPages: 1,
		next: null,
		previous: null
	}
}


const arrayVazio: any = []

const mock_cenarios = {
	cenario1: arrayNaoVazio,
	cenario2: arrayVazio,
	cenario3: undefined,
	cenario4: arrayEstoqueVazio,
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
			<Distribuicao />
		</MockedContextProvider>
	)

}

describe(`Distribuicao [caixa preta]`, () => {
	it(`Abrir tela com a listagem não vazia => Permanecer estável`, async () => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`processo/distribuicao/estoque-clientes`).reply(200,mock_cenarios.cenario1)
		renderComponente()
		await waitFor(() => {
			expect(screen.getByText(`HPS 28 DE AGOSTO`)).toBeInTheDocument()
		})
	})

	it(`Abrir tela com a listagem vazia => Permanecer estável`, async () => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`processo/distribuicao/estoque-clientes`).reply(200, mock_cenarios.cenario2)
		renderComponente()
	})

	it(`Abrir tela com a listagem retornando undefined => Permanecer estável`, async () => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`processo/distribuicao/estoque-clientes`).reply(200, mock_cenarios.cenario3)
		renderComponente()
	})

	it(`Abrir tela com a listagem retornando coleta como undefined => Permanecer estável`, async () => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`processo/distribuicao/estoque-clientes`).reply(200, mock_cenarios.cenario4)
		renderComponente()
	})
})

describe(`Distribuicao [caixa branca]`, () => {
	it(`Renderiza o componente Distribuicao corretamente`, () => {
		renderComponente()

		const titulo = screen.getByText(`Distribuição`)

		expect(titulo).toBeInTheDocument()
	})

	it(`Abrir tela com a listagem não vazia e retornar os dados vindos da api`, async () => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`processo/distribuicao/estoque-clientes`).reply(200, mock_cenarios.cenario1)
		renderComponente()
		await waitFor(() => {
			expect(screen.getByText(`HPS 28 DE AGOSTO`)).toBeInTheDocument()
		})

	})

	it(`Abrir tela com a listagem vazia e retornar a mensagem esperada`, async () => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`processo/distribuicao/estoque-clientes`).reply(200, mock_cenarios.cenario2)
		renderComponente()
		await waitFor(() => {
			expect(screen.getByText(`Nenhum resultado encontrado`)).toBeInTheDocument()
		})
	})

	it.skip(`Abrir tela com a listagem de estoque vazia e retornar a mensagem esperada`, async () => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`processo/distribuicao/estoque-clientes`).reply(200, mock_cenarios.cenario4)
		renderComponente()
		await waitFor(() => {
			expect(screen.getByText(`HPS 28 DE AGOSTO`)).toBeInTheDocument()
		})

		expect(screen.getByText(`Nenhum resultado encontrado`)).toBeInTheDocument()

	})
})

describe(`useDistribuicao [caixa branca]`, () => {
	it(`Verificar estado inicial => retornar valores iniciais dos useState `, () => {
		const { result } = renderHook(() => useDistribuicao())

		expect(result.current.visible).toEqual(false)
		// expect(result.current.loading).toEqual(true)
		expect(result.current.serial).toEqual(``)
		expect(result.current.dateInitial).toEqual(null)
		expect(result.current.dateFinal).toEqual(null)
		// expect(result.current.paginaAtual).toEqual(0)
		expect(result.current.cliente).toEqual(``)
		expect(result.current.clienteSelecionado).toEqual(undefined)
		expect(result.current.visibleModalSequenciais).toEqual(false)
	})

	afterEach(() => {
		RemoteAccessClient.limparCenariosDeTeste()
	})

	afterAll(() => {
		RemoteAccessClient.DesfazerModoTeste()
	})
})
