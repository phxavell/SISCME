import { useCallback, useEffect, useState } from "react"
import {useFieldArray, useForm} from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
	NovaCaixaSchema,
	TItemCaixa,
	TNovaCaixa
} from '@pages/por-grupo/administrativo/cruds/caixa/nova-caixa/schemas.ts'

import { CaixaAPI, mapMakeOptionListFromCliente } from "@infra/integrations/caixa/caixa.ts"
import { useAuth } from "@/provider/Auth"
import { ClientAPI } from "@infra/integrations/client.ts"
import { ICaixaOptionsResponse, IOptionToSelect } from "@infra/integrations/caixa/types.ts"
import {
	useItensDinamicos
} from "@pages/por-grupo/administrativo/cruds/caixa/nova-caixa/modal-caixa/useItensDinamicos.ts"
import { THandlerSalvar } from "@pages/por-grupo/administrativo/cruds/caixa/nova-caixa/modal-caixa/types-modal.ts"
import { useCaixaStore } from "@/store/store.ts"
enum ModalCaixaErros {
    get = `Não foi possível baixar as configurações do formulário. Tente mais tarde.`
}

export enum EtapaCadasto {
    Etapa1,
    Etapa2
}

export const useModalCaixa = () => {
	const {
		user,
		toastError,
		toastSuccess,
		toastAlert
	} = useAuth()
	//gerenciamento do modal-caixa
	const [etapaCadastro, setEtapaCadastro] = useState<EtapaCadasto>(0)
	const [salvando, setSalvando] = useState<boolean>(false)
	const [loadingOption, setLoadingOption] = useState<boolean>(true)

	//etapa 1 dados da caixa
	const [optionsForTheForm, setOptions] = useState<ICaixaOptionsResponse>()
	const [clientesForTheForm, setClientes] = useState<IOptionToSelect[]>([])
	// etapa 2 listagem de itens
	const [itensParaSelecao, setItensParaSelecao] = useState<IOptionToSelect[]>([])
	const [itensSelecionadosParaCaixa, setItensSelecionadosParaCaixa] = useState<TItemCaixa[]>([])

	//tratamento de imagens
	const [uploadErro, setUploadErro] = useState<string>()

	const { modo_edicao, setErrosList } = useCaixaStore()

	const handleAddTiposDeCaixa = (keyItem: string) => {
		//TODO checar
		console.log(`Tipos de caixa, keyItem`, keyItem)
	}

	const getOptions = useCallback(async () => {

		if (user) {
			setLoadingOption(true)
			CaixaAPI.opcoesParaFormulario(user).then(optionsResponse => {
				setOptions(optionsResponse)
				setLoadingOption(false)
			}).catch(() => {
				toastError(ModalCaixaErros.get)
				setLoadingOption(false)

			})

		}
	}, [user, toastError])

	useEffect(() => {
		let mounted = true
		if (user) {
			CaixaAPI.opcoesParaFormulario(user).then(optionsResponse => {
				if (mounted) {
					setOptions(optionsResponse)
					setLoadingOption(false)
				}
			}).catch(() => {
				if (mounted) {
					if (loadingOption) {
						toastError(ModalCaixaErros.get)
						setLoadingOption(false)
					}
				}
			})

			ClientAPI.listar(user, 1).then(clientes => {
				if (mounted) {
					const clientFormated = clientes?.data?.map(mapMakeOptionListFromCliente)
					setClientes(clientFormated)
				}

			})
		}
		return () => {
			mounted = false
		}

	}, [loadingOption, toastError, user])

	const methodsUseForm = useForm<TNovaCaixa>({
		shouldFocusError: true,
		resolver: zodResolver(NovaCaixaSchema),
		mode: `all`,
		defaultValues: {
			caixa: ``,
			validade: 3
		}
	})

	const {
		control,
		register,
		handleSubmit,
		reset,
		setValue,
		getValues,
		trigger,
		watch,
		setError,
		formState: { errors },
		setFocus
	} = methodsUseForm

	const {fields, update} = useFieldArray({
		control,
		// @ts-ignore
		name: `foto`
	})
	const watchFieldArray = watch(`foto`)
	const controlledFields = fields?.map((field, index) => {
		if (watchFieldArray && watchFieldArray[index]) {
			return {
				...field,
				...watchFieldArray[index]
			}
		} else {
			return {
				...field,

			}
		}
	})

	const handleClearFileVehicle = useCallback(() => {
		update(0,
			{
				...controlledFields[0],
				files: []
			})
	}, [controlledFields, update])

	const handleClickProsseguir = useCallback(() => {

		const validar = [
			`caixa`,
			`cliente`,
			`embalagem`,
			`temperatura`,
			`tipo_caixa`,
			`prioridade`,
			`criticidade`,
			`situacao`,
			`categoria`,
			`instrucoes_uso`,
			`validade`,
			`descricao`
		]

		if (modo_edicao) {
			//@ts-ignore
			trigger(validar).then(() => {
				//@ts-ignore
				trigger(validar).then((formEstaValidado) => {
					if (formEstaValidado && !Object.keys(errors).length) {
						setEtapaCadastro(EtapaCadasto.Etapa2)
					} else {
						toastAlert(`Verifique o preenchimento do formulário.`)
					}
				})
			})
		} else {
			//@ts-ignore
			trigger(validar).then((formEstaValidado) => {
				if (formEstaValidado && !Object.keys(errors).length) {
					setEtapaCadastro(EtapaCadasto.Etapa2)
				} else {
					toastAlert(`Verifique o preenchimento do formulário.`)
				}
			})
		}

	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [errors, trigger])

	const makeBody = useCallback((itensSelecionados: any[]) => {
		const values = getValues()
		const itens = itensSelecionados.map(item => {
			return {
				criticidade: item.criticidade,
				quantidade: item.quantidade,
				produto: item.item.id,
				id: item.id ?? 0,
			}
		})

		const fotoValidacao = () => {
			// @ts-ignore
			if (values.foto[0]?.files[0]?.length > 0 || values.foto[0]?.files[0] !== undefined) {
				// @ts-ignore
				return values.foto[0].files[0]
			} else {
				return []
			}
		}

		const body: any = {
			nome: values.caixa.toUpperCase(),
			temperatura: values.temperatura,
			criticidade: values.criticidade,
			validade: values.validade,//todo input,
			embalagem: values.embalagem,
			cliente: values.cliente,
			tipo_caixa: values.tipo_caixa,
			descricao: values.descricao,
			instrucoes_uso: values.instrucoes_uso,
			situacao: values.situacao,
			prioridade: values.prioridade,
			categoria_uso: values.categoria,
			itens: itens,
			imagem: fotoValidacao()
		}

		const formData = new FormData()
		Object.keys(body).forEach((key) => {
			if (key === `itens`) {
				body.itens.forEach((value: any, index: any) => {
					formData.append(`itens[${index}]criticidade`, value.criticidade)
					formData.append(`itens[${index}]quantidade`, value.quantidade)
					formData.append(`itens[${index}]produto`, value.produto)
					formData.append(`itens[${index}]id`, value.id)
				})
			} else {
				if (body[key]) {
					formData.append(key, body[key])
				}
			}
		})
		return formData
	}, [getValues])


	const {
		reset: ItensDinamicosReset,
	} = useItensDinamicos(
		{
			itensSelecionadosParaCaixa,
			setItensSelecionadosParaCaixa
		}
	)

	const handleSalvar: THandlerSalvar = useCallback(async (itensSelecionados, idEditando) => {
		if (itensSelecionados.length === 0) {

			toastAlert(`Ops! Necessário adicionar itens à caixa:)`)
			return
		}
		setSalvando(true)
		const body = makeBody(itensSelecionados)
		try {
			let r
			if (idEditando) {
				r = await CaixaAPI.editar(user, body, idEditando, setError)
				const nome = getValues().caixa
				toastSuccess(`Caixa ${nome} atualizada!`)
			} else {
				r = await CaixaAPI.salvar(user, body, setError)
				const nome = getValues().caixa
				toastSuccess(`Caixa ${nome} registrada!`)
			}
			if (r) {
				reset()
				ItensDinamicosReset()
				setItensSelecionadosParaCaixa([])

				setEtapaCadastro(EtapaCadasto.Etapa1)

				handleClearFileVehicle()
				setErrosList([])
				setSalvando(false)

				return true
			}

		} catch (erros) {
			toastError(`Caixa não salva. Por favor, revise o formulário.`)
			if (Array.isArray(erros)) {

				const itens = erros.find(erro => erro.keyName === `itens`)?.message
				if (!itens) {
					setEtapaCadastro(EtapaCadasto.Etapa1)
					setFocus(`descricao`)
				} else {
					const erros: any[] = []
					itens.forEach((item: any, index: number) => {
						if (Object.keys(item).length) {
							const criticidadeMsg = item.criticidade ? ` - Criticidade: ` + item.criticidade : ``
							const produtoMsg = item.produto ? ` - Produto: ` + item.produto : ``
							const quantidadeMsg = item.quantidade ? ` - Produto: ` + item.quantidade : ``
							const msg = `Item ${index + 1}: ${produtoMsg} ${criticidadeMsg} ${quantidadeMsg}`
							erros.push(msg)
							toastError(msg)

						} else {
							erros.push(``)
						}
					})
					setErrosList(erros)
				}
			}
			setTimeout(() => {
				setSalvando(false)
			}, 300)
			return false
		}


	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		ItensDinamicosReset,
		makeBody,
		reset,
		user,
		toastSuccess,
		toastError
	])


	return {

		salvando,
		loadingOption, setLoadingOption,
		etapaCadastro, setEtapaCadastro,
		handleClickProsseguir,
		handleSalvar,

		control, register, handleSubmit, errors, setValue, reset, setError, setFocus,watch,

		optionsForTheForm,
		clientesForTheForm,
		itensParaSelecao, setItensParaSelecao,


		getValues,

		itensSelecionadosParaCaixa, setItensSelecionadosParaCaixa,

		handleAddTiposDeCaixa, handleClearFileVehicle,
		uploadErro, setUploadErro,

		user, getOptions,
		controlledFields,
		methodsUseForm,
	}
}
