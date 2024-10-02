import { useAuth } from "@/provider/Auth"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { etiquetaFormSchema, EtiquetaFormSchemaType } from "../schemas"
import { useCallback, useEffect, useState } from "react"
import { ComplementoAPI } from "@/infra/integrations/complemento"
import { DropdownFilterEvent } from "primereact/dropdown"
import { ProductAPI } from "@/infra/integrations/produto"
import { ClientAPI } from "@/infra/integrations/client"
import { EtiquetaAPI } from "@/infra/integrations/processo/etiquetas"

export const useModalEdicao = (visibleEdicao: boolean, etiquetaEdicao: any) => {
	const [miniModalVisible, setMiniModalVisible] = useState(false)
	const [formOptions, setFormOptions] = useState<any>()
	const [loadingOption, setLoadingOption] = useState<boolean>(true)
	const [itensParaSelecao, setItensParaSelecao] = useState<any[]>([])
	const [complementos, setComplementos] = useState<any[]>([])
	const [clientes, setClientes] = useState<any[]>([])
	const [cliente, setCliente] = useState<any>()
	const { user, toastError } = useAuth()
	const {
		control,
		register,
		handleSubmit,
		reset,
		setError,
		setValue,
		formState: { errors, isDirty, isLoading },
	} = useForm<EtiquetaFormSchemaType>({
		resolver: zodResolver(etiquetaFormSchema),
	})
	const listarComplementos = useCallback(async () => {
		if (visibleEdicao) {
			try {
				const data =
                    await ComplementoAPI.listarComplementosAtivos(user)
				setComplementos(data)
			} catch (error) {
				console.log(error)
			}
		}
	}, [user, visibleEdicao])
	const handleErrorReturnApi = useCallback(
		(data: any) => {
			if (data.error && typeof data.error.data === `object`) {
                type nameItem =
                    | `seladora`
                    | `autoclave`
                    | `biologico`
                    | `ciclo`
                    | `datavalidade`
                    | `cautela`
                    | `termodesinfectora`
                    | `peso`
                    | `qtd`
                    | `qtdimpressao`
                    | `servico`
                    | `temperatura`
                    | `tipoetiqueta`
                    | `idcli`
                    | `idproduto`;
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
		},
		[toastError, setError],
	)
	const onFilterComplementos = useCallback(
		(event: DropdownFilterEvent) => {
			if (event.filter && complementos) {
				ComplementoAPI.buscarComplementos(user, event.filter).then(
					(data) => {
						if (data.length) setComplementos(data)
					},
				)
			} else {
				listarComplementos()
			}
		},
		[user, complementos, listarComplementos],
	)
	const onFilterItens = useCallback(
		(event: DropdownFilterEvent) => {
			if (event.filter) {
				setLoadingOption(true)
				ProductAPI.onListSearchDropdown(user, event.filter)
					.then((r) => {
						if (r.length) {
							setItensParaSelecao(r)
						}
						setLoadingOption(false)
					})
					.catch(() => {
						setLoadingOption(false)
					})
			}
		},
		[user],
	)
	useEffect(() => {
		listarComplementos()
	}, [listarComplementos])

	useEffect(() => {
		let mounted = true
		if (visibleEdicao) {
			ClientAPI.listarAll(user).then((data) => {
				if (mounted) {
					setClientes(data)
					setCliente(data[0]?.idcli)
				}
			})
		}

		return () => {
			mounted = false
		}
	}, [user, visibleEdicao])

	useEffect(() => {
		let mounted = true
		if (visibleEdicao) {
			ProductAPI.onListSearchDropdown(user, ``)
				.then((data) => {
					if (mounted) {
						if (data.length) {
							setItensParaSelecao(data)
						}
						setLoadingOption(false)
					}
				})
				.catch(() => {
					if (mounted) {
						setLoadingOption(false)
					}
				})
		}

		return () => {
			mounted = false
		}
	}, [user, visibleEdicao])

	useEffect(() => {
		let mounted = true
		if (visibleEdicao) {
			EtiquetaAPI.formOptions(user).then((data) => {
				setFormOptions(data)
			})
		}

		return () => {
			mounted = false
		}
	}, [user, visibleEdicao])

	useEffect(() => {
		if (etiquetaEdicao) {
			setItensParaSelecao((prev) => [...prev, etiquetaEdicao?.produto])
			setComplementos((prev) => [...prev, etiquetaEdicao?.complemento])
			const numeroExtraido = etiquetaEdicao?.temperatura
				?.match(/\d+/g)
				.join(``)
			reset({
				datavalidade: etiquetaEdicao?.datavalidade ?? ``,
				idproduto: etiquetaEdicao?.produto.id ?? undefined,
				idcomplemento: etiquetaEdicao.complemento?.id ?? undefined,
				servico: etiquetaEdicao.servico ?? ``,
				setor: etiquetaEdicao?.setor?.id ?? undefined,
				termodesinfectora: etiquetaEdicao.termodesinfectora?.id ?? undefined,
				seladora: etiquetaEdicao.seladora?.id ?? undefined,
				autoclave: etiquetaEdicao.autoclave?.id ?? undefined,
				peso: etiquetaEdicao.peso ?? ``,
				cautela: etiquetaEdicao.cautela ?? ``,
				temperatura: numeroExtraido ?? ``,
				biologico: etiquetaEdicao.biologico ?? ``,
				qtd: etiquetaEdicao.qtd ?? ``,

				ciclo_termodesinfectora:
                    etiquetaEdicao.ciclo_termodesinfectora ?? ``,

				ciclo_autoclave: etiquetaEdicao.ciclo_autoclave ?? ``,
				tipoetiqueta: etiquetaEdicao.tipoetiqueta ?? ``,
			})
		}
	}, [reset, etiquetaEdicao, setItensParaSelecao, setComplementos])
	return {
		miniModalVisible,
		setMiniModalVisible,
		control,
		register,
		errors,
		handleSubmit,
		setValue,
		reset,
		isDirty,
		isLoading,
		listarComplementos,
		cliente,
		setCliente,
		handleErrorReturnApi,
		setComplementos,
		complementos,
		setItensParaSelecao,
		itensParaSelecao,
		clientes,
		setClientes,
		loadingOption,
		onFilterItens,
		onFilterComplementos,
		formOptions,
	}
}
