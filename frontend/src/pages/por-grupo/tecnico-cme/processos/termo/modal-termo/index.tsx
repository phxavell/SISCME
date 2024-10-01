import {Dialog} from "primereact/dialog"
import React, {useCallback} from "react"
import {HeaderTemplateTermo} from "./componentes/HeaderTemplateTermo.tsx"
import {useModalCaixaTermo} from "./useModalTermo"
import {CardDadosInicarTermoTemplate} from "./componentes/CardDadosIniciarTermo.tsx"
import {CardDadosCadastrarCaixas} from "./componentes/CardDadosCadastrarCaixas.tsx"
import {FormProvider} from "react-hook-form"
import {styleForm, styleFormCaixa} from "@pages/por-grupo/administrativo/cruds/caixa/styles-caixa.ts"

interface IModalTermo {
    showModal: boolean
    onClose: any
    equipamentoPorQrCode: any
}

export const ModalTermo: React.FC<IModalTermo> = (props) => {
	const {
		showModal,
		onClose,
		equipamentoPorQrCode
	} = props

	const {
		clear,
		etapaCadastro,
		setEtapaCadastro,
		handleClickProsseguir,
		handleEnviarTermo,
		caixasSelecionadas,
		salvando, setSalvando,
		methodsUseForm,
		caixasDisponiveis,
		setCaixasSelecionadas,
		formOptions,

	} = useModalCaixaTermo(showModal)

	const ShowEtapa = useCallback(() => {
		if (etapaCadastro === 0) {
			return (
				<form className={styleForm}>
					<div className={styleFormCaixa}>
						<CardDadosInicarTermoTemplate
							equipamentosuuid={equipamentoPorQrCode}
							formOptions={formOptions}
						/>
					</div>
				</form>
			)
		}
		return (
			<form className={styleForm}>
				<CardDadosCadastrarCaixas
					caixasDisponiveis={caixasDisponiveis}
					setCaixasSelecionadas={setCaixasSelecionadas}
					caixasSelecionadas={caixasSelecionadas}
				/>
			</form>
		)
	}, [

		etapaCadastro,
		caixasDisponiveis,
		setCaixasSelecionadas,
		caixasSelecionadas,
		equipamentoPorQrCode,
		formOptions
	])

	const handleClose = ()=> {
		onClose(false)
		clear()
		setEtapaCadastro(0)
	}

	return (
		<FormProvider {...methodsUseForm}>

			<Dialog
				style={{
					width: `100%`,
					height: `100%`

				}}
				data-testid='termo-modal'
				draggable={false}
				dismissableMask
				resizable={false}
				onHide={handleClose}
				header={
					<HeaderTemplateTermo
						handleClickProsseguir={handleClickProsseguir}
						etapaCadastro={etapaCadastro}
						setEtapaCadastro={setEtapaCadastro}
						setShowModal={handleClose}
						caixa={caixasSelecionadas}
						handleEnviarTermo={handleEnviarTermo}
						salvando={salvando}
						setSalvando={setSalvando}

					/>}
				visible={showModal}
				position="top"
			>
				{ShowEtapa()}
			</Dialog>
		</FormProvider>
	)
}
