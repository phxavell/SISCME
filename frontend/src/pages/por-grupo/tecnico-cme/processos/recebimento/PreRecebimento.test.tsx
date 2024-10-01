import React from 'react'
import {afterAll, afterEach, beforeAll, expect} from 'vitest'
import {Recebimento} from './Recebimento.tsx'
import {act, render, renderHook, screen, waitFor} from '@testing-library/react'
import RemoteAccessClient from '@infra/api/axios-s-managed.ts'
import {usePreRecebimento} from '@pages/por-grupo/tecnico-cme/processos/recebimento/usePreRecebimento.ts'
import {PreRecebimentoMock} from '@infra/integrations/__mocks__/pre-recebimento.ts'
import {BoxWithProducts, NPreRecebiomento} from "@infra/integrations/processo/recebimento/types-recebimento.ts"

const mock_response: BoxWithProducts[] = PreRecebimentoMock.list

const renderModal = () => {
	return (<Recebimento/>)
}
describe.skip(`usePreRecebimento`, () => {
	beforeAll(() => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`${NPreRecebiomento.Methods.Get}`).reply(200, mock_response)
	})
	it(`retornando listagem usando o mocl`, () => {
		const {result} = renderHook(() => usePreRecebimento())
		act(() => {
			// @ts-ignore
			result.current.setCaixas(mock_response)
		})
		expect(result.current.caixas).toEqual(mock_response)
	})
})


describe.skip(`Recebimento [Caixa Preta]`, () => {

	beforeAll(() => {

		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`${NPreRecebiomento.Methods.Get}`)
			.reply(200, mock_response)
	})
	it(`Abrir modal-caixa com todos params ok`, async () => {
		//TODO a exemplo das possibilidades de uso
		// @ts-ignore
		/*useSearchSpy.mockReturnValue({
            groupsMemo:[{empresa: "gvgh",
                itens: 1}],
            handleInput: vi.fn(),
            caixas: items,
            setCaixas:vi.fn(),
            caixasWithProducts: undefined,
            setCaixasWithProducts: vi.fn(),
            visible: false,
            setVisible: vi.fn(),
        });*/
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		// @ts-ignore
		// const { result , waitForNextUpdate} = renderHook(() => usePreRecebimento());

		const rended = renderModal()

		render(rended)

		await waitFor(() => {
			expect(screen.queryAllByText(`CXVASV-HGP002`).length).toEqual(1)
		})

		screen.debug()
	})

	afterEach(() => {
		RemoteAccessClient.limparCenariosDeTeste()
	})

	afterAll(() => {
		RemoteAccessClient.DesfazerModoTeste()
	})

})
