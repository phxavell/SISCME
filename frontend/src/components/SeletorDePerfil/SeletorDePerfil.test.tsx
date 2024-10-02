import React from 'react'
import { render, renderHook, screen} from '@testing-library/react'
import { vi } from 'vitest'
import { SeletorDePerfil} from '.'
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
		result.current.selecionarPerfil(`Administrativo`)
	    })
	render(
		<MockedContextProvider contextValue={result.current}>
			<SeletorDePerfil
				styleButton={undefined}
				openFast={true}
				styleIdSubMenu={undefined}
			/>
		</MockedContextProvider>
	)

}

describe(`SeletorDePerfil [caixa branca]`, () => {
	it(`Chamar componente SeletorDePerfil => permanecer estável`, async () => {

		renderComponente()
		expect(screen.getByText(`Selecionar Perfil`)).toBeInTheDocument()
	})
})
