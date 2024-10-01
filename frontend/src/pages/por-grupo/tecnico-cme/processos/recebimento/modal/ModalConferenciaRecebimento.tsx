import { Dialog } from "primereact/dialog"
import "./modal.css"
import React, { useCallback, useEffect, useState } from "react"
import { InputNumber } from "primereact/inputnumber"
import { Fieldset } from "primereact/fieldset"
import { ModalN } from "@pages/por-grupo/tecnico-cme/processos/recebimento/types.ts"
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
import { PreRecebimentoAPI } from "@infra/integrations/processo/recebimento/pre-recebimento.ts"
import { useAuth } from "@/provider/Auth"
import {useDebounce} from "primereact/hooks"

const debounceTime = 700
export const ModalConferenciaRecebimento: ModalN.ModalRecebimentoType = (
	props,
) => {
	const { user, toastSuccess, toastError } = useAuth()


	const { openDialog, closeDialog, conteudo, alertReduced } = props

	const [ItensCaixaChecada, setItensCaixaChecada] = useState<any[]>([])
	const [focusAtual,focusAtualDebounce, setFocusAtual] = useDebounce(`serial`, debounceTime)

	useEffect(() => {
		if (conteudo?.produtos) {
			setItensCaixaChecada(conteudo.produtos)
		}
	}, [conteudo])

	useEffect(()=> {
		const timeout= setTimeout (()=> {
			if(focusAtualDebounce !==`serial`){
				setFocusAtual(`serial`)
			}
		}, 300)
		return ()=> {
			// @ts-ignore
			clearTimeout(timeout)
		}
	}, [focusAtualDebounce, setFocusAtual])

	const handleClose = useCallback((trueOfFalse?: any) => {
		closeDialog(trueOfFalse)
	}, [closeDialog])

	const handleBipConfirmacao = useCallback(
		async (v: { serial: string }, imagens: any) => {
			if (
				conteudo &&
                v.serial &&
                v.serial.toUpperCase() === conteudo?.serial
			) {
				const payload = {
					...conteudo,
					files: imagens,
				}
				PreRecebimentoAPI.finalizarChecagem(
					user,
					payload,
					ItensCaixaChecada,
				)
					.then(() => {
						const caixa_completa_ =
                            ItensCaixaChecada.findIndex(
                            	(check) => !check.check,
                            ) === -1
						const caixa = {
							...payload,
							caixaEditada: ItensCaixaChecada,
							horario: new Date(),
							caixa_completa: caixa_completa_,
						}
						handleClose(caixa)

						toastSuccess(`Caixa recebida com sucesso!`)



					})
					.catch((e) => {
						toastError(e, false)
					})
			} else {
				toastError(`Serial não confere com o da caixa`, false)
			}
		},
		[
			alertReduced,
			ItensCaixaChecada,
			conteudo,
			handleClose,
			toastError,
			toastSuccess,
			user,
		],
	)

	return (
		<Dialog
			className={styleDialogConferencia}
			headerClassName={`pb-0 pt-2`}
			header={
				<HeaderModalConferencia
					conteudo={conteudo}
					openDialog={openDialog}
					hadleSubmitInput={handleBipConfirmacao}
					itensCaixaChecada={ItensCaixaChecada}
					focusAtual={focusAtual}
				/>
			}
			visible={openDialog}
			onHide={() => handleClose()}
			position="top"
			data-testid="modal-conferencia-recebimento"
			blockScroll={false}
			draggable={false}
			dismissableMask={true}
			closeOnEscape={true}
			pt={styleDialogRecebimento.pt}
		>
			<div className={`flex flex-column`}>
				<div className={stylesDivGrid}>
					<div className={classesGridItens} style={styleGridItens}>
						{ItensCaixaChecada?.map((item: any, index: number) => {
							return (
								<Fieldset
									className={styleRecebimentoItem(item)}
									legend={item.produto}
									pt={ptExpandFieldset}
									key={item.id}
								>
									<div className={`flex flex-row gap-2 `}>
										<div
											className={
												styleInputNumberRecebimento
											}
										>
											<div className={`titleItem`}>
                                                Previsto
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
												value={item.quantidade}
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
												value={item.quantidadeB}
												size={1}
												onValueChange={(e) => {
													setFocusAtual(`quantidade`)
													const prevBox = [
														...ItensCaixaChecada,
													]
													const isDiferente =
                                                        item.quantidade !==
                                                        e.value
													prevBox.splice(index, 1, {
														...ItensCaixaChecada[
															index
														],
														quantidadeB:
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
