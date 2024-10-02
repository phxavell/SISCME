import RemoteAccessClient from '../api/axios-s-managed.ts'
import {LoginResponse} from '@/infra/integrations/login.ts'

/****
 * post
 *cadastro/
 * body
 * */

type ProficionalType = {
    atrelado: string
    contato: string
    coren: string
    cpf: string
    dtadmissao: string | undefined
    dtcadastro: string | undefined
    dtdesligamento: string | undefined
    dtnascimento: string | undefined
    email: string
    matricula: string
    nome: string
    rt: string
    sexo: string
    status: string
    idprofissao: string
    perfil: number[]
}

type UsuarioType = {
    datacadastrousu: string | undefined
    apelidousu: string
    ativo: boolean
    senhausu: string
}

export interface UserProfissionalAddType {
    profissional: ProficionalType
    usuario: UsuarioType


}

/****
 *response
 * */
export interface UserProfissionalResponse {
    refresh: string
    access: string
    email: string
    permissions: [string]
    groups: [string]
}

/*
*  exemple
* {
    "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NjY2MjY4NSwiaWF0IjoxNjg2NTc2Mjg1LCJqdGkiOiIwZDg3NWYyOGFjZGQ0NDA5YjliMzQxNjYyZjMwMWI3OCIsInVzZXJfaWQiOjJ9.nnKOUo264BhIKZZs0HRaqBOyvmdboySv9aFhJ0p7S_A",
    "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjkyNTc2MjI1LCJpYXQiOjE2ODY1NzYyODUsImp0aSI6IjI2OGJkNTk1MWJlMDQ4NGJiMDk0NDY2MTkwZTQ5MWFhIiwidXNlcl9pZCI6Mn0.dBSRbhHM0RI04tAAkLiKXsTlrNz2t4twp14T7TR5ml8",
    "email": "robsonviana@gmail.com",
    "permissions": [],
    "groups": [
        "Enfermeiros"
    ]
}
* */
export const UserProfissionalAPI = {
	save: async (userLogado: LoginResponse, user: any) => {
		try {
			const api = RemoteAccessClient.getInstance(userLogado)
			const body: UserProfissionalAddType = {
				'profissional': {
					atrelado: `s`,
					contato: user.telefone,
					coren: user.coren,
					cpf: user.cpf,
					dtadmissao: `2023-06-12`,
					dtcadastro: `2023-06-12`,
					dtdesligamento: `2023-06-12`,
					dtnascimento: user.dtNasc,
					email: user.email,
					matricula: user.registration,
					nome: user.name,
					rt: user.rt,
					sexo: user.sexo,
					status: `true`,
					idprofissao: user.idprofissao,
					perfil: user.perfil
				},
				'usuario': {
					apelidousu: user.username,
					ativo: true,
					senhausu: user.password,
					datacadastrousu: `2023-06-12T19:09:45.378Z`,
				}


			}
			const userResponse: UserProfissionalResponse = await api({
				url: `cadastro/usuarios`,
				method: `POST`,
				data: body,
			}).then(r => r.data).catch(e => {
				throw e
			})
			//RemoteAccessClient.ReconfigureInstance(userResponse.access)
			return {
				status: 200,
				statusText: `Sucesso ao cadastrar.`,
				data: userResponse
			}
		} catch (e) {
			return {
				// @ts-ignore
				status: e.response?.status,
				statusText: `Erro ao cadastrar.`,
				data: undefined
			}
		}
	}
}
