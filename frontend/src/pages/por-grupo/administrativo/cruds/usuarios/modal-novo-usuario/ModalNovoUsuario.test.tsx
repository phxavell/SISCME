import React from 'react'
import {render, renderHook, screen, waitFor, act } from '@testing-library/react'
import { vi } from 'vitest'
import RemoteAccessClient from '@/infra/api/axios-s-managed'
import MockedContextProvider from '@/provider/Auth/MockedContextProvider.tsx'

import { ModalNovoUsuario } from './ModalNovoUsuario'
import { useUsuarios } from '../useUsuarios'
import { useAuth } from '@/provider/Auth'

const arrayNaoVazio = {
	data: [
		{
			idprofissional: 16,
			iduser: 14,
			matricula: `123122`,
			cpf: `893.646.239-04`,
			contato: `(92)99238-9237`,
			email: `nicolecoelho@gmail.com`,
			atrelado: ``,
			coren: `23123`,
			dtadmissao: `2023-12-01`,
			dtcadastro: `2023-12-15`,
			dtdesligamento: null,
			dtnascimento: `2000-07-12T00:00:00-04:00`,
			nome: `Nicole Coelho`,
			rt: ``,
			sexo: `F`,
			status: `ADMITIDO`,
			cliente: null,
			profissao: {
				id: 1,
				descricao: `ANALISTA DE SISTEMAS`
			}
		},
		{
			idprofissional: 15,
			iduser: 13,
			matricula: `12312`,
			cpf: `128.739.128-37`,
			contato: `(67)86676-7878`,
			email: `nicole.coelho@bringel.com`,
			atrelado: ``,
			coren: `12313`,
			dtadmissao: `2020-01-01`,
			dtcadastro: `2023-12-15`,
			dtdesligamento: null,
			dtnascimento: `1999-05-14T00:00:00-04:00`,
			nome: `Nicole Coelho`,
			rt: ``,
			sexo: `F`,
			status: `DESATIVADO`,
			cliente: null,
			profissao: {
				id: 1,
				descricao: `ANALISTA DE SISTEMAS`
			}
		}
	],
	meta: {
		currentPage: `1`,
		totalItems: 12,
		itemsPerPage: 10,
		totalPages: 2
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

describe.skip(`ModalNovoUsuario [caixa branca]`, () => {
	it(`Visualizar modal em tela => permanecer estável`, async () => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`cadastro/usuarios/`).reply(200, mock_cenarios.cenario3)
		const { result} = renderHook(() => useUsuarios())
		const { result: auth} = renderHook(() => useAuth())

		act(() => {

		    auth.current={
			// @ts-ignore
				user: { id: 2, nome: `ADMIN` },
				toastSuccess: vi.fn(),
				toastError: vi.fn(),
			}

		})
		const onClose = () => {
			result.current.setLoading(true)
			result.current.setShowModal(false)
			setTimeout(() => {
				result.current.listarUsuarios()
				result.current.setLoading(false)
			}, 1000)
		}
		render(
			<MockedContextProvider contextValue={auth.current}>
				<ModalNovoUsuario
					showModal={true}
					onClose={onClose}
				/>
			</MockedContextProvider>
		)
		await waitFor(() => {
			expect(screen.getByText(`Cadastro de Veículo`)).toBeInTheDocument()
		})
	})

})
