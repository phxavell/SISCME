import React from 'react'
import { act, fireEvent, render, renderHook, screen, waitFor } from '@testing-library/react'
import { GerenciarMotoristaColetaEntrega } from '.'
import RemoteAccessClient from '@/infra/api/axios-s-managed'
import { useGerenciarMotoristas } from './useGerenciarMotoristas'
import { useAuth } from '@/provider/Auth'
import { vi } from 'vitest'
import MockedContextProvider from '@/provider/Auth/MockedContextProvider'

const arrayNaoVazio = [
	{
		"profissional": {
			"id": 235,
			"nome": `batista1`
		},
		"coletas": [
			{
				"retorno": false,
				"data_criacao": `2023-10-19T16:14:50.447857-03:00`,
				"id_coleta": 53,
				"id_solicitacao": 4,
				"situacao": `Aguardando Coleta`,
				"cliente": `HOSPITAL GERAL DE PALMAS`,
				"total_caixas": 1,
				"profissional": {
					"id": 235,
					"nome": `batista1`
				}
			}
		],
		"entregas": [
			{
				"retorno": true,
				"data_criacao": `2023-12-12T11:50:15.455214-04:00`,
				"id_coleta": 2,
				"id_solicitacao": 1,
				"situacao": `Em Transporte`,
				"cliente": `Hospital Israelita Albert Einstein`,
				"total_caixas": 1,
				"profissional": {
					"id": 7,
					"nome": `Raimundo Nonato da Silva`
				}
			},
		]
	}
]

const arrayColetaVazia = [
	{
		"profissional": {
			"id": 235,
			"nome": `batista1`
		},
		"coletas": undefined,
		"entregas": []
	}
]

const arrayEntregaVazia = [
	{
		"profissional": {
			"id": 235,
			"nome": `batista1`
		},
		"coletas": undefined,
		"entregas": []
	}
]

const arrayProfissionalEDataUndefined = [
	{
		"profissional": undefined,
		"coletas": [
			{
				"retorno": false,
				"data_criacao": undefined,
				"id_coleta": 53,
				"id_solicitacao": 4,
				"situacao": `Aguardando Coleta`,
				"cliente": `HOSPITAL GERAL DE PALMAS`,
				"total_caixas": 1,
				"profissional": undefined
			}
		],
		"entregas": []
	}
]

const arrayVazio: any = []

const mock_cenarios = {
	cenario1: arrayNaoVazio,
	cenario2: arrayVazio,
	cenario3: undefined,
	cenario4: arrayColetaVazia,
	cenario5: arrayProfissionalEDataUndefined
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
			<GerenciarMotoristaColetaEntrega />
		</MockedContextProvider>
	)
}

describe(`GerenciarMotoristaColetaEntrega [caixa preta]`, () => {
	it(`Abrir tela com a listagem não vazia => Permanecer estável`, async () => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`logistica/gerenciamento-demandas-motorista/`).reply(200, { data: mock_cenarios.cenario1 })
		renderComponente()
	})

	it(`Abrir tela com a listagem vazia => Permanecer estável`, async () => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`logistica/gerenciamento-demandas-motorista/`).reply(200, { data: mock_cenarios.cenario2 })
		renderComponente()
	})

	it(`Abrir tela com a listagem retornando undefined => Permanecer estável`, async () => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`logistica/gerenciamento-demandas-motorista/`).reply(200, { data: mock_cenarios.cenario3 })
		renderComponente()
	})

	it(`Abrir tela com a listagem retornando coleta como undefined => Permanecer estável`, async () => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`logistica/gerenciamento-demandas-motorista/`).reply(200, { data: mock_cenarios.cenario4 })
		renderComponente()
	})

	it(`Abrir tela com a listagem retornando profissional e data de criacao como undefined => Permanecer estável`, async () => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`logistica/gerenciamento-demandas-motorista/`).reply(200, { data: mock_cenarios.cenario5 })
		renderComponente()
	})
})

describe(`GerenciarMotoristaColetaEntrega [caixa branca]`, () => {
	it(`Renderiza o componente GerenciarMotoristaColetaEntrega corretamente`, () => {
		renderComponente()

		const titulo = screen.getByText(`Gerenciamento de Entregas/Coletas`)

		expect(titulo).toBeInTheDocument()
	})

	it(`Abrir tela com a listagem não vazia e retornar os dados vindos da api`, async () => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`logistica/gerenciamento-demandas-motorista/`).reply(200, { data: mock_cenarios.cenario1 })
		renderComponente()
		await waitFor(() => {
			expect(screen.getByText(`batista1`)).toBeInTheDocument()
		})

		const botao = screen.getByRole(`button`, { expanded: false })

		fireEvent.click(botao)

		screen.getByRole(`button`, { expanded: true })

		expect(screen.getByText(`HOSPITAL GERAL DE PALMAS`)).toBeInTheDocument()

	})

	it(`Abrir tela com a listagem vazia e retornar a mensagem esperada`, async () => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`logistica/gerenciamento-demandas-motorista/`).reply(200, { data: mock_cenarios.cenario2 })
		renderComponente()
		await waitFor(() => {
			expect(screen.getByText(`Nenhum transporte em andamento.`)).toBeInTheDocument()
		})
	})

	it(`Abrir tela com a listagem de coletas vazia e retornar a mensagem esperada`, async () => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`logistica/gerenciamento-demandas-motorista/`).reply(200, { data: mock_cenarios.cenario4 })
		renderComponente()
		await waitFor(() => {
			expect(screen.getByText(`batista1`)).toBeInTheDocument()
		})
		const botao = screen.getByRole(`button`, { expanded: false })

		fireEvent.click(botao)

		screen.getByRole(`button`, { expanded: true })

		expect(screen.getByText(`Nenhum transporte em andamento.`)).toBeInTheDocument()
	})

	it(`Abrir tela com a listagem não vazia para clicar no modal e permancer o comportamento esperado`, async () => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`logistica/gerenciamento-demandas-motorista/`).reply(200, { data: mock_cenarios.cenario1 })
		mock.onPatch(`logistica/iniciar-coleta/1/`).reply(200)
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
				<GerenciarMotoristaColetaEntrega />
			</MockedContextProvider>
		)
		await waitFor(() => {
			expect(screen.getByText(`batista1`)).toBeInTheDocument()
		})

		const botao = screen.getByRole(`button`, { expanded: false })

		fireEvent.click(botao)

		const botaoColetar = screen.getByTestId(`botao-coletar`)
		fireEvent.click(botaoColetar)

		await waitFor(() => {
			const botao = screen.getByTestId(`botao-confirmar-coleta`)
			fireEvent.click(botao)
		})

		await waitFor(() => {
			expect(result.current.toastSuccess).toHaveBeenCalled()
		})

	})

	it(`Abrir tela com a listagem de entregas vazia e ver mensagem esperada`, async () => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`logistica/gerenciamento-demandas-motorista/`).reply(200, { data: arrayEntregaVazia })
		renderComponente()
		await waitFor(() => {
			expect(screen.getByText(`batista1`)).toBeInTheDocument()
		})

		const botao = screen.getByRole(`button`, { expanded: false })

		fireEvent.click(botao)

		const tabElement = screen.getByRole(`tab`, { name: /A Entregar/i })

		fireEvent.click(tabElement)

		expect(screen.getByText(`Nenhum transporte em andamento.`)).toBeInTheDocument()


	})

	it(`Abrir tela com a listagem de entregas não vazia e carregar os dados corretamente`, async () => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`logistica/gerenciamento-demandas-motorista/`).reply(200, { data: mock_cenarios.cenario1 })
		renderComponente()
		await waitFor(() => {
			expect(screen.getByText(`batista1`)).toBeInTheDocument()
		})

		const botao = screen.getByRole(`button`, { expanded: false })

		fireEvent.click(botao)

		const tabElement = screen.getByRole(`tab`, { name: /A Entregar/i })

		fireEvent.click(tabElement)

		expect(screen.getByText(`Hospital Israelita Albert Einstein`)).toBeInTheDocument()


	})


	it(`Abrir tela com a listagem de entregas não vazia e confirmar entrega`, async () => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`logistica/gerenciamento-demandas-motorista/`).reply(200, { data: mock_cenarios.cenario1 })
		mock.onPatch(`logistica/finalizar-coleta/1/`).reply(200)

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
				<GerenciarMotoristaColetaEntrega />
			</MockedContextProvider>
		)

		await waitFor(() => {
			expect(screen.getByText(`batista1`)).toBeInTheDocument()
		})

		const botao = screen.getByRole(`button`, { expanded: false })

		fireEvent.click(botao)

		const tabElement = screen.getByRole(`tab`, { name: /A Entregar/i })

		fireEvent.click(tabElement)

		const botaoEntregar = screen.getByTestId(`botao-entregar`)
		fireEvent.click(botaoEntregar)

		await waitFor(() => {
			const botao = screen.getByTestId(`botao-confirmar-entrega`)
			fireEvent.click(botao)
		})

		await waitFor(() => {
			expect(result.current.toastSuccess).toHaveBeenCalled()
		})

	})

})

describe(`useGerenciarMotoristas [caixa branca]`, () => {
	it(`Verificar estado inicial => retornar valores iniciais dos useState `, () => {
		const { result } = renderHook(() => useGerenciarMotoristas())

		expect(result.current.visible).toEqual(false)
		expect(result.current.loading).toEqual(true)
		expect(result.current.solicitacoes).toEqual([])
		expect(result.current.salvando).toEqual(false)
		expect(result.current.statusAtual).toEqual(``)
	})

	afterEach(() => {
		RemoteAccessClient.limparCenariosDeTeste()
	})

	afterAll(() => {
		RemoteAccessClient.DesfazerModoTeste()
	})
})
