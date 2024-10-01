import { render, screen, fireEvent, waitFor, renderHook, act } from "@testing-library/react"
import { vi } from 'vitest'
import userEvent from "node_modules/@testing-library/user-event"
import { ModalTipoProduto } from "./index.tsx"
import { useTipoProduto } from "@pages/por-grupo/administrativo/cruds/produto/tipo-produto/useTipoProduto.ts"
import { useAuth } from "@/provider/Auth"
import MockedContextProvider from "@/provider/Auth/MockedContextProvider.tsx"

describe(`Modal: Modal Tipo Produto [Caixa Preta]`, () => {

	it(`Abrir modal => Renderizar modal com titulo "Novo Tipo de Produto"`, () => {
		const { result } = renderHook(() => useTipoProduto())
		const { result: resultAuth } = renderHook(() => useAuth())
		act(() => {
			// @ts-ignore
			resultAuth.current={ user: { id: 1, nome: `ADMIN` },
				toastSuccess: vi.fn(),
				toastError: vi.fn(),
			}
		})
		const refreshTable = (success: boolean) => {
			result.current.setVisible(false)
			if (success) {
				result.current.onGetTipoProduto()
			}
		}
		act(() => {
			result.current.setVisible(true)
		})
		render(
			<MockedContextProvider contextValue={resultAuth.current}>
				<ModalTipoProduto visible={true} onClose={refreshTable} />
			</MockedContextProvider>
		)
		expect(screen.getByText(`Novo Tipo de Produto`)).toBeVisible()
		expect(screen.getByText(`Descrição:`)).toBeVisible()
		expect(screen.getByRole(`botao-submit`)).toBeVisible()

	})
	it(`Clicar no botão fechar => Fechar modal a função "refreshTable" deve ser chamada`, () => {
		const { result } = renderHook(() => useTipoProduto())
		const { result: resultAuth } = renderHook(() => useAuth())
		act(() => {
			// @ts-ignore
			resultAuth.current={ user: { id: 1, nome: `ADMIN` },
				toastSuccess: vi.fn(),
				toastError: vi.fn(),
			}
		})

		const refreshTable = vi.fn((success: boolean) => {
			result.current.setVisible(false)
			if (success) {
				result.current.onGetTipoProduto()
			}
		})
		act(() => {
			result.current.setVisible(true)
		})
		render(
			<MockedContextProvider contextValue={resultAuth.current}>
				<ModalTipoProduto visible={true} onClose={refreshTable} />
			</MockedContextProvider>
		)
		const botaoFechar = screen.getByLabelText(`Close`)

		fireEvent.click(botaoFechar)

		expect(refreshTable).toHaveBeenCalled()

	})

})
describe(`Modal: Modal Tipo Produto [Caixa Branca]`, () => {
	it(`Clicar no botão submit com input em branco =>Exibir mensagem de erro "Descrição não informada!"`, async () => {
		const { result } = renderHook(() => useTipoProduto())
		const { result: resultAuth } = renderHook(() => useAuth())
		act(() => {
			// @ts-ignore
			resultAuth.current={ user: { id: 1, nome: `ADMIN` },
				toastSuccess: vi.fn(),
				toastError: vi.fn(),
			}
		})
		const refreshTable = (success: boolean) => {
			result.current.setVisible(false)
			if (success) {
				result.current.onGetTipoProduto()
			}
		}
		render(
			<MockedContextProvider contextValue={resultAuth.current}>
				<ModalTipoProduto visible={true} onClose={refreshTable} />
			</MockedContextProvider>
		)
		const botaoSubmit = screen.getByRole(`botao-submit`)
		act(() => {
			userEvent.click(botaoSubmit)
		})

		await waitFor(() => {
			expect(screen.getByText(`Descrição não informada!`)).toBeVisible()
		})

	})
	it(`Clicar no botão submit com input preenchido => A função de submit deve ser chamada com o valor do input`, async () => {
		const { result } = renderHook(() => useTipoProduto())
		const { result: resultAuth } = renderHook(() => useAuth())
		act(() => {
			// @ts-ignore
			resultAuth.current={ user: { id: 1, nome: `administrador` },
				toastSuccess: vi.fn(),
				toastError: vi.fn(),
			}
		})

		const refreshTable = (success: boolean) => {
			result.current.setVisible(false)
			if (success) {
				result.current.onGetTipoProduto()
			}
		}
		act(() => {
			result.current.setVisible(true)
		})
		const descricao = `produto 1`
		render(
			<MockedContextProvider contextValue={resultAuth.current}>
				<ModalTipoProduto visible={result.current.visible} onClose={refreshTable} />
			</MockedContextProvider>
		)
		const botaoSubmit = screen.getByRole(`botao-submit`)
		const inputDescricao = screen.getByTestId(`input-descricao`)
		act(() => {
			userEvent.type(inputDescricao, descricao)
			userEvent.click(botaoSubmit)
		})

		await waitFor(() => {
			expect(inputDescricao).toHaveValue(descricao)
		})
	})

})
