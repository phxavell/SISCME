import {useAuth} from "@/provider/Auth"
import React, {useCallback, useEffect, useState} from "react"
import {useForm} from "react-hook-form"
import {TNovaCaixa} from "./schemas"
import {EsterilizacaoAPI} from "@/infra/integrations/processo/esterilizacao"
import {EProcesso, ProcessoAPI} from "@infra/integrations/processo/processo.ts"

export enum EtapaCadastoEstilizacao {
    Etapa1,
    Etapa2,
    _Length
}

export const useModalCaixaEsterilizacao = (showModal: boolean) => {
	const {
		user,
		toastError,
		toastSuccess
	} = useAuth()
	const [formOptions, setFormOptions] = useState<any>(undefined)
	const [salvando, setSalvando] = useState(false)
	const [etapaCadastro, setEtapaCadastro] = useState<EtapaCadastoEstilizacao>(EtapaCadastoEstilizacao.Etapa1)
	const [paginaAtual, setPaginaAtual] = useState(0)
	const [caixasSelecionadas, setCaixasSelecionadas] = React.useState<any[]>([])


	const methodsUseForm = useForm<TNovaCaixa>({
		defaultValues: {
			ciclo: ``,
			equipamento: ``,
			programacao: ``,
		}
	})

	const {
		control,
		register,
		handleSubmit,
		reset,
		getValues,
		trigger,
		setValue,
		setError,
		formState: {errors}, setFocus
	} = methodsUseForm

	const clear = useCallback(() => {
		setCaixasSelecionadas([])
		reset()
	}, [reset])

	const onPageChange = (event: { first: number }) => {
		setPaginaAtual(event.first)
	}

	const handleClickProsseguir = useCallback(() => {
		if (getValues().ciclo === `` || getValues().equipamento === `` || getValues().programacao === ``) {
			toastError(`Preencha todos os campos para prosseguir`)
			return
		}
		setEtapaCadastro(EtapaCadastoEstilizacao.Etapa2)

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [getValues])

	const handleEnviarEsterilizacao = useCallback( async (data: any) => {
		return await EsterilizacaoAPI.enviarEsterilizacao(user, data).then(() => {
			setSalvando(false)
			toastSuccess(`Esterilização enviada com sucesso!`)

			return true
		}).catch((erros:any) => {

			erros.forEach((error:any) => {
				toastError(error?.message)
			})

			setSalvando(false)
			return false
		})
	}, [user, toastSuccess, toastError])

	const formOptionsEsterilizacao = useCallback( () => {
		if (showModal) {
			EsterilizacaoAPI.listarStatus(user).then((data) => {
				setFormOptions(data)
			}).catch((error) => {
				toastError(error?.message)

			})
		}
	}, [user, showModal, toastError])
	useEffect(() => {
		formOptionsEsterilizacao()
	}, [formOptionsEsterilizacao])

	const [caixasDisponiveis, setCaixasDisponiveis] = useState([])
	const auth = useAuth()
	const buscarSeriaisDisponiveis = useCallback(()=> {
		if (showModal && auth){
			ProcessoAPI.seriaisDisponiveis(auth,EProcesso.Esterilizacao).then((data)=> {
				setCaixasDisponiveis(data)
			})
		}
	}, [auth, showModal])

	useEffect(() => {
		buscarSeriaisDisponiveis()
		return ()=> {}
	}, [buscarSeriaisDisponiveis])

	return {
		caixasSelecionadas, setCaixasSelecionadas,
		caixasDisponiveis,
		clear,
		onPageChange,
		user,
		setError, errors,
		control, register,
		reset,
		setFocus,
		setValue, getValues, trigger,
		handleSubmit,
		etapaCadastro, setEtapaCadastro,
		handleClickProsseguir,
		handleEnviarEsterilizacao,
		salvando, formOptions,
		paginaAtual, setPaginaAtual,

		methodsUseForm
	}

}
