import React, { useCallback, useState } from "react"
import {IHeaderEsterilizacao} from "../types"
import {styleHeaderTitle} from "@pages/por-grupo/administrativo/cruds/caixa/styles-caixa.ts"
import {Button} from "primereact/button"
import {EtapaCadasto} from "@/pages/por-grupo/administrativo/cruds/caixa/nova-caixa/modal-caixa/useModalCaixa"
import {useFormContext} from "react-hook-form"
import { ModalIndicadores } from "../../modal-indicadores"
import { useAuth } from "@/provider/Auth"

export const HeaderTemplateEsterilizacao: React.FC<IHeaderEsterilizacao> = (props) => {
	const [visibleModalIndicadores, setVisibleModalIndicadores] = useState(false)
	const {
		caixasSelecionadas,
		etapaCadastro,
		salvando,
		handleClickProsseguir,
		handleEnviarEsterilizacao,
		setEtapaCadastro,
		onClose,
	} = props

	const {getValues} = useFormContext()

	const handleClickSalvar = async () => {

		const values = getValues()
		const data = {
			...values,
			itens: caixasSelecionadas
		}
		const salvou = await handleEnviarEsterilizacao(data)
		if (salvou) {
			onClose(true)
		}

	}

	const {toastError} = useAuth()

	const handleClickVoltar = () => {
		setEtapaCadastro(EtapaCadasto.Etapa1)
	}

	const handleCicloTeste = useCallback(() => {
		const values = getValues()
		if(values.equipamento == `` || values.ciclo == `` || values.programacao == ``) {
			toastError(`Preencha todos os campos para prosseguir`)
		} else {
			setVisibleModalIndicadores(true)
		}

	}, [getValues, toastError])

	if (etapaCadastro === 0) {
		return (
			<div className={styleHeaderTitle}>
				<div className="w-full text-md md:text-3xl">
					<ModalIndicadores
						visible={visibleModalIndicadores}
						onClose={() => {setVisibleModalIndicadores(false)}}
						values={getValues}
						onCloseIniciar={() => {setVisibleModalIndicadores(false), onClose()}}
					/>
					<div className="flex justify-content-between">
						<div className="text-md md:text-2xl">
                    	Etapa 1/2: Inserir dados de ciclo
						</div>
						<div className="gap-2 flex mr-2 pl-2">
							<Button
								label="Ciclo teste"
								severity="warning"
								//TODO => REMOVER HIDDEN QUANDO INDICADORES ENTRAR
								className="text-2xl hidden"
								autoFocus={true}
								onClick={() => {
									handleCicloTeste()
								}}
							/>
							<Button
								label="Prosseguir"
								severity="success"
								className="text-2xl"
								autoFocus={true}
								onClick={() => {
									handleClickProsseguir()
								}}
							/>
						</div>

					</div>
				</div>
			</div>
		)
	}

	return (
		<div className={styleHeaderTitle}>
			<div className="text-md md:text-3xl mr-5">
                Etapa 2/2: Inserir caixas
			</div>
			<div className="gap-2 flex mr-2">
				<Button
					label="Voltar"
					disabled={salvando}
					className="text-2xl"
					onClick={handleClickVoltar}
				/>
				<Button
					label="Salvar"
					severity="success"
					loading={salvando}
					icon={`pi pi-save text-lg`}
					className="text-2xl"
					onClick={handleClickSalvar}
				/>
			</div>
		</div>
	)
}
