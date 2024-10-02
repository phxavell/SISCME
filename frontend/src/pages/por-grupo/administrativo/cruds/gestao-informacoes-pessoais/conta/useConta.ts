import { useAuth } from '@/provider/Auth'
import { ContaProps, GereciarInformacoesPessoaisPI } from '@/infra/integrations/gerenciar-informacoes-pessoais'
import { useCallback, useEffect, useState } from 'react'

export function useConta() {
	const [conta, setConta] = useState<ContaProps>()
	const { user } = useAuth()
	const onListUsuario = useCallback(async () => {
		try {
			const data = await GereciarInformacoesPessoaisPI.onList(user)
			setConta(data?.conta)
		} catch (error) {
			console.log(error)
		}
	}, [user])
	useEffect(() => {
		onListUsuario()
	}, [onListUsuario])
	return {
		conta
	}
}
