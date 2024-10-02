import * as React from 'react'
import {Button} from 'primereact/button'
import {styleHeaderTitle} from '@pages/por-grupo/administrativo/cruds/caixa/styles-caixa.ts'
import {IPropsHeader} from '@pages/por-grupo/administrativo/cruds/caixa/nova-caixa/modal-caixa/types-modal.ts'
import {EtapaCadasto} from '@pages/por-grupo/administrativo/cruds/caixa/nova-caixa/modal-caixa/useModalCaixa.ts'

export const HeaderTemplate: React.FC<IPropsHeader> = (props) => {
	const {
		itensSelecionadosParaCaixa,
		etapaCadastro,
		loadingOption,
		salvando,
		handleClickProsseguir,
		handleSalvar,
		setEtapaCadastro,
		setShowModal,
		idEditando
	} = props
	const handleClickSalvar = () => {
		handleSalvar(itensSelecionadosParaCaixa, idEditando).then((result) => {
			if (result) {
				setShowModal(true)
			}
		})
	}
	const handleClickVoltar = () => {
		setEtapaCadastro(EtapaCadasto.Etapa1)
	}

	if (etapaCadastro === 0) {
		return (
			<div className={styleHeaderTitle}>
				<div className="text-md md:text-2xl">
                    Cadastro de caixa 1/2: Dados da caixa
				</div>
				<div className="gap-2 flex mr-2 pl-2">
					<Button
						label="Prosseguir"
						severity="success"
						autoFocus={true}
						disabled={loadingOption}
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
			<div className="text-md md:text-2xl mr-5">
                Cadastro de caixa 2/2: Itens da caixa
			</div>
			<div className="gap-2 flex mr-2">
				<Button
					label="Voltar"
					disabled={salvando}
					onClick={handleClickVoltar}
				/>
				<Button
					autoFocus={true}
					label="Salvar"
					severity="success"
					loading={salvando}
					onClick={handleClickSalvar}
				/>
			</div>
		</div>
	)
}
