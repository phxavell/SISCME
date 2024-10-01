import React from 'react'
import {act, render, renderHook, screen, waitFor } from '@testing-library/react'
import { ModalEdicaoSetor} from './ModalEdicaoSetor.tsx'
import userEvent from "node_modules/@testing-library/user-event"

import RemoteAccessClient from '@infra/api/axios-s-managed.ts'
import { useAuth } from '@/provider/Auth'
import { vi } from 'vitest'
import MockedContextProvider from '@/provider/Auth/MockedContextProvider.tsx'

import { useSetorStore } from '../store/useSetorState.ts'

const setorData =  {
	id: 1,
	criado_por: {
		id: 1,
		username: `ADMIN`,
		nome: `Mestre dos Magos`
	},
	criado_em: `2023-12-04T16:34:26.608437-04:00`,
	atualizado_por: {
		id: 1,
		username: `ADMIN`,
		nome: `Mestre dos Magos`
	},
	atualizado_em: `2023-12-04T16:34:26.608437-04:00`,
	descricao: `Ala A`
}

describe(`ModalEdicaoSetor [caixa branca]`, () => {
	it(`Visualizar modal em tela => permanecer estável`, async () => {
		const {openModalEditar} = useSetorStore.getState()

		act (() => {openModalEditar(setorData)})
		render(<ModalEdicaoSetor />)

		await waitFor(() => {
			expect(screen.getByText(`Editar Setor`)).toBeInTheDocument()
		})

	})

	it(`Erro ao editar setor => chamar toast`, async () => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onPut(`setores/1/`).reply(500)
		const {openModalEditar} = useSetorStore.getState()

		act (() => {openModalEditar(setorData)})
		const { result: resultAuth } = renderHook(() => useAuth())
		act(() => {
			// @ts-ignore
			resultAuth.current={ user: { id: 1, nome: `ADMIN` },
				toastSuccess: vi.fn(),
				toastError: vi.fn(),
			}
		})

		render(
			<MockedContextProvider contextValue={resultAuth.current}>
				<ModalEdicaoSetor/>
			</MockedContextProvider>
		)

		const user = userEvent.setup()
		const botaoSubmit = screen.getByRole(`button`, {name: /Filter/i})
		const inputDescricao = screen.getByRole(`textbox`)
		await user.type(inputDescricao, `descricao`)
		await user.click(botaoSubmit)

		await waitFor(() => {
			expect(resultAuth.current.toastError).toHaveBeenCalled()
		})
	})

	it(`Sucesso ao editar setor => chamar toast`, async () => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onPut(`setores/1/`).reply(200, { descricao: `teste` })
		const {openModalEditar} = useSetorStore.getState()

		act (() => {openModalEditar(setorData)})
		const { result: resultAuth } = renderHook(() => useAuth())
		act(() => {
			// @ts-ignore
			resultAuth.current={ user: { id: 1, nome: `ADMIN` },
				toastSuccess: vi.fn(),
				toastError: vi.fn(),
			}
		})

		render(
			<MockedContextProvider contextValue={resultAuth.current}>
				<ModalEdicaoSetor/>
			</MockedContextProvider>
		)

		const user = userEvent.setup()
		const botaoSubmit = screen.getByRole(`button`, {name: /Filter/i})
		const inputDescricao = screen.getByRole(`textbox`)
		await user.type(inputDescricao, `teste`)
		await user.click(botaoSubmit)

		await waitFor(() => {
			expect(resultAuth.current.toastSuccess).toHaveBeenCalled()
		})

	})

})
