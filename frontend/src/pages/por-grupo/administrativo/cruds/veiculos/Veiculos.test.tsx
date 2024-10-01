import {act, render, renderHook, screen, waitFor} from '@testing-library/react'
import {Veiculos} from '.'
import RemoteAccessClient from '@/infra/api/axios-s-managed'
import {useVeiculos} from './useVeiculos'
import { useAuth } from '@/provider/Auth'
import { vi } from 'vitest'
import MockedContextProvider from '@/provider/Auth/MockedContextProvider.tsx'

const arrayNaoVazio = {
	data: [
		{
			id: 2,
			placa: `WFA9374`,
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
			criado_em: `2023-11-24T15:33:57.466404-04:00`,
			atualizado_em: `2023-11-24T15:33:57.466404-04:00`,
			descricao: ``,
			marca: `Fiat`,
			modelo: `Argo`,
			foto: `http://10.0.1.27:8000/media/veiculos/fiat_argo_laranja.jpg`,
			motorista_atual: null
		},
	]
}

const arrayVazio = {
	data: []
}

const mock_cenarios = {
	cenario1: arrayNaoVazio,
	cenario2: arrayVazio,
	cenario3: undefined,
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
			<Veiculos />
		</MockedContextProvider>
	)

}

describe(`Veiculos [caixa preta]`, () => {
	it(`Abrir tela com a listagem não vazia => Permanecer estável`, async () => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`veiculos/`).reply(200, mock_cenarios.cenario1)
		renderComponente()
		await waitFor(() => {
			expect(screen.getByText(`WFA9374`)).toBeInTheDocument()
		})
	})

	it(`Abrir tela com a listagem vazia => Permanecer estável`, async () => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`veiculos/`).reply(200, mock_cenarios.cenario2)
		renderComponente()
		await waitFor(() => {
			expect(screen.getByText(`Nenhum veículo cadastrado.`)).toBeInTheDocument()
		})
	})

	it(`Abrir tela com a listagem retornando undefined => Permanecer estável`, async () => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`veiculos/`).reply(200, mock_cenarios.cenario3)
		renderComponente()
		await waitFor(() => {
			expect(screen.getByText(`Nenhum veículo cadastrado.`)).toBeInTheDocument()
		})

	})
})

describe(`Veiculos [caixa branca]`, () => {
	it(`Renderiza o componente Veiculos corretamente`, () => {
		renderComponente()

		const titulo = screen.getByText(`Veículos`)

		expect(titulo).toBeInTheDocument()
	})

	it(`Abrir tela com a listagem não vazia e retornar os dados vindos da api`, async () => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`veiculos/`).reply(200, mock_cenarios.cenario1)
		renderComponente()
		await waitFor(() => {
			expect(screen.getByText(`WFA9374`)).toBeInTheDocument()
		})
	})

	it(`Abrir tela com a listagem vazia e retornar a mensagem esperada`, async () => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`veiculos/`).reply(200, mock_cenarios.cenario2)
		renderComponente()
		await waitFor(() => {
			expect(screen.getByText(`Nenhum veículo cadastrado.`)).toBeInTheDocument()
		})
	})

	it(`Abrir tela com a listagem retornando undefined => retornar a mensagem esperada`, async () => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`veiculos/`).reply(200, mock_cenarios.cenario3)
		renderComponente()
		await waitFor(() => {
			expect(screen.getByText(`Nenhum veículo cadastrado.`)).toBeInTheDocument()
		})
	})
})

describe(`useVeiculos [caixa branca]`, () => {
	it(`Verificar estado inicial => retornar valores iniciais dos useState `, () => {
		const {result} = renderHook(() => useVeiculos())

		expect(result.current.visible).toEqual(false)
		expect(result.current.loading).toEqual(true)
		expect(result.current.first).toEqual(0)
		expect(result.current.visibleModalDelete).toEqual(false)
	})

	afterEach(() => {
		RemoteAccessClient.limparCenariosDeTeste()
	})

	afterAll(() => {
		RemoteAccessClient.DesfazerModoTeste()
	})
})
