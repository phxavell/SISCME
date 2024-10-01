import React from 'react'
import {render, screen, waitFor } from '@testing-library/react'

import { ModalSetorVisualizacao} from './intex.tsx'

import { useSetorStore } from '../store/useSetorState.ts'
import { act } from 'react-dom/test-utils'

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

describe(`ModalSetorVisualizacao [caixa branca]`, () => {
	it(`Visualizar modal em tela => permanecer estável`, async () => {
		const {openModalPreview} = useSetorStore.getState()
		act (() => {openModalPreview(setorData)})
		render(
			<ModalSetorVisualizacao	/>
		)

		await waitFor(() => {
			expect(screen.getByText(`Ala A`)).toBeInTheDocument()
		})


	})

})
