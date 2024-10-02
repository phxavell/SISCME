import React from 'react'
import {render, renderHook, screen, waitFor } from '@testing-library/react'

import { useTipoCaixa } from '../useTipoCaixa'
import RemoteAccessClient from '@/infra/api/axios-s-managed'
import { ModalEdicaoTipoCaixa } from './ModalEdicaoTipoCaixa'

const tipoCaixa =  {
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
}
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
describe(`ModalEdicaoTipoCaixa [caixa branca]`, () => {
	it(`Visualizar modal em tela => permanecer estável`, async () => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`tipos-caixa/`).reply(200, mock_cenarios.cenario3)
		const { result} = renderHook(() => useTipoCaixa())
		render(
			<ModalEdicaoTipoCaixa
				visible={true}
				onClose={result.current.closeModalEditar}
				TipoCaixaData={tipoCaixa}
			/>
		)
		await waitFor(() => {
			expect(screen.getByText(`Editar Tipos Caixa`)).toBeInTheDocument()
		})


	})

})
