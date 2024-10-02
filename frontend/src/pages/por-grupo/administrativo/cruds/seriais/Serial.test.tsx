import {render, renderHook, screen, waitFor} from '@testing-library/react'
import { Seriais } from '.'
import RemoteAccessClient from '@/infra/api/axios-s-managed'
import { useSeriais } from './useSeriais'
import { vi } from 'vitest'
import { act } from 'react-dom/test-utils'
import { useAuth } from '@/provider/Auth'
import MockedContextProvider from '@/provider/Auth/MockedContextProvider.tsx'
const arrayNaoVazio = {
	data: [
		{
			serial: `CR001`,
			descricao: `CUBA RIM`,
			cliente: `Hospital Israelita Albert Einstein`,
			situacao: `Abortado`,
			quantidade_itens: 1,
			ultimo_registro: `29/11/2023 08:55`
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
			<Seriais />
		</MockedContextProvider>
	)
}
describe(`Seriais [caixa preta]`, () => {
	it(`Abrir tela com a listagem não vazia => Permanecer estável`, async () => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`seriais/`).reply(200, mock_cenarios.cenario1)
		renderComponente()
		await waitFor(() => {
			expect(screen.getByText(`CR001`)).toBeInTheDocument()
		})
	})

	it(`Abrir tela com a listagem vazia => Permanecer estável`, async () => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`seriais/`).reply(200, mock_cenarios.cenario2)
		renderComponente()
		await waitFor(() => {
			expect(screen.getByText(`Nenhum resultado encontrado.`)).toBeInTheDocument()
		})
	})

	it(`Abrir tela com a listagem retornando undefined => Permanecer estável`, async () => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`seriais/`).reply(200, mock_cenarios.cenario3)
		renderComponente()
		await waitFor(() => {
			expect(screen.getByText(`Nenhum resultado encontrado.`)).toBeInTheDocument()
		})
	})
})

describe(`Seriais [caixa branca]`, () => {
	it(`Renderiza o componente Seriais corretamente`, () => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`seriais/`).reply(200, mock_cenarios.cenario1)
		renderComponente()
		const titulo = screen.getByText(`Seriais`)
		expect(titulo).toBeInTheDocument()
	})

	it(`Abrir tela com a listagem não vazia e retornar os dados vindos da api`, async () => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`seriais/`).reply(200, mock_cenarios.cenario1)
		renderComponente()
		await waitFor(() => {
			expect(screen.getByText(`CUBA RIM`)).toBeInTheDocument()
		})
	})

	it(`Abrir tela com a listagem vazia e retornar a mensagem de resultado não encontrado na tabela`, async () => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`seriais/`).reply(200, mock_cenarios.cenario2)
		renderComponente()
		await waitFor(() => {
			expect(screen.getByText(`Nenhum resultado encontrado.`)).toBeInTheDocument()
		})
	})

	it(`Abrir tela com a listagem undefined e retornar a mensagem de resultado não encontrado na tabela`, async () => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`seriais/`).reply(200, mock_cenarios.cenario3)
		renderComponente()
		await waitFor(() => {
			expect(screen.getByText(`Nenhum resultado encontrado.`)).toBeInTheDocument()
		})
	})
})

describe(`useSeriais [caixa branca]`, () => {
	it(`Verificar estado inicial => retornar valores iniciais dos useState `, () => {
		const {result} = renderHook(() => useSeriais())
		expect(result.current.seriais).toEqual(undefined)
		expect(result.current.selectSerial).toEqual(null)
		expect(result.current.first).toEqual(0)
		expect(result.current.serial).toEqual(null)
		expect(result.current.loading).toEqual(true)
		expect(result.current.salvando).toEqual(false)
		expect(result.current.pesquisando).toEqual(false)
	})
	afterEach(() => {
		RemoteAccessClient.limparCenariosDeTeste()
	})
	afterAll(() => {
		RemoteAccessClient.DesfazerModoTeste()
	})
})
