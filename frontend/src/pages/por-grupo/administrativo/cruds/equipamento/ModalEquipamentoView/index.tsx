import { Dialog } from "primereact/dialog"
import { Message } from "primereact/message"
import { headerTableStyle, styleMessage } from "@/util/styles"
import moment from "moment"
import { useModalEquipamentoView } from "./useModalEquipamentoView"
import { Button } from "primereact/button"
import { styleActionTable } from "@/components/RowTemplate"
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import { useCallback, useRef, useState } from "react"
import { OverlayPanel } from 'primereact/overlaypanel'
import { IModalEquipamento } from "./interfaces"
import { messageTemplate } from "@/components/TextFields/messager"
import DatetimeTemplate from "@/components/table-templates/DatetimeTemplate"

export const ModalEquipamentoView = (props: IModalEquipamento) => {
	const { showModal, setShowModal, dadosView} = props
	const {
		visibleModalHistoricoManutencao, setVisibleModalHistoricoManutencao,
		manutencoes,
		handleBuscarManutencao
	} = useModalEquipamentoView()

	const buttonEl = useRef(null)
	const [descricao, setDescricao] = useState(``)

	const footer = () => {
		return (
			<div>
				<div className="flex mb-2 align-items-center text-sm font-italic">
					Criado por {dadosView?.data.criado_por?.nome} em {moment(dadosView?.data.criado_em).format(`DD/MM/YYYY HH:mm`)}
				</div>
				<div className="flex align-items-center text-sm font-italic">
					Atualizado por {dadosView?.data.atualizado_por?.nome} em {moment(dadosView?.data.atualizado_em).format(`DD/MM/YYYY HH:mm`)}
				</div>
			</div>
		)
	}

	const exibirDescricao = useCallback(() => {
		if(descricao) {
			return descricao
		} else {
			return `Descrição não informada.`
		}
	}, [descricao])

	const templateDescricao = (data: any) => {
		return(
			<>
				<Button
					icon='pi pi-eye'
					className="h-2rem"
					onClick={(e) => {
						setDescricao(data?.descricao)
						if (buttonEl.current) {
							(buttonEl.current as OverlayPanel).toggle(e)
						}
					}}
				/>
				<OverlayPanel
					ref={buttonEl}
					className="bg-gray-900 text-white w-8"
				>
					<h4>{exibirDescricao()}</h4>
				</OverlayPanel>
			</>
		)
	}

	return (
		<>
			<Dialog
				header={`Histórico de manutenção - ${dadosView?.data.descricao}`}
				visible={visibleModalHistoricoManutencao}
				onHide={() => setVisibleModalHistoricoManutencao(false)}
				style={{
					minWidth: `70vw`,
				}}
				dismissableMask={true}
				closeOnEscape={true}
				draggable={false}
				resizable={false}

			>
				<DataTable
					dataKey="id"
					value={manutencoes?.data}
					className="w-full"
					style={{minWidth: `100px`}}
					paginatorClassName={`p-0 mt-0`}
					tableClassName={`p-0`}
					rowHover
					stripedRows
					emptyMessage='Nenhum resultado encontrado'
				>
					<Column
						field="usuario.nome"
						header="Usuário"
						headerStyle={headerTableStyle}
					/>
					<Column
						field="inicio"
						body={DatetimeTemplate}
						header="Data Início"
						headerStyle={headerTableStyle}
					/>
					<Column
						field="fim"
						body={DatetimeTemplate}
						header="Data Fim"
						headerStyle={headerTableStyle}
					/>
					<Column
						field="tipo"
						header="Tipo de Manutenção"
						headerStyle={headerTableStyle}
					/>
					<Column
						field="observacao"
						header="Descrição"
						headerStyle={headerTableStyle}
						body={templateDescricao}
					/>
				</DataTable>
			</Dialog>
			<Dialog
				header={`Detalhes do Equipamento - ${dadosView?.data.descricao}`}
				visible={showModal}
				onHide={() => setShowModal(false)}
				style={{
					minWidth: `50vw`,
				}}
				dismissableMask={true}
				closeOnEscape={true}
				draggable={false}
				resizable={false}
				footer={footer}

			>

				<div className="flex gap-6 mb-4 align-items-center">
					<Message
						style={styleMessage}
						className="border-primary h-4rem"
						severity="info"
						content={() => messageTemplate(`Número de Série`, dadosView?.data.numero_serie)}
					/>
					<Message
						style={styleMessage}
						className="border-primary h-4rem"
						severity="info"
						content={() => messageTemplate(`Descrição`, dadosView?.data.descricao)}
					/>
					<Message
						style={styleMessage}
						className="border-primary h-4rem"
						severity="info"
						content={() => messageTemplate(`Fabricante`, dadosView?.data.fabricante)}
					/>
					<Message
						style={styleMessage}
						className="border-primary h-4rem"
						severity="info"
						content={() => messageTemplate(`Capacidade (L)`, dadosView?.data.capacidade)}
					/>
				</div>
				<div className="flex gap-6 mb-4 align-items-center">
					<Message
						style={styleMessage}
						className="border-primary h-4rem"
						severity="info"
						content={() => messageTemplate(`Tipo`, dadosView?.data.tipo.valor)}
					/>
					<Message
						style={styleMessage}
						className="border-primary h-4rem"
						severity="info"
						content={() => messageTemplate(`Situação`, dadosView?.data.ativo ? `Ativo` : `Inativo`)}
					/>
					<Message
						style={styleMessage}
						className="border-primary h-4rem"
						severity="info"
						content={() => messageTemplate(`Registro Anvisa`, dadosView?.data.registro_anvisa)}
					/>
					<Message
						style={styleMessage}
						className="border-primary h-4rem"
						severity="info"
						content={() => messageTemplate(`Data de Fabricação`, moment(dadosView?.data.data_fabricacao).format(`DD/MM/YYYY`))}
					/>
				</div>
				<div className="flex gap-6 align-items-center">
					<Message
						style={styleMessage}
						className="border-primary h-4rem"
						severity="info"
						content={() => messageTemplate(`Próxima Manutenção`, dadosView?.data.proxima_manutencao? moment(dadosView?.data.proxima_manutencao).format(`DD/MM/YYYY`) : `Não informado!`)}
					/>
					<Message
						style={styleMessage}
						className="border-primary h-4rem"
						severity="info"
						content={() => messageTemplate(`Ultima Manutenção`, dadosView?.data.ultima_manutencao ? moment(dadosView?.data.ultima_manutencao).format(`DD/MM/YYYY`) : `Não informado!`)}
					/>
					<Button
						label="Histórico de manutenções"
						onClick={() => {setVisibleModalHistoricoManutencao(true), handleBuscarManutencao(dadosView?.data.idequipamento)}}
						className={styleActionTable(`blue`, 600)}
					/>
				</div>
			</Dialog>

		</>
	)
}
