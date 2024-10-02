import React from 'react'
import { render, renderHook, screen} from '@testing-library/react'
import { Home} from '.'

import { useAuth } from '@/provider/Auth'
import { act } from 'react-dom/test-utils'
import MockedContextProvider from '@/provider/Auth/MockedContextProvider.tsx'
import { BrowserRouter } from 'react-router-dom'


const renderComponente = (perfil: string) => {
	const { result} = renderHook(() => useAuth())
	    act(() => {
		    result.current.perfil= perfil
	    })
	render(
		<MockedContextProvider contextValue={result.current}>
			<BrowserRouter>
				<Home />
			</BrowserRouter>
		</MockedContextProvider>
	)

}

describe.skip(`Home [caixa branca]`, () => {
	it(`Abrir tela com perfil de Administrativo => permanecer estável`, async () => {

		renderComponente(`Administrativo`)
		expect(screen.getByText(`Gerenciamento de Patrimônio`)).toBeInTheDocument()
	})
	it(`Abrir tela com perfil de "Hospital" => permanecer estável`, async () => {

		renderComponente(`Hospital`)
		expect(screen.getByText(`Solicitações de Esterilização`)).toBeInTheDocument()
	})
	it(`Abrir tela com perfil de Enfermagem => permanecer estável`, async () => {

		renderComponente(`Enfermagem`)

		expect(screen.getByText(`Processo de Esterilização`)).toBeInTheDocument()
	})
	it(`Abrir tela com perfil de "Técnico" => permanecer estável`, async () => {
		renderComponente(`Técnico`)

		expect(screen.getByText(`Processo de Esterilização`)).toBeInTheDocument()
	})
	it(`Abrir tela com perfil de "Transportador" => permanecer estável`, async () => {
		renderComponente(`Transportador`)

		expect(screen.getByText(`Minhas Demandas`)).toBeInTheDocument()
	})
	it(`Abrir tela com perfil de "Técnico", caso o perfil esteja em branco => permanecer estável`, async () => {
		renderComponente(``)
		expect(screen.getByText(`Processo de Esterilização`)).toBeInTheDocument()
	})
})
