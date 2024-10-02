import { renderHook, act, waitFor } from '@testing-library/react'

import RemoteAccessClient from '@/infra/api/axios-s-managed'

import { PesquisarProducoesMock } from '@/infra/integrations/__mocks__/processos/producao/pesquisar-producoes/pesquisar-producoes'
import { usePesquisarProducoes } from './usePesquisarProducoes'


const mockarAPI =  (mock_response: any) => {
	RemoteAccessClient.prepararModoTeste()
	const mock = RemoteAccessClient.mockAdapter

	mock.onAny().reply(() => {

		return [200, mock_response]
	})
}

describe(`usePesquisarProducoes [caixa branca]`, () => {
	it(`Chamar a função search como parametro true => a variável first = 0`, async () => {
		mockarAPI(PesquisarProducoesMock.cenario1)
		const { result } = renderHook(() => usePesquisarProducoes())
		act(() => {
			result.current.search(true)
		})
		expect(result.current.first).toBe(0)

	})
	it(`Chamar a função onPageChange como parametro event = 1 => a variável first = 1`, async () => {
		mockarAPI(PesquisarProducoesMock.cenario1)
		const { result } = renderHook(() => usePesquisarProducoes())
		const event = {first:1}
		act(() => {
			result.current.onPageChange(event)
		})
		expect(result.current.first).toBe(1)

	})
	it(`Chamar a função clearFiltroPesquisa  => a variável first = 0 e o serial uma string vazia`, async () => {
		mockarAPI(PesquisarProducoesMock.cenario1)
		const { result } = renderHook(() => usePesquisarProducoes())

		act(() => {
			result.current.clearFiltroPesquisa()
		})
		expect(result.current.first).toBe(0)
		expect(result.current.serial).toBe(``)

	})
	it(`Chamar a função handleGerarPDF  => retornar um objeto`, async () => {
		mockarAPI(PesquisarProducoesMock.cenario2)
		const { result } = renderHook(() => usePesquisarProducoes())

		act(() => {
			// @ts-ignore
			result.current.handleGerarPDF(PesquisarProducoesMock.cenario3)

		})
		await waitFor(() => {
			expect(result.current.caixaToPDF).toEqual(expect.any(Object))
		})

	})

	afterEach(() => {
		RemoteAccessClient.limparCenariosDeTeste()
	})
	afterAll(() => {
		RemoteAccessClient.DesfazerModoTeste()
	})
})
