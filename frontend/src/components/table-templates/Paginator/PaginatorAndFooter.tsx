import {Paginator} from "primereact/paginator"
import {TemplatePaginator} from "@/components/table-templates/Paginator/TemplatePaginator.tsx"
import React, {useCallback} from "react"
import {TFooter} from "@/components/table-templates/types.ts"
import {ProgressBar} from "primereact/progressbar"

const classesFooter = `
flex
justify-content-end
py-2
px-4
mb-0
bg-blue-800
text-white
`

export const PaginatorAndFooter: React.FC<TFooter> = (props) => {
	const {
		first,
		onPageChange,
		meta,
		wClassCustom,
		notShowPagination,
		classesFooterCustom,
		loading
	} = props
	if (!meta) {
		return <div></div>
	}
	const classesNameFooter = classesFooterCustom ? classesFooterCustom : `${classesFooter} ${wClassCustom ? wClassCustom : `w-full`}`
	const classNamePaginator = wClassCustom ? wClassCustom : `w-full`
	const paginaAtual = meta?.currentPage ? ((meta?.currentPage - 1) * 10 + 1) : 0
	let indexFinalAtual = (meta?.currentPage * 10)
	indexFinalAtual = indexFinalAtual > meta.totalItems ? meta.totalItems : indexFinalAtual
	const totalItems = meta?.totalItems ?? 0
	const showPagination = useCallback(() => {
		if (notShowPagination) {
			return <></>
		}
		return (
			<div className={classNamePaginator}>
				<Paginator
					className={`p-0`}
					first={first ?? 0}
					rows={1}
					alwaysShow={false}
					totalRecords={meta?.totalPages}
					onPageChange={(e) => onPageChange(e)}
					template={TemplatePaginator}
				/>
			</div>
		)
	}, [classNamePaginator, first, meta?.totalPages, notShowPagination, onPageChange])


	const mostrarProgress = () => {
		if (loading) {
			return (
				<ProgressBar
					mode="indeterminate"
					style={{height: `6px`}}
					color={`cyan`}
					className={`color-gradiente-maximum-compatibility`}
				/>
			)
		}
		return <div style={{height: `6px`}}></div>
	}

	return (
		<>
			{mostrarProgress()}
			{showPagination()}
			<div className={classesNameFooter}>
				<span>Exibindo {paginaAtual}-{indexFinalAtual} de {totalItems} itens</span>
			</div>
		</>
	)
}
