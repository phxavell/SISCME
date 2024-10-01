import { UsuariosAPI } from "@/infra/integrations/cadastro-usuarios"
import { useAuth } from "@/provider/Auth"
import { useCallback, useEffect, useMemo, useState } from "react"


export const useUsuarios = () => {
	const { user,toastError , toastSuccess} = useAuth()
	const [showModal, setShowModal] = useState(false)
	const [showModalEdit, setShowModalEdit] = useState(false)
	const [loading, setLoading] = useState(true)
	const [pesquisando, setPesquisando] = useState(false)
	const [paginaAtual, setPaginaAtual] = useState(0)

	const [usuarios, setUsuarios] = useState<any>(undefined)
	const [nome, setNome] = useState(``)
	const [cpf, setCpf] = useState(``)


	const onPageChange = (event: { first: number }) => {
		setPaginaAtual(event.first)
	}

	const paramsMemo = useMemo(()=>{
		return {
			nome,
			cpf,
			page: paginaAtual+1
		}
	}, [paginaAtual, nome, cpf])

	const listarUsuarios = useCallback( () => {
		setLoading(true)
		UsuariosAPI.listar(user, paramsMemo).then((data) => {
			setUsuarios(data)
			setLoading(false)
		}
		).catch((error) => {
			toastError(error.message, false)
			setLoading(false)
		})
	}, [user, paramsMemo, toastError])


	const desativarUsuario = useCallback((idUser: number) => {
		setLoading(true)
		UsuariosAPI.deactive(user, idUser).then(() => {
			toastSuccess(`Usuário desativado com sucesso!`)
			setLoading(false)

		}).catch((error) => {
			toastError(error.message, false)
			setLoading(false)
		})
	}, [toastError, toastSuccess, user])

	const ativarUsuario = useCallback(async (idUser: number) => {
		setLoading(true)
		UsuariosAPI.active(user, idUser).then((data) => {
			toastSuccess(`Usuário ativado com sucesso!`)
			setLoading(false)
			return data

		}).catch((error) => {
			toastError(error.message, false)
			setLoading(false)
		})
	}, [toastError, toastSuccess, user])

	const resetarSenha = useCallback(async (idUser: number) => {
		setLoading(true)
		UsuariosAPI.resetPassword(user, idUser).then(() => {
			toastSuccess(`Senha resetada com sucesso!`)
			setLoading(false)

		}).catch((error) => {
			toastError(error.message, false)
			setLoading(false)
		})
	}, [toastError, toastSuccess, user])


	const handleStatusUsuario = useCallback((status: string, idUser: number) => {
		if (status === `DESATIVADO`) {
			ativarUsuario(idUser)
		} else {
			desativarUsuario(idUser)
		}
	}, [ativarUsuario, desativarUsuario])

	useEffect(() => {
		listarUsuarios()
	}, [listarUsuarios])


	return {
		usuarios,
		setUsuarios,
		paginaAtual,
		setPaginaAtual,
		loading,
		pesquisando,
		setPesquisando,
		onPageChange,
		nome,cpf,
		setNome, setCpf,
		showModal, setShowModal,
		showModalEdit, setShowModalEdit,
		listarUsuarios, desativarUsuario, ativarUsuario,
		setLoading, handleStatusUsuario, resetarSenha
	}


}
