import React from 'react'
import {render, renderHook, screen, waitFor } from '@testing-library/react'
import { ModalEdicaoSubTipoProduto} from './ModalEdicaoSubTipoProduto'
import { useSubTipoProdutoModal } from '../useSubTipoProdutoModal'
import RemoteAccessClient from '@/infra/api/axios-s-managed'

const subTipoProduto =  {
	id: 1,
	descricao: `Teste`,
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
			descricao: `Termodesinfectado`,
			criado_por: {
				id: 1,
				username: `administrador`,
				nome: `Mestre dos Magos`
			},
			atualizado_por: {
				id: 1,
				username: `administrador`,
				nome: `Mestre dos Magos`
			},
			criado_em: `2023-11-23T16:19:44.243988-04:00`,
			atualizado_em: `2023-11-23T16:19:44.243988-04:00`,
			dtcadastro: `2023-11-23T16:19:44.243839-04:00`,
			situacao: true
		},
		{
			id: 2,
			descricao: `Esterilizado`,
			criado_por: {
				id: 1,
				username: `administrador`,
				nome: `Mestre dos Magos`
			},
			atualizado_por: {
				id: 1,
				username: `administrador`,
				nome: `Mestre dos Magos`
			},
			criado_em: `2023-11-23T16:19:40.556766-04:00`,
			atualizado_em: `2023-11-23T16:19:40.556766-04:00`,
			dtcadastro: `2023-11-23T16:19:40.556621-04:00`,
			situacao: true
		}
	],
	meta: {
		currentPage: 1,
		totalItems: 11,
		firstItem: 1,
		lastItem: 10,
		itemsPerPage: 10,
		totalPages: 2,
		next: `http://localhost:8000/api/subtipoproduto/?page=2`,
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
describe(`ModalEdicaoSubTipoProduto [caixa branca]`, () => {
	it(`Visualizar modal em tela => permanecer estável`, async () => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`subtipoproduto/`).reply(200, mock_cenarios.cenario3)
		const { result} = renderHook(() => useSubTipoProdutoModal())
		render(
			<ModalEdicaoSubTipoProduto
				visible={true}
				onClose={result.current.closeModalEditar}
				subTipoProdutoData={subTipoProduto}
			/>
		)
		await waitFor(() => {
			expect(screen.getByText(`Editar Sub Tipo Produto`)).toBeInTheDocument()
		})


	})

})
