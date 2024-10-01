import {DataPlantao, PlantaoAPI} from "@/infra/integrations/plantao"

import {useAuth} from "@/provider/Auth"
import {Button} from "primereact/button"
import {Dialog} from "primereact/dialog"
import {InputTextarea} from "primereact/inputtextarea"
import React, {useEffect, useState} from "react"
import {useForm} from "react-hook-form"
import {ModalProps} from "@pages/por-grupo/enfermagem/plantao/ModalPlantao/index.tsx"

export interface ModalEditDescricaoProps extends ModalProps {
    plantao: DataPlantao
}

export function ModalEditDescricao({onClose, visible, plantao}: ModalEditDescricaoProps) {
	const {toastError, toastSuccess} = useAuth()
	const [descricaoFormatada, setDescricaoFormatada] = useState(``)

	useEffect(() => {
		setDescricaoFormatada(plantao?.descricaoaberto.split(`\r\n`).join(`\n`))
	}, [plantao])

	const {
		handleSubmit,
		reset,
	} = useForm()

	const {user} = useAuth()

	function handleEditPlantao() {
		PlantaoAPI.atualizar(user, descricaoFormatada, plantao.idplantao).then(() => {
			reset()
			onClose(true)
			toastSuccess(`Plantão editado com sucesso.`)
		}).catch((e) => {
			toastError(e.data)
		})
	}

	return (
		<>
			<Dialog
				header='Editar Descrição'
				onHide={() => onClose(false)}
				visible={visible}
				style={{width: `80vw`}}
			>
				<form className="flex flex-column gap-2 mt-5" onSubmit={handleSubmit(handleEditPlantao)}>
					<span className="p-float-label">
						<InputTextarea
							className="w-full h-20rem"
							value={descricaoFormatada}
							onChange={(e) => setDescricaoFormatada(e.target.value)}
						/>
						<label>Descrição</label>
					</span>

					<div className="w-full flex justify-content-center">
						<Button
							className="w-3"
							label="Atualizar Plantão"
						/>

					</div>

				</form>
			</Dialog>

		</>
	)
}
