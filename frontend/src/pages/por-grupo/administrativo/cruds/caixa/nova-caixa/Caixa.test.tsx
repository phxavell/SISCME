import {render, renderHook, screen, waitFor} from '@testing-library/react'
import { NovaCaixa } from '.'
import RemoteAccessClient from '@/infra/api/axios-s-managed'
import {useModeloCaixa} from './useModeloCaixa'
import { vi } from 'vitest'
import { act } from 'react-dom/test-utils'
import { useAuth } from '@/provider/Auth'
import MockedContextProvider from '@/provider/Auth/MockedContextProvider.tsx'

const arrayNaoVazio = {data: [
	{
		id: 2,
		codigo_modelo: `CXPC-HIP`,
		descricao: null,
		instrucoes_uso: null,
		prioridade: 3,
		situacao: 1,
		criticidade: 1,
		embalagem: 1,
		itens: [
			{
				id: 2,
				produto: 855,
				criticidade: 1,
				quantidade: 1,
				caixa: 2
			},
			{
				id: 3,
				produto: 690,
				criticidade: 2,
				quantidade: 2,
				caixa: 2
			},

		],
		criado_em: `15/11/2023 16:22:04`,
		atualizado_em: `15/11/2023 16:22:04`,
		total_itens: 25,
		nome: `CAIXA DE PEQUENA CIRURGIA`,
		validade: 3,
		temperatura: `134`,
		imagem: null,
		categoria_uso: 8,
		cliente: 5,
		tipo_caixa: 1
	},
]}

const arrayItensVazio = {data: [
	{
		id: 2,
		codigo_modelo: `CXPC-HIP`,
		descricao: null,
		instrucoes_uso: null,
		prioridade: 3,
		situacao: 1,
		criticidade: 1,
		embalagem: 1,
		itens: [],
		criado_em: `15/11/2023 16:22:04`,
		atualizado_em: `15/11/2023 16:22:04`,
		total_itens: 25,
		nome: `CAIXA DE PEQUENA CIRURGIA`,
		validade: 3,
		temperatura: `134`,
		imagem: null,
		categoria_uso: 8,
		cliente: 5,
		tipo_caixa: 1
	},
]}

const arrayVazio: any = {
	data: []
}

const mock_cenarios = {
	cenario1: arrayNaoVazio,
	cenario2: arrayVazio,
	cenario3: arrayItensVazio,
	cenario4: {data: undefined},
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
			<NovaCaixa />
		</MockedContextProvider>
	)

}

describe(`Caixa [caixa preta]`, () => {
	it(`Abrir tela com a listagem não vazia => Permanecer estável`, async () => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`caixas/`).reply(200, mock_cenarios.cenario1)
		mock.onGet(`clientes/`).reply(200, mock_cenarios.cenario2)
		renderComponente()
		await waitFor(() => {
			expect(screen.getByText(`CXPC-HIP`)).toBeInTheDocument()
		})
	})

	it(`Abrir tela com a listagem vazia => Permanecer estável`, async () => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`caixas/`).reply(200, mock_cenarios.cenario2)
		mock.onGet(`clientes/`).reply(200, mock_cenarios.cenario2)
		renderComponente()
		await waitFor(() => {
			expect(screen.getByText(`Nenhum resultado encontrado.`)).toBeInTheDocument()
		})
	})

	it(`Abrir tela com a listagem de itens vazia => Permanecer estável`, async () => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`caixas/`).reply(200, mock_cenarios.cenario3)
		mock.onGet(`clientes/`).reply(200, mock_cenarios.cenario2)
		renderComponente()
		waitFor(() => {
			expect(screen.getByText(`CXPC-HIP`)).toBeInTheDocument()
		})
	})

	it(`Abrir tela com a listagem retornando undefined => Permanecer estável`, async () => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`caixas/`).reply(200, mock_cenarios.cenario4)
		mock.onGet(`clientes/`).reply(200, mock_cenarios.cenario2)
		renderComponente()
		waitFor(() => {
			expect(screen.getByText(`CXPC-HIP`)).toBeInTheDocument()
		})
	})
})

describe(`Caixa [caixa branca]`, () => {
	it(`Renderiza o componente NovaCaixa corretamente`, () => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`clientes/`).reply(200, mock_cenarios.cenario2)
		renderComponente()

		const titulo = screen.getByText(`Modelos de Caixa`)

		expect(titulo).toBeInTheDocument()
	})

	it(`Abrir tela com a listagem não vazia e retornar os dados vindos da api`, async () => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`caixas/`).reply(200, mock_cenarios.cenario1)
		mock.onGet(`clientes/`).reply(200, mock_cenarios.cenario2)
		renderComponente()
		await waitFor(() => {
			expect(screen.getByText(`CXPC-HIP`)).toBeInTheDocument()
		})
	})

	it(`Abrir tela com a listagem vazia e retornar a mensagem de resultado não encontrado na tabela`, async () => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`caixas/`).reply(200, mock_cenarios.cenario2)
		mock.onGet(`clientes/`).reply(200, mock_cenarios.cenario2)
		renderComponente()
		await waitFor(() => {
			expect(screen.getByText(`Nenhum resultado encontrado.`)).toBeInTheDocument()
		})
	})

	it(`Abrir tela com a listagem de itens vazia => permanecer estável`, async () => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`caixas/`).reply(200, mock_cenarios.cenario3)
		mock.onGet(`clientes/`).reply(200, mock_cenarios.cenario2)
		renderComponente()
		await waitFor(() => {
			expect(screen.getByText(`CXPC-HIP`)).toBeInTheDocument()
		})
	})

	it(`Abrir tela com a listagem undefined e retornar a mensagem de resultado não encontrado na tabela`, async () => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`caixas/`).reply(200, mock_cenarios.cenario4)
		mock.onGet(`clientes/`).reply(200, mock_cenarios.cenario2)
		renderComponente()
		await waitFor(() => {
			expect(screen.getByText(`Nenhum resultado encontrado.`)).toBeInTheDocument()
		})
	})
})

describe(`useModeloCaixa [caixa branca]`, () => {
	it(`Verificar estado inicial => retornar valores iniciais dos useState `, () => {
		const {result} = renderHook(() => useModeloCaixa())

		expect(result.current.showModal).toEqual(false)
		expect(result.current.showModalDetail).toEqual(false)
		expect(result.current.loadingListagemCaixas).toEqual(true)
		expect(result.current.first).toEqual(0)
		expect(result.current.serial).toEqual(``)
		expect(result.current.codigo).toEqual(``)
		expect(result.current.fromDate).toEqual(undefined)
		expect(result.current.toDate).toEqual(undefined)
		expect(result.current.visibleModalDelete).toEqual(false)
		expect(result.current.deletando).toEqual(false)
		expect(result.current.modoEdicao).toEqual(false)
	})

	afterEach(() => {
		RemoteAccessClient.limparCenariosDeTeste()
	})

	afterAll(() => {
		RemoteAccessClient.DesfazerModoTeste()
	})
})
