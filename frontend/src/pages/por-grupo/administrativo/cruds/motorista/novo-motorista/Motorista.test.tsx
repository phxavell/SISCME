import {render, renderHook, screen, waitFor} from '@testing-library/react'
import {NewDriver} from '.'
import RemoteAccessClient from '@/infra/api/axios-s-managed'
import {defaultValuesMotorista, useMotorista} from './useMotorista'

const arrayNaoVazio = {
	data: [
		{
			idprofissional: 24,
			iduser: 24,
			matricula: `6454561`,
			cpf: `684.745.614-58`,
			contato: ``,
			email: `joao@almeida.com`,
			atrelado: `S`,
			coren: null,
			dtadmissao: `2023-11-29`,
			dtcadastro: `2023-11-29`,
			dtdesligamento: null,
			dtnascimento: `2000-10-10T00:00:00-04:00`,
			nome: `Joao Almeida`,
			rt: `N`,
			sexo: `M`,
			status: `ADMITIDO`,
			cliente: null,
			profissao: {
				id: 5,
				descricao: `MOTORISTA`
			}
		}
	],
	meta: {
		currentPage: 1,
		totalItems: 1,
		itemsPerPage: 10,
		totalPages: 1
	}
}

const arrayVazio: any = []

const mock_cenarios = {
	cenario1: arrayNaoVazio,
	cenario2: arrayVazio,
	cenario3: undefined,
}

const renderMotorista = () => render(<NewDriver/>)

describe(`Motorista [caixa preta]`, () => {
	it(`Abrir tela com a listagem não vazia => Permanecer estável`, async () => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`motoristas/`).reply(200, mock_cenarios.cenario1)
		renderMotorista()
	})

	it(`Abrir tela com a listagem vazia => Permanecer estável`, async () => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`motoristas/`).reply(200, mock_cenarios.cenario2)
		renderMotorista()
	})

	it(`Abrir tela com a listagem retornando undefined => Permanecer estável`, async () => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`motoristas/`).reply(200, mock_cenarios.cenario3)
		renderMotorista()
	})
})

describe(`NewDriver [caixa branca]`, () => {
	it(`Renderiza o componente NewDriver corretamente`, () => {
		renderMotorista()

		const titulo = screen.getByText(`Motoristas`)

		expect(titulo).toBeInTheDocument()
	})

	it(`Abrir tela com a listagem não vazia e retornar os dados vindos da api`, async () => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`motoristas/`).reply(200, mock_cenarios.cenario1)
		renderMotorista()
		await waitFor(() => {
			expect(screen.getByText(`Joao Almeida`)).toBeInTheDocument()
		})

	})

	it(`Abrir tela com a listagem vazia e retornar a mensagem esperada`, async () => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`motoristas/`).reply(200, {data: mock_cenarios.cenario2})
		renderMotorista()
		await waitFor(() => {
			expect(screen.getByText(`Nenhum resultado encontrado`)).toBeInTheDocument()
		})
	})

	it(`Abrir tela com a listagem retornando undefined => retornar a mensagem esperada`, async () => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		mock.onGet(`motoristas/`).reply(200, {data: mock_cenarios.cenario3})
		renderMotorista()
		await waitFor(() => {
			expect(screen.getByText(`Nenhum resultado encontrado`)).toBeInTheDocument()
		})
	})
})

describe(`useEquipamento [caixa branca]`, () => {
	it(`Verificar estado inicial => retornar valores iniciais dos useState `, () => {
		const {result} = renderHook(() => useMotorista())

		expect(result.current.visible).toEqual(false)
		expect(result.current.loading).toEqual(true)
		expect(result.current.first).toEqual(0)
		expect(result.current.motoristas).toEqual(undefined)
		expect(result.current.motoristaDetail).toEqual(defaultValuesMotorista)
		expect(result.current.visibleModalDelete).toEqual(false)
		expect(result.current.visibleModalDetail).toEqual(false)
		expect(result.current.visibleModalEdit).toEqual(false)
		expect(result.current.visibleModalEditSenha).toEqual(false)
	})

	afterEach(() => {
		RemoteAccessClient.limparCenariosDeTeste()
	})

	afterAll(() => {
		RemoteAccessClient.DesfazerModoTeste()
	})
})
