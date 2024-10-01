import React, {createContext, useCallback, useContext, useEffect, useMemo, useRef, useState} from "react"
import {Login, LoginAPI, LoginResponse} from "@/infra/integrations/login.ts"
import {Toast} from "primereact/toast"
import { getLocalStorage, getLocalStoragePerfil, setLocalStorage } from "./variables"
import {IHeaderImgs, NContextos} from "./types_auth"
import { initialState } from "./types_auth"
import { AuthContextType } from "./types_auth"
import { TMessageAlert } from "@/components/modals/ModalMessagemApi/types"
import { useLocation } from "react-router-dom"
import {LogoBP128, LogoGovAM, SeloBPHalf180} from "@/util/styles"
export const AuthContext = createContext<AuthContextType>({} as AuthContextType)


// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
	return useContext(AuthContext)
}



export const AuthProvider = ({children}: { children: React.ReactNode }) => {
	const [user, setUser] = useState<LoginResponse>(() => getLocalStorage(`user`, initialState))
	const [perfil, setPerfil] = useState<string>(() => getLocalStoragePerfil(`perfil`, ``))
	const [visibleModalFeedback, setVisibleModalFeedback] = useState<boolean>(false)
	const [alertReduced, setAlertReduced] = useState(false)
	const location = useLocation()


	const [messageFeedback, setMessageFeedback] = useState<{
        type: TMessageAlert
        description: string
    }>({type: TMessageAlert.Error,
    	description: `Erro não mapeado!!`})




	const toast = useRef<Toast>(null)
	const toastSuccess = (messagem: string) => {
		if (!alertReduced) {
			setMessageFeedback({
				type:TMessageAlert.Success,
				description: messagem
			})
			setTimeout(()=>{
				setVisibleModalFeedback(true)
			}, 300)

		}}
	const toastInfor = (messagem: string) => {
		setMessageFeedback({
			type:TMessageAlert.Alert,
			description: messagem
		})

		setVisibleModalFeedback(true)
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const toastError: NContextos.NTost = useCallback((messagem, _) => {
		setMessageFeedback({
			type:TMessageAlert.Error,
			description: messagem
		})
		setTimeout(()=>{
			setVisibleModalFeedback(true)
		}, 300)

	}, [setMessageFeedback])
	const toastAlert = (messagem: string) => {
		setMessageFeedback({
			type:TMessageAlert.Alert,
			description: messagem
		})
		setVisibleModalFeedback(true)

	}

	const signin = async (user: Login): Promise<void> => {
		const userResponse = await LoginAPI.logar(user)
		if (!userResponse) {
			throw `Error ao logar`
		}
		const {data} = userResponse
		// @ts-ignore
		setUser(data)
	}

	const signout = () => {
		setUser(initialState)
		setPerfil(``)
	}

	useEffect(() => {
		setLocalStorage(`user`, user)
	}, [user])
	useEffect(() => {
		setLocalStorage(`perfil`, perfil)
	}, [perfil])

	const estaLogado = useMemo(() => {
		return !!user?.access?.length

	}, [user])

	const selecionarPerfil = (perfilSelecionado: string) => {
		setPerfil(perfilSelecionado)
	}

	const getHeaderImgs:()=>IHeaderImgs = ()=> {
		return {
			prefixo: [
				{
					id: 1,
					src: LogoBP128
				}
			],
			sufixo: [
				// {
				// 	id: 2,
				// 	src: SeloBPHalf180
				// },
				{
					id: 3,
					src: LogoGovAM
				}
			]
		}
	}

	useEffect(() => {
		setAlertReduced(false)
	}, [location])

	const value = {
		user,
		signin,
		signout,
		estaLogado,
		selecionarPerfil,
		perfil,
		toastSuccess,
		toastError,
		toast,
		toastAlert,
		toastInfor,
		visibleModalFeedback,
		setVisibleModalFeedback,
		messageFeedback,
		alertReduced,
		setAlertReduced,
		getHeaderImgs

	}

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
