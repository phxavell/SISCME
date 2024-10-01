import React from 'react'
import { render, renderHook, screen} from '@testing-library/react'
import { vi } from 'vitest'
import { Login} from '.'
import { useAuth } from '@/provider/Auth'
import { act } from 'react-dom/test-utils'
import MockedContextProvider from '@/provider/Auth/MockedContextProvider.tsx'

const renderComponente = () => {
	const { result} = renderHook(() => useAuth())
	    act(() => {
		// @ts-ignore
		    result.current={ user: { id: 1, nome: `ADMIN`, groups: [`Administrativo`] },
			    selecionarPerfil: vi.fn()
		    }
	    })
	render(
		<MockedContextProvider contextValue={result.current}>
			<Login/>
		</MockedContextProvider>
	)

}

describe(`Login [caixa branca]`, () => {
	it(`Chamar componente Login => permanecer estável`, async () => {
		renderComponente()
		expect(screen.getByText(`© 2023 Bioplus, Grupo Bringel. Todos os direitos reservados.`)).toBeInTheDocument()
	})

})
