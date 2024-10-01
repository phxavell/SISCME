import {rowClassName, styleActionHeader} from "@/components/RowTemplate.tsx"
import {styleColumnCaixa} from "@pages/por-grupo/administrativo/cruds/caixa/styles-caixa.ts"
import {ContainerFlexColumnDiv, headerTableStyle} from "@/util/styles"
import {Button} from "primereact/button"
import {Column} from "primereact/column"
import {DataTable} from "primereact/datatable"
import {Calendar} from 'primereact/calendar'
import {InputText} from "primereact/inputtext"
import {usePesquisarDistribuicao} from "./usePesquisarDistribuicao"
import React from "react"
import {ModalBaixarPDF} from "@/components/modal-pdf/ModalBaixarPDF.tsx"
import {RelatorioDistribuicaoTemplate} from "@/components/pdf-templates/RelatorioDistribuicaoTemplate.tsx"
import {TitleWithBackArrow} from "@/components/TitleWithBackArrow.tsx"
import {RoutersPathName} from "@/routes/schemas.ts"
import TableColumn from "@/components/table-templates/TableColumn.tsx"
import {DropdownSearch} from "@/components/DropdownSeach/DropdownSearch.tsx"
import {PaginatorAndFooter} from "@/components/table-templates/Paginator/PaginatorAndFooter.tsx"

export const PesquisarDistribuicao = () => {

	const {
		distribuidos,
		paginaAtual, setPaginaAtual,
		onPageChange,
		loading,
		fromDate, setFromDate,
		toDate, setToDate,
		sequencial, setSerial,
		handleGerarPDF,
		cliente, setCliente,
		showModalBaixarPDF, setShowModalBaixarPDF,
		setConteudoSelecionado,
		conteudoParaPDF, setConteudoParaPDF,
		setUsandoPesquisa,
		loadingOption,
		setores,
		onFilterItens,
		control,
		formState: {errors},
		reset,
	} = usePesquisarDistribuicao()

	const templateActions = (item: any) => {
		return (
			<div className="flex gap-2 h-2rem">
				<Button
					text
					icon="pi pi-file-pdf"
					className={styleActionHeader(`orange`, `400`, `600`)}
					style={{color: `white`}}
					onClick={() => {
						handleGerarPDF(item)
					}}
				/>
			</div>
		)
	}

	return (
		<div className={ContainerFlexColumnDiv}>
			<TitleWithBackArrow
				title={`Pesquisa de Itens em Distribuição`}
				page={RoutersPathName.Distribuicao}
			/>
			<div className="flex gap-2 align-items-start relative">
				<div className=" flex flex-col gap-2 p-2">
					<Calendar
						id="fromDate"
						value={fromDate}
						onChange={(e) => setFromDate(e.value)}
						showTime
						placeholder="Dt. Início"
						locale="pt"
						className={`w-15rem h-3rem`}
						hideOnDateTimeSelect={true}
						showIcon
						showOnFocus={false}
						dateFormat="dd/mm/yy"/>
					<Calendar
						className={`w-15rem h-3rem`}
						id="toDate"
						value={toDate}
						onChange={(e) => setToDate(e.value)}
						placeholder="Dt. Fim"
						showTime
						hideOnDateTimeSelect={true}
						locale="pt"
						showOnFocus={false}
						showIcon
						dateFormat="dd/mm/yy"/>
					<InputText
						className={`w-8rem h-3rem`}
						id="cliente"
						value={cliente}
						onChange={(e) => {
							setCliente(e?.target?.value)
							setPaginaAtual(0)
						}}
						placeholder="Cliente"/>
					<InputText
						className={`w-8rem h-3rem`}
						id="sequencial"
						value={sequencial}

						onChange={(e) => {
							setSerial(e.target.value)
							setPaginaAtual(0)
						}}
						placeholder="Serial"/>
					<div className={`w-9rem  h-3rem`}>
						<DropdownSearch
							label="Setor"
							keyItem="setor"
							control={control}
							errors={errors}
							filter
							showAdd={false}
							loadingOptions={loadingOption}
							listOptions={setores}
							optionsObject={{
								optionValue: `descricao`,
								optionLabel: `descricao`
							}}
							onFilter={onFilterItens}
						/>
					</div>

					<Button
						icon="pi pi-times"
						onClick={() => {
							setUsandoPesquisa(false)
							setSerial(``)
							setCliente(``)
							setFromDate(``)
							setToDate(``)
							reset()
						}}
						className={styleActionHeader(`blue`, `600`, `700`)}
					/>
				</div>
			</div>

			<ModalBaixarPDF
				nomeArquivo={`Distribuição`}
				documentoPDF={<RelatorioDistribuicaoTemplate {...conteudoParaPDF}/>}
				showModal={showModalBaixarPDF}
				closeModal={() => {
					setShowModalBaixarPDF(false)
					setConteudoSelecionado(undefined)
					setConteudoParaPDF(undefined)
				}}
			/>
			<DataTable
				scrollHeight="550px"
				style={{ height: 550}}
				value={distribuidos?.data?? []}
				size={`small`}
				className={`w-full`}
				emptyMessage="Nenhum resultado encontrado."
				stripedRows
				loading={loading}
				dataKey={`distribuicao`}
				rowClassName={rowClassName}
				rowHover
			>
				<Column
					field="cliente"
					header="Cliente"
					headerStyle={headerTableStyle}
					className={styleColumnCaixa}
				/>
				<Column
					field="setor"
					header="Setor"
					headerStyle={headerTableStyle}
					className={styleColumnCaixa}
					body={TableColumn}
				/>
				<Column
					field="data_distribuicao"
					header="Data da Distribuição"
					headerStyle={headerTableStyle}
					className={styleColumnCaixa}
				/>
				<Column
					field="quantidade_caixas"
					header="Quantidade de Caixas"
					headerStyle={headerTableStyle}
					className={styleColumnCaixa}
				/>
				<Column
					header="PDF"
					headerStyle={headerTableStyle}
					body={templateActions}
				/>
			</DataTable>
			<PaginatorAndFooter
				first={paginaAtual}
				onPageChange={onPageChange}
				meta={distribuidos?.meta}/>

		</div>
	)
}
