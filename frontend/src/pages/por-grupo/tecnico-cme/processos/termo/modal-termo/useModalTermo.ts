import {useAuth} from "@/provider/Auth"
import React, {useCallback, useEffect, useState} from "react"
import {useForm} from "react-hook-form"
import {TNovaCaixa} from "./schemas"
import {EsterilizacaoPesquisaAPI} from "@/infra/integrations/esterilizacao-pesquisa"
import {EProcesso, ProcessoAPI} from "@infra/integrations/processo/processo.ts"


export enum EtapaCadasto {
    Etapa1,
    Etapa2
}

export const useModalCaixaTermo = (showModal: boolean) => {

	const [paginaAtual, setPaginaAtual] = useState(0)
	const [equipamento, setEquipamento] = React.useState<any>(null)
	const [programacao, setProgramacao] = React.useState<any>(null)
	const [ciclo, setCiclo] = React.useState<any>(null)
	const [caixasSelecionadas, setCaixasSelecionadas] = React.useState<any[]>([])

	const [loading, setLoading] = useState(true)
	const [salvando, setSalvando] = useState(false)
	const [formOptions, setFormOptions] = useState<any>({})
	const [etapaCadastro, setEtapaCadastro] = useState<EtapaCadasto>(0)

	const {
		user,
		toastError,
		toastSuccess
	} = useAuth()

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
		formState: {errors},
		setFocus
	} = methodsUseForm

	const clear = useCallback(() => {
		setEquipamento(``)
		setCiclo(``)
		setProgramacao(``)
		setCaixasSelecionadas([])

		setValue(`ciclo`, ``)
		setValue(`equipamento`, ``)
		setValue(`programacao`, ``)

	}, [setValue])

	const onPageChange = (event: { first: number }) => {
		setPaginaAtual(event.first)
	}

	const handleSetCiclo = useCallback((value: any) => {
		setCiclo(value)
		setValue(`ciclo`, value)
	}, [setValue])


	const handleSetEquipamento = useCallback((value: any) => {
		setEquipamento(value)
		setValue(`equipamento`, value)
	}, [setValue])

	const handleSetProgramacao = useCallback((value: any) => {
		setProgramacao(value)
		setValue(`programacao`, value)
	}, [setValue])

	const handleSetCaixas = useCallback((value: any) => {
		setCaixasSelecionadas(value)
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [setValue])

	const handleClickProsseguir = useCallback(() => {
		if (
			getValues().ciclo === `` ||
            getValues().equipamento === `` ||
            getValues().programacao === ``
		) {
			toastError(`Preencha todos os campos para prosseguir`)

			return
		}
		setEtapaCadastro(EtapaCadasto.Etapa2)
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [getValues])

	const handleEnviarTermo = useCallback(async (data: any) => {
		setSalvando(true)
		EsterilizacaoPesquisaAPI.enviarTermo(user, data).then(() => {
			setSalvando(false)
			toastSuccess(`Ciclo de termodesinfecção criado com sucesso`)


		}
		).catch((errors) => {
			errors.forEach((error:any) => {
				toastError(error?.message)
			})

			setSalvando(false)
			return false
		})
	}, [user, toastError, toastSuccess])

	const listFormOptions = useCallback( () => {
		if(showModal){
			EsterilizacaoPesquisaAPI.formOptions(user).then((response) => {
				setFormOptions(response)
			})
		}
	}, [user, showModal])

	const [caixasDisponiveis, setCaixasDisponiveis] = useState([])
	const auth = useAuth()
	const buscarSeriaisDisponiveis = useCallback(()=> {
		if (showModal && auth){
			ProcessoAPI.seriaisDisponiveis(auth,EProcesso.TermoDesinfeccao).then((data)=> {
				setCaixasDisponiveis(data)
			})
		}
	}, [auth, showModal])
	useEffect(() => {
		listFormOptions()
		return ()=> {}
	}, [listFormOptions])
	useEffect(() => {
		buscarSeriaisDisponiveis()
		return ()=> {}
	}, [buscarSeriaisDisponiveis])

	return {
		clear,
		paginaAtual, setPaginaAtual, onPageChange,
		user,
		setError,errors,
		control, register, reset, setFocus, setValue, getValues, trigger,
		handleSubmit,
		etapaCadastro, setEtapaCadastro,
		handleClickProsseguir,
		handleSetCiclo,
		handleSetEquipamento,
		handleSetProgramacao,
		handleSetCaixas,
		handleEnviarTermo,
		caixasSelecionadas,
		ciclo,
		equipamento,
		programacao,
		setCaixasSelecionadas,
		setEquipamento,
		setProgramacao,
		setCiclo,
		showModal,
		loading,
		salvando,
		formOptions,
		setSalvando,
		setLoading,
		methodsUseForm,
		caixasDisponiveis,
	}

}
