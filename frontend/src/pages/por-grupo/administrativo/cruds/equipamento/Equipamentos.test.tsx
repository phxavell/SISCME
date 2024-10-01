import {renderHook} from '@testing-library/react'
import RemoteAccessClient from '@/infra/api/axios-s-managed'
import {useEquipamento} from './useEquipamento'
import {defaultValueEquipamento} from '@/infra/integrations/__mocks__/administrativo/equipamentos-mock'
//
// const arrayNaoVazio = [
// 	{
// 		"idequipamento": 1,
// 		"descricao": `Equipamento Hospitalar`,
// 		"numero_serie": `2332323`,
// 		"criado_por": {
// 			"id": 1,
// 			"username": `administrador`,
// 			"nome": `Mestre dos Magos`
// 		},
// 		"atualizado_por": {
// 			"id": 1,
// 			"username": `administrador`,
// 			"nome": `Mestre dos Magos`
// 		},
// 		"criado_em": `2023-11-28T08:37:34.288457-04:00`,
// 		"atualizado_em": `2023-11-28T09:38:12.482318-04:00`,
// 		"data_fabricacao": `2023-11-08`,
// 		"registro_anvisa": `7845123`,
// 		"capacidade": `10`,
// 		"fabricante": `Fametro`,
// 		"tipo": `TD`,
// 		"ativo": true,
// 		"ultima_manutencao": null,
// 		"proxima_manutencao": null
// 	}
// ]
//
// const arrayVazio: any = []

// const mock_cenarios = {
// 	cenario1: arrayNaoVazio,
// 	cenario2: arrayVazio,
// 	cenario3: undefined,
// }
//TODO revisar
// describe.skip(`Equipamentos [caixa preta]`, () => {
// 	it(`Abrir tela com a listagem não vazia => Permanecer estável`, async () => {
// 		const mock = RemoteAccessClient.mockAdapter
// 		mock.onGet(`equipamentos/`).reply(200, {data: mock_cenarios.cenario1})
// 		render(<EquipamentosPage/>)
// 	})
//
// 	it(`Abrir tela com a listagem vazia => Permanecer estável`, async () => {
// 		const mock = RemoteAccessClient.mockAdapter
// 		mock.onGet(`equipamentos/`).reply(200, {data: mock_cenarios.cenario2})
// 		render(<EquipamentosPage/>)
// 	})
//
// 	it(`Abrir tela com a listagem retornando undefined => Permanecer estável`, async () => {
// 		const mock = RemoteAccessClient.mockAdapter
// 		mock.onGet(`equipamentos/`).reply(200, {data: mock_cenarios.cenario3})
// 		render(<EquipamentosPage/>)
// 	})
// })
//
// describe.skip(`EquipamentosPage [caixa branca]`, () => {
// 	it(`Renderiza o componente EquipamentosPage corretamente`, () => {
// 		render(<EquipamentosPage/>)
//
// 		const titulo = screen.getByText(`Equipamentos`)
//
// 		expect(titulo).toBeInTheDocument()
// 	})
//
// 	it.only(`Abrir tela com a listagem não vazia e retornar os dados vindos da api`, async () => {
// 		const mock = RemoteAccessClient.mockAdapter
// 		mock.onGet(`equipamentos/`).reply(200, {data: mock_cenarios.cenario1})
// 		render(<EquipamentosPage/>)
// 		await waitFor(() => {
// 			expect(screen.getByText(`Fametro`)).toBeInTheDocument()
// 		})
// 	})
//
// 	it(`Abrir tela com a listagem vazia e retornar a mensagem esperada`, async () => {
// 		const mock = RemoteAccessClient.mockAdapter
// 		mock.onGet(`equipamentos/`).reply(200, {data: mock_cenarios.cenario2})
// 		render(<EquipamentosPage/>)
// 		await waitFor(() => {
// 			expect(screen.getByText(`Nenhum resultado encontrado`)).toBeInTheDocument()
// 		})
// 	})
//
// 	it(`Abrir tela com a listagem retornando undefined => retornar a mensagem esperada`, async () => {
//
// 		const mock = RemoteAccessClient.mockAdapter
// 		mock.onGet(`equipamentos/`).reply(200, {data: mock_cenarios.cenario3})
// 		render(<EquipamentosPage/>)
// 		await waitFor(() => {
// 			expect(screen.getByText(`Nenhum resultado encontrado`)).toBeInTheDocument()
// 		})
// 	})
// })
//
describe.skip(`useEquipamento [caixa branca]`, () => {
	it.skip(`Verificar estado inicial => retornar valores iniciais dos useState `, () => {
		const {result} = renderHook(() => useEquipamento())

		expect(result.current.visible).toEqual(false)
		expect(result.current.loading).toEqual(true)
		expect(result.current.first).toEqual(0)
		expect(result.current.excluirEquipamento).toEqual(defaultValueEquipamento)
		expect(result.current.visibleModalDelete).toEqual(false)
	})


})
beforeAll(() => {
	RemoteAccessClient.prepararModoTeste()
})
afterEach(() => {
	RemoteAccessClient.limparCenariosDeTeste()
})

afterAll(() => {
	RemoteAccessClient.DesfazerModoTeste()
})
