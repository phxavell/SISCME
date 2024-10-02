import React, { useMemo } from 'react'
import {FieldError, FieldErrorsImpl, Merge} from 'react-hook-form'

export interface ErrorProps {
  message: string | undefined | FieldError | Merge<FieldError, FieldErrorsImpl<never>>
}
export const Errors:React.FC<ErrorProps> = ({message}) => {
	const mensagem = useMemo(() => {
		if (message !== `Required`) {
			return message as string
		} else {
			return `Este campo é obrigatório.`
		}
	}, [message])
	return (
		<div
			className="text-red-300 mt-1 text-xs font-medium"
			style={{
				wordBreak: `break-word`,
				textShadow: `0.1em 0.1em 0.2em black`
			}}
		>
			{mensagem}
		</div>
	)
}
