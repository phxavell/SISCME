import React from "react"
import { IPropsHeaderTermo} from "../types"
import { styleHeaderTitle } from "@pages/por-grupo/administrativo/cruds/caixa/styles-caixa.ts"
import { Button } from "primereact/button"
import { EtapaCadasto } from "@/pages/por-grupo/administrativo/cruds/caixa/nova-caixa/modal-caixa/useModalCaixa"
import { EsterilizacaoPesquisaAPI } from "@/infra/integrations/esterilizacao-pesquisa"
import {useFormContext} from "react-hook-form"
import { useAuth } from "@/provider/Auth"

export const HeaderTemplateTermo: React.FC<IPropsHeaderTermo> = (props) => {
	const {
		caixa,
		etapaCadastro,
		salvando,
		handleClickProsseguir,
		setEtapaCadastro,
		setShowModal,
		setSalvando,
	} = props
	const {reset, getValues} = useFormContext()

	const { user, toastError, toastSuccess } = useAuth()

	const handleClickSalvar = () => {

		setSalvando(true)
		const values = getValues()
		const data = {
			...values,
			"itens": caixa
		}
		EsterilizacaoPesquisaAPI.enviarTermo(user, data).then(() => {
			setSalvando(false)
			reset()
			toastSuccess(`Ciclo de termodesinfecção criado com sucesso!`)

			setEtapaCadastro(EtapaCadasto.Etapa1)
			setShowModal(false)
		}).catch((error) => {
			setSalvando(false)
			toastError(error?.message?.data?.itens[0])

		})
	}

	const handleClickVoltar = () => {
		setEtapaCadastro(EtapaCadasto.Etapa1)
	}

	if (etapaCadastro === 0) {
		return (
			<div className={styleHeaderTitle}>
				<div className="text-md md:text-3xl">
					Etapa 1/2: Inserir dados de ciclo
				</div>
				<div className="gap-2 flex mr-2 pl-2">
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
					className="text-2xl"
					disabled={salvando}
					onClick={handleClickVoltar}
				/>
				<Button
					label="Salvar"
					severity="success"
					className="text-2xl"
					icon={`pi pi-save text-lg`}
					loading={salvando}
					onClick={handleClickSalvar}
				/>
			</div>
		</div>
	)
}
