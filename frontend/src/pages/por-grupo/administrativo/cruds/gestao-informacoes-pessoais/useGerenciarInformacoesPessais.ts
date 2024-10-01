import { GereciarInformacoesPessoaisPI, Info } from '@/infra/integrations/gerenciar-informacoes-pessoais'
import { useAuth } from '@/provider/Auth'
import { useState, useEffect } from 'react'
export function useGerenciarInformacoesPessoais() {
	const { user } = useAuth()
	const [usuario, setUsuario] = useState<Info | undefined>()

	async function onListUsuario() {
		try {
			const data = await GereciarInformacoesPessoaisPI.onList(user)
			console.log(data?.infos)
			setUsuario(data?.infos)
			console.log(data)
		} catch (error) {
			console.log(error)
		}
	}
	useEffect(() => {
		onListUsuario()
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])
	return {
		usuario,
		onListUsuario
	}
}
