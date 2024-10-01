import {useNavigate} from "react-router-dom"
import {Button} from "primereact/button"
import React from "react"
import {styleNotFound} from "@pages/general/NotFound/style.ts"
import {RoutersPathName} from "@/routes/schemas.ts"
interface TErrorFallback {
    error: any
    componentStack: any
    resetErrorBoundary: any
}
export const ErrorFallback: React.FC<TErrorFallback | any> = (props) => {
	const {error, componentStack, resetErrorBoundary } = props
	const navigation = useNavigate()
	console.info(`ErrorFallback: error=${error}`)
	console.info(`ErrorFallback: componentStack=${componentStack}`)
	return (
		<div className={styleNotFound}>
			<h2>
                Oops! Ocorreu um erro
				<br/>
				<br/>
                Reporte para a equipe de desenvolvimento.
				<br/>
				<br/>
				<Button
					size={`large`}
					icon={`pi pi-home`}
					onClick={() => {
						if (navigation) {
							resetErrorBoundary()
							navigation(RoutersPathName.Home, {replace: false})
						}

					}}
				></Button>
			</h2>
		</div>
	)
}
