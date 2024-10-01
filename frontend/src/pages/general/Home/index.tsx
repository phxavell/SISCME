import { useAuth } from '@/provider/Auth'
import { HomeCliente } from '@pages/general/Home/HomeCliente'
import { HomeMotorista } from './HomeMotorista'
import { useMemo } from 'react'
import { Perfis } from '@/infra/integrations/login.ts'
import { HomeTecnico } from './HomeTecnico'
import { HomeAdministrativo } from '@pages/general/Home/HomeAdministrativo'
import { HomeEnfermagem } from '@pages/general/Home/HomeEnfermagem'
import { HomeGerencia } from './HomeGerencia'

export function Home() {
	const { perfil } = useAuth()

	const showHome = useMemo(() => {
		if (perfil === Perfis.Cliente) {
			return <HomeCliente />
		}
		if (perfil === Perfis.Transportador) {
			return <HomeMotorista />
		}
		if (perfil === Perfis.Tecnico) {
			return <HomeTecnico />
		}
		if (perfil === Perfis.Administrador) {
			return <HomeAdministrativo />
		}
		if (perfil === Perfis.Enfermagem) {
			return <HomeEnfermagem />
		}
		if (perfil === Perfis.Gerente) {
			return <HomeGerencia />
		}
		return <HomeTecnico />
	}, [perfil])
	return (
		<>
			{showHome}
		</>
	)
}
