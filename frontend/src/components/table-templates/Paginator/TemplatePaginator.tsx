import {PaginatorCurrentPageReportOptions} from 'primereact/paginator'

export const TemplatePaginator = {
	layout: `
    FirstPageLink
    PrevPageLink
    CurrentPageReport
    NextPageLink
    LastPageLink
    `,

	CurrentPageReport: (options: PaginatorCurrentPageReportOptions) => {
		const currentPage = options?.currentPage + `` !== `NaN` ? options?.currentPage : 0
		const total = options?.totalRecords + `` !== `NaN` ? options?.totalRecords : 0

		return (
			<span>
				{currentPage} de {total}
			</span>
		)
	},
}
