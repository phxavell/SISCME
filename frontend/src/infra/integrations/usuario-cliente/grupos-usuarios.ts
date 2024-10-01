import RemoteAccessClient from "../../api/axios-s-managed"
import { LoginResponse } from "@/infra/integrations/login.ts"
import { AxiosError } from "axios"

 interface erroProps {
    code: number | undefined,
    message: string | undefined
}
export interface GruposUsuarioResponse {
    id: number,
   value: string
}

export const GruposUsuariosAPI = {
	getOptions: async (user: LoginResponse): Promise<any> => {
		try {
			const api = RemoteAccessClient.getInstance(user)
			const { data } = await api({
				url: `grupos/form-options`,
				method: `GET`
			})

			if ( data && Array.isArray(data?.data?.grupos) ){
				const grupos = data?.data?.grupos.map((grupo: any) => {
					return {id: grupo.id,
						descricao: grupo.value}
				})
				return grupos
			} else {
				return []
			}

		} catch (error) {

			if (error instanceof AxiosError) {
			    const customError: erroProps = {
			        message: error.response?.data,
			        code: error.response?.status
			    }
				if(customError?.code) {
					throw customError
				} else {
					throw {	 message: `Erro não mapeado.` }
				}

			} else {
				throw {	message: `Erro não mapeado.` }
			}
		}
	},
}
