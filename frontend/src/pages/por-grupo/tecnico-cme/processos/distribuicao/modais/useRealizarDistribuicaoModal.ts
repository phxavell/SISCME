import {useCallback, useEffect, useState} from "react"
import {useAuth} from "@/provider/Auth"
import {useForm} from "react-hook-form"
import {
	DistribuicaoInputs,
	DistribuicaoSchema, IRealizarDistribuicao
} from "@pages/por-grupo/tecnico-cme/processos/distribuicao/modais/schema.ts"
import {zodResolver} from "@hookform/resolvers/zod"
import {SetorAPI} from "@infra/integrations/setor.ts"
import {DistribuicaoAPI} from "@infra/integrations/processo/distribuicao/distribuicao.ts"
import {DropdownFilterEvent} from "primereact/dropdown"
const checkJaLido = (sequencial: string) => (item: any) => {
	return item.serial === sequencial.toUpperCase()
}
export const useRealizarDistribuicaoModal = (props:IRealizarDistribuicao)=> {
	const {visible, onClose, clienteSelecionado} = props
	const [listaBipado, setListaBipado] = useState<any[]>([])
	const [sequencial, setSerial] = useState(``)
	const [cautela, setCautela] = useState(`0`)
	const {user, toastSuccess, toastError} = useAuth()
	const [seriaisDisponiveis, setSeriaisDisponiveis] = useState<any[]>([])
	const [loadingOption, setLoadingOption] = useState(true)
	const [setores, setSetores] = useState<any>()
	const {
		control,
		handleSubmit,
		formState: {errors},
		setError,
		reset,
		clearErrors,
		getValues
	} = useForm<DistribuicaoInputs>({
		mode: `all`,
		resolver: zodResolver(DistribuicaoSchema)
	})

	useEffect(() => {
		if (visible) {
			SetorAPI.listar(user, 1).then(data => {
				setSetores(data?.data)
				setLoadingOption(false)
			}).catch(() => {
				setLoadingOption(false)
			})
		}

	}, [user, visible])

	useEffect(() => {
		if (visible && clienteSelecionado?.cliente_id) {
			DistribuicaoAPI.seriaisDisponiveis(user, clienteSelecionado.cliente_id).then((seriais) => {
				//TODO fica a critério de validar esse processo ainda com cliente,
				//TODO facilitar o debug do cenário, após 100% testado retiramos
				console.log(seriais.map(serial => serial.serial).toString())
				setSeriaisDisponiveis(seriais)
			})
		}
	}, [visible, user, clienteSelecionado])

	const caixaCorrespondente = useCallback((serial: string) => {
		return seriaisDisponiveis.find(serialDisponivel => serialDisponivel.serial === serial.toUpperCase())
	}, [seriaisDisponiveis])

	const includeList = useCallback((e: any) => {
		e.preventDefault()
		const sequencialTrim = sequencial.trim().toUpperCase()
		if (sequencialTrim === ``) {
			toastError(`Bipe o sequencial da caixa`, false)
		} else if (!listaBipado.some(checkJaLido(sequencialTrim))) {
			const caixaBiped = caixaCorrespondente(sequencialTrim)
			if (caixaBiped) {
				const prev = [caixaBiped].concat(listaBipado)
				setListaBipado(prev)
			} else {
				toastError(`${sequencialTrim} não pertence ao estoque do ${clienteSelecionado?.nome ?? `Não informado`}`, false)
			}
		} else {
			toastError(`Serial já bipado`, false)
		}
		setSerial(``)
	}, [caixaCorrespondente, clienteSelecionado, listaBipado, sequencial, toastError])

	const handleDistribuicao = useCallback(() => {

		const body = {
			cliente: clienteSelecionado?.cliente_id,
			itens: listaBipado,
			cautela,
			setor: getValues(`setor`)
		}

		DistribuicaoAPI.distribuir(user, body, toastError, setError, clearErrors, () => {
			toastSuccess(`Material distribuído com sucesso.`)
			setListaBipado([])
			setSerial(``)
			reset()
			onClose(true)
		})
	}, [
		clienteSelecionado?.cliente_id,
		listaBipado,
		cautela,
		getValues,
		user,
		toastError,
		setError,
		toastSuccess,
		reset,
		onClose
	])

	const handleCloseModal = () => {
		setListaBipado([])
		setSerial(``)
		setCautela(`0`)
		reset()
		onClose()
	}

	const deletarSerial = (sequencial: any) => {
		setListaBipado((prevLista) =>
			prevLista.filter((item) => item.serial !== sequencial)
		)
	}
	const onFilterItens = useCallback((event: DropdownFilterEvent) => {
		if (event.filter) {
			setLoadingOption(true)
			SetorAPI.filtrar(user, {descricao: event.filter}).then(r => {
				if (r?.data.length) {
					setSetores(r.data)
				}
				setLoadingOption(false)
			}).catch(() => {
				setLoadingOption(false)
			})
		}
	}, [user])
	return {
		listaBipado, setListaBipado,
		sequencial, setSerial,
		cautela, setCautela,
		seriaisDisponiveis, setSeriaisDisponiveis,
		loadingOption, setLoadingOption,
		setores, setSetores,
		caixaCorrespondente,
		includeList,
		handleDistribuicao,
		handleCloseModal,
		deletarSerial,
		onFilterItens,
		control,
		handleSubmit,
		formState: {errors},
		setError,
		reset,
		clearErrors,
		getValues
	}
}
