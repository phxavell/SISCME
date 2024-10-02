import React from 'react'
import { render, renderHook, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import { Apresentacao} from '.'
import { useAuth } from '@/provider/Auth'
import { act } from 'react-dom/test-utils'
import MockedContextProvider from '@/provider/Auth/MockedContextProvider.tsx'

enum EtapaLogin {
    APRESENTACAO = `Apresentação`,
    LOGIN = `Login`,
    ESCOLHAPERFIL =`EscolhaPerfil`
}

const renderComponente = (show?: boolean) => {
	const show1 = show || false
	const { result} = renderHook(() => useAuth())
	    act(() => {
		// @ts-ignore
		    result.current={ user: { id: 1, nome: `ADMIN`, groups: [`Administrativo`] },
			    selecionarPerfil: vi.fn()
		    }
	    })
	render(
		<MockedContextProvider contextValue={result.current}>
			<Apresentacao
				setEtapaLogin={EtapaLogin.LOGIN}
				show={show1}
				setShow={vi.fn()}
			/>
		</MockedContextProvider>
	)

}

describe(`Apresentacao [caixa branca]`, () => {
	it(`Chamar componente Apresentacao => permanecer estável`, async () => {

		renderComponente()

		expect(screen.getByText(`© 2023 Bioplus, Grupo Bringel. Todos os direitos reservados.`)).toBeInTheDocument()
	})

	it(`Clicar na image de logo bingel => usuário vai ser direcionado ao site da empresa`, async () => {
		const open = vi.spyOn(window, `open`).mockImplementation(() => null)
		renderComponente()

		const imagem = screen.getByAltText(`logo bringel`)
		fireEvent.click(imagem)
		expect(open).toHaveBeenCalled()
	})
	it(`Clicar na image de logo bioplus => usuário vai ser direcionado ao site da empresa`, async () => {
		const open = vi.spyOn(window, `open`).mockImplementation(() => null)
		renderComponente()
		const imagem = screen.getByAltText(`logo bioplus`)
		fireEvent.click(imagem)
		expect(open).toHaveBeenCalled()
	})
	it(`Passar o parametro show=true => a função handleClickLogo `, async () => {
		const open = vi.spyOn(window, `open`).mockImplementation(() => null)

		renderComponente(true)
		const imagem = screen.getByAltText(`logo bioplus`)
		fireEvent.click(imagem)
		expect(open).toHaveBeenCalled()
		const botao = screen.getByRole(`button`)
		expect(botao).toBeInTheDocument()

	})
})
