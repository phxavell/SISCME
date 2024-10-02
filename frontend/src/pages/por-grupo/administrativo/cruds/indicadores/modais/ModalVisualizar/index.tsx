import { Dialog } from "primereact/dialog"
import { Message } from "primereact/message"
import { headerTableStyle, styleMessage } from "@/util/styles"
import moment from "moment"
import { DataTable } from "primereact/datatable"
import { rowClassName, styleActionTable } from "@/components/RowTemplate"
import { Column } from "primereact/column"
import { Button } from "primereact/button"
import { Image } from "primereact/image"
import { useCallback } from "react"
import { ModalAssociar } from "../ModalAssociar"
import { useModalView } from "./useModalView"
import { PaginatorAndFooter } from "@/components/table-templates/Paginator/PaginatorAndFooter"
import { ModalLote } from "../ModalLote"

export const ModalVisualizarIndicador = (props: any) => {
	const { showModal, onClose, dadosView, listarIndicadores } = props

	const {
		visible, setVisible,
		lotes,
		lote, setLote,
		loading,
		paginaAtual,
		onPageChange,
		listarLotes,
		visibleModalLote, setVisibleModalLote,
		setPaginaAtual,
		excluirLotes,
		visibleModalExcluir, setVisibleModalExcluir
	} = useModalView(dadosView)

	const messageTemplate = (title: string, label: string | undefined) => {
		return (
			<div>
				<h4 className="p-0 m-0">{title}</h4>
				<p className="p-0 m-0">{label !== `` ? label : `Não informado!`}</p>
			</div>
		)
	}

	const footer = () => {
		return (
			<div>
				<div className="flex mb-2 align-items-center text-sm font-italic">
					Criado por {dadosView?.criado_por?.nome} em {dadosView?.criado_em}s
				</div>
				<div className="flex align-items-center text-sm font-italic">
					Atualizado por {dadosView?.atualizado_por?.nome} em {dadosView?.atualizado_em}s
				</div>
			</div>
		)
	}

	const templateActions = (data: any) => {
		return (
			<div className="flex gap-2 h-2rem">
				<Button
					className={styleActionTable(`blue`, 500)}
					outlined
					icon='pi pi-pencil'
					tooltip={`Editar`}
					onClick={() => {setVisibleModalLote(true), setLote(data)}}
				/>
				<Button
					className={styleActionTable(`red`, 700)}
					outlined
					icon='pi pi-trash'
					tooltip={`Excluir`}
					onClick={() => {setLote(data), setVisibleModalExcluir(true)}}
				/>
				<Button
					className={styleActionTable(`green`, 500)}
					outlined
					icon='pi pi-ticket'
					tooltip={`Realizar operação`}
					onClick={() => {setLote(data), setVisible(true)}}
				/>
			</div>
		)
	}

	const templateFabricacao = (data: any) => {
		if(data?.fabricacao) {
			return moment(data?.fabricacao).format(`DD/MM/YYYY`)
		} else {
			return `Não informada!`
		}
	}

	const templateVencimento = (data: any) => {
		if(data?.vencimento) {
			return moment(data?.vencimento).format(`DD/MM/YYYY`)
		} else {
			return `Não informada!`
		}
	}

	const showImagem = useCallback(() => {
		if(dadosView?.foto) {
			return (
				<Image
					src={`${dadosView?.foto}`}
					alt="Imagem do indicador"
					preview
					width="200"
				/>
			)
		} else {
			return
		}
	}, [dadosView])

	return (
		<>
			<ModalAssociar
				indicador={dadosView}
				lote={lote}
				onClose={() => {
					listarLotes(),
					listarIndicadores(),
					setVisible(false)
				}}
				visible={visible}
			/>

			<ModalLote
				visible={visibleModalLote}
				onClose={() => {
					setVisibleModalLote(false),
					listarIndicadores()
				}}
				buscarLotes={listarLotes}
				indicador={dadosView}
				lote={lote}
			/>

			<Dialog
				header={<i className="pi pi-info-circle"></i>}
				draggable={false}
				resizable={false}
				closeOnEscape={true}
				dismissableMask={true}
				onHide={() => setVisibleModalExcluir(false)}
				visible={visibleModalExcluir}
			>
				<h2 className="m-0 mb-3 flex flex-column">Tem certeza que deseja excluir este registro?</h2>

				<div className="flex gap-2">
					<Button label="Não" onClick={() => setVisibleModalExcluir(false)} />
					<Button
						label="Sim, tenho certeza"
						onClick={() => {
							excluirLotes(lote)
						} }
						data-testid='confirmar-switch' />

				</div>
			</Dialog>

			<Dialog
				header={`Detalhes do Indicador - ${dadosView?.descricao}`}
				visible={showModal}
				onHide={() => {onClose(), setPaginaAtual(0)}}
				style={{
					width: `90vw`,
					height:`90vh`
				}}
				dismissableMask={true}
				closeOnEscape={true}
				draggable={false}
				resizable={false}
				footer={footer}
			>
				<div className="flex gap-8 mb-4">
					<Message
						style={styleMessage}
						className="border-primary h-4rem"
						severity="info"
						content={() => messageTemplate(`Código`, dadosView?.codigo)}
					/>
					<Message
						style={styleMessage}
						className="border-primary h-4rem"
						severity="info"
						content={() => messageTemplate(`Descrição`, dadosView?.descricao)}
					/>
					<Message
						style={styleMessage}
						className="border-primary h-4rem"
						severity="info"
						content={() => messageTemplate(`Tipo`, dadosView?.tipo)}
					/>
					<Message
						style={styleMessage}
						className="border-primary h-4rem"
						severity="info"
						content={() => messageTemplate(`Fabricante`, dadosView?.fabricante)}
					/>
					{showImagem()}
				</div>
				<div className="w-full">
					<h2 className="text-center">Lotes</h2>
					<Button
						label="Novo Lote"
						className=" flex ml-auto mb-3"
						onClick={() => {
							setLote(undefined)
							setVisibleModalLote(true)
						}}
					/>
					<DataTable
						dataKey="id"
						value={lotes?.data}
						scrollHeight="300px"
						loading={loading}
						className="w-full"
						style={{minWidth: `100px`, height: `300px`}}
						rowClassName={rowClassName}
						paginatorClassName={`p-0 mt-0`}
						tableClassName={`p-0`}
						rowHover
						size="small"
						stripedRows
						emptyMessage='Nenhum resultado encontrado.'
					>
						<Column
							field="id"
							header="#"
							headerStyle={headerTableStyle}
						/>
						<Column
							field="codigo"
							header="Código"
							headerStyle={headerTableStyle}
						/>
						<Column
							field="saldo"
							header="Saldo"
							headerStyle={headerTableStyle}
						/>
						<Column
							body={templateFabricacao}
							header="Fabricação"
							headerStyle={headerTableStyle}
						/>
						<Column
							body={templateVencimento}
							header="Vencimento"
							headerStyle={headerTableStyle}
						/>
						<Column
							body={templateActions}
							header="Ações"
							headerStyle={headerTableStyle}
						/>
					</DataTable>
					<PaginatorAndFooter
						first={paginaAtual}
						meta={lotes?.meta}
						onPageChange={onPageChange}
					/>

				</div>
			</Dialog>

		</>
	)
}
