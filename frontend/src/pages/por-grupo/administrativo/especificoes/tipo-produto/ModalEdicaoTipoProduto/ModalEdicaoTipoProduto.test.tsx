import React from 'react'
import {render, renderHook, screen, waitFor } from '@testing-library/react'

import RemoteAccessClient from '@infra/api/axios-s-managed.ts'
import { ModalEdicaoTipoProduto } from './ModalEdicaoTipoProduto.tsx'
import { useTipoProdutoModal } from '../useTipoProdutoModal.ts'

const tipoProduto =  {
	id: 4,
	descricao: `Teste 2`,
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
	criado_em: `2023-12-07T11:50:46.687630-04:00`,
	atualizado_em: `2023-12-07T11:50:46.687630-04:00`,
	dtcadastro: `2023-12-07T11:50:46.687450-04:00`,
	situacao: true
}
const arrayNaoVazio = {
	data: [
		{
			id: 4,
			descricao: `Teste 2`,
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
			criado_em: `2023-12-07T11:50:46.687630-04:00`,
			atualizado_em: `2023-12-07T11:50:46.687630-04:00`,
			dtcadastro: `2023-12-07T11:50:46.687450-04:00`,
			situacao: true
		},
		{
			id: 3,
			descricao: `test`,
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
			criado_em: `2023-12-07T10:34:44.855639-04:00`,
			atualizado_em: `2023-12-07T10:34:44.855639-04:00`,
			dtcadastro: `2023-12-07T10:34:44.854089-04:00`,
			situacao: true
		}
	],
	"meta": {
		"currentPage": 1,
		"totalItems": 2,
		"firstItem": 1,
		"lastItem": 2,
		"itemsPerPage": 2,
		"totalPages": 1,
		"next": null,
		"previous": null
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
describe(`ModalEdicaoTipoProduto [caixa branca]`, () => {
	it(`Visualizar modal em tela => permanecer estável`, async () => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`tipo-pacote/`).reply(200, mock_cenarios.cenario3)
		const { result} = renderHook(() => useTipoProdutoModal())
		render(
			<ModalEdicaoTipoProduto
				visible={true}
				onClose={result.current.closeModalEditar}
				tipoProdutoData={tipoProduto}
			/>
		)
		await waitFor(() => {
			expect(screen.getByText(`Editar Tipo Produto`)).toBeInTheDocument()
		})
	})

})
