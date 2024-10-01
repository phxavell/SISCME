import { useAuth } from "."

import { RoutersPathName } from "@/routes/schemas"
import { useLocation, Navigate } from "react-router-dom"


export const RequireAuth = ({ children }: { children: JSX.Element} ) => {
	const { estaLogado } = useAuth()
	const location = useLocation()
	if (!estaLogado) {
		return (
			<Navigate
				to={RoutersPathName.Login}
				state={{ from: location }}
				replace />
		)
	}

	if (location.pathname == `/`) {

		return (
			<Navigate
				to={RoutersPathName.Home}
				state={{ from: location }}
				replace />
		)
	}
	return children
}
