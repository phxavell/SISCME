import { expect } from 'vitest'
import { act, render, renderHook, waitFor } from '@testing-library/react'
import { PesquisarRecebimentos } from '.'
import RemoteAccessClient from '@/infra/api/axios-s-managed'
import { usePesquisarRecebimentos } from './usePesquisarRecebimentos'
import { NEsterilizacaoPesquisaAPI, RecebimentosPropsData } from '@/infra/integrations/esterilizacao-pesquisa'
import { pesquisarMockResponse } from '@/infra/integrations/__mocks__/pesquisa'

const mock_response: RecebimentosPropsData[] = pesquisarMockResponse



const mock_cenarios_caixa_preta = {
	cenario1: {
		...mock_response,
	},
	cenario2: {
		...mock_response,
		meta: undefined

	},
	cenario3: {
		...mock_response,
		data: undefined
	},
	cenario4: {
		...mock_response,
		data: [
			{
				...mock_response[0],
				produtos: [
					{
						produto: undefined,
						quantidade: 1
					}
				]
			}
		]
	},
	cenario5: {
		...mock_response,
		data: [
			{
				...mock_response[0],
				produtos: [
					{
						produto: {
							id: 1,
							nome: `Produto`
						},
						quantidade: undefined
					}
				]
			}
		]
	},
	cenario6: {
		...mock_response,
		data: [
			{
				...mock_response[0],
				sequencial: undefined,
				data_recebimento: undefined,
				status: undefined
			}
		]
	}
}

const renderModal = (props: any) => {

	const { result } = renderHook(
		() => usePesquisarRecebimentos()
	)

	const methods = result.current

	render(
		<PesquisarRecebimentos {...{ ...props, ...methods }} />
	)
}
beforeAll(() => {
	RemoteAccessClient.prepararModoTeste()
})
afterEach(() => {
	RemoteAccessClient.limparCenariosDeTeste()
})

afterAll(() => {
	RemoteAccessClient.DesfazerModoTeste()
})
//TODO revisar
describe.skip(`usePesquisarRecebimentos`, () => {
	beforeAll(() => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		const url = NEsterilizacaoPesquisaAPI.MethodsRecebimentos.Get
		mock.onGet(`${url}`).reply(200, mock_response)
	})
	it(`retornando listagem usando o mocl`, async () => {
		const { result } = renderHook(() => usePesquisarRecebimentos())
		act(() => {
			// @ts-ignore
			result.current.user = { id: 1, nome: `ADMIN` }
		})
		await waitFor(() => {
			expect(result.current.recebimentos).toEqual(mock_response)
		})
	})

})

//TODo revisar
describe.skip(`PesquisarRecebimentos [Caixa Preta]`, () => {
	it(`Abrir tabela com todos params ok`, async () => {
		const mock = RemoteAccessClient.mockAdapter
		const url = NEsterilizacaoPesquisaAPI.MethodsRecebimentos.Get
		mock.onGet(`${url}`).reply(200, mock_cenarios_caixa_preta.cenario1)
		const { result } = renderHook(() => usePesquisarRecebimentos())
		act(() => {
			// @ts-ignore
			result.current.user = { id: 1, nome: `ADMIN` }
		})
		await waitFor(() => {
			expect(result.current.recebimentos).toEqual(mock_response)
		})
	})
	it(`Abrir tabela com meta undefined`, () => {
		renderModal(mock_cenarios_caixa_preta.cenario2)
	})
	it(`Abrir tabela com data undefined`, () => {
		renderModal(mock_cenarios_caixa_preta.cenario3)
	})
	it(`Abrir tabela com produto undefined`, () => {
		renderModal(mock_cenarios_caixa_preta.cenario4)
	})
	it(`Abrir tabela com quantidade undefined`, () => {
		renderModal(mock_cenarios_caixa_preta.cenario5)
	})
	it(`Abrir tabela com sequencial, data_recebimento e status undefined`, () => {
		renderModal(mock_cenarios_caixa_preta.cenario6)
	})
})
