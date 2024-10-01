import {render, renderHook, screen, waitFor} from '@testing-library/react'
import RemoteAccessClient from '@/infra/api/axios-s-managed'
import { vi } from 'vitest'
import { act } from 'react-dom/test-utils'
import { useAuth } from '@/provider/Auth'
import MockedContextProvider from '@/provider/Auth/MockedContextProvider.tsx'
import { RelatorioSujidade } from '.'

const arrayNaoVazio = {
	status: `success`,
	data: {
		"total": 9,
		"tipos": [
			{
				"idindicador": 1,
				"quantidade": 5,
				"tipo": `Falha de Limpeza`
			},
			{
				"idindicador": 10,
				"quantidade": 3,
				"tipo": `Material com Sujidade`
			},
			{
				"idindicador": 3,
				"quantidade": 1,
				"tipo": `Esterilização Falha`
			}
		],
		"clientes": {
			"MATERNIDADE Dº REGINA": {
				"total_ocorrencias": 5,
				"tipos": {
					"Falha de Limpeza": 3,
					"Esterilização Falha": 1,
					"Material com Sujidade": 1
				}
			},
			"HOSPITAL LIBERDADE SANTOS": {
				"total_ocorrencias": 2,
				"tipos": {
					"Falha de Limpeza": 2
				}
			},
			"HOSPITAL MARIA DA PENHA": {
				"total_ocorrencias": 1,
				"tipos": {
					"Material com Sujidade": 1
				}
			},
			"HOSPITAL SANTO AGOSTINHO": {
				"total_ocorrencias": 1,
				"tipos": {
					"Material com Sujidade": 1
				}
			}
		}
	}
}

const arrayNaoVazioUmCliente = {
	status : `success`,
	data : {
		"total": 9,
		"tipos": [
			{
				"idindicador": 1,
				"quantidade": 5,
				"tipo": `Falha de Limpeza`
			},
			{
				"idindicador": 10,
				"quantidade": 3,
				"tipo": `Material com Sujidade`
			},
			{
				"idindicador": 3,
				"quantidade": 1,
				"tipo": `Esterilização Falha`
			}
		],
		"clientes": {
			"MATERNIDADE Dº REGINA": {
				"total_ocorrencias": 5,
				"tipos": {
					"Falha de Limpeza": 3,
					"Esterilização Falha": 1,
					"Material com Sujidade": 1
				}
			},
		}
	}
}


const arrayVazio = [
	{
		"status": `success`,
		"data": {
			"total": 0,
			"tipos": [],
			"clientes": {}
		}
	}
]

const mock_cenarios = {
	cenario1: arrayNaoVazio,
	cenario2: arrayNaoVazioUmCliente,
	cenario3: arrayVazio,
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
			<RelatorioSujidade />
		</MockedContextProvider>
	)
}
describe(`RelatorioTipoOcorrencia [Caixa Preta]`, () => {
	it(`Abrir tela com a listagem não vazia => Permanecer estável`, async () => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`/relatorios/tipos-ocorrencia`).reply(200, mock_cenarios.cenario1)
		renderComponente()
		await waitFor(() => {
			expect(screen.getByText(`Relatório de Ocorrências`)).toBeInTheDocument()
		})
	})
	it(`Abrir tela com a listagem não vazia e apenas um cliente => Permanecer estável`, async () => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`/relatorios/tipos-ocorrencia`).reply(200, mock_cenarios.cenario2)
		renderComponente()
		await waitFor(() => {
			expect(screen.getByText(`Relatório de Ocorrências`)).toBeInTheDocument()
		})
	})
	it(`Abrir tela com a listagem vazia => Permanecer estável`, async () => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`/relatorios/tipos-ocorrencia`).reply(200, mock_cenarios.cenario3)
		renderComponente()
		await waitFor(() => {
			expect(screen.getByText(`Relatório de Ocorrências`)).toBeInTheDocument()
		})
	})
})
