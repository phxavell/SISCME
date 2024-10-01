import React from 'react'
import {render, renderHook, screen, waitFor } from '@testing-library/react'
import { useProfissao } from '../useProfissao'
import RemoteAccessClient from '@/infra/api/axios-s-managed'
import { ModalEdicaoProfissao } from './ModalEdicaoProfissoa'

const profissaoData =  {
	id: 1,
	descricao: `ANALISTA DE SISTEMAS`,
	criado_por: {
		id: 1,
		username: `ADMIN`,
		nome: `Mestre dos Magos`
	},
	atualizado_por: {
		id: 1,
		username: `ADMIN`,
		nome: `Mestre dos Magos`
	},
	criado_em: `2023-11-27T16:35:27.021021-04:00`,
	atualizado_em: `2023-12-11T10:53:24.929222-04:00`,
	dtcadastro: `2023-11-27T16:35:27.020041-04:00`,
	situacao: true
}
const arrayNaoVazio = {
	data: [
		{
			id: 1,
			criado_por: null,
			criado_em: `2023-11-23T15:30:07.800710-04:00`,
			atualizado_por: null,
			atualizado_em: `2023-11-23T15:30:07.800710-04:00`,
			descricao: `ANALISTA DE SISTEMAS`
		},
		{
			id: 2,
			criado_por: null,
			criado_em: `2023-11-23T15:30:07.821341-04:00`,
			atualizado_por: null,
			atualizado_em: `2023-11-23T15:30:07.821341-04:00`,
			descricao: `TECNICO ENFERMAGEM`
		},
		{
			id: 3,
			criado_por: null,
			criado_em: `2023-11-23T15:30:07.823587-04:00`,
			atualizado_por: null,
			atualizado_em: `2023-11-23T15:30:07.823587-04:00`,
			descricao: `ENFERMEIRA`
		}
	],
	meta: {
		currentPage: 1,
		totalItems: 5,
		firstItem: 1,
		lastItem: 5,
		itemsPerPage: 5,
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
describe(`ModalEdicaoProfissao [caixa branca]`, () => {
	it(`Visualizar modal em tela => permanecer estável`, async () => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`profissoes/`).reply(200, mock_cenarios.cenario3)
		const { result} = renderHook(() => useProfissao())
		render(
			<ModalEdicaoProfissao
				visible={true}
				onClose={result.current.closeModalPreview}
				profissaoData={profissaoData}
			/>
		)
		await waitFor(() => {
			expect(screen.getByText(`Editar Profissão`)).toBeInTheDocument()
		})
	})

})
