import '../style.css'
import {ModalCaixa} from "@pages/por-grupo/administrativo/cruds/caixa/nova-caixa/modal-caixa/ModalCaixa.tsx"
import {ContainerFlexColumnDiv, headerTableStyle, titleStyle} from "@/util/styles"
import {Button} from "primereact/button"
import {Column} from "primereact/column"
import {DataTable} from "primereact/datatable"
import {styleColumnCaixa, styleImagemTemplate} from "@pages/por-grupo/administrativo/cruds/caixa/styles-caixa.ts"
import {
	ModalDetailsCaixa
} from '@pages/por-grupo/administrativo/cruds/caixa/nova-caixa/modal-detail/ModalDetailCaixa.tsx'
import {rowClassName, styleActionHeader} from '@/components/RowTemplate.tsx'
import {InputText} from 'primereact/inputtext'
import {useModeloCaixa} from './useModeloCaixa'
import {Calendar} from 'primereact/calendar'
import {useEffect, useRef, useState} from 'react'
import {DialogNovoSerial} from './modal-serial'
import {ModalBaixarPDF} from '@/components/modal-pdf/ModalBaixarPDF'
import {PatrimonioCaixa} from '@/components/pdf-templates/PatrimonioCaixa'
import JsBarcode from 'jsbarcode'
import {useSerial} from './modal-serial/useSerial'
import {ModalConfirmDelete} from "@pages/por-grupo/administrativo/cruds/produto/ModalConfirmDelete.tsx"
import {PaginatorAndFooter} from "@/components/table-templates/Paginator/PaginatorAndFooter.tsx"
import {
	styleFilter,
	styleInputIsolado,
	styleInputsFilter,
	styleToolbarTable
} from "@pages/por-grupo/administrativo/cruds/styles-crud.ts"

export const NovaCaixa= ()=> {
	const [showModalSerial, setShowModalSerial] = useState(false)
	// @ts-ignore
	const myRef = useRef<InputText>(null)

	const {
		codigo, fromDate, toDate,
		setCodigo, setFromDate, setToDate,
		showModal, setShowModal,
		caixas,
		loadingListagemCaixas,
		first, showModalDetail,
		preparaParaEditar,
		prepararParaDeletar,
		handleCloseModalCaixa,
		onPageChange,
		handleExcluir,
		setVisibleModalDelete,
		visibleModalDelete, itemParaDeletar,
		caixaToShowDetail, modoEdicao, setCaixaToShowDetail, setShowModalDetail,
	} = useModeloCaixa()

	const {
		seriais,
		listarSeriais
	} = useSerial()

	const bodyFotoTemplate = (data: any) => {
		if (data.imagem) {
			return (
				<div className={styleImagemTemplate}>
					<img
						src={`${data.imagem}`}
						alt="Image de caixa"
						width="100"
						onClick={(e: React.MouseEvent<HTMLImageElement>) => {
							e.preventDefault()
							e.stopPropagation()
						}}
					/>
				</div>
			)
		}
	}

	const templateActions = (caixa: any) => {
		return (
			<div className="flex gap-2 h-2rem">
				<Button
					icon='pi pi-tags'
					tooltip='Gerar seriais'
					className={styleActionHeader(`orange`, `600`, `400`)}
					onClick={() => {
						setCaixaToShowDetail(caixa)
						setShowModalSerial(true)
					}}
				/>
				<Button
					icon='pi pi-eye'
					tooltip='Mais detalhes'
					className={styleActionHeader(`green`, `600`, `400`)}
					onClick={() => {
						listarSeriais(caixa.id)
						setCaixaToShowDetail(caixa)
						setShowModalDetail(true)
					}}
				/>

				<Button
					tooltip='Editar'
					className={styleActionHeader(`blue`, `600`, `400`)}
					icon='pi pi-pencil'
					onClick={(e) => {
						e.preventDefault()
						e.stopPropagation()
						preparaParaEditar(caixa)
					}}
				/>

				<Button
					icon='pi pi-trash'
					tooltip='Excluir'
					className={styleActionHeader(`red`, `800`, `600`)}
					onClick={() => {
						prepararParaDeletar(caixa)
					}
					}
				/>
			</div>
		)
	}

	const [conteudoParaPdf, setConteudoParaPdf] = useState<any>(null)
	const [showModalPdf, setShowModalPdf] = useState(false)
	const [imagemToPDF, setImagemToPDF] = useState<any>(undefined)

	useEffect(()=> {
		if(conteudoParaPdf){
			JsBarcode(`#barcode`, conteudoParaPdf.serial, {
				height: 64,
				fontOptions: `bold`,
				textMargin: 0,
				textAlign: `center`,
				margin:0,

				// background: 'blue',

			})
			setTimeout(() => {
				const node2 = document.getElementById(`barcode`)
				//@ts-ignore
				setImagemToPDF(node2?.src)
			}, 200)
		}
	}, [conteudoParaPdf])

	useEffect(()=> {
		if(imagemToPDF){
			setShowModalPdf(true)
		}
	}, [imagemToPDF])

	const resetFilter = () => {
		setCodigo(``)
		setFromDate(``)
		setToDate(``)
	}

	return (
		<div className={ContainerFlexColumnDiv}>
			<h1 className={titleStyle}>Modelos de Caixa</h1>
			<div className={styleToolbarTable}>
				<div className={styleFilter}>
					<div className={styleInputsFilter}>
						<Calendar
							className={styleInputIsolado}
							id="fromDate"
							value={fromDate}
							onChange={(e) => setFromDate(e.value)}
							placeholder="Dt. Início"
							showTime
							showIcon
							dateFormat="dd/mm/yy"
						/>
						<Calendar
							className={styleInputIsolado}
							id="toDate"
							value={toDate}
							onChange={(e) => setToDate(e.value)}
							placeholder="Dt. Fim"
							showTime
							showIcon
							dateFormat="dd/mm/yy"
						/>
						<InputText
							className={styleInputIsolado}
							ref={myRef}
							id="serial"
							placeholder="Código/Descrição"
							value={codigo}
							autoFocus={true}
							onChange={(e) => setCodigo(e.target.value)}
						/>
						<Button
							className={styleActionHeader(`gray`, `700`, `500`) + ` h-3rem ml-1`}
							icon="pi pi-times"
							tooltip="Limpar pesquisa"

							onClick={resetFilter}
						/>
					</div>

				</div>
				<Button
					onClick={() => {
						setShowModal(true)
					}}
					className="w-2 p-0"
					label="Novo Modelo de Caixa"
				/>
			</div>
			<DataTable
				loading={loadingListagemCaixas}
				scrollHeight="500px"
				style={{ height: 500}}
				dataKey="id"
				value={caixas?.data ?? []}
				className={`w-full text-sm`}
				paginatorClassName={`p-0 mt-0`}
				tableClassName={`p-0`}
				emptyMessage='Nenhum resultado encontrado.'
				stripedRows
				rowClassName={rowClassName}
				rowHover
				removableSort
				sortField={`id`}
				sortOrder={-1}
			>
				<Column
					field="id"
					header="#"
					headerStyle={headerTableStyle}
					className={styleColumnCaixa}
				/>
				<Column
					field="codigo_modelo"
					header="Código"
					headerStyle={headerTableStyle}
					className={styleColumnCaixa}
				/>
				<Column
					field="nome"
					header="Nome"
					sortable
					headerStyle={headerTableStyle}
					className={styleColumnCaixa}
				/>
				<Column
					field="total_itens"
					header="Total de itens"
					headerStyle={headerTableStyle}
					className={styleColumnCaixa}
				/>
				<Column
					headerStyle={headerTableStyle}
					header="Foto"
					body={bodyFotoTemplate}
					className={styleColumnCaixa}
				/>
				<Column
					field="criado_em"
					header="Criado em"
					headerStyle={headerTableStyle}
					className={styleColumnCaixa}
				/>
				<Column
					header="Ações"
					headerStyle={headerTableStyle}
					body={templateActions}
				/>
			</DataTable>
			<PaginatorAndFooter
				first={first}
				onPageChange={onPageChange}
				meta={caixas?.meta}/>
			<ModalCaixa
				modoEdicao={modoEdicao}
				caixaAEditar={caixaToShowDetail}
				setShowModal={handleCloseModalCaixa}
				showModal={showModal}
			/>
			<ModalDetailsCaixa
				visible={showModalDetail}
				seriais={seriais}
				onClose={() => {
					setCaixaToShowDetail(undefined)
					setShowModalDetail(false)
				}}
				caixa={caixaToShowDetail}
				onDelete={(caixa) => {
					prepararParaDeletar(caixa)
				}}
				onEdit={(caixa) => {
					setShowModalDetail(false)
					preparaParaEditar(caixa)
				}}
				setConteudoParaPdf={setConteudoParaPdf}
			/>

			<ModalConfirmDelete
				modalTipoVisible={visibleModalDelete}
				titulo="Confirmar"
				onClose={() => setVisibleModalDelete(false)}
				onConfirm={() => handleExcluir(itemParaDeletar)}
			/>

			<DialogNovoSerial
				setShowModal={setShowModalSerial}
				showModal={showModalSerial}
				data={caixaToShowDetail}
				setConteudoParaPdf={setConteudoParaPdf}
			/>
			<ModalBaixarPDF
				closeModal={()=> {
					setConteudoParaPdf(undefined)
					setImagemToPDF(undefined)
					setShowModalPdf(false)
				}}
				documentoPDF={<PatrimonioCaixa {...{...conteudoParaPdf,
					barcodeSrc:imagemToPDF
				}}></PatrimonioCaixa>}
				showModal={showModalPdf}
				nomeArquivo='etiquetaCaixa'
				hiddenButtonDownload={true}

			/>
			<div style={{
				display: `none`
			}}>
				<img id="barcode"/>
			</div>

		</div>
	)
}
