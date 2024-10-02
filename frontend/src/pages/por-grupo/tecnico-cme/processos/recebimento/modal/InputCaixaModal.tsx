import {
	SterilizationRequestsSchema,
	SterilizationRequestsType
} from "@pages/por-grupo/cliente/criar-solicitacao/modal-create-sterilization/schemas.ts"
import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import {InputText} from "primereact/inputtext"
import {Button} from "primereact/button"
import {InputCaixaProps} from "@pages/por-grupo/tecnico-cme/processos/recebimento/types.ts"
import React, {useEffect} from "react"
import { buttonSave } from "@/util/styles/buttonAction"

export const InputCaixaModal: React.FC<InputCaixaProps> = ({ handleInput, showModal, focusAtual, modalIndicador }) => {
	const {
		register,
		handleSubmit,
		reset,
		formState: { isSubmitting },
		setFocus,
	} = useForm<SterilizationRequestsType>({
		resolver: zodResolver(SterilizationRequestsSchema)
	})
	const handleRequest = (data: SterilizationRequestsType) => {
		handleInput(data).then(() => {
			reset()
		})
	}
	useEffect(()=> {
		const timeout= setInterval (() => {
			if(showModal && focusAtual ===`serial` && !modalIndicador){
				setFocus(`serial`)
			}
		}, 2000)
		return ()=> {
			// @ts-ignore
			clearTimeout(timeout)
		}
	}, [showModal, focusAtual, setFocus, modalIndicador])
	return (
		<form
			onSubmit={handleSubmit(handleRequest)}
			className="flex gap-2">
			<InputText
				type="text"
				autoFocus
				data-testid='serial-modal'
				placeholder="Serial da caixa"
				{...register(`serial`)}
				className="w-9rem"
			/>
			<Button
				type="submit"
				icon={buttonSave.icon}
				disabled={isSubmitting}
				className={buttonSave.color}
			/>
		</form>
	)
}
