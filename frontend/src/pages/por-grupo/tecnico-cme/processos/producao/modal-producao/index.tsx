import { Dialog } from "primereact/dialog"
import "./modal.css"
import React from "react"
import { InputNumber } from "primereact/inputnumber"
import { Fieldset } from "primereact/fieldset"
import { ModalProducaoConferencia } from "@pages/por-grupo/tecnico-cme/processos/producao/types"

import { useModalProducao } from "./useModalProducao"
import {
	classesGridItens,
	ptExpandFieldset,
	styleDialogConferencia,
	styleDialogRecebimento,
	styleGridItens,
	styleInputNumberRecebimento,
	styleRecebimentoItem,
	stylesDivGrid,
} from "@pages/por-grupo/tecnico-cme/processos/recebimento/modal/styles.ts"
import { HeaderModalConferencia } from "@pages/por-grupo/tecnico-cme/processos/recebimento/modal/HeaderModalConferencia.tsx"

export const ModalProducao: ModalProducaoConferencia.ModalPreparoType = (
	props,
) => {
	const { openDialog, closeDialog, conteudo, setCaixaToPDF } = props

	const {
		setItensCaixaChecada,
		itensCaixaChecada,
		handleClose,
		hadleSubmitInput,
		focusAtual,
		indicador,
		setIndicador
	} = useModalProducao(conteudo, closeDialog, setCaixaToPDF)

	return (
		<Dialog
			className={styleDialogConferencia}
			headerClassName={`pb-0 pt-2`}
			header={
				<HeaderModalConferencia
					conteudo={conteudo}
					openDialog={openDialog}
					hadleSubmitInput={hadleSubmitInput}
					itensCaixaChecada={itensCaixaChecada}
					focusAtual={focusAtual}
					indicador={indicador}
					setIndicador={setIndicador}
					isProducao
				/>
			}
			visible={openDialog}
			onHide={() => {
				handleClose()
				setIndicador(undefined)
			}}
			position="top"
			data-testid="modal-producao"
			blockScroll={false}
			draggable={false}
			dismissableMask={true}
			closeOnEscape={true}
			pt={styleDialogRecebimento.pt}
		>
			<div className={`flex flex-column`}>
				<div className={stylesDivGrid}>
					<div className={classesGridItens} style={styleGridItens}>
						{itensCaixaChecada?.map((item: any, index: number) => {
							return (
								<Fieldset
									className={styleRecebimentoItem(item)}
									legend={item?.produto}
									pt={ptExpandFieldset}
									key={item?.id}
								>
									<div className={`flex flex-row gap-2 `}>
										<div
											className={
												styleInputNumberRecebimento
											}
										>
											<div className={`titleItem`}>
                                                Padrão
											</div>
											<InputNumber
												showButtons={false}
												buttonLayout="vertical"
												decrementButtonClassName="p-button-secondary"
												incrementButtonClassName="p-button-secondary"
												incrementButtonIcon="pi pi-plus"
												decrementButtonIcon="pi pi-minus"
												style={{ width: `4rem` }}
												size={1}
												value={item?.quantidade}
												disabled
											/>
										</div>
										<div
											className={
												styleInputNumberRecebimento
											}
										>
											<div className="titleItem">
                                                Apurado
											</div>
											<InputNumber
												showButtons
												buttonLayout="stacked"
												decrementButtonClassName="p-button-secondary"
												incrementButtonIcon="pi pi-plus"
												decrementButtonIcon="pi pi-minus"
												style={{ width: `4rem` }}
												value={item.quantidade_checada}
												size={1}
												onValueChange={(e) => {
													const prevBox = [
														...itensCaixaChecada,
													]
													const isDiferente =
                                                        item.quantidade !==
                                                        e.value
													prevBox.splice(index, 1, {
														...itensCaixaChecada[
															index
														],
														quantidade_checada:
                                                            e.value || 0,
														check: !isDiferente,
													})
													setItensCaixaChecada(
														prevBox,
													)
												}}
												min={0}
											/>
										</div>
									</div>
								</Fieldset>
							)
						})}
					</div>
				</div>
			</div>
		</Dialog>
	)
}
