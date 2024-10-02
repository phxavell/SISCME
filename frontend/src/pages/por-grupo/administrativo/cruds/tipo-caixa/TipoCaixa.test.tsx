import React from 'react'
import {render, renderHook, screen, waitFor, act } from '@testing-library/react'
import { vi } from 'vitest'
import RemoteAccessClient from '@/infra/api/axios-s-managed'
import MockedContextProvider from '@/provider/Auth/MockedContextProvider.tsx'
import { TipoCaixa } from './index'
import { useAuth } from '@/provider/Auth'

const arrayNaoVazio = {
	data: [
		{
			id: 3,
			criado_por: {
				id: 1,
				username: `ADMIN`,
				nome: `Mestre dos Magos`
			},
			criado_em: `2023-12-12T10:49:55.199672-04:00`,
			atualizado_por: {
				id: 1,
				username: `ADMIN`,
				nome: `Mestre dos Magos`
			},
			atualizado_em: `2023-12-12T10:49:55.199672-04:00`,
			descricao: `Caixa`
		},
		{
			id: 2,
			criado_por: {
				id: 1,
				username: `ADMIN`,
				nome: `Mestre dos Magos`
			},
			criado_em: `2023-12-12T10:41:18.372780-04:00`,
			atualizado_por: {
				id: 1,
				username: `ADMIN`,
				nome: `Mestre dos Magos`
			},
			atualizado_em: `2023-12-12T14:13:41.888756-04:00`,
			descricao: `Teste`
		}
	],
	meta: {
		currentPage: 1,
		totalItems: 3,
		firstItem: 1,
		lastItem: 3,
		itemsPerPage: 3,
		totalPages: 1,
		next: null,
		previous: null
	}
}
const arrayVazio: any = {
	data: [	],
	meta: {
		currentPage: 1,
		totalItems: 79,
		firstItem: 1,
		lastItem: 10,
		itemsPerPage: 10,
		totalPages: 8,
		next: null,
		previous: null
	}
}
const arrayUndefined: any = {
	data: undefined,
	meta: {
		currentPage: 1,
		totalItems: 1,
		firstItem: 1,
		lastItem: 1,
		itemsPerPage: 1,
		totalPages: 8,
		next: null,
		previous: null
	}
}
const mock_cenarios = {
	cenario1: arrayVazio,
	cenario2: arrayUndefined,
	cenario3: arrayNaoVazio,
	// cenario4: arrayColetaVazia,
	// cenario5: arrayProfissionalEDataUndefined
}
const renderComponent = () => {
	const { result} = renderHook(() => useAuth())

	act(() => {

		    result.current={
			// @ts-ignore
			user: { id: 2, nome: `ADMIN` },
			toastSuccess: vi.fn(),
			toastError: vi.fn(),
		}

	})

	render(
		<MockedContextProvider contextValue={result.current}>
			<TipoCaixa />
		</MockedContextProvider>
	)
}
describe(`TipoCaixa [caixa branca]`, () => {
	it(`Abrir tela TipoCaixa com array não vazio => permanecer estável`, async () => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`tipos-caixa/`).reply(200, mock_cenarios.cenario3)

		renderComponent()
		await waitFor(() => {
			expect(screen.getByText(`Tipos de Caixa`)).toBeInTheDocument()
		})


	})

})
