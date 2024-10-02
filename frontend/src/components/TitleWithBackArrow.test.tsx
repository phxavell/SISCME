import {expect, vi} from 'vitest'
import {act, render, renderHook, screen} from '@testing-library/react'
import React from 'react'
import {TitleWithBackArrow} from "@/components/TitleWithBackArrow.tsx"
import MockedContextProvider from "@/provider/Auth/MockedContextProvider.tsx"
import {useAuth} from "@/provider/Auth"

const mocks = {
	cenario1: {
		page: {nome:`teste`},
		title: `nome`
	},
	cenario2: {
		page: undefined,
		title: `nome`
	},
	cenario3: {
		page: undefined,
		title: ``
	},
	cenario4: {
		page: {nome: {
			cliente:`teste`
		}},
		title: ``
	},
}

const renderModal = (props: any) => {
	const { result: resultAuth } = renderHook(() => useAuth())
	act(() => {
		// @ts-ignore
		resultAuth.current={ user: { id: 1, nome: `ADMIN` },
			toastSuccess: vi.fn(),
			toastError: vi.fn(),
		}
	})
	render(
		<MockedContextProvider contextValue={resultAuth.current}>
			<TitleWithBackArrow {...props} />
		</MockedContextProvider>
	)
}

describe(`TitleWithBackArrow [Caixa Preta]`, () => {
	it(`Render component c1`, async () => {
		renderModal(mocks.cenario1)
		const data =screen.queryAllByText(`nome`)
		expect(data.length).toBeGreaterThan(0)
	})
	it(`Render component c2`, async () => {
		renderModal(mocks.cenario2)
	})
	it(`Render component c3`, async () => {
		renderModal(mocks.cenario3)
	})
	it(`Render component c4`, async () => {
		renderModal(mocks.cenario4)
	})
})
