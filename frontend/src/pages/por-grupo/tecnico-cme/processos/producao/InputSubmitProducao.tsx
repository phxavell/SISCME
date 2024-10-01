import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import {InputText} from "primereact/inputtext"
import {Button} from "primereact/button"
import {ModalSubmitSchema, ModalSubmitSchemaType} from "./schema"
import React, {useEffect} from "react"
import {InputModalSubmitCaixaProps} from "@pages/por-grupo/tecnico-cme/processos/producao/types.ts"

export const InputSubmitProducao: React.FC<InputModalSubmitCaixaProps> = (props) => {

	const {handleInput, modalOpen} = props
	const {
		register,
		handleSubmit,
		reset,
		setFocus,
		formState: {isSubmitting}
	} = useForm<ModalSubmitSchemaType>({
		resolver: zodResolver(ModalSubmitSchema)
	})
	const handleRequest = (data: ModalSubmitSchemaType) => {
		handleInput(data).then(() => {
			reset()
		})
	}

	useEffect(()=> {
		const timeout= setInterval (()=> {
			if(modalOpen){
				setFocus(`serial`)
			}
		}, 1200)
		return ()=> {
			// @ts-ignore
			clearTimeout(timeout)
		}
	}, [modalOpen, setFocus])

	return (
		<form
			onSubmit={handleSubmit(handleRequest)}
			className="flex gap-2">
			<InputText
				type="text"
				placeholder="Serial da caixa"
				data-testid='serial-modal'
				{...register(`serial`)}
				autoFocus
				className="w-9rem"
			/>
			<Button
				type="submit"
				icon='pi pi-save'
				data-testid='botao-confirmar-serial-producao'
				disabled={isSubmitting}/>
		</form>
	)
}
