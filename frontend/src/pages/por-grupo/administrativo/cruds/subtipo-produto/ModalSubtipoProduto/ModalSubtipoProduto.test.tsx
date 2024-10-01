import React from 'react'
import { render, renderHook, screen, waitFor, act } from '@testing-library/react'
import userEvent from "node_modules/@testing-library/user-event"
import RemoteAccessClient from '@/infra/api/axios-s-managed'

import { useAuth } from '@/provider/Auth'

import { vi } from 'vitest'
import MockedContextProvider from '@/provider/Auth/MockedContextProvider.tsx'
import { ModalSubtipoProduto } from '.'
import { useSubTipoProdutoModal } from '../useSubTipoProdutoModal'

//DOTO verificar
describe.skip(`ModalSubtiProduto [caixa branca]`, async() => {
	it(`Clicar no botão submit com input em branco=> Exibir mensagem de erro "Descrição não informada! `, async() => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onPost(`/setores/`, {descricao: `teste 2`}).reply(201)
		const { result } = renderHook(() => useSubTipoProdutoModal())
		const { result: resultAuth } = renderHook(() => useAuth())
		const user = userEvent.setup()
		const refreshTable = (success: boolean) => {
			result.current.setVisible(false)
			if (success) {
				result.current.handleListSubTipoProdutos()
			}
		}
		act(() => {
			// @ts-ignore
			resultAuth.current={ user: { id: 1, nome: `ADMIN` },
				toastSuccess: vi.fn(),
				toastError: vi.fn(),
			}
		})
		render(
			<MockedContextProvider contextValue={resultAuth.current}>
				<ModalSubtipoProduto
					visible={true}
					onClose={refreshTable}
				/>
			</MockedContextProvider>
		)
		const botaoSubmit = screen.getByRole(`button`, {name: /Filter/i})
		await user.click(botaoSubmit)

		await waitFor(() => {
			expect(screen.getByText(`Descrição não informada!`)).toBeVisible()
		})

	})
	// it(`Clicar no botão submit com input preenchido => A função de submit deve ser chamada com o valor do input`, async () => {
	// 	RemoteAccessClient.prepararModoTeste()
	// 	const mock = RemoteAccessClient.mockAdapter
	// 	mock.onAny(`setores/`).reply(200)

	// 	const { result } = renderHook(() => useSubTipoProdutoModal())
	// 	const { result: resultAuth } = renderHook(() => useAuth())
	// 	act(() => {
	// 		// @ts-ignore
	// 		resultAuth.current={ user: { id: 1, nome: `ADMIN` },
	// 			toastSuccess: vi.fn(),
	// 			toastError: vi.fn(),
	// 		}
	// 		result.current.open()
	// 	})
	// 	const descricao = data.descricao
	// 	render(
	// 		<MockedContextProvider contextValue={resultAuth.current}>
	// 			<ModalSetor
	// 				visible={result.current.visibleModalCreate}
	// 				onClose={result.current.closeModalCreate}
	// 			/>
	// 		</MockedContextProvider>
	// 	)
	// 	const user = userEvent.setup()
	// 	const botaoSubmit = screen.getByRole(`button`, {name: /Filter/i})
	// 	const inputDescricao = screen.getByRole(`textbox`)
	// 	await user.type(inputDescricao, descricao)
	// 	await user.click(botaoSubmit)

	// 	await waitFor(() => {
	// 		expect(resultAuth.current.toastSuccess).toHaveBeenCalled()
	// 	})

	// })
	// afterEach(() => {
	// 	RemoteAccessClient.limparCenariosDeTeste()
	// })

	// afterAll(() => {
	// 	RemoteAccessClient.DesfazerModoTeste()
	// })
})
