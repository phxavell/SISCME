import {Dialog} from "primereact/dialog"
import React, {useCallback} from "react"
import {HeaderTemplateEsterilizacao} from "./componentes/HeaderTemplateEsterilizacao.tsx"
import {useModalCaixaEsterilizacao} from "./useModalCaixaEsterilizacao"
import {DadosIniciaisEsterilizacao} from "./componentes/DadosIniciaisEsterilizacao.tsx"
import {CadastrarCaixasEsterilizacao} from "./componentes/CadastrarCaixasEsterilizacao.tsx"
import {FormProvider} from "react-hook-form"
import {styleForm} from "@pages/por-grupo/administrativo/cruds/caixa/styles-caixa.ts"

interface IModalEsterilizacao {
    onClose: (requerAtualizacao?: boolean) => void
    showModal: boolean
    equipamentos: any
}

export const ModalEsterilizacao: React.FC<IModalEsterilizacao> = (props) => {
	const {
		showModal,
		onClose,
		equipamentos
	} = props

	const {
		clear,
		etapaCadastro, setEtapaCadastro,
		handleClickProsseguir,
		salvando,
		formOptions,
		handleEnviarEsterilizacao,
		methodsUseForm, caixasDisponiveis,
		caixasSelecionadas, setCaixasSelecionadas,
	} = useModalCaixaEsterilizacao(showModal)

	const ShowEtapa = useCallback(() => {
		if (etapaCadastro === 0) {
			return (
				<form className={styleForm}>
					<DadosIniciaisEsterilizacao
						formOptions={formOptions}
						equipamentouuid={equipamentos}
					/>
				</form>
			)
		}
		return (
			<form className={styleForm}>
				<CadastrarCaixasEsterilizacao
					caixasDisponiveis={caixasDisponiveis}
					setCaixasSelecionadas={setCaixasSelecionadas}
					caixasSelecionadas={caixasSelecionadas}
				/>
			</form>
		)
	}, [
		caixasDisponiveis,
		caixasSelecionadas,
		equipamentos,
		etapaCadastro,
		formOptions,
		setCaixasSelecionadas,
	])

	const handleCloseDialog = () => {
		setEtapaCadastro(0)
		clear()
		onClose(false)
	}


	return (
		<FormProvider {...methodsUseForm}>
			<Dialog
				style={{
					width: `100%`,
					height: `100%`

				}}
				data-testid='esterilizacao-modal'
				draggable={false}
				resizable={false}
				dismissableMask={true}
				closeOnEscape={true}
				onHide={handleCloseDialog}
				header={
					<HeaderTemplateEsterilizacao
						handleClickProsseguir={handleClickProsseguir}
						etapaCadastro={etapaCadastro}
						setEtapaCadastro={setEtapaCadastro}
						onClose={handleCloseDialog}
						caixasSelecionadas={caixasSelecionadas}
						handleEnviarEsterilizacao={handleEnviarEsterilizacao}
						salvando={salvando}
					/>}
				visible={showModal}
				position="top"
			>
				{ShowEtapa()}
			</Dialog>
		</FormProvider>
	)
}
