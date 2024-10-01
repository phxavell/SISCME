import {
	ContainerFlexColumnDiv,
	headerTableStyle,
	titleStyle,
} from "@/util/styles"
import { Button } from "primereact/button"
import { Column } from "primereact/column"
import { DataTable } from "primereact/datatable"
import { useEtiquetas } from "./useEtiquetas"
import { Calendar } from "primereact/calendar"
import { InputText } from "primereact/inputtext"
import { DataEtiqueta } from "@/infra/integrations/processo/types-etiquetas"
import { ModalEtiqueta } from "./modais"
import { useCallback } from "react"
import { Dialog } from "primereact/dialog"
import { ModalEtiquetaPdf } from "@pages/por-grupo/tecnico-cme/cruds/etiquetas/modais/ModalEtiquetaPdf"
import { RoutersPathName } from "@/routes/schemas.ts"
import { useHome } from "@pages/general/Home/useHome.ts"
import { PaginatorAndFooter } from "@/components/table-templates/Paginator/PaginatorAndFooter.tsx"
import DateTemplate from "@/components/table-templates/DateTemplate.tsx"
import { TimeOnly } from "@/components/table-templates/TimeOnly.tsx"
import { styleActionTable } from "@/components/RowTemplate"
import { ModalEtiquetaEdicao } from "./modalEdicao"
import { Toast } from "primereact/toast"
import {
	styleActionsExtern,
	styleFiltrosEtiquetas,
	styleRowFilterEtiquetas,
} from "@pages/por-grupo/tecnico-cme/cruds/etiquetas/etiquetas.style.ts"
import {cnCellRecebimento} from "@pages/por-grupo/administrativo/cruds/caixa/styles-caixa.ts"

import "./etiquetas.css"
import {styleContainerRecebimento} from "@pages/por-grupo/tecnico-cme/processos/recebimento/style.ts"

export const Etiquetas = () => {
	const {
		visible,
		setVisible,
		loading,
		first,
		setFirst,
		onPageChange,
		dateInitial,
		setDateInitial,
		dateFinal,
		setDateFinal,
		refreshTable,
		codigo,
		setCodigo,
		etiquetas,
		filterEtiqueta,
		excluirEtiqueta,
		handleEditarEtiqueta,
		setEtiqueta,
		setVisibleModalDelete,
		setVisibleModalPdf,
		today,
		toastEtiqueta,
		limparFiltro,
		visibleModalDelete,
		etiqueta,
		visibleModalEdicao,
		handleFecharModalEdicao,
		etiquetaEdicao,
		setEtiquetaEdicao,
		visibleModalPdf,
	} = useEtiquetas()
	const { goRouter } = useHome(0)


	const templateActions = (etiqueta: DataEtiqueta) => {
		return (
			<div className="flex gap-2 h-2rem">
				<Button
					icon="pi pi-pencil"
					outlined
					className={styleActionTable(`blue`, 500)}
					onClick={() => handleEditarEtiqueta(etiqueta)}
				/>
				<Button
					className={`bg-red-600 border-red-600 hover:bg-red-700`}
					icon="pi pi-trash"
					onClick={() => {
						setEtiqueta(etiqueta)
						setVisibleModalDelete(true)
					}}
				/>
				<Button
					className={`bg-orange-500 border-orange-500 hover:bg-orange-700`}
					icon="pi pi-file-pdf"
					onClick={() => {
						setEtiqueta(etiqueta)
						setVisibleModalPdf(true)
					}}
				/>
			</div>
		)
	}

	const toastEtiquetaCriada = useCallback(
		(messagem: string) => {
			toastEtiqueta?.current?.show({
				severity: `success`,
				summary: `Sucesso`,
				detail: messagem,
			})
		},
		[toastEtiqueta],
	)

	const handleSalvamento = useCallback(
		(sucesso?: any) => {
			if (sucesso) {
				setVisible(false)
				setFirst(0)
				refreshTable()
				setTimeout(() => {
					toastEtiquetaCriada(`Etiqueta criada com sucesso!`)
				}, 900)
			} else {
				setVisible(false)
			}
		},
		[toastEtiquetaCriada, refreshTable, setFirst, setVisible],
	)

	return (
		<div
			className={ContainerFlexColumnDiv}
			 style={styleContainerRecebimento}>
			<h1 className={titleStyle}>Etiquetas</h1>
			<div className={styleFiltrosEtiquetas}>
				<div className={styleRowFilterEtiquetas}>
					<Calendar
						className={`w-10rem`}
						placeholder={`De:`}
						mask="99/99/9999"
						value={dateInitial}
						onChange={(e) => {
							//@ts-ignore
							setDateInitial(e.value)
						}}
						showIcon
						dateFormat="dd/mm/yy"
						locale="pt"
						maxDate={today}
						showOnFocus={false}
					/>
					<Calendar
						className={`w-10rem`}
						placeholder={`Até:`}
						value={dateFinal}
						onChange={(e) => {
							//@ts-ignore
							setDateFinal(e.value)
						}}
						showIcon
						dateFormat="dd/mm/yy"
						locale="pt"
						maxDate={today}
						showOnFocus={false}
						mask="99/99/9999"
					/>
					<InputText
						placeholder="Código"
						value={codigo}
						onChange={(e) => setCodigo(e.target.value)}
						className="w-5rem"
					/>

					<div className="flex gap-1">
						<Button
							className="hover:bg-blue-600"
							icon="pi pi-search"
							onClick={filterEtiqueta}
						/>
						<Button
							className="bg-gray-800 border-gray-800 hover:bg-gray-900 h-3rem"
							icon="pi pi-times"
							onClick={limparFiltro}
						/>
					</div>
				</div>
				<div className={styleActionsExtern}>
					<Button
						onClick={() => {

							setVisible(true)
						}}
						className="hover:bg-blue-600 p-1 m-0 lg:p-2"
						icon="pi pi-plus"
						label="Nova Etiqueta"
					/>
					<Button
						className="p-3 m-0 lg:p-2"
						outlined
						label="Complementos"
						onClick={() => goRouter(RoutersPathName.Complementos)}
					/>
				</div>
			</div>

			<DataTable
				value={etiquetas?.data}
				loading={loading}
				scrollable
				scrollHeight="500px"
				className="w-full text-sm"
				tableClassName={`p-0`}
				stripedRows
				size={`small`}
				dataKey={`id`}
				rowHover
				emptyMessage="Nenhum resultado encontrado"
			>
				<Column
					headerStyle={headerTableStyle}
					field="produto.descricao"
					header="Produto"
					className={cnCellRecebimento + ` select-none`}
				/>
				<Column
					headerStyle={headerTableStyle}
					field="tipoetiqueta"
					header="Tipo"
					className={cnCellRecebimento + ` select-none`}
				/>
				<Column
					headerStyle={headerTableStyle}
					header="Data"
					field="datalancamento"
					body={DateTemplate(``)}
					className={cnCellRecebimento + ` select-none`}
				/>
				<Column
					headerStyle={headerTableStyle}
					header="Hora"
					field={`horalancamento`}
					body={TimeOnly}
					className={cnCellRecebimento + ` select-none`}
				/>
				<Column
					headerStyle={headerTableStyle}
					field="cliente.nome"
					header="Cliente"
					className={cnCellRecebimento + ` select-none`}
				/>
				<Column
					headerStyle={headerTableStyle}
					header="Profissional"
					field="profissional.nome"
					className={cnCellRecebimento + ` select-none`}
				/>
				<Column
					headerStyle={headerTableStyle}
					header="Ações"
					body={templateActions}
					className={cnCellRecebimento + ` select-none`}
				/>
			</DataTable>

			<PaginatorAndFooter
				first={first}
				onPageChange={onPageChange}
				meta={etiquetas?.meta}
			/>
			<Dialog
				header=':"&#40;'
				onHide={() => setVisibleModalDelete(false)}
				visible={visibleModalDelete}
				draggable={false}
				resizable={false}
				closeOnEscape={true}
				blockScroll={true}
				dismissableMask={true}
			>
				<h2 className="m-0 mb-3">Tem certeza que deseja excluir?</h2>

				<div className="flex gap-2">
					<Button
						label="Não"
						onClick={() => setVisibleModalDelete(false)}
					/>
					<Button
						label="Sim, tenho certeza"
						onClick={() => {
							excluirEtiqueta(etiqueta!)
							setVisibleModalDelete(false)
						}}
					/>
				</div>
			</Dialog>
			<ModalEtiquetaEdicao
				visibleEdicao={visibleModalEdicao}
				onClose={handleFecharModalEdicao}
				etiquetaEdicao={etiquetaEdicao}
				setEtiquetaEdicao={setEtiquetaEdicao}
			/>
			<ModalEtiqueta visible={visible} onClose={handleSalvamento} />
			<ModalEtiquetaPdf
				visible={visibleModalPdf}
				onClose={() => setVisibleModalPdf(false)}
				etiqueta={etiqueta}
			/>
			<Toast ref={toastEtiqueta} />
		</div>
	)
}
