import {render, renderHook, screen, waitFor} from '@testing-library/react'
import { Product } from './index.tsx'
import RemoteAccessClient from '@infra/api/axios-s-managed.ts'
import { vi } from 'vitest'
import { act } from 'react-dom/test-utils'
import { useAuth } from '@/provider/Auth'
import MockedContextProvider from '@/provider/Auth/MockedContextProvider.tsx'

const arrayNaoVazio = {
	data: [
		{
			id: 1,
			descricao: `AFASTADOR ADSON ARTICULADO 3 X 4 GARRAS 31 CM`,
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
			criado_em: `30/11/2023 11:16:18`,
			atualizado_em: `30/11/2023 17:17:17`,
			embalagem: `G`,
			situacao: false,
			foto: null,
			status: `1`,
			idsubtipoproduto: {
				id: 1,
				descricao: `ESTERILIZADO`
			},
			idtipopacote: {
				id: 3,
				descricao: `ROUPARIA`
			}
		},
	]
}

const arrayVazio: any = {
	data: []
}

const mock_cenarios = {
	cenario1: arrayNaoVazio,
	cenario2: arrayVazio,
	cenario3: {data: undefined},
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
			<Product />
		</MockedContextProvider>
	)

}

describe(`Produto [caixa preta]`, () => {
	it(`Abrir tela com a listagem não vazia => Permanecer estável`, async () => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`produtos`).reply(200, mock_cenarios.cenario1)
		mock.onGet(`subtipoproduto/`).reply(200, mock_cenarios.cenario2)
		mock.onGet(`tipo-pacote/`).reply(200, mock_cenarios.cenario2)
		renderComponente()
		await waitFor(() => {
			expect(screen.getByText(`G`)).toBeInTheDocument()
		})
	})

	it(`Abrir tela com a listagem vazia => Permanecer estável`, async () => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`produtos`).reply(200, mock_cenarios.cenario2)
		mock.onGet(`subtipoproduto/`).reply(200, mock_cenarios.cenario2)
		mock.onGet(`tipo-pacote/`).reply(200, mock_cenarios.cenario2)
		renderComponente()
		await waitFor(() => {
			expect(screen.getByText(`Nenhum produto cadastrado`)).toBeInTheDocument()
		})
	})

	it(`Abrir tela com a listagem vazia => Permanecer estável`, async () => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`produtos`).reply(200, mock_cenarios.cenario3)
		mock.onGet(`subtipoproduto/`).reply(200, mock_cenarios.cenario2)
		mock.onGet(`tipo-pacote/`).reply(200, mock_cenarios.cenario2)
		renderComponente()
		await waitFor(() => {
			expect(screen.getByText(`Nenhum produto cadastrado`)).toBeInTheDocument()
		})
	})

	afterEach(() => {
		RemoteAccessClient.limparCenariosDeTeste()
	})

	afterAll(() => {
		RemoteAccessClient.DesfazerModoTeste()
	})
})

describe(`Produto [caixa branca]`, () => {
	it(`Renderiza o componente Product corretamente`, () => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`produtos`).reply(200, mock_cenarios.cenario1)
		mock.onGet(`subtipoproduto/`).reply(200, mock_cenarios.cenario2)
		mock.onGet(`tipo-pacote/`).reply(200, mock_cenarios.cenario2)
		renderComponente()

		const titulo = screen.getByText(`Produtos`)

		expect(titulo).toBeInTheDocument()
	})

	it(`Abrir tela com a listagem não vazia e retornar os dados vindos da api`, async () => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`produtos`).reply(200, mock_cenarios.cenario1)
		mock.onGet(`subtipoproduto/`).reply(200, mock_cenarios.cenario2)
		mock.onGet(`tipo-pacote/`).reply(200, mock_cenarios.cenario2)
		renderComponente()
		await waitFor(() => {
			expect(screen.getByText(`ROUPARIA`)).toBeInTheDocument()
		})
	})

	it(`Abrir tela com a listagem vazia e retornar a mensagem de resultado não encontrado na tabela`, async () => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`produtos`).reply(200, mock_cenarios.cenario2)
		mock.onGet(`subtipoproduto/`).reply(200, mock_cenarios.cenario2)
		mock.onGet(`tipo-pacote/`).reply(200, mock_cenarios.cenario2)
		renderComponente()
		await waitFor(() => {
			expect(screen.getByText(`Nenhum produto cadastrado`)).toBeInTheDocument()
		})
	})

	it(`Abrir tela com a listagem undefined e retornar a mensagem de resultado não encontrado na tabela`, async () => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`produtos`).reply(200, mock_cenarios.cenario3)
		mock.onGet(`subtipoproduto/`).reply(200, mock_cenarios.cenario2)
		mock.onGet(`tipo-pacote/`).reply(200, mock_cenarios.cenario2)
		renderComponente()
		await waitFor(() => {
			expect(screen.getByText(`Nenhum produto cadastrado`)).toBeInTheDocument()
		})
	})

	afterEach(() => {
		RemoteAccessClient.limparCenariosDeTeste()
	})

	afterAll(() => {
		RemoteAccessClient.DesfazerModoTeste()
	})
})
