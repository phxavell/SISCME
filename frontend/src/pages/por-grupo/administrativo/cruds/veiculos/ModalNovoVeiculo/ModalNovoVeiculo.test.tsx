import React from 'react'
import {render, renderHook, screen, waitFor } from '@testing-library/react'

import RemoteAccessClient from '@/infra/api/axios-s-managed'
import { useVeiculos } from '../useVeiculos'
import { ModalNovoVeiculo } from '.'

const arrayNaoVazio = {
	data: [
		{
			id: 5,
			placa: `DJS2893`,
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
			criado_em: `2023-11-27T10:15:02.405536-04:00`,
			atualizado_em: `2023-11-27T10:15:02.405536-04:00`,
			descricao: ``,
			marca: `Honda`,
			modelo: `Brio`,
			foto: `http://10.0.1.27:8000/media/veiculos/honda_brio.jpg`,
			motorista_atual: null
		},
		{
			id: 3,
			placa: `ALQ3827`,
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
			criado_em: `2023-11-24T15:36:29.739778-04:00`,
			atualizado_em: `2023-12-14T10:25:05.626583-04:00`,
			descricao: ``,
			marca: `Chevrolet`,
			modelo: `Onix`,
			foto: `http://10.0.1.27:8000/media/veiculos/ONIX_LARANJA.jpg`,
			motorista_atual: null
		}
	],
	meta: {
		currentPage: 1,
		totalItems: 4,
		firstItem: 1,
		lastItem: 4,
		itemsPerPage: 4,
		totalPages: 1,
		next: null,
		previous: null
	}
}

const arrayVazio = {
	data: []
}

const mock_cenarios = {
	cenario1: arrayNaoVazio,
	cenario2: arrayVazio,
	cenario3: undefined,
}

describe(`ModalNovoVeiculo [caixa branca]`, () => {
	it(`Visualizar modal em tela => permanecer estável`, async () => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`veiculos/`).reply(200, mock_cenarios.cenario1)
		const { result} = renderHook(() => useVeiculos())
		render(
			<ModalNovoVeiculo
				visible={true}
				onClose={result.current.handleCloseModal}
				veiculoEditando={result.current.itemSelecionado}
			/>
		)
		await waitFor(() => {
			expect(screen.getByText(`Cadastro de Veículo`)).toBeInTheDocument()
		})
	})

})
