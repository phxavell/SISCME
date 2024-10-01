import {act, render, renderHook, screen, waitFor} from '@testing-library/react'
import {PesquisarProducoes} from '.'
import RemoteAccessClient from '@/infra/api/axios-s-managed'
import {usePesquisarProducoes} from './usePesquisarProducoes'
import {useAuth} from '@/provider/Auth'
import MockedContextProvider from '@/provider/Auth/MockedContextProvider.tsx'
import {vi} from 'vitest'

const arrayNaoVazio = [
	{
		id: 31888,
		serial: `BDVI-HGP001`,
		nome_caixa: `BANDEJA DISSECÇAO VENOSA INFANTIL`,
		data_preparo: `04/12/2023 20:12`,
		data_validade: `04/03/2024`,
		cliente: `ALA PEDIATRICA -HGP`
	},
]

const arrayVazio: any = []

const mock_cenarios = {
	cenario1: arrayNaoVazio,
	cenario2: arrayVazio,
	cenario3: undefined,
}

const renderComponente = () => {
	const {result} = renderHook(() => useAuth())
	act(() => {
		// @ts-ignore

		result.current = {
			// @ts-ignore
			user: {id: 1, nome: `ADMIN`},
			toastSuccess: vi.fn(),
			toastError: vi.fn(),
		}
	})
	render(
		<MockedContextProvider contextValue={result.current}>
			<PesquisarProducoes/>
		</MockedContextProvider>
	)

}


describe(`Esterilização [caixa preta]`, () => {
	it(`Abrir tela com a listagem não vazia => Permanecer estável`, async () => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`/processo/preparo/itens-preparados/`).reply(200, {data: mock_cenarios.cenario1})
		renderComponente()
		await waitFor(() => {
			expect(screen.getByText(`BDVI-HGP001`)).toBeInTheDocument()
		})
	})

	it(`Abrir tela com a listagem vazia => Permanecer estável`, async () => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`/processo/preparo/itens-preparados/`).reply(200, {data: mock_cenarios.cenario2})
		renderComponente()
		await waitFor(() => {
			expect(screen.getByText(`Nenhum resultado encontrado.`)).toBeInTheDocument()
		})
	})

	it(`Abrir tela com a listagem retornando undefined => Permanecer estável`, async () => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`/processo/preparo/itens-preparados/`).reply(200, {data: mock_cenarios.cenario3})
		renderComponente()
		await waitFor(() => {
			expect(screen.getByText(`Nenhum resultado encontrado.`)).toBeInTheDocument()
		})
	})
})

describe(`Producao [caixa branca]`, () => {
	it(`Renderiza o componente Producao corretamente`, () => {
		renderComponente()

		const titulo = screen.getByText(`Pesquisa de Itens em Produção`)

		expect(titulo).toBeInTheDocument()
	})

	it(`Abrir tela com a listagem não vazia e retornar os dados vindos da api`, async () => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`/processo/preparo/itens-preparados/`).reply(200, {data: mock_cenarios.cenario1})
		renderComponente()
		await waitFor(() => {
			expect(screen.getByText(`BDVI-HGP001`)).toBeInTheDocument()
		})

	})

	it(`Abrir tela com a listagem vazia e retornar a mensagem esperada`, async () => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`/processo/preparo/itens-preparados/`).reply(200, {data: mock_cenarios.cenario2})
		renderComponente()
		await waitFor(() => {
			expect(screen.getByText(`Nenhum resultado encontrado.`)).toBeInTheDocument()
		})
	})

	it(`Abrir tela com a listagem undefined e retornar a mensagem esperada`, async () => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`/processo/preparo/itens-preparados/`).reply(200, {data: mock_cenarios.cenario3})
		renderComponente()
		await waitFor(() => {
			expect(screen.getByText(`Nenhum resultado encontrado.`)).toBeInTheDocument()
		})
	})
})

describe(`useProducao [caixa branca]`, () => {
	it(`Verificar estado inicial => retornar valores iniciais dos useState `, () => {
		const {result} = renderHook(() => usePesquisarProducoes())

		expect(result.current.serial).toEqual(``)
		expect(result.current.loading).toEqual(true)
		expect(result.current.fromDate).toEqual(undefined)
		expect(result.current.toDate).toEqual(undefined)
		expect(result.current.first).toEqual(0)
	})

	afterEach(() => {
		RemoteAccessClient.limparCenariosDeTeste()
	})

	afterAll(() => {
		RemoteAccessClient.DesfazerModoTeste()
	})
})
