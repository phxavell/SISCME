
import { renderHook, waitFor, act } from "@testing-library/react"
import { useQRCodeEquipamento } from "./useQRCodeEquipamento.ts"
import RemoteAccessClient from "@infra/api/axios-s-managed.ts"
import { EquipamentoMock } from "@infra/integrations/__mocks__/equipamento/equipamento.ts"

const data = {
	qrEquipamento: `da893c84-1c87-4ad2-b886-6ae9f057fede`
}

const mockarAPI =  (mock_response: any) => {
	RemoteAccessClient.prepararModoTeste()
	const mock = RemoteAccessClient.mockAdapter

	mock.onAny().reply(() => {
		return [200, mock_response]
	})
}
describe(`useQRCodeEquipapmento`, () => {
	it(`retornando listagem vazia`, async () => {
		mockarAPI(EquipamentoMock.QRCode)
		const { result } = renderHook(() => useQRCodeEquipamento(`AC`))
		act(() => {
			result.current.handleClearEquipamentoUuid()
			result.current.handleSubmitQRCode(data)
		})
		await waitFor(() => {
			expect(result.current.equipamento).toEqual([])
		})
	})
	it(`retornando listagem não vazia`, async () => {
		mockarAPI(EquipamentoMock.QRCode)
		const { result } = renderHook(() => useQRCodeEquipamento(`AC`))
		act(() => {
			result.current.handleSubmitQRCode(data)
		})
		await waitFor(() => {
			expect(result.current.equipamento).not.toBeNull()
		})
	})
	afterEach(() => {
		RemoteAccessClient.limparCenariosDeTeste()
	})

	afterAll(() => {
		RemoteAccessClient.DesfazerModoTeste()
	})
})
