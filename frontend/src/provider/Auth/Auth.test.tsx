import {vi} from 'vitest'
import {act, renderHook} from '@testing-library/react'
import * as Auth from "@/provider/Auth/index.tsx"
import {
	AuthProvider,
	useAuth
} from "@/provider/Auth/index.tsx"
import {BrowserRouter} from "react-router-dom"
import { setLocalStorage } from './variables'

// @ts-ignore
const wrapper = ({children}) => (
	<AuthProvider>{children}</AuthProvider>
)
describe(`Funções gerais [Caixa Preta]`, () => {
	it(`setLocalStorage`, () => {
		const funcaoInternaMock = vi.spyOn(Auth, `useAuth`) // Cria um mock da função interna
		setLocalStorage(`data`, {})
		expect(funcaoInternaMock).toHaveBeenCalled()
		expect(funcaoInternaMock).toHaveBeenCalled()
	})
	it(`getLocalStorage`, () => {
		const funcaoInternaMock = vi.spyOn(Auth, `useAuth`) // Cria um mock da função interna
		expect(funcaoInternaMock).toHaveBeenCalled()
	})
	it(`getLocalStoragePerfil`, () => {
		const funcaoInternaMock = vi.spyOn(Auth, `useAuth`) // Cria um mock da função interna
		expect(funcaoInternaMock).toHaveBeenCalled()
	})
	it(`useAuth`, () => {
		const {result: resultAuth} = renderHook(() => useAuth())


		act(() => {

			// @ts-ignore
			resultAuth.current = {
				// @ts-ignore
				user: {id: `1`, nome: `ADMIN`},
				toastSuccess: vi.fn(),
				toastError: vi.fn(),
			}
		})
		act(() => {

			// @ts-ignore
			resultAuth.current.user = {}
		})

		// @ts-ignore

	})
	it(`AuthProvider`, () => {
		const {result: resultAuth} = renderHook(() => useAuth(), {wrapper})
		const funcaoInternaMock = vi.spyOn(resultAuth.current, `toastSuccess`) // Cria um mock da função interna
		// act(() => {
		//
		// 	// @ts-ignore
		// 	resultAuth.current = {
		// 		// @ts-ignore
		// 		user: {id: `1`, nome: `ADMIN`},
		// 		toastSuccess: vi.fn(),
		// 		toastError: vi.fn(),
		// 	}
		// })
		// act(() => {
		//
		// 	// @ts-ignore
		// 	resultAuth.current.user = {}
		// })
		//
		// expect(resultAuth.current.estaLogado).toBe(false)

		act(() => {

			// @ts-ignore
			resultAuth.current.toastSuccess(`sucesso`)
			resultAuth.current.toastAlert(`sucesso`)
			resultAuth.current.toastInfor(`sucesso`)
			resultAuth.current.toastError(`sucesso`)
			resultAuth.current.signin({
				username: `sucesso`,
				password: `senha`
			})
		})
		expect(funcaoInternaMock).toHaveBeenCalled()

	})
})
describe(`RequireAuth [Caixa Preta]`, () => {
	it(`Render component c1`, () => {


		// @ts-ignore
		const wrapper1 = ({children}) => <BrowserRouter>{children}</BrowserRouter>
		const {result: resultAuth} = renderHook(() => useAuth(), {wrapper: wrapper1})

		act(() => {

			// @ts-ignore
			resultAuth.current = {
				// @ts-ignore
				user: {id: `1`, nome: `ADMIN`},
				toastSuccess: vi.fn(),
				toastError: vi.fn(),
				estaLogado: true
			}
		})
		act(() => {

			// @ts-ignore
			resultAuth.current.user = {access: `logado`}
		})
	})
})
