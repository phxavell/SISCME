import {DataTable} from "primereact/datatable"
import {Column} from "primereact/column"
import {ContainerFlexColumnDiv, headerTableStyle, titleStyle} from "@/util/styles"
import {ModalProducao} from "./modal-producao/index.tsx"
import {useProducao} from "./useProducao.ts"
import "./recebimento.css"
import {rowClassName} from "@/components/RowTemplate.tsx"
import {enumFocus} from "@pages/por-grupo/tecnico-cme/processos/producao/types.ts"
import {ModalPreparoEtiquetaPDF} from "./modal-preparo-etiqueta-pdf/index.tsx"
import {InputText} from "primereact/inputtext"
import {Button} from "primereact/button"
import {RoutersPathName} from "@/routes/schemas.ts"
import {PaginatorAndFooter} from "@/components/table-templates/Paginator/PaginatorAndFooter.tsx"
import {styleToolbarTable} from "@pages/por-grupo/administrativo/cruds/styles-crud.ts"
import {
	FlexResponsiveRecebimento,
	styleCell2,
	styleContainerDireito,
	styleContainerEsquerdo,
	styleContainerEsquerdo2,
	styleContainerRecebimento,
	styleRecebimento4,
	styleTabelas
} from "@pages/por-grupo/tecnico-cme/processos/recebimento/style.ts"
import {cnCellRecebimento, heigthTable} from "@pages/por-grupo/administrativo/cruds/caixa/styles-caixa.ts"
import moment from "moment/moment"
import {styleLoadingIcon} from "@pages/por-grupo/tecnico-cme/processos/recebimento/Recebimento.tsx"

export const Producao = () => {

	const {
		handleInput,
		caixas,
		caixasWithProducts,
		visible,
		loading,
		first,
		onPageChange,
		showModal,
		handleCloseModalCaixa,
		cautela, setCautela,
		sequencial, setSerial,
		myRef,
		caixaToPDF, setCaixaToPDF,
		handleCloseModal,
		handleSubmit,
		handleRequest, goRouter,
		pesquisando,
		setFocusAtual,
		refCiclo, focusAtual,
		caixasTemporarias,
	} = useProducao()

	return (
		<div
			className={ContainerFlexColumnDiv}
			style={styleContainerRecebimento}>
			<h1 className={titleStyle}>Produção</h1>
			<div className={FlexResponsiveRecebimento}>
				<div className={styleContainerEsquerdo2}>
					<div className={`margin-top-custom w-full`}>
					</div>
					<div className={styleContainerEsquerdo}>
						<div className={styleCell2}>
							<h4 className={styleRecebimento4}>
                                Últimas caixas produzidas
							</h4>

							<DataTable
								value={caixasTemporarias ?? []}
								emptyMessage={`Os registros serão temporários`}
								scrollHeight={heigthTable}
								className={styleTabelas}
								stripedRows
								rowHover
								dataKey="serial"
								rowClassName={rowClassName}
							>


								<Column
									field="serial"
									header="Caixa"
									headerStyle={headerTableStyle}
									className={cnCellRecebimento}
									style={{
										width: `25%`
									}}
								/>
								<Column
									field=""
									header="Horário"

									headerStyle={headerTableStyle}
									className={cnCellRecebimento}
									body={(data) => {
										return (
											<div>{data.caixa_completa ? `Conforme` : `Não conforme`} em {moment(data.horario).format(`DD/MM/YYYY hh:mm`)}</div>)
									}}
									style={{
										width: `70%`
									}}


								/>
							</DataTable>

						</div>
					</div>
				</div>

				<div className={styleContainerDireito}>
					<div className={styleToolbarTable}>
						<form
							onSubmit={handleSubmit(handleRequest)}
							className="flex gap-2">
							<InputText
								ref={refCiclo}
								value={cautela}
								onChange={(e: any) => {
									setCautela(e?.target?.value)
									setFocusAtual(enumFocus.Ciclo)
								}}
								onFocus={() => {
									if (focusAtual !== enumFocus.Ciclo) {
										setFocusAtual(enumFocus.Ciclo)
									}
								}}
								type="number"
								placeholder="Ciclo"
								className="w-6rem"
							/>
							<InputText
								ref={myRef}
								value={sequencial}
								onChange={(e: any) => {

									setSerial(e?.target?.value)
								}}
								onFocus={() => {
									if (focusAtual !== enumFocus.Serial) {
										setFocusAtual(enumFocus.Serial)
									}
								}}

								data-testid='serial'
								type="text"
								placeholder="Serial da caixa"
								autoFocus
								className="w-10rem"

							/>
							<Button
								type="submit"
								iconPos={`right`}
								icon='pi pi-box'
								label={`Conferir`}
								className={` h-3rem mr-auto w-8rem`}
								data-testid='check-serial-producao'
								loading={pesquisando}
								onClick={() => {
									handleInput({
										cautela: cautela,
										serial: sequencial
									}).then(() => {
										setCautela(``)
										setSerial(``)
									})
								}}
							/>

						</form>
						<Button
							disabled={pesquisando}
							iconPos={`right`}
							icon='pi pi-check-square'
							className={`h-3rem w-12rem xl:w-18rem`}
							label={`Histórico de itens produzidos`}
							onClick={() => {
								goRouter(RoutersPathName.PesquisarProducoes)
							}
							}/>
					</div>
					<h4 className={styleRecebimento4}>
                        Caixas a produzir
					</h4>
					<DataTable
						value={caixas?.data}
						loading={loading}
						scrollHeight={`420px`}
						paginatorClassName={`p-0 mt-0`}
						tableClassName={`p-0`}
						style={{height: 420}}
						className={styleTabelas}
						loadingIcon={styleLoadingIcon}
						dataKey="serial"
						stripedRows
						rowHover
						rowClassName={rowClassName}



						emptyMessage='Não há caixas pendentes.'
					>
						<Column
							field="serial"
							header="Serial"
							headerStyle={headerTableStyle}
							className={cnCellRecebimento + ` cursor-auto select-all`}
						/>
						<Column
							field="nome_caixa"
							header="Descrição"
							headerStyle={headerTableStyle}
							className={cnCellRecebimento + ` select-none`}
						/>
						<Column
							field="cliente"
							header="Cliente"
							headerStyle={headerTableStyle}
							className={cnCellRecebimento + ` select-none`}
						/>


					</DataTable>
					<PaginatorAndFooter
						first={first}
						onPageChange={onPageChange}
						meta={caixas?.meta}/>
				</div>

			</div>
			<div style={{
				display: `none`
			}}>
				<img id="barcode"/>
			</div>
			<ModalProducao
				closeDialog={handleCloseModal}
				conteudo={caixasWithProducts}
				openDialog={visible}
				setCaixaToPDF={setCaixaToPDF}
			/>
			{/*
			    todo refatorar para não usar um componente específico
			*/}
			<ModalPreparoEtiquetaPDF
				showModal={showModal}
				setShowModal={() => {
					handleCloseModalCaixa()
				}}
				preparoEtiquetaToPDF={caixaToPDF}
			/>

		</div>


	)
}
