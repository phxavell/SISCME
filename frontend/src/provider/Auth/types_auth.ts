import { Login, LoginResponse } from "@/infra/integrations/login"
import { Toast } from "primereact/toast"
import { RefObject } from "react"

export namespace NContextos {

	export type NTost = (messagem: string, fixo?: boolean) => void
}
export const initialState: LoginResponse = {
	access: ``,
	email: ``,
	refresh: ``,
	groups: [],
	permissions: []
}
export interface IHeaderImgs {
	prefixo: {
		id: number;
		src: string;
	}[];
	sufixo: {
		id: number;
		src: string;
	}[];
}
export interface AuthContextType {
	user: LoginResponse
	signin: (user: Login) => Promise<void>
	signout: () => void
	estaLogado: boolean
	perfil: string
	selecionarPerfil: (perfilselecionado: string) => void
	toastSuccess: (messagem: string) => void
	toastInfor: (messagem: string) => void
	toastError: NContextos.NTost
	toastAlert: (messagem: string) => void
	toast: RefObject<Toast>
    visibleModalFeedback: any
    setVisibleModalFeedback: any
    messageFeedback: any
	alertReduced: any
	setAlertReduced: any
	getHeaderImgs:()=>IHeaderImgs
}
