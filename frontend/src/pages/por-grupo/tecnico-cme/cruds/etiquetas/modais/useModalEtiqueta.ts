import {zodResolver} from "@hookform/resolvers/zod"
import {useCallback, useEffect, useState} from "react"
import {useForm} from "react-hook-form"
import { EtiquetaFormSchemaType, etiquetaFormSchema} from "../schemas"
import {useAuth} from "@/provider/Auth"
import {ClientAPI} from "@/infra/integrations/client"
import {ProductAPI} from "@/infra/integrations/produto"
import {EtiquetaAPI} from "@/infra/integrations/processo/etiquetas"

import {DropdownFilterEvent} from "primereact/dropdown"
import { ComplementoAPI } from "@/infra/integrations/complemento"
import { DataEtiqueta } from "@/infra/integrations/processo/types-etiquetas"
import { useSetor } from "@/pages/por-grupo/administrativo/especificoes/setor/useSetor"
import {SetorAPI, SetoresProps} from "@infra/integrations/setor.ts"

export const useModalEtiqueta = (visible:boolean, onClose:any ) => {
	const {user, toastSuccess, toastError} = useAuth()
	const {
		control,
		register,
		handleSubmit,
		reset,
		setError,
		setValue,
		formState: {errors, isDirty, isLoading}
	} = useForm<EtiquetaFormSchemaType>({
		resolver: zodResolver(etiquetaFormSchema),
	})

	const [miniModalVisible, setMiniModalVisible] = useState(false)
	const [clientes, setClientes] = useState<any[]>([])
	const [integrador, setIntegrador] = useState(`NÃO`)
	const [cliente, setCliente] = useState<any>()
	const [loadingOption, setLoadingOption] = useState<boolean>(true)
	const [itensParaSelecao, setItensParaSelecao] = useState<any[]>([])
	const [complementos, setComplementos] = useState<any[]>([])
	const [formOptions, setFormOptions] = useState<any>()
	const [visibleModalComplemento, setVisibleModalComplemento] = useState(false)
	const [tipoImpressaoEtiqueta, setTipoImpressaoEtiqueta] = useState(``)
	const [visibleModalPdf, setVisibleModalPdf] = useState(false)
	const [visibleModalSetor, setVisibleModalSetor] = useState(false)
	const [etiqueta, setEtiqueta] = useState<DataEtiqueta>()

	const [setores, setSetores] = useState<SetoresProps>()
	const handleBuscarSetores = useCallback( () => {

		SetorAPI.listar(user,  1).then(data=> {
			setSetores(data)
		})

	}, [user])
	useEffect(()=> {
		if(visible){
			handleBuscarSetores()
		}
	}, [handleBuscarSetores,visible])

	const handleVisualizarEtiqueta = (data: any) => {
		setEtiqueta(data)
		setVisibleModalPdf(true)
	}
	const handleAtualizarComplemento = async(data: any) => {
		await listarComplementos()
		setValue(`idcomplemento`, data.id)
	}

	const handleAtualizarSetor = async(data: any) => {
		await handleBuscarSetores()
		setValue(`setor`, data.id)
		setVisibleModalSetor(false)
	}

	const confirmarFecharModal = useCallback(() => {
		if (isDirty) {
			setMiniModalVisible(true)
		} else {
			reset()
			setTipoImpressaoEtiqueta(``)
			onClose(false)
		}

	}, [isDirty, onClose, reset, setMiniModalVisible])

	useEffect(() => {
		const handleKeyDown = (e: any) => {
			if (e.key === `Escape` && visible) {
				confirmarFecharModal()
			}
		}

		window.addEventListener(`keydown`, handleKeyDown)

		return () => {
			window.removeEventListener(`keydown`, handleKeyDown)
		}
	}, [visible, confirmarFecharModal])

	const listarComplementos = useCallback(async() => {
		try {
			const data = await  ComplementoAPI.listarComplementosAtivos(user)
			setComplementos(data)
		} catch (error) {
			console.log(error)
		}
	}, [user])

	useEffect(() => {
		let mounted = true;
		(() => {
			if (user && visible) {
				ClientAPI.listarAll(user).then((data) => {
					if (mounted) {
						setClientes(data)
						setCliente(data[0]?.idcli)
					}
				})
				listarComplementos()
				ProductAPI.onListSearchDropdown(user, ``).then((data) => {
					if (mounted) {
						if (data.length) {
							setItensParaSelecao(data)
						}
						setLoadingOption(false)
					}
				}).catch(() => {
					if (mounted) {
						setLoadingOption(false)
					}
				})

				EtiquetaAPI.formOptions(user).then((data) => {
					setFormOptions(data)
				})

			}
		})()
		return () => {
			mounted = false
		}
	}, [user, listarComplementos, visible])

	const handleErrorReturnApi = useCallback((data: any)=> {
		if (data.error && typeof data.error.data === `object`) {
            type nameItem = `seladora` |
                `autoclave` |
                `biologico` |
                `ciclo` |
                `datavalidade` |
                `cautela` |
                `termodesinfectora` |
                `peso` |
                `qtd` |
                `qtdimpressao` |
                `servico` |
                `temperatura` |
                `tipoetiqueta` |
                `idcli` |
                `idproduto`
            // @ts-ignore
            Object.keys(data.error.data).map((key: nameItem) => {
            	if (
            		key === `seladora` ||
                    key === `autoclave` ||
                    key == `biologico` ||
                    key == `datavalidade` ||
                    key == `cautela` ||
                    key == `termodesinfectora` ||
                    key == `peso` ||
                    key == `qtd` ||
                    key == `idproduto` ||
                    key == `temperatura` ||
                    key == `tipoetiqueta`
            	) {
            		setError(key, {
            			type: `manual`,
            			message: data.error.data[key][0],
            		})
            	}
            })
		} else {
			toastError(data.error.message, false)
		}
	}, [toastError, setError])

	const  handleEtiqueta = useCallback( (dataPayload: EtiquetaFormSchemaType) => {
		const payload = {
			...dataPayload,
			idcli: cliente,
		}
		EtiquetaAPI.save(user, payload).then((data) => {
			onClose(true)
			handleVisualizarEtiqueta(data)
			reset()
		}).catch((error: any) => {
			if (error.data) {
				handleErrorReturnApi(error.data)
			} else {
				toastError(`Não foi possível salvar etiqueta!!`, false)
			}
		})
	}, [user, onClose, reset, toastError, cliente, handleErrorReturnApi])

	const onFilterComplementos = useCallback((event: DropdownFilterEvent) => {
		if(event.filter && complementos){
			ComplementoAPI.buscarComplementos(user, event.filter).then((data) => {
				if(data.length) setComplementos(data)
			})
		} else {
			listarComplementos()
		}
	},[user, complementos, listarComplementos])


	const onFilterItens = useCallback((event: DropdownFilterEvent) => {
		if (event.filter) {
			setLoadingOption(true)
			ProductAPI.onListSearchDropdown(user, event.filter).then(r => {
				if (r.length) {
					setItensParaSelecao(r)
				}
				setLoadingOption(false)
			}).catch(() => {
				setLoadingOption(false)
			})
		}
	}, [user])


	const handleCloseMiniModal = useCallback(() => {
		reset()
		onClose(false)
		setTipoImpressaoEtiqueta(``)
	}, [reset, onClose])
	return {
		handleCloseMiniModal,
		miniModalVisible, setMiniModalVisible,
		reset,
		isDirty,
		isLoading,
		errors,
		handleSubmit,
		user,
		control,
		register,
		setValue,
		handleErrorReturnApi,
		onFilterItens,
		loadingOption,
		itensParaSelecao, setItensParaSelecao,
		clientes,
		formOptions,
		tostSuccess: toastSuccess,
		tostError: toastError,
		integrador, setIntegrador,
		cliente, setCliente,
		complementos,
		onFilterComplementos,
		listarComplementos,
		handleAtualizarSetor,
		confirmarFecharModal,
		setVisibleModalComplemento,
		setores,
		setVisibleModalSetor,
		setTipoImpressaoEtiqueta,
		handleEtiqueta,
		tipoImpressaoEtiqueta,
		visibleModalComplemento,
		handleAtualizarComplemento,
		visibleModalPdf,
		setVisibleModalPdf,
		etiqueta,
		setEtiqueta,
		visibleModalSetor,
		setComplementos
	}
}
