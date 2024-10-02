import { useCallback, useEffect, useState } from "react"
import {useForm} from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { UsuariosAPI } from "@/infra/integrations/cadastro-usuarios"
import { IOptionToSelect } from "@/infra/integrations/caixa/types"
import { useAuth } from "@/provider/Auth"
import { GruposUsuariosAPI } from "@/infra/integrations/usuario-cliente/grupos-usuarios"
import { ETabUsuario, UsuariosInputs, UsuariosSchema } from "./types"

const mapMakeOptionListFromProfissao = (profissao: any): IOptionToSelect => {
	return {
		id: profissao.id,
		valor: profissao.descricao
	}
}
interface SelectGruposProps {
    id: number,
    descricao: string
}

export const debounceTime = 700

export const useModalNovoUsuario = (showModal: boolean, onClose: any) => {

	const { user,toastError, toastSuccess} = useAuth()
	const [tabAtual, setTabAtual] = useState(ETabUsuario.DadosPessoais)
	const [profissoesList, setProfissoesList] = useState<IOptionToSelect[]>([])
	const [idUser, setIdUser] = useState(0)
	const [status, setStatus] = useState(``)
	const [miniModalVisible, setMiniModalVisible] = useState<boolean>(false)
	const [gruposUsuarios, setGruposUsuarios] = useState<SelectGruposProps[]>([])
	const [selectedGrupos, setSelectedGrupos] = useState<SelectGruposProps[] | null>(null)

	const {
		control,
		handleSubmit,
		reset,
		register,
		setError,
		getValues,
		formState: { errors }
	} = useForm<UsuariosInputs>({resolver: zodResolver(UsuariosSchema)})

	const [loading, setLoading] = useState(false)

	const atualizarParametrosParaEdicao = useCallback((usuarioEdit?: any) => {

		const dtnascimentoedit = new Date(usuarioEdit?.dtnascimento)
		const dtadmissaoedit = new Date(usuarioEdit?.dtadmissao)
		const matriculaedit = usuarioEdit?.matricula ? parseInt(usuarioEdit?.matricula) : null

		if(!usuarioEdit) return
		reset({
			Profissional: {
				cpf: usuarioEdit?.cpf ?? ``,
				nome: usuarioEdit?.nome ?? ``,
				matricula: matriculaedit ?? null,
				coren: usuarioEdit?.coren ?? ``,
				sexo: usuarioEdit?.sexo ?? ``,
				// @ts-ignore
				dtnascimento: dtnascimentoedit,
				// @ts-ignore
				dtadmissao: dtadmissaoedit,
				rt: usuarioEdit.rt,
				contato: usuarioEdit?.contato ?? ``,
				email: usuarioEdit?.email ?? ``,
				idprofissao: usuarioEdit?.profissao?.id ?? ``,
			},
			Usuario: {
				username: usuarioEdit?.user?.username ?? ``,
				grupos: usuarioEdit?.user.grupos ?? ``,
			}

		})
		setIdUser(usuarioEdit?.user?.id)


	}, [reset])

	const hasFilledFields = () => {
		const formValues = getValues()
		return Object.values(formValues).some((value) => !!value)
	}

	const confirmarFecharModal = () => {
		if (hasFilledFields()) {
			setMiniModalVisible(true)
			setTabAtual(ETabUsuario.DadosPessoais)
		} else {
			onClose(false)
		}
	}
	const handlerMiniModal = () => {
		reset({
			Profissional: {
				cpf: ``,
				nome: ``,
				matricula: null,
				coren: ``,
				sexo: ``,
				// @ts-ignore
				dtnascimento: ``,
				// @ts-ignore
				dtadmissao: ``,
				rt: ``,
				email: ``,
				idprofissao: 0,
			},
			Usuario: {
				username: ``,
				grupos: [],
			}

		})
	}
	const listarProfissoes = useCallback( () => {
		UsuariosAPI.listarProfissoes(user, {}).then((data) => {
			setProfissoesList(data.data.map(mapMakeOptionListFromProfissao))
		}
		).catch((error) => {
			toastError(error.message, false)
		})
	}, [toastError, user])
	const listarGrupos = useCallback(() => {

		GruposUsuariosAPI.getOptions(user)
			.then((data) => setGruposUsuarios(data))
			.catch((error) => {
				toastError(error.message, false)
				setTimeout(() => {
					onClose()
				}, 1000)
			})
	}, [user, toastError, onClose])
	useEffect(() => {
		if(showModal){
			listarProfissoes()
			listarGrupos()
		}
	}, [showModal, listarProfissoes, listarGrupos])


	const handleErrorReturnApi = useCallback((data: any) => {

		if (data.data && typeof data.data === `object`) {
			Object.keys(data.data).map((key) => {
				switch(key) {
				    case `cpf`:
					    setError(`Profissional.cpf`, {
						    type: `manual`,
						    message:data.data[key][0]}
					    )
					setTabAtual(ETabUsuario.DadosPessoais)
					break
				    case `nome`:
					    setError(`Profissional.nome`, {
						    type: `manual`,
						    message:data.data[key][0]}
					    )
					setTabAtual(ETabUsuario.DadosPessoais)
					break
				    case `dtnascimento`:
					    setError(`Profissional.dtnascimento`, {
						    type: `manual`,
						    message:data.data[key][0]}
					    )
					setTabAtual(ETabUsuario.DadosAdicionais)
					break
				    case `dtadmissao`:
					    setError(`Profissional.dtadmissao`, {
						    type: `manual`,
						    message:data.data[key][0]}
					    )
					setTabAtual(ETabUsuario.DadosAdicionais)
					break
				    case `rt`:
					    setError(`Profissional.rt`, {
						    type: `manual`,
						    message:data.data[key][0]}
					    )
					break
				    case `email`:
					    setError(`Profissional.email`, {
						    type: `manual`,
						    message:data.data[key][0]}
					    )
					break
				case `sexo`:
					    setError(`Profissional.sexo`, {
						    type: `manual`,
						    message:data.data[key][0]}
					    )
					setTabAtual(ETabUsuario.DadosPessoais)
					break
				case `idprofissao`:
					    setError(`Profissional.idprofissao`, {
						    type: `manual`,
						    message:data.data[key][0]}
					    )
					break

				case `username`:
					    setError(`Usuario.username`, {
						    type: `manual`,
						    message:data.data[key][0]}
					    )
					break
				}
			})
		} else {
			toastError(data.message, false)

		}
	}, [toastError, setError])

	const handleSubmitUsuario = (data: UsuariosInputs) => {

		UsuariosAPI.cadastrar(user, data).then(() => {
			toastSuccess(`Usuário cadastrado com sucesso!`)
			setLoading(false)
			reset()
			setTabAtual(ETabUsuario.DadosPessoais)
			listarProfissoes()
			onClose()
		}).catch((error: any) => {
			console.log(error)
			handleErrorReturnApi(error.message)
			setLoading(false)
		})

	}

	const editarUsuario = (data: UsuariosInputs, onClose: any) => {
		setLoading(true)
		const payloudData = {
			...data.Profissional,
			grupos: data.Usuario.grupos,
		}


		UsuariosAPI.update(user, idUser, payloudData).then(() => {
			toastSuccess(`Usuário editado com sucesso!`)
			setLoading(false)
			setTabAtual(ETabUsuario.DadosPessoais)
			reset()
			onClose()
		}).catch((error) => {
			handleErrorReturnApi(error.message)
			setLoading(false)
		})

	}
	return {
		idUser,setIdUser,
		control,
		handleSubmit,
		register,
		errors,
		reset,
		loading,
		getValues,
		profissoesList,
		status, setStatus,
		editarUsuario, atualizarParametrosParaEdicao,
		user,
		toastSuccess,
		handleErrorReturnApi,
		listarProfissoes,
		selectedGrupos, setSelectedGrupos,
		gruposUsuarios,
		handleSubmitUsuario,
		miniModalVisible, setMiniModalVisible,
		confirmarFecharModal, handlerMiniModal,
		setTabAtual, tabAtual,
	}
}
