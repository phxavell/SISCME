import {fireEvent, render, renderHook, screen, waitFor} from '@testing-library/react'
import { NovoCliente } from '.'
import RemoteAccessClient from '@/infra/api/axios-s-managed'
import { vi } from 'vitest'
import { act } from 'react-dom/test-utils'
import { useAuth } from '@/provider/Auth'
import MockedContextProvider from '@/provider/Auth/MockedContextProvider.tsx'

const arrayNaoVazio = {
	data: [
		{
			idcli: 4,
			inscricaoestadualcli: `14233142`,
			inscricaomunicipalcli: `415381524`,
			cnpjcli: `09.628.825/0001-20`,
			cepcli: `69084-070`,
			emailcli: `28agosto28@gmail.com`,
			telefonecli: `(92)99123-3123`,
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
			criado_em: `2023-12-04T14:30:54.092778-04:00`,
			atualizado_em: `2023-12-11T12:06:29.780543-04:00`,
			bairrocli: `Adrianópolis`,
			cidadecli: `Manaus`,
			codigocli: ``,
			contatocli: ``,
			datacadastrocli: `2023-12-04`,
			horacadastrocli: `14:30:54.092526`,
			nomeabreviado: `HPA`,
			nomecli: `Hospital e Pronto Socorro 28 de Agosto`,
			nomefantasiacli: `Hospital 28 de Agosto`,
			numerocli: `1581`,
			ruacli: `Av. Mário Ypiranga`,
			ufcli: undefined,
			ativo: true,
			foto: null
		},
	]
}

const clienteDesativado = {
	data: [
		{
			idcli: 4,
			inscricaoestadualcli: `14233142`,
			inscricaomunicipalcli: `415381524`,
			cnpjcli: `09.628.825/0001-20`,
			cepcli: `69084-070`,
			emailcli: `28agosto28@gmail.com`,
			telefonecli: `(92)99123-3123`,
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
			criado_em: `2023-12-04T14:30:54.092778-04:00`,
			atualizado_em: `2023-12-11T12:06:29.780543-04:00`,
			bairrocli: `Adrianópolis`,
			cidadecli: `Manaus`,
			codigocli: ``,
			contatocli: ``,
			datacadastrocli: `2023-12-04`,
			horacadastrocli: `14:30:54.092526`,
			nomeabreviado: `HPA`,
			nomecli: `Hospital e Pronto Socorro 28 de Agosto`,
			nomefantasiacli: `Hospital 28 de Agosto`,
			numerocli: `1581`,
			ruacli: `Av. Mário Ypiranga`,
			ufcli: `AM`,
			ativo: false,
			foto: null
		},
	]
}

const arrayParaPaginacao = {
	data: [
		{
			idcli: 4,
			inscricaoestadualcli: `14233142`,
			inscricaomunicipalcli: `415381524`,
			cnpjcli: `09.628.825/0001-20`,
			cepcli: `69084-070`,
			emailcli: `28agosto28@gmail.com`,
			telefonecli: `(92)99123-3123`,
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
			criado_em: `2023-12-04T14:30:54.092778-04:00`,
			atualizado_em: `2023-12-11T12:06:29.780543-04:00`,
			bairrocli: `Adrianópolis`,
			cidadecli: `Manaus`,
			codigocli: ``,
			contatocli: ``,
			datacadastrocli: `2023-12-04`,
			horacadastrocli: `14:30:54.092526`,
			nomeabreviado: `HPA`,
			nomecli: `Hospital e Pronto Socorro 28 de Agosto`,
			nomefantasiacli: `Hospital 28 de Agosto`,
			numerocli: `1581`,
			ruacli: `Av. Mário Ypiranga`,
			ufcli: `AM`,
			ativo: true,
			foto: null
		},
		{
			idcli: 5,
			inscricaoestadualcli: `14233142`,
			inscricaomunicipalcli: `415381524`,
			cnpjcli: `09.628.825/0001-20`,
			cepcli: `69084-070`,
			emailcli: `28agosto28@gmail.com`,
			telefonecli: `(92)99123-3123`,
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
			criado_em: `2023-12-04T14:30:54.092778-04:00`,
			atualizado_em: `2023-12-11T12:06:29.780543-04:00`,
			bairrocli: `Adrianópolis`,
			cidadecli: `Manaus`,
			codigocli: ``,
			contatocli: ``,
			datacadastrocli: `2023-12-04`,
			horacadastrocli: `14:30:54.092526`,
			nomeabreviado: `HPA`,
			nomecli: `Hospital 2`,
			nomefantasiacli: `Hospital 2`,
			numerocli: `1581`,
			ruacli: `Av. Mário Ypiranga`,
			ufcli: `AM`,
			ativo: true,
			foto: null
		},
		{
			idcli: 6,
			inscricaoestadualcli: `14233142`,
			inscricaomunicipalcli: `415381524`,
			cnpjcli: `09.628.825/0001-20`,
			cepcli: `69084-070`,
			emailcli: `28agosto28@gmail.com`,
			telefonecli: `(92)99123-3123`,
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
			criado_em: `2023-12-04T14:30:54.092778-04:00`,
			atualizado_em: `2023-12-11T12:06:29.780543-04:00`,
			bairrocli: `Adrianópolis`,
			cidadecli: `Manaus`,
			codigocli: ``,
			contatocli: ``,
			datacadastrocli: `2023-12-04`,
			horacadastrocli: `14:30:54.092526`,
			nomeabreviado: `HPA`,
			nomecli: `Hospital 3`,
			nomefantasiacli: `Hospital 3`,
			numerocli: `1581`,
			ruacli: `Av. Mário Ypiranga`,
			ufcli: `AM`,
			ativo: true,
			foto: null
		},
		{
			idcli: 7,
			inscricaoestadualcli: `14233142`,
			inscricaomunicipalcli: `415381524`,
			cnpjcli: `09.628.825/0001-20`,
			cepcli: `69084-070`,
			emailcli: `28agosto28@gmail.com`,
			telefonecli: `(92)99123-3123`,
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
			criado_em: `2023-12-04T14:30:54.092778-04:00`,
			atualizado_em: `2023-12-11T12:06:29.780543-04:00`,
			bairrocli: `Adrianópolis`,
			cidadecli: `Manaus`,
			codigocli: ``,
			contatocli: ``,
			datacadastrocli: `2023-12-04`,
			horacadastrocli: `14:30:54.092526`,
			nomeabreviado: `HPA`,
			nomecli: `Hospital 4`,
			nomefantasiacli: `Hospital 4`,
			numerocli: `1581`,
			ruacli: `Av. Mário Ypiranga`,
			ufcli: `AM`,
			ativo: true,
			foto: null
		},
		{
			idcli: 8,
			inscricaoestadualcli: `14233142`,
			inscricaomunicipalcli: `415381524`,
			cnpjcli: `09.628.825/0001-20`,
			cepcli: `69084-070`,
			emailcli: `28agosto28@gmail.com`,
			telefonecli: `(92)99123-3123`,
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
			criado_em: `2023-12-04T14:30:54.092778-04:00`,
			atualizado_em: `2023-12-11T12:06:29.780543-04:00`,
			bairrocli: `Adrianópolis`,
			cidadecli: `Manaus`,
			codigocli: ``,
			contatocli: ``,
			datacadastrocli: `2023-12-04`,
			horacadastrocli: `14:30:54.092526`,
			nomeabreviado: `HPA`,
			nomecli: `Hospital 5`,
			nomefantasiacli: `Hospital 5`,
			numerocli: `1581`,
			ruacli: `Av. Mário Ypiranga`,
			ufcli: `AM`,
			ativo: true,
			foto: null
		},
		{
			idcli: 9,
			inscricaoestadualcli: `14233142`,
			inscricaomunicipalcli: `415381524`,
			cnpjcli: `09.628.825/0001-20`,
			cepcli: `69084-070`,
			emailcli: `28agosto28@gmail.com`,
			telefonecli: `(92)99123-3123`,
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
			criado_em: `2023-12-04T14:30:54.092778-04:00`,
			atualizado_em: `2023-12-11T12:06:29.780543-04:00`,
			bairrocli: `Adrianópolis`,
			cidadecli: `Manaus`,
			codigocli: ``,
			contatocli: ``,
			datacadastrocli: `2023-12-04`,
			horacadastrocli: `14:30:54.092526`,
			nomeabreviado: `HPA`,
			nomecli: `Hospital 6`,
			nomefantasiacli: `Hospital 6`,
			numerocli: `1581`,
			ruacli: `Av. Mário Ypiranga`,
			ufcli: `AM`,
			ativo: true,
			foto: null
		},
		{
			idcli: 1,
			inscricaoestadualcli: `14233142`,
			inscricaomunicipalcli: `415381524`,
			cnpjcli: `09.628.825/0001-20`,
			cepcli: `69084-070`,
			emailcli: `28agosto28@gmail.com`,
			telefonecli: `(92)99123-3123`,
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
			criado_em: `2023-12-04T14:30:54.092778-04:00`,
			atualizado_em: `2023-12-11T12:06:29.780543-04:00`,
			bairrocli: `Adrianópolis`,
			cidadecli: `Manaus`,
			codigocli: ``,
			contatocli: ``,
			datacadastrocli: `2023-12-04`,
			horacadastrocli: `14:30:54.092526`,
			nomeabreviado: `HPA`,
			nomecli: `Hospital 7`,
			nomefantasiacli: `Hospital 7`,
			numerocli: `1581`,
			ruacli: `Av. Mário Ypiranga`,
			ufcli: `AM`,
			ativo: true,
			foto: null
		},
		{
			idcli: 2,
			inscricaoestadualcli: `14233142`,
			inscricaomunicipalcli: `415381524`,
			cnpjcli: `09.628.825/0001-20`,
			cepcli: `69084-070`,
			emailcli: `28agosto28@gmail.com`,
			telefonecli: `(92)99123-3123`,
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
			criado_em: `2023-12-04T14:30:54.092778-04:00`,
			atualizado_em: `2023-12-11T12:06:29.780543-04:00`,
			bairrocli: `Adrianópolis`,
			cidadecli: `Manaus`,
			codigocli: ``,
			contatocli: ``,
			datacadastrocli: `2023-12-04`,
			horacadastrocli: `14:30:54.092526`,
			nomeabreviado: `HPA`,
			nomecli: `Hospital 8`,
			nomefantasiacli: `Hospital 8`,
			numerocli: `1581`,
			ruacli: `Av. Mário Ypiranga`,
			ufcli: `AM`,
			ativo: true,
			foto: null
		},
		{
			idcli: 3,
			inscricaoestadualcli: `14233142`,
			inscricaomunicipalcli: `415381524`,
			cnpjcli: `09.628.825/0001-20`,
			cepcli: `69084-070`,
			emailcli: `28agosto28@gmail.com`,
			telefonecli: `(92)99123-3123`,
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
			criado_em: `2023-12-04T14:30:54.092778-04:00`,
			atualizado_em: `2023-12-11T12:06:29.780543-04:00`,
			bairrocli: `Adrianópolis`,
			cidadecli: `Manaus`,
			codigocli: ``,
			contatocli: ``,
			datacadastrocli: `2023-12-04`,
			horacadastrocli: `14:30:54.092526`,
			nomeabreviado: `HPA`,
			nomecli: `Hospital 9`,
			nomefantasiacli: `Hospital 9`,
			numerocli: `1581`,
			ruacli: `Av. Mário Ypiranga`,
			ufcli: `AM`,
			ativo: true,
			foto: null
		},
		{
			idcli: 10,
			inscricaoestadualcli: `14233142`,
			inscricaomunicipalcli: `415381524`,
			cnpjcli: `09.628.825/0001-20`,
			cepcli: `69084-070`,
			emailcli: `28agosto28@gmail.com`,
			telefonecli: `(92)99123-3123`,
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
			criado_em: `2023-12-04T14:30:54.092778-04:00`,
			atualizado_em: `2023-12-11T12:06:29.780543-04:00`,
			bairrocli: `Adrianópolis`,
			cidadecli: `Manaus`,
			codigocli: ``,
			contatocli: ``,
			datacadastrocli: `2023-12-04`,
			horacadastrocli: `14:30:54.092526`,
			nomeabreviado: `HPA`,
			nomecli: `Hospital 10`,
			nomefantasiacli: `Hospital 10`,
			numerocli: `1581`,
			ruacli: `Av. Mário Ypiranga`,
			ufcli: `AM`,
			ativo: true,
			foto: null
		},
		{
			idcli: 11,
			inscricaoestadualcli: `14233142`,
			inscricaomunicipalcli: `415381524`,
			cnpjcli: `09.628.825/0001-20`,
			cepcli: `69084-070`,
			emailcli: `28agosto28@gmail.com`,
			telefonecli: `(92)99123-3123`,
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
			criado_em: `2023-12-04T14:30:54.092778-04:00`,
			atualizado_em: `2023-12-11T12:06:29.780543-04:00`,
			bairrocli: `Adrianópolis`,
			cidadecli: `Manaus`,
			codigocli: ``,
			contatocli: ``,
			datacadastrocli: `2023-12-04`,
			horacadastrocli: `14:30:54.092526`,
			nomeabreviado: `HPA`,
			nomecli: `Hospital 11`,
			nomefantasiacli: `Hospital 11`,
			numerocli: `1581`,
			ruacli: `Av. Mário Ypiranga`,
			ufcli: `AM`,
			ativo: true,
			foto: null
		},
		{
			idcli: 12,
			inscricaoestadualcli: `14233142`,
			inscricaomunicipalcli: `415381524`,
			cnpjcli: `09.628.825/0001-20`,
			cepcli: `69084-070`,
			emailcli: `28agosto28@gmail.com`,
			telefonecli: `(92)99123-3123`,
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
			criado_em: `2023-12-04T14:30:54.092778-04:00`,
			atualizado_em: `2023-12-11T12:06:29.780543-04:00`,
			bairrocli: `Adrianópolis`,
			cidadecli: `Manaus`,
			codigocli: ``,
			contatocli: ``,
			datacadastrocli: `2023-12-04`,
			horacadastrocli: `14:30:54.092526`,
			nomeabreviado: `HPA`,
			nomecli: `Hospital 12`,
			nomefantasiacli: `Hospital 12`,
			numerocli: `1581`,
			ruacli: `Av. Mário Ypiranga`,
			ufcli: `AM`,
			ativo: true,
			foto: null
		},
	]
}

const arrayVazio: any = {
	data: []
}
const mock_cenarios = {
	cenario1: arrayNaoVazio,
	cenario2: arrayVazio,
	cenario3: {data: undefined},
}
const renderComponente = () => {
	const { result} = renderHook(() => useAuth())
	    act(() => {
		// @ts-ignore
		result.current={ user: { id: 1, nome: `ADMIN` },
			toastSuccess: vi.fn(),
			toastError: vi.fn(),
		}
	})
	render(
		<MockedContextProvider contextValue={result.current}>
			<NovoCliente />
		</MockedContextProvider>
	)
}
describe(`Cliente [caixa preta]`, () => {
	it(`Abrir tela com a listagem não vazia => Permanecer estável`, async () => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`clientes/`).reply(200, mock_cenarios.cenario1)
		renderComponente()
		await waitFor(() => {
			expect(screen.getByText(arrayNaoVazio.data[0].cnpjcli)).toBeInTheDocument()
		})
	})
	it(`Abrir tela com a listagem vazia => Permanecer estável`, async () => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`clientes/`).reply(200, mock_cenarios.cenario2)
		renderComponente()
		await waitFor(() => {
			expect(screen.getByText(`Nenhum resultado encontrado.`)).toBeInTheDocument()
		})
	})
	it(`Abrir tela com a listagem vazia => Permanecer estável`, async () => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`clientes/`).reply(200, mock_cenarios.cenario2)
		renderComponente()
		await waitFor(() => {
			expect(screen.getByText(`Nenhum resultado encontrado.`)).toBeInTheDocument()
		})
	})
	afterEach(() => {
		RemoteAccessClient.limparCenariosDeTeste()
	})
	afterAll(() => {
		RemoteAccessClient.DesfazerModoTeste()
	})
})

describe(`Cliente [caixa branca]`, () => {
	it(`Renderiza o componente NovoCliente corretamente`, () => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`clientes/`).reply(200, mock_cenarios.cenario1)
		renderComponente()
		const titulo = screen.getByText(`Clientes`)
		expect(titulo).toBeInTheDocument()
	})

	it(`Abrir tela com a listagem não vazia e retornar os dados vindos da api`, async () => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`clientes/`).reply(200, mock_cenarios.cenario1)
		renderComponente()

		await waitFor(() => {
			expect(screen.getByText(arrayNaoVazio.data[0].nomeabreviado)).toBeInTheDocument()
		})
	})
	it.skip(`Abrir tela com a listagem não vazia e retornar a mensagem de erro por falha na requisição`, async () => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`clientes/`).reply(500, mock_cenarios.cenario1)
		renderComponente()

		await waitFor(() => {
			expect(screen.getByText(`Não foi possível carregar os dados`)).toBeInTheDocument()
		})
	})

	it(`Abrir tela com a listagem não vazia e validar a pesquisa dos dados`, async () => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`clientes/`).reply(200, mock_cenarios.cenario1)
		renderComponente()

		const inputPesquisa = screen.getByPlaceholderText(`Pesquisar`)

		fireEvent.change(inputPesquisa, { target: { value: `hpadd` } })

	})

	it(`Abrir tela com a listagem não vazia e validar a pesquisa dos dados com erro na requisição`, async () => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`clientes/`).reply(500, mock_cenarios.cenario1)
		renderComponente()

		const inputPesquisa = screen.getByPlaceholderText(`Pesquisar`)

		fireEvent.change(inputPesquisa, { target: { value: `hpadd` } })

	})

	it(`Abrir tela com a listagem não vazia e poder abrir e fechar o modal de novo cliente`, async () => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`clientes/`).reply(200, mock_cenarios.cenario1)
		renderComponente()
		const botaoNovoCliente = screen.getByRole(`button`, { name: /novo cliente/i })

		fireEvent.click(botaoNovoCliente)
		await waitFor(() => {
			expect(screen.getByTestId(`modal-cliente`)).toBeDefined()
		})

		await waitFor(() => {
			const botaoModalFechar = screen.getByRole(`button`, {name: /Close/i})
			fireEvent.click(botaoModalFechar)
		})

		await waitFor(() => {
			expect(screen.queryByTestId(`modal-cliente`)).toBeNull()
		})
	})
	it(`Abrir tela com modal de novo cliente e retornar mensagem de campo obrigatório`, async () => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`clientes/`).reply(200, mock_cenarios.cenario1)
		renderComponente()
		const botaoNovoCliente = screen.getByRole(`button`, { name: /novo cliente/i })

		fireEvent.click(botaoNovoCliente)

		expect(screen.getByRole(`button`, { name: /Cadastrar/i }))
		fireEvent.click(screen.getByRole(`button`, { name: /Cadastrar/i }))
		await waitFor(() => {
			const camposObrigatórios = screen.getAllByText(/Este campo é obrigatório./i)
			expect(camposObrigatórios.length).toEqual(3)
		})
	})

	it.skip(`Abrir tela com a listagem não vazia e excluir cliente`, async () => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`clientes/`).reply(200, mock_cenarios.cenario1)
		mock.onDelete(`clientes/${mock_cenarios.cenario1.data[0].idcli}/`).reply(204)
		renderComponente()

		await waitFor(() => {
			const botaoAbrirModalExcluir = screen.getByTestId(`botao-excluir`)
			fireEvent.click(botaoAbrirModalExcluir)
		})

		const botaoConfirmarExclusao = screen.getByTestId(`confirmar-delete`)
		fireEvent.click(botaoConfirmarExclusao)

		await waitFor(() => {
			expect(screen.getByText(`Cliente excluído com sucesso!`)).toBeDefined()
		})

	})

	it.skip(`Abrir tela com a listagem não vazia e simular falha na exclusão do cliente`, async () => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`clientes/`).reply(200, mock_cenarios.cenario1)
		mock.onDelete(`clientes/${mock_cenarios.cenario1.data[0].idcli}/`).reply(500)
		renderComponente()

		await waitFor(() => {
			const botaoAbrirModalExcluir = screen.getByTestId(`botao-excluir`)
			fireEvent.click(botaoAbrirModalExcluir)
		})

		const botaoConfirmarExclusao = screen.getByTestId(`confirmar-delete`)
		fireEvent.click(botaoConfirmarExclusao)

		await waitFor(() => {
			expect(screen.getByText(`Não foi possível excluir cliente!`)).toBeDefined()
		})

	})

	it.skip(`Abrir tela com a listagem não vazia e desativar um cliente`, async () => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`clientes/`).reply(200, mock_cenarios.cenario1)
		mock.onAny(`clientes/${mock_cenarios.cenario1.data[0].idcli}/desativar/`).reply(200)
		renderComponente()

		await waitFor(() => {
			const switchCliente = screen.getByTestId(`switch-cliente`)
			fireEvent.click(switchCliente)

		})

		const botaoDesativar = screen.getByTestId(`confirmar-switch`)
		fireEvent.click(botaoDesativar)

		await waitFor(() => {
			expect(screen.getByText(`Cliente desativado!`)).toBeDefined()
		})

	})

	it.skip(`Abrir tela com a listagem não vazia e simular erro ao desativar um cliente`, async () => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`clientes/`).reply(200, mock_cenarios.cenario1)
		mock.onAny(`clientes/${mock_cenarios.cenario1.data[0].idcli}/desativar/`).reply(500)
		renderComponente()

		await waitFor(() => {
			const switchCliente = screen.getByTestId(`switch-cliente`)
			fireEvent.click(switchCliente)
		})

		const botaoDesativar = screen.getByTestId(`confirmar-switch`)
		fireEvent.click(botaoDesativar)

		await waitFor(() => {
			expect(screen.getByText(`Não foi possível desativar cliente!`)).toBeDefined()
		})

	})

	it.skip(`Abrir tela com a listagem não vazia e ativar um cliente`, async () => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`clientes/`).reply(200, clienteDesativado)
		mock.onAny(`clientes/${mock_cenarios.cenario1.data[0].idcli}/ativar/`).reply(200)
		renderComponente()

		await waitFor(() => {
			const switchCliente = screen.getByTestId(`switch-cliente`)
			fireEvent.click(switchCliente)

		})

		await waitFor(() => {
			expect(screen.getByText(`Cliente ativado!`)).toBeDefined()
		})

	})

	it.skip(`Abrir tela com a listagem não vazia e simular erro ao ativar um cliente`, async () => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`clientes/`).reply(200, clienteDesativado)
		mock.onAny(`clientes/${mock_cenarios.cenario1.data[0].idcli}/ativar/`).reply(500)
		renderComponente()

		await waitFor(() => {
			const switchCliente = screen.getByTestId(`switch-cliente`)
			fireEvent.click(switchCliente)
		})

		await waitFor(() => {
			expect(screen.getByText(`Não foi possível ativar cliente!`)).toBeDefined()
		})

	})

	it(`Abrir tela com a listagem não vazia e abrir modal de detalhes`, async () => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`clientes/`).reply(200, arrayNaoVazio)
		renderComponente()

		await waitFor(() => {
			const BotaoDetalhes = screen.getByTestId(`botao-detalhes`)
			fireEvent.click(BotaoDetalhes)
		})

		await waitFor(() => {
			expect(screen.getByText(`Não informado!`)).toBeInTheDocument()
			expect(screen.getAllByText(arrayNaoVazio.data[0].nomeabreviado)).toBeDefined()
		})
	})

	it.skip(`Abrir tela com a listagem não vazia e validar a paginação`, async () => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`clientes/`).reply(200, arrayParaPaginacao)
		renderComponente()

		await waitFor(() => {
			expect(screen.getByText(`Hospital 6`)).toBeInTheDocument()

		})

		const botaoProximaPagina = screen.getByRole(`button`, { name: /Next Page/i })

		act(() => {
			fireEvent.click(botaoProximaPagina)
		})

		await waitFor(() => {
			expect(screen.getByText(`Hospital 12`)).toBeInTheDocument()
		})
	})



	it(`Abrir tela com a listagem vazia e retornar a mensagem de resultado não encontrado na tabela`, async () => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`clientes/`).reply(200, mock_cenarios.cenario2)
		renderComponente()
		await waitFor(() => {
			expect(screen.getByText(`Nenhum resultado encontrado.`)).toBeInTheDocument()
		})
	})
	it(`Abrir tela com a listagem undefined e retornar a mensagem de resultado não encontrado na tabela`, async () => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`clientes/`).reply(200, mock_cenarios.cenario3)
		renderComponente()
		await waitFor(() => {
			expect(screen.getByText(`Nenhum resultado encontrado.`)).toBeInTheDocument()
		})
	})
	afterEach(() => {
		RemoteAccessClient.limparCenariosDeTeste()
	})
	afterAll(() => {
		RemoteAccessClient.DesfazerModoTeste()
	})
})
