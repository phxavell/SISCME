import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { UsuarioCliente } from '.'
import { BrowserRouter } from 'react-router-dom'
import userEvent from 'node_modules/@testing-library/user-event'
import RemoteAccessClient from "@infra/api/axios-s-managed.ts"

const UsuarioClienteComponente = () => (
	<BrowserRouter>
		<UsuarioCliente />
	</BrowserRouter>
)
beforeAll(()=> {
	RemoteAccessClient.prepararModoTeste()
})
afterEach(() => {
	RemoteAccessClient.limparCenariosDeTeste()
})

afterAll(() => {
	RemoteAccessClient.DesfazerModoTeste()
})

describe(`Usuário Cliente-CNPJ`, () => {
	it(`verificar se a renderização do componente é feita`, () => {
		render(<UsuarioClienteComponente />)

		const botaoNovoUsuario = screen.getByText(`Novo Usuário`)

		expect(botaoNovoUsuario).toBeInTheDocument()

		expect(screen.getByText(`#`))
	})

	//TODO revisar
	it.skip(`verifica se o modal-caixa é aberto e fechado corretamente`, () => {
		render(<UsuarioClienteComponente />)

		const botaoNovoUsuario = screen.getByText(`Novo Usuário`)
		fireEvent.click(botaoNovoUsuario)

		const modal = screen.getByTestId(`modal-caixa-usuario-cliente`)
		expect(modal).toBeInTheDocument()

		const botaoFechar = screen.getByLabelText(`Close`)
		fireEvent.click(botaoFechar)

		waitFor(() => {
			expect(modal).not.toBeInTheDocument()
		})
	})

	it(`verifica se erros de campos não preenchidos aparecem`, async () => {
		render(<UsuarioClienteComponente />)

		const botaoNovoUsuario = screen.getByText(`Novo Usuário`)
		fireEvent.click(botaoNovoUsuario)

		const botaoCadastrar = screen.getByTestId(`botao-cadastrar-usuario-cliente`)

		await userEvent.click(botaoCadastrar)

		const erros = screen.getAllByText(`Campo Obrigatório`)

		expect(erros.length).toEqual(5)

	})
})
