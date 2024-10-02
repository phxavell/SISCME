import {render} from '@testing-library/react'
import {vi} from 'vitest'
import {PaginatorAndFooter} from "@/components/table-templates/Paginator/PaginatorAndFooter.tsx"
import {TFooter} from "@/components/table-templates/types.ts"

const mock_cenarios = {
	cenario1: {
		first: 0,
		onPageChange: vi.fn(),
		meta: {
			firstItem: 1,
			currentPage: 1,
			totalItems: 10,
			totalPages: 1
		}
	} as TFooter,
	cenario2: {
		first: 0,
		onPageChange: vi.fn(),
		meta: {
			firstItem: 1,
			currentPage: 1,
			totalItems: 10,
			totalPages: 1
		},
		wClassCustom: `flex-column w-11`
	} as TFooter,
	cenario3: {
		first: undefined,
		onPageChange: undefined,
		meta: undefined,
		classNameCustom: undefined
	},
	cenario4: {
		first: 1,
		onPageChange: vi.fn(),
		meta: {
			currentPage: 8,
			totalItems: 80,
			firstItem: 1,
			lastItem: 10,
			itemsPerPage: 10,
			totalPages: 8,
			next: `http://10.0.1.27:8000/api/produtos/?page=2`,
			previous: null
		},
		classNameCustom: undefined
	},
	cenario5: {
		first: 1,
		onPageChange: vi.fn(),
		meta: {
			currentPage: 5,
			totalItems: 48,
			firstItem: 1,
			lastItem: 10,
			itemsPerPage: 10,
			totalPages: 5,
			next: `http://10.0.1.27:8000/api/produtos/?page=2`,
			previous: null
		},
		classNameCustom: undefined
	},
	cenario6: {
		first: 1,
		onPageChange: vi.fn(),
		meta: {
			currentPage: undefined,
			totalItems: undefined,
			firstItem: 1,
			lastItem: 10,
			itemsPerPage: 10,
			totalPages: undefined,
			next: `http://..../api/produtos/?page=2`,
			previous: null
		},
		classNameCustom: undefined
	},
}
describe(`PaginatorAndFooter.tsx [caixa preta]`, () => {
	it(`Abrir com params base ok => Permanecer estável`, async () => {
		render(
			<PaginatorAndFooter
				{...mock_cenarios.cenario1}
			/>)
	})
	it(`Abrir com params base + adicional ok => Permanecer estável`, async () => {
		render(
			<PaginatorAndFooter
				{...mock_cenarios.cenario2}
			/>)
	})
	it(`Abrir com params all=undefined => Permanecer estável`, async () => {
		render(
			<PaginatorAndFooter
				{...mock_cenarios.cenario3}
			/>)
	})
	it(`Abrir com params=formato2 => Permanecer estável`, async () => {
		render(
			<PaginatorAndFooter
				{...mock_cenarios.cenario4}
			/>)
	})
	it(`Cenário em que se está na última página com 48 itens, neste caso mostrar 40-48 e não 40-50`, async () => {
		render(
			<PaginatorAndFooter
				{...mock_cenarios.cenario5}
			/>)
	})
	it(`Cenário em que parte mais internas do objeto esperado não vem no payload`, async () => {
		render(
			<PaginatorAndFooter
				{...mock_cenarios.cenario6}
			/>)
	})
})
