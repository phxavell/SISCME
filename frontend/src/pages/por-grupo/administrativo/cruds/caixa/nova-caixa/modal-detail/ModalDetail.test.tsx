import { fireEvent, render, renderHook, screen, waitFor, act } from '@testing-library/react'
import { vi } from 'vitest'
import RemoteAccessClient from '@/infra/api/axios-s-managed'
import { useAuth } from '@/provider/Auth'
import MockedContextProvider from '@/provider/Auth/MockedContextProvider.tsx'
import { caixaMockModalDetail } from '@/infra/integrations/__mocks__/administrativo/caixa/modal-detail/MockModalDetail'
import { ModalDetailsCaixa } from './ModalDetailCaixa'



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
			<ModalDetailsCaixa
				visible={true}
				caixa={caixaMockModalDetail.caixa}
				onClose={() => {}}
				onDelete={() => {}}
				onEdit={() => {}}
				seriais={caixaMockModalDetail.serial}
				setConteudoParaPdf={() => {}}
			/>
		</MockedContextProvider>
	)
}
const mockarAPI =  (mock_response: any) => {
	RemoteAccessClient.prepararModoTeste()
	const mock = RemoteAccessClient.mockAdapter

	mock.onAny().reply(() => {
		return [200, mock_response]
	})
}
describe(`ModalDetailsCaixa [caixa preta]`, () => {
	it(`Abrir modal details => Permanecer estável`, async () => {
		mockarAPI(caixaMockModalDetail.caixa)
		renderComponente()
		await waitFor(() => {
			expect(screen.getByText(`1 meses`)).toBeInTheDocument()
		})
	})

	it(`Abrir tela modal cliente => Permanecer estável`, async () => {
		renderComponente()
		const clienteButton = screen.getByTestId(`visualizar-cliente`)
		fireEvent.click(clienteButton)

		await waitFor(() => {
			expect(screen.getByText(`Detalhes`)).toBeInTheDocument()
		})

	})
})
