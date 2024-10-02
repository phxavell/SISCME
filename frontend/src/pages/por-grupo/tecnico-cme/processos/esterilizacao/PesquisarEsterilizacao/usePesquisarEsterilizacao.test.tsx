import { pesquisarMockResponseEsterilizacaoPesquisar } from "@/infra/integrations/__mocks__/caixa-esterilizacao"
import { IFLEsterilizacao } from "@/infra/integrations/processo/types"
import { RespostaAPI } from "@/infra/integrations/types"
import { usePesquisarEsterilizacao } from "./usePesquisarEsterilizacao"
import { render, renderHook, waitFor } from "@testing-library/react"
import { PesquisarEsterilizacao } from "."
import RemoteAccessClient from "@/infra/api/axios-s-managed"
import { NEsterilizacao } from "@/infra/integrations/processo/esterilizacao"
import { act } from "react-dom/test-utils"
import { BrowserRouter } from "react-router-dom"


const mock_response: RespostaAPI<IFLEsterilizacao>[] = pesquisarMockResponseEsterilizacaoPesquisar

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
		data: undefined,
		meta: undefined
	},
	cenario5: {
		...mock_response,
		data: {
			...mock_response[0],
			equipamento: undefined
		}
	},

}


const renderModal = (props: any) => {

	const { result } = renderHook(
		() => usePesquisarEsterilizacao()
	)

	const methods = result.current

	render(
		<BrowserRouter>
		    <PesquisarEsterilizacao {...{ ...props, ...methods }} />
		</BrowserRouter>
	)
}

describe(`usePesquisarEsterilizacao`, () => {
	beforeAll(() => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		const url = NEsterilizacao.MethodsEsterilizacaoPesquisa.Get
		mock.onGet(`${url}`).reply(200, mock_response)
	})
	it(`retornando listagem usando o mocl`, async () => {
		const { result } = renderHook(() => usePesquisarEsterilizacao())
		act(() => {
			// @ts-ignore
			result.current.user = {}
		})
		await waitFor(() => {
			expect(result.current.esterilizacaoFiltro).toEqual(mock_response)
		})
	})
	afterEach(() => {
		RemoteAccessClient.limparCenariosDeTeste()
	})

	afterAll(() => {
		RemoteAccessClient.DesfazerModoTeste()
	})
})

describe(`usePesquisarEsterilizacao [caixa preta]`, () => {
	it(`Abrir tabela com todos params ok`, async () => {
		RemoteAccessClient.prepararModoTeste()
		const mock = RemoteAccessClient.mockAdapter
		const url = NEsterilizacao.MethodsEsterilizacaoPesquisa.Get
		mock.onGet(`${url}`).reply(200, mock_cenarios_caixa_preta.cenario1)
		const { result } = renderHook(() => usePesquisarEsterilizacao())
		act(() => {
			// @ts-ignore
			result.current.user = {}
		})
		await waitFor(() => {
			expect(result.current.esterilizacaoFiltro).toEqual(mock_cenarios_caixa_preta.cenario1)
		})
	})
	it(`Abrir tabela com meta undefined`, () => {
		renderModal(mock_cenarios_caixa_preta.cenario2)
	})
	it(`Abrir tabela com data undefined`, () => {
		renderModal(mock_cenarios_caixa_preta.cenario3)
	})
	it(`Abrir tabela com data e meta undefined`, () => {
		renderModal(mock_cenarios_caixa_preta.cenario4)
	})
	it(`Abrir tabela com equipamento undefined`, () => {
		renderModal(mock_cenarios_caixa_preta.cenario5)
	})
})
