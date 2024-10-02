import React from 'react'
import { render, renderHook, screen, waitFor, act } from '@testing-library/react'
import userEvent from "node_modules/@testing-library/user-event"
import RemoteAccessClient from '@/infra/api/axios-s-managed'

import { useAuth } from '@/provider/Auth'

import { vi } from 'vitest'
import MockedContextProvider from '@/provider/Auth/MockedContextProvider.tsx'
import { ModalProfissao } from '.'
import { useProfissao } from '../useProfissao'
const data = {
	id: 1,
	descricao: `Analista`

}
describe(`ModalProfissao [caixa branca]`, async() => {
	it(`Clicar no botão submit com input em btanco=> Exibir mensagem de erro "Descrição não informada! `, async() => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onAny(`profissoes/`).reply(201)
		const { result } = renderHook(() => useProfissao())
		const { result: resultAuth } = renderHook(() => useAuth())
		const user = userEvent.setup()
		act(() => {
			// @ts-ignore
			resultAuth.current={ user: { id: 1, nome: `ADMIN` },
				toastSuccess: vi.fn(),
				toastError: vi.fn(),
			}
		})
		render(
			<MockedContextProvider contextValue={resultAuth.current}>
				<ModalProfissao
					visible={true}
					onClose={result.current.closeModalCreate}
				/>
			</MockedContextProvider>
		)
		const botaoSubmit = screen.getByRole(`button`, {name: /Filter/i})
		await user.click(botaoSubmit)
		await waitFor(() => {
			expect(screen.getByText(`Descrição não informada!`)).toBeVisible()
		})

	})
	it(`Clicar no botão submit com input preenchido => A função de submit deve ser chamada com o valor do input`, async () => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onAny(`profissoes/`).reply(200)

		const { result } = renderHook(() => useProfissao())
		const { result: resultAuth } = renderHook(() => useAuth())
		act(() => {
			// @ts-ignore
			resultAuth.current={ user: { id: 1, nome: `ADMIN` },
				toastSuccess: vi.fn(),
				toastError: vi.fn(),
			}
			result.current.openModalCreate()
		})
		const descricao = data.descricao
		render(
			<MockedContextProvider contextValue={resultAuth.current}>
				<ModalProfissao
					visible={result.current.visibleModalCreate}
					onClose={result.current.closeModalCreate}
				/>
			</MockedContextProvider>
		)
		const user = userEvent.setup()
		const botaoSubmit = screen.getByRole(`button`, {name: /Filter/i})
		const inputDescricao = screen.getByRole(`textbox`)
		await user.type(inputDescricao, descricao)
		await user.click(botaoSubmit)

		await waitFor(() => {
			expect(resultAuth.current.toastSuccess).toHaveBeenCalled()
		})

	})
	afterEach(() => {
		RemoteAccessClient.limparCenariosDeTeste()
	})

	afterAll(() => {
		RemoteAccessClient.DesfazerModoTeste()
	})
})
