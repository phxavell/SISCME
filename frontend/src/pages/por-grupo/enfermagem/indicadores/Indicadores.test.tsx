import { render, renderHook, screen, waitFor, act } from '@testing-library/react'
import { TipoOcorrencia } from '.'
import RemoteAccessClient from '@/infra/api/axios-s-managed'
import { useIndicador } from './useIndicador'
import { useAuth } from '@/provider/Auth'

import { vi } from 'vitest'
import MockedContextProvider from "@/provider/Auth/MockedContextProvider.tsx"

const arrayNaoVazio = {
	data: [
		{
			id: 7,
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
			criado_em: `2023-12-07T16:36:31.239555-04:00`,
			atualizado_em: `2023-12-07T16:36:31.239555-04:00`,
			datalancamento: `2023-12-07`,
			descricao: `Nick`,
			status: ``,
			idusu: 1
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

const arrayVazio: any = {data: []}

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
			<TipoOcorrencia />
		</MockedContextProvider>
	)

}

describe(`Indicadores [caixa preta]`, () => {
	it(`Abrir tela com a listagem não vazia => Permanecer estável`, async () => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`tipo-ocorrencia/`).reply(200,mock_cenarios.cenario1)
		renderComponente()
		await waitFor(() => {
			expect(screen.getByText(`Nick`)).toBeInTheDocument()
		})
	})

	it(`Abrir tela com a listagem vazia => Permanecer estável`, async () => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`tipo-ocorrencia/`).reply(200, mock_cenarios.cenario2)
		renderComponente()
		await waitFor(() => {
			expect(screen.getByText(`Nenhum resultado encontrado`)).toBeInTheDocument()
		})
	})

	it(`Abrir tela com a listagem retornando undefined => Permanecer estável`, async () => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`tipo-ocorrencia/`).reply(200, mock_cenarios.cenario3)
		renderComponente()
		await waitFor(() => {
			expect(screen.getByText(`Nenhum resultado encontrado`)).toBeInTheDocument()
		})
	})

})

describe(`Indicadores [caixa branca]`, () => {
	it(`Renderiza o componente Indicadores corretamente`, () => {
		renderComponente()

		const titulo = screen.getByText(`Tipos de Ocorrências`)

		expect(titulo).toBeInTheDocument()
	})

	it(`Abrir tela com a listagem não vazia e retornar os dados vindos da api`, async () => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`tipo-ocorrencia/`).reply(200, mock_cenarios.cenario1)
		renderComponente()
		await waitFor(() => {
			expect(screen.getByText(`Nick`)).toBeInTheDocument()
		})

	})

	it(`Abrir tela com a listagem vazia e retornar a mensagem esperada`, async () => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`tipo-ocorrencia/`).reply(200, mock_cenarios.cenario2)
		renderComponente()
		await waitFor(() => {
			expect(screen.getByText(`Nenhum resultado encontrado`)).toBeInTheDocument()
		})
	})

	it(`Abrir tela com a listagem vazia e retornar a mensagem esperada`, async () => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`tipo-ocorrencia/`).reply(200, mock_cenarios.cenario3)
		renderComponente()
		await waitFor(() => {
			expect(screen.getByText(`Nenhum resultado encontrado`)).toBeInTheDocument()
		})
	})

})

describe(`useIndicador [caixa branca]`, () => {
	it(`Verificar estado inicial => retornar valores iniciais dos useState `, () => {
		const { result } = renderHook(() => useIndicador())

		expect(result.current.visible).toEqual(false)
		expect(result.current.visibleModalVisualizar).toEqual(false)
		expect(result.current.visibleModalDeletar).toEqual(false)
		expect(result.current.loading).toEqual(false)
		expect(result.current.first).toEqual(0)
		expect(result.current.descricao).toEqual(``)
	})

	afterEach(() => {
		RemoteAccessClient.limparCenariosDeTeste()
	})

	afterAll(() => {
		RemoteAccessClient.DesfazerModoTeste()
	})
})
