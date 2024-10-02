import {Outlet} from 'react-router-dom'
import {useAuth} from '@/provider/Auth'
import {Header} from './header'
import {HeaderCliente} from './header/header-cliente'
import {HeaderMotorista} from './header/header-motorista'
import {useMemo, useState} from 'react'
import {Perfis} from '@/infra/integrations/login.ts'

import {ModalMessageApi} from '@/components/modals/ModalMessagemApi/ModalMessageApi'
import {ErrorBoundary} from "react-error-boundary"
import {ErrorFallback} from "@/layout/ErrorFallback.tsx"


export const Layout = () => {
	const {
		perfil,
		visibleModalFeedback,
		setVisibleModalFeedback,
		messageFeedback
	} = useAuth()

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [errorMessage, setErrorMessage] = useState<string>(``)

	const logError = (error: any) => {
		console.error(error)
		setErrorMessage(error.message)
		// we can also send the error to a logging service
	}
	const handleResetError = () => {
		setErrorMessage(``)
		//additional logic to perform code cleanup and state update actions
	}

	const showHeader = useMemo(() => {
		if (perfil === Perfis.Cliente) {
			return <HeaderCliente/>
		}
		if (perfil === Perfis.Transportador) {
			return <HeaderMotorista/>
		}
		return <Header/>
	}, [perfil])

	return (
		<>
			<ModalMessageApi
				visibleModalError={visibleModalFeedback}
				setVisibleModalError={setVisibleModalFeedback}
				messageErrorApi={messageFeedback}

			/>
			{showHeader}
			<ErrorBoundary
				onError={logError}
				onReset={handleResetError}
				FallbackComponent={ErrorFallback}
			>
				<Outlet/>
			</ErrorBoundary>

		</>
	)
}
