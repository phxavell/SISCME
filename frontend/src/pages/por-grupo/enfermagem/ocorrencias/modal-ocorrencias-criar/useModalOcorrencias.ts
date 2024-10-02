import {useCallback, useEffect, useState} from "react"
import {mapMakeOpcaoListFromCliente} from "@infra/integrations/caixa/caixa.ts"
import {ClientAPI} from "@infra/integrations/client.ts"
import {useAuth} from "@/provider/Auth"
import {useForm} from "react-hook-form"
import {OcorrenciaSchema, TOcorrencia} from "@pages/por-grupo/enfermagem/ocorrencias/schemas.ts"
import {zodResolver} from "@hookform/resolvers/zod"
import {OcorrenciaOpcoes, OptionOcorrencia} from "@infra/integrations/enfermagem/types.ts"
import {OcorrenciasAPI} from "@infra/integrations/enfermagem/ocorrencias.ts"
import moment from "moment"
import {StatusCliente} from "@infra/integrations/types-client.ts"

const template1 = `<p><strong>MANAUS,</strong></p><p><strong>OCORRÊNCIA RECEBIDA:</strong></p><p>A BP Serviços, em atendimento á notificação da unidade&nbsp;referente&nbsp;_______________, vem respeitosamente por meio desta informar&nbsp; que a recepcionamos e efetuamos ações de correção necessárias visando a&nbsp;resolução no menor espaço de tempo possível.</p><p>Dessa forma, apresentamos as ações corretivas referente à não conformidade relatada pela unidade:</p><p><br></p>`
export const defaultValuesModal = () => {
	return {
		data_ocorrencia: new Date(),
		hora_ocorrencia: new Date(),
		datetime_ocorrencia: new Date(),
		cliente: 4,
		descricao: template1,
		indicador: 1,
		profissional: 2,
		setor: 1,
		tipo: `RECEBIDO`
	}
}
// @ts-ignore
// @ts-ignore
export const useModalOcorrencias = (openDialog: boolean, closeDialog: any, conteudo: any) => {
	const {user, toastError, toastSuccess, toastInfor} = useAuth()
	const [loadingOption, setLoadingOption] = useState(true)
	const [clientes, setClientes] = useState<OptionOcorrencia[]>([])

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
		clearErrors,
		formState: {errors},
		setFocus
	} = useForm<TOcorrencia>({
		shouldFocusError: true,
		resolver: zodResolver(OcorrenciaSchema),
		mode: `all`,
		defaultValues: defaultValuesModal()
	})
	const [opcoes, setOpcoes] = useState<OcorrenciaOpcoes>()


	const handleClose = useCallback((close?: boolean) => {
		reset(defaultValuesModal())
		closeDialog(close)
	}, [closeDialog, reset])

	const handlesalvar = useCallback(async () => {

		await trigger().then((ok) => {
			if (ok) {
				const values = getValues()
				if (!conteudo) {
					OcorrenciasAPI.salvar(user, values, setError).then(() => {
						toastSuccess(`Ocorrência registrada.`)
						reset(defaultValuesModal())
						handleClose(true)
					}).catch((erros) => {
						console.log(`erros em tela`, erros)
						toastError(`Erros em tela`)
					})
				} else {
					OcorrenciasAPI.editarOcorrencia(
						user,
						values,
						conteudo.id,
						setError).then(() => {
						toastInfor(`Ocorrência Alterada.`)
						reset(defaultValuesModal())
						handleClose(true)
					}).catch(erros => {
						console.log(`erros em tela`, erros)
						toastError(`Erros em tela`)
					})
				}


			}
		})
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		user,
		trigger,
		getValues,
		conteudo,
		toastSuccess,
		toastInfor,
		toastError,
		setError,
		handleClose
	])

	useEffect(() => {
		if (conteudo) {
			// @ts-ignore
			let dateF = new moment(new Date())
			dateF = moment(`${conteudo.dt_ocorrencia}`, `YYYY-MM-DD HH:mm:ss`)

			const formaterDeEdit = {
				data_ocorrencia: dateF.toDate(),
				hora_ocorrencia: dateF.toDate(),
				datetime_ocorrencia: dateF.toDate(),
				cliente: conteudo.cliente.id,
				descricao: conteudo.descricao,
				indicador: conteudo.indicador.id,
				profissional: conteudo.profissional_responsavel,
				setor: conteudo.setor.id,
				tipo: conteudo.tipodediariodeocorrencia,
			}
			reset(formaterDeEdit)
		} else {
			reset(defaultValuesModal())
		}
	}, [conteudo, reset])


	useEffect(() => {
		let mounted = true
		//TODO checar uma forma de por em cache essa request
		if (user && openDialog) {
			setLoadingOption(true)

			ClientAPI.listar(user, 1, StatusCliente.Ativo).then(clientes => {
				if (mounted) {
					const clientFormated = clientes.data.map(mapMakeOpcaoListFromCliente)
					setClientes(clientFormated)
				}
			})
			OcorrenciasAPI.listarOpcoes(user)
				.then((data) => {
					setOpcoes(data)
					setLoadingOption(false)
				})
				.catch(() => {
					setLoadingOption(false)
				})
		}
		return () => {
			mounted = false
		}

	}, [toastError, user, openDialog])


	return {
		clientes,
		loadingOption,
		setClientes,
		control,
		register,
		handleSubmit, clearErrors,
		reset,
		setValue,
		getValues,
		trigger,
		watch,
		setError,
		errors,
		setFocus,
		opcoes,
		handlesalvar,
		handleClose
	}
}
