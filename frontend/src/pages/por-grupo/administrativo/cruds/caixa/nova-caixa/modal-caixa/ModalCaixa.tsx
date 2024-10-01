import { Dialog } from "primereact/dialog"
import * as React from "react"
import { useCallback, useEffect, useMemo, useState } from "react"
import { DropdownFilterEvent } from "primereact/dropdown"
import { useModalCaixa } from "./useModalCaixa.ts"
import { CaixaAPI } from "@infra/integrations/caixa/caixa.ts"
import { styleForm, styleFormCaixa, } from "../../styles-caixa.ts"
import { ModalTipoCaixa } from '../modal-tipo-caixa/ModalTipoCaixa.tsx'
import { ModalEmbalagem } from "../modal-embalagem/ModalEmbalagem.tsx"
import { CardDadosOrigemIdentificacaoTemplate } from "./etapa-1/CardDadosOrigemIdentificacaoTemplate.tsx"
import { CardDadosDeCriticidadeTemplate } from './etapa-1/CardDadosDeCriticidadeTemplate.tsx'
import { CardDetalhesEspecificosTemplate } from "./etapa-1/CardDetalhesEspecificosTemplate.tsx"
import { HeaderTemplate } from "@pages/por-grupo/administrativo/cruds/caixa/nova-caixa/modal-caixa/HeaderTemplate.tsx"
import {
	ItensDinamicos
} from "@pages/por-grupo/administrativo/cruds/caixa/nova-caixa/modal-caixa/etapa-2/ItensDinamicos.tsx"
import { useCaixaStore } from "@/store/store.ts"
import { ItensCaixaAPI } from "@infra/integrations/caixa/itens-caixa.ts"
import { getFileFromUrl } from "@pages/por-grupo/administrativo/cruds/veiculos/ModalNovoVeiculo"
import { FormProvider } from "react-hook-form"
import { IModalCaixa } from "../../interfaces.ts"

export const ModalCaixa: React.FC<IModalCaixa> = (props) => {

	const { showModal, setShowModal, modoEdicao, caixaAEditar } = props
	const {
		salvando,
		loadingOption, setLoadingOption,
		etapaCadastro, setEtapaCadastro,
		handleClickProsseguir,
		handleSalvar,

		setValue, reset,

		optionsForTheForm,
		clientesForTheForm,
		itensParaSelecao, setItensParaSelecao,
		itensSelecionadosParaCaixa, setItensSelecionadosParaCaixa,

		handleClearFileVehicle,
		uploadErro,

		user, getOptions,

		methodsUseForm,
	} = useModalCaixa()

	const {
		setCarregandoProdutos,
		setModoEdicao,
		setErrosList
	} = useCaixaStore()

	useEffect(() => {
		if (modoEdicao && caixaAEditar) {

			setModoEdicao(true)

			reset({
				caixa: caixaAEditar?.nome,
				cliente: caixaAEditar?.cliente,
				embalagem: caixaAEditar?.embalagem,
				temperatura: caixaAEditar?.temperatura,
				tipo_caixa: caixaAEditar?.tipo_caixa,
				prioridade: caixaAEditar?.tipo_caixa,
				criticidade: caixaAEditar?.criticidade,
				situacao: caixaAEditar?.situacao,
				categoria: caixaAEditar?.categoria_uso,
				instrucoes_uso: caixaAEditar?.instrucoes_uso ?? ``,
				descricao: caixaAEditar?.descricao ?? ``,
				validade: caixaAEditar?.validade ?? 0,
				foto: [],
			})
			if (caixaAEditar?.imagem) {
				const name = caixaAEditar.imagem.split(`media/caixas/`)[1]
				getFileFromUrl(caixaAEditar.imagem, name).then((imgFile) => {
					setValue(`foto`, [
						{
							files: [imgFile]
						} as unknown as FileList
					])
				})
			}

			setCarregandoProdutos(true)
			ItensCaixaAPI.itensComDescricaoDeProduto(user, caixaAEditar.itens).then((itensAEditar: any[]) => {
				setItensSelecionadosParaCaixa(itensAEditar)
				setCarregandoProdutos(false)
			})
		} else {
			setModoEdicao(false)
			reset({
				caixa: ``,
				cliente: undefined,
				embalagem: undefined,
				temperatura: undefined,
				tipo_caixa: undefined,
				prioridade: undefined,
				criticidade: undefined,
				situacao: undefined,
				categoria: undefined,
				instrucoes_uso: ``,
				descricao: ``,
				foto: [],
				validade: 1
			})
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [modoEdicao, caixaAEditar, reset, setValue])

	useEffect(() => {
		if (!showModal) {
			reset()
		}
	}, [reset, showModal])

	const [showModalTipoCaixa, setShowModalTipoCaixa] = useState(false)
	const handleCloseModalTipoCaixa = async (id: number) => {
		setShowModalTipoCaixa(false)
		if (id) {
			setValue(`tipo_caixa`, id, { shouldValidate: true })
			await getOptions()
		}
	}

	const [showModalEmbalagens, setShowModalEmbalagens] = useState(false)
	const handleCloseModalEmbalagens = async (id: number) => {
		setShowModalEmbalagens(false)
		if (id) {
			setValue(`embalagem`, id, { shouldValidate: true })
			await getOptions()
		}
	}

	const handleAddTiposDeCaixa = (keyItem: string) => {
		if (`tipo_caixa` === keyItem) {
			setShowModalTipoCaixa(true)
		}
		if (`embalagem` === keyItem) {
			setShowModalEmbalagens(true)
		}
	}

	const onFilterItens = useCallback((event: DropdownFilterEvent) => {
		if (event.filter) {
			setLoadingOption(true)
			CaixaAPI.buscarProdutos(user, event.filter).then(r => {
				if (r.length) {
					setItensParaSelecao(r)
				}
				setLoadingOption(false)
			}).catch(() => {
				setLoadingOption(false)
			})
		}
	}, [setItensParaSelecao, setLoadingOption, user])


	useEffect(() => {
		let mounted = true
		CaixaAPI.buscarProdutos(user, ``).then(r => {
			if (mounted) {
				if (r.length) {
					setItensParaSelecao(r)
				}
				setLoadingOption(false)
			}
		}).catch(() => {
			if (mounted) {
				setLoadingOption(false)
			}
		})
		return () => {
			mounted = false
		}
	}, [setItensParaSelecao, setLoadingOption, user])

	const ShowEtapa = useMemo(() => {
		if (etapaCadastro === 0) {
			return (
				<form className={styleForm}>
					<div className={styleFormCaixa}>
						<CardDadosOrigemIdentificacaoTemplate
							clientesForTheForm={clientesForTheForm}
							tipos_caixa={optionsForTheForm?.tipos_caixa ?? []}
							embalagens={optionsForTheForm?.embalagens ?? []}
							loadingOption={loadingOption}
							handleAddTiposDeCaixa={handleAddTiposDeCaixa}
							uploadErro={uploadErro}
							caixaEditando={caixaAEditar}
						/>
						<CardDadosDeCriticidadeTemplate
							criticidades={optionsForTheForm?.criticidades ?? []}
							prioridades={optionsForTheForm?.prioridades ?? []}
							temperaturas={optionsForTheForm?.temperaturas ?? []}
							loadingOption={loadingOption}
						/>
						<CardDetalhesEspecificosTemplate
							situacoes={optionsForTheForm?.situacoes ?? []}
							categorias_uso={optionsForTheForm?.categorias_uso ?? []}
							loadingOption={loadingOption}
						/>
					</div>
				</form>
			)
		}
		return (
			<div>
				<ItensDinamicos
					criticidadesOptions={optionsForTheForm?.criticidades ?? []}
					onFilterItens={onFilterItens}
					loadingOption={loadingOption}
					itensParaSelecao={itensParaSelecao}
					itensSelecionadosParaCaixa={itensSelecionadosParaCaixa}
					setItensSelecionadosParaCaixa={setItensSelecionadosParaCaixa} />
			</div>
		)
	}, [
		etapaCadastro,
		optionsForTheForm?.criticidades,
		optionsForTheForm?.tipos_caixa,
		optionsForTheForm?.embalagens,
		optionsForTheForm?.prioridades,
		optionsForTheForm?.temperaturas,
		optionsForTheForm?.situacoes,
		optionsForTheForm?.categorias_uso,
		onFilterItens,
		loadingOption,
		itensParaSelecao,
		itensSelecionadosParaCaixa,
		setItensSelecionadosParaCaixa,
		clientesForTheForm,
		uploadErro,
		caixaAEditar])

	useEffect(() => {
		if (showModal) {
			reset()
		}
	}, [reset, showModal])

	return (
		<FormProvider {...methodsUseForm}>
			<Dialog
				style={{
					maxWidth: `90vw`,
				}}

				blockScroll={true}
				focusOnShow={false}

				closeOnEscape={false}
				resizable={false}
				draggable={false}
				visible={showModal}
				header={
					<HeaderTemplate
						itensSelecionadosParaCaixa={itensSelecionadosParaCaixa}
						etapaCadastro={etapaCadastro}
						loadingOption={loadingOption}
						salvando={salvando}
						handleClickProsseguir={handleClickProsseguir}
						handleSalvar={handleSalvar}
						setEtapaCadastro={setEtapaCadastro}
						setShowModal={(value) => {
							reset()
							setItensSelecionadosParaCaixa([])
							handleClearFileVehicle()
							setShowModal(value)
							setErrosList([])
							setEtapaCadastro(0)

						}}
						idEditando={caixaAEditar?.id}
					/>}
				onHide={() => {
					reset({})
					setItensSelecionadosParaCaixa([])
					handleClearFileVehicle()
					setShowModal(false)
					setErrosList([])
					setEtapaCadastro(0)
				}}>
				<ModalTipoCaixa
					visible={showModalTipoCaixa}
					onClose={handleCloseModalTipoCaixa}
				/>
				<ModalEmbalagem
					visible={showModalEmbalagens}
					onClose={handleCloseModalEmbalagens}
				/>
				{ShowEtapa}
			</Dialog>
		</FormProvider>
	)
}
