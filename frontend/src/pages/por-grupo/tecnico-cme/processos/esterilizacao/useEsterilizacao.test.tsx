import { pesquisarMockResponseEsterilizacao } from "@/infra/integrations/__mocks__/caixa-esterilizacao"
import { IEsterilizacao } from "@/infra/integrations/processo/types"
import { RespostaAPI } from "@/infra/integrations/types"
import { render, renderHook, waitFor } from "@testing-library/react"
import { useEsterilizacao } from "./useEsterilizacao"
import { Esterilizacao } from "."
import RemoteAccessClient from "@/infra/api/axios-s-managed"
import { NEsterilizacao } from "@/infra/integrations/processo/esterilizacao"
import { act } from "react-dom/test-utils"
import { BrowserRouter } from "react-router-dom"


const mock_response: RespostaAPI<IEsterilizacao>[] = pesquisarMockResponseEsterilizacao



const mock_cenarios_caixa_preta = {
	cenario1: {
		...mock_response,
	},
	cenario2: {
		...mock_response,
		meta: undefined

	},
	cenario3: {
		...mock_response,
		data: undefined
	},
	cenario4: {
		...mock_response,
		data: [
			{
				...mock_response[0],
				serial: undefined
			}
		]
	},

}
const renderModal = (props: any) => {

	const { result } = renderHook(
		() => useEsterilizacao()
	)

	const methods = result.current

	render(
		<BrowserRouter>
			<Esterilizacao {...{ ...props, ...methods }} />
		</BrowserRouter>
	)
}
describe(`useEsterilizacao`, () => {
	beforeAll(() => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		const url = NEsterilizacao.MethodsEsterilizacao.Get
		mock.onGet(`${url}`).reply(200, mock_response)
	})
	it(`retornando listagem usando o mocl`, async () => {
		const { result } = renderHook(() => useEsterilizacao())
		act(() => {
			// @ts-ignore
			result.current.user = {}
		})
		await waitFor(() => {
			expect(result.current.caixas).toEqual(mock_response)
		})
	})
	afterEach(() => {
		RemoteAccessClient.limparCenariosDeTeste()
	})

	afterAll(() => {
		RemoteAccessClient.DesfazerModoTeste()
	})
})

describe(`useEsterilizacao [Caixa Preta]`, () => {
	it(`Abrir tabela com todos params ok`, async () => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		const url = NEsterilizacao.MethodsEsterilizacao.Get
		mock.onGet(`${url}`).reply(200, mock_cenarios_caixa_preta.cenario1)
		const { result } = renderHook(() => useEsterilizacao())
		act(() => {
			// @ts-ignore
			result.current.user = {}
		})
		await waitFor(() => {
			expect(result.current.caixas).toEqual(mock_response)
		})
	})
	it(`Abrir tabela com meta undefined`, () => {
		renderModal(mock_cenarios_caixa_preta.cenario2)
	})
	it(`Abrir tabela com data undefined`, () => {
		renderModal(mock_cenarios_caixa_preta.cenario3)
	})
	it(`Abrir tabela com serial undefined`, () => {
		renderModal(mock_cenarios_caixa_preta.cenario4)
	})
})
