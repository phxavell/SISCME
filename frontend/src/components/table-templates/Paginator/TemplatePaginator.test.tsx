import {render} from '@testing-library/react'
import {TemplatePaginator} from "@/components/table-templates/Paginator/TemplatePaginator.tsx"
import {PaginatorCurrentPageReportOptions} from "primereact/paginator"

const mock_cenarios = {
	cenario1: {} as PaginatorCurrentPageReportOptions,
	cenario2: {
		totalRecords: NaN,
		currentPage: NaN,
	} as PaginatorCurrentPageReportOptions,
	cenario3: {
		totalRecords: 1,
		currentPage: 1,
	} as PaginatorCurrentPageReportOptions,
}
describe(`TemplatePaginator.tsx [caixa preta]`, () => {
	it(`Abrir com nenhum params => Permanecer estável`, async () => {
		render(
			TemplatePaginator.CurrentPageReport(mock_cenarios.cenario1)
		)
	})
	it(`Abrir com params nulo => Permanecer estável`, async () => {
		render(
			TemplatePaginator.CurrentPageReport(mock_cenarios.cenario2)
		)
	})
	it(`Abrir com params nulo => Permanecer estável`, async () => {
		render(
			TemplatePaginator.CurrentPageReport(mock_cenarios.cenario3)
		)
	})
})
