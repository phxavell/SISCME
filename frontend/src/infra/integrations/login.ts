import RemoteAccessClient from '../api/axios-s-managed.ts'

export interface Login {
    username: string
    password: string
}

export interface LoginResponse {
    refresh: string
    access: string
    email: string
    permissions: string[]
    groups: string[]
}


export enum Perfis {
    Administrador = `Administrativo`,
    Cliente = `Hospital`,
    Enfermagem = `Enfermagem`,
    Tecnico = `Técnico`,
    Transportador = `Transportador`,
	Gerente = `Gerente`
}

const groupsMapped = {
	Administrador: [
		`ADMINISTRATIVO`,
		`ADMINISTRADORES`
	],
	Cliente: [
		`CLIENTE`,
		`ADMINISTRADORES`
	],
	Tecnico: [
		`TECNICOENFERMAGEM`,
		`TECNICORECEBIMENTO`,
		`TECNICOTERMO`,
		`TECNICOEMBALAGEM`,
		`TECNICOESTERILIZACAO`,
		`TECNICODISTRIBUICAO`,
		`ADMINISTRADORES`
	],
	Transportador: [
		`MOTORISTA`,
		`ADMINISTRADORES`
	],
	Enfermagem: [
		`SUPERVISAOENFERMAGEM`,
		`ENFERMAGEM`,
		`ADMINISTRADORES`
	],
	Gerente: [
		`GERENTE`,
		`ADMINISTRADORES`
	]
}
const isAdmin = (groups: string[]) => {
	const index =  groups.findIndex(group => {
		return groupsMapped.Administrador.includes(group)
	})
	return index !== -1
}
const isClient = (groups: string[]) => {
	const index = groups.findIndex(group => {
		return groupsMapped.Cliente.includes(group)
	})
	return index !== -1
}
const isTechnician = (groups: string[]) => {
	const index = groups.findIndex(group => {
		return groupsMapped.Tecnico.includes(group)
	})
	return index !== -1
}
const isTransporter = (groups: string[]) => {
	const index = groups.findIndex(group => {
		return groupsMapped.Transportador.includes(group)
	})
	return index !== -1
}
const isEnfermagem = (groups: string[]) => {
	const index = groups.findIndex(group => {
		return groupsMapped.Enfermagem.includes(group)
	})
	return index !== -1
}
const isGerente = (groups: string[]) => {
	const index = groups.findIndex(group => {
		return groupsMapped.Gerente.includes(group)
	})
	return index !== -1
}

const regroup = (groups: string[]) => {
	const newgroups = []
	if (isAdmin(groups)) {
		newgroups.push(Perfis.Administrador)
	}
	if (isClient(groups)) {
		newgroups.push(Perfis.Cliente)
	}
	if (isEnfermagem(groups)) {
		newgroups.push(Perfis.Enfermagem)
		if (groups.includes(`SUPERVISAOENFERMAGEM`)) {
			newgroups.push(`SUPERVISAOENFERMAGEM`)
		}
	}
	if (isTechnician(groups)) {
		newgroups.push(Perfis.Tecnico)
	}
	if (isTransporter(groups)) {
		newgroups.push(Perfis.Transportador)
	}
	if (isGerente(groups)) {
		newgroups.push(Perfis.Gerente)
	}

	return newgroups
}

export const LoginAPI = {
	logar: async (user: Login) => {
		try {
			const api = RemoteAccessClient.getInstance(undefined)
			const userResponse: LoginResponse = await api({
				url: `token/`,
				method: `POST`,
				data: {username: user.username, password: user.password},
			}).then(r => r.data).catch(e => {
				throw e
			})
			const userRegrouped = {
				...userResponse,
				groups: regroup(userResponse.groups)
			}
			RemoteAccessClient.ReconfigureInstance(userResponse.access)
			return {
				status: 200,
				statusText: `Sucesso ao logar.`,
				data: userRegrouped
			}
		} catch (e: any) {
			throw {
				status: e?.response?.status,
				statusText: e?.response,
				message: e?.response?.data?.error?.message,
			}
		}
	}
}
