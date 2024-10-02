import { pesquisarMockResponseUsuarios } from "@/infra/integrations/__mocks__/pesquisa"
import { NRotasUsuarios, UsuariosCadastrarPropsData } from "@/infra/integrations/cadastro-usuarios"
import { useUsuarios } from "./useUsuarios"
import { renderHook, waitFor } from "@testing-library/react"
import RemoteAccessClient from "@/infra/api/axios-s-managed"

const mock_response: UsuariosCadastrarPropsData[] = pesquisarMockResponseUsuarios


const mock_cenarios_caixa_preta = {
	cenario1: {
		...mock_response,
	},
	cenario2: {
		...mock_response,
		meta: null

	},
	cenario3: {
		...mock_response,
		data: null
	},
	cenario4: {
		...mock_response,
		data: [
			{
				...mock_response[0],
				profissao: null
			}
		]
	},
	cenario5: {
		...mock_response,
		data: [
			{
				...mock_response[0],
				profissao: {
					id: 1,
					descricao: null
				}
			}
		]
	},
	cenario6: {
		...mock_response,
		data: [
			{
				...mock_response[0],
				iduser: null,
			}
		]
	},
	cenario7: {
		...mock_response,
		data: [
			{
				...mock_response[0],
				unknown: null,
			}
		]
	}
}
describe(`Teste do componente Usuario`, () => {
	beforeAll(() => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		const url = NRotasUsuarios.MethodsUsuarios.Get
		mock.onGet(url).reply(200, mock_response)
	})
	it(`Teste do componente Usuario - Cenário 1`, async () => {
		const { result } = renderHook(
			() => useUsuarios()
		)
		await waitFor(() => {
			expect(result.current.usuarios).toEqual(mock_cenarios_caixa_preta.cenario1)
		})
		afterEach(() => {
			RemoteAccessClient.limparCenariosDeTeste()
		})

		afterAll(() => {
			RemoteAccessClient.DesfazerModoTeste()
		})
	})
})

describe(`Teste do componente Usuario [Caixa Preta]`, () => {
	it(`Abrir tabela com todos params ok`, async () => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		const url = NRotasUsuarios.MethodsUsuarios.Get
		mock.onGet(`${url}`).reply(200, mock_cenarios_caixa_preta.cenario1)
		const { result } = renderHook(() => useUsuarios())

		await waitFor(() => {
			expect(result.current.usuarios).toEqual(mock_cenarios_caixa_preta.cenario1)
		})
	})
	it(`Abrir tabela sem meta`, async () => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		const url = NRotasUsuarios.MethodsUsuarios.Get
		mock.onGet(`${url}`).reply(200, mock_cenarios_caixa_preta.cenario2)
		const { result } = renderHook(() => useUsuarios())

		await waitFor(() => {
			expect(result.current.usuarios).toEqual(mock_cenarios_caixa_preta.cenario2)
		})
	})
	it(`Abrir tabela sem data`, async () => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		const url = NRotasUsuarios.MethodsUsuarios.Get
		mock.onGet(`${url}`).reply(200, mock_cenarios_caixa_preta.cenario3)
		const { result } = renderHook(() => useUsuarios())

		await waitFor(() => {
			expect(result.current.usuarios).toEqual(mock_cenarios_caixa_preta.cenario3)
		})
	})
	it(`Abrir tabela com profissao null`, async () => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		const url = NRotasUsuarios.MethodsUsuarios.Get
		mock.onGet(`${url}`).reply(200, mock_cenarios_caixa_preta.cenario4)
		const { result } = renderHook(() => useUsuarios())

		await waitFor(() => {
			expect(result.current.usuarios).toEqual(mock_cenarios_caixa_preta.cenario4)
		})
	})
	it(`Abrir tabela com profissao descricao null`, async () => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		const url = NRotasUsuarios.MethodsUsuarios.Get
		mock.onGet(`${url}`).reply(200, mock_cenarios_caixa_preta.cenario5)
		const { result } = renderHook(() => useUsuarios())

		await waitFor(() => {
			expect(result.current.usuarios).toEqual(mock_cenarios_caixa_preta.cenario5)
		})
	})
	it(`Abrir tabela com iduser null`, async () => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		const url = NRotasUsuarios.MethodsUsuarios.Get
		mock.onGet(`${url}`).reply(200, mock_cenarios_caixa_preta.cenario6)
		const { result } = renderHook(() => useUsuarios())

		await waitFor(() => {
			expect(result.current.usuarios).toEqual(mock_cenarios_caixa_preta.cenario6)
		})
	})
	it(`Abrir tabela com unknown null`, async () => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		const url = NRotasUsuarios.MethodsUsuarios.Get
		mock.onGet(`${url}`).reply(200, mock_cenarios_caixa_preta.cenario7)
		const { result } = renderHook(() => useUsuarios())

		await waitFor(() => {
			expect(result.current.usuarios).toEqual(mock_cenarios_caixa_preta.cenario7)
		})
	})
})
