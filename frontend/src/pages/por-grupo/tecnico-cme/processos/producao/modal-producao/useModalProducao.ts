import { IPreparoToPDF } from "@/components/pdf-templates/types"
import { CaixaPreaparoPros, ProducaoAPI, ProdutoProducao } from "@infra/integrations/processo/producao.ts"
import { CaixaProdutoPreparo } from '@/infra/integrations/processo/types'
import { useAuth } from "@/provider/Auth"
import {useCallback, useEffect, useState} from "react"
import {useDebounce} from "primereact/hooks"
const debounceTime = 700
export function useModalProducao(conteudo: CaixaPreaparoPros, closeDialog:any, setCaixaToPDF:any){
	const { user} = useAuth()
	const [itensCaixaChecada, setItensCaixaChecada] = useState<ProdutoProducao[]>([])
	const [focusAtual, focusAtualDebounce, setFocusAtual] = useDebounce(``, debounceTime)
	const { toastError} = useAuth()
	const [indicador, setIndicador] = useState<any>()

	useEffect(() => {
		if (conteudo?.produtos) {
			setItensCaixaChecada(conteudo.produtos)
		}
	}, [conteudo, setFocusAtual])

	useEffect(() => {
		const timeout= setTimeout (()=> {
			if(focusAtualDebounce !==`serial`){
				setFocusAtual(`serial`)
			}
		}, 300)
		return ()=> {
			clearTimeout(timeout)
		}
	}, [focusAtualDebounce, setFocusAtual])

	const makeEtiqueta = (data:any)=> {
		return {
			caixa: {
				id: data.id,
				cliente: data.cliente,
				descricao: data.caixa,
				tipo: ` `,
				cautela: data.cautela,
				sequencial: data.serial,
				temperatura: data.temperatura,
				itens: data.produto
			},
			cautela: data.cautela,
			codigo: data.quantidade,
			responsavel_tecnico_coren: data.responsavel_tecnico_coren,
			responsavel_tecnico_nome: data.responsavel_tecnico_nome,
			usuario_preparo_coren: data?.usuario_preparo_coren,
			ciclo_termodesinfeccao: data?.ciclo_termodesinfeccao,
			recebimento: {
				usuario: {
					id: 1,
					nome: data.usuario_preparo
				},
				data_hora: data.data_preparo,
				data_recebimento: data.data_validade,
			}
		}
	}

	const handleSubmitPreparo = useCallback( async (
		conteudo: CaixaProdutoPreparo,
		itensCaixaChecada: ProdutoProducao[]
	) => {
		try {
			const {data} = await ProducaoAPI.finalizarChecagem(user,conteudo, itensCaixaChecada)
			setIndicador(undefined)
			const etiqueta:IPreparoToPDF = makeEtiqueta(data)
			return etiqueta

		} catch (error) {
			console.log(error)
			throw  error
		}
	}, [user])
	const handleFinalizarChegagem = useCallback(async(v: any) => {
		try {
			if (conteudo && v.serial && v.serial.toUpperCase() === conteudo?.serial) {
				const payload:any = {
					...conteudo,
					lote: indicador?.id,
					files: v.files,
				}
			 	const data = await	handleSubmitPreparo(payload, itensCaixaChecada)
				return data
			}else {
				throw `Serial divergente.`
			}
		} catch (error: any) {
			console.log(error)
			throw  error
		}
	}, [conteudo, handleSubmitPreparo, indicador?.id, itensCaixaChecada])

	const handleClose = async(trueOfFalse = false) => {
		closeDialog(trueOfFalse)
	}

	const hadleSubmitInput = async(v: any, files: any[]) => {
		const payload = {
			...v,
			files
		}
		handleFinalizarChegagem(payload).then(data=> {
			setCaixaToPDF(data)
			const caixa_completa_ = itensCaixaChecada.findIndex(check => !check.check) === -1
			const caixa = {
				...payload,
				caixaEditada: itensCaixaChecada,
				horario: new Date(),
				caixa_completa: caixa_completa_
			}
			handleClose(caixa)
		}).catch(error=> {
			toastError(error, false)
		})

	}
	return {
		focusAtual, setFocusAtual,
		setItensCaixaChecada,
		itensCaixaChecada,
		handleFinalizarChegagem,
		handleClose,
		hadleSubmitInput,

		indicador, setIndicador
	}
}
