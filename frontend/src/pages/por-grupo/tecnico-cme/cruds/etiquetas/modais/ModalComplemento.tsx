import { Dialog } from "primereact/dialog"
import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import { ComplementoAPI} from "@/infra/integrations/complemento"
import { InputText } from "primereact/inputtext"
import { useAuth } from "@/provider/Auth"
import { Button } from "primereact/button"
import { styleActionHeader } from "@/components/RowTemplate"
import { Errors } from "@/components/Errors"
import { ComplementoFormSchema, ModalComplementoProps, complementoForm } from "./types"


export function ModalComplemento({ onClose, visible, setComplemento }: ModalComplementoProps) {

	const { toastError, user } = useAuth()
	const {	register, handleSubmit,	reset, formState: {errors, isLoading}
	} = useForm<ComplementoFormSchema>({
		resolver: zodResolver(complementoForm)
	})

	const handleComplemento = async(data: ComplementoFormSchema) => {
		const paylod = {
			status: `ATIVO`,
			descricao: data.descricao
		}
		try {
			 const data = ComplementoAPI.save(user, paylod)
			setComplemento(data)
			reset()
			onClose()

		} catch (error: any) {
			const msgError=  `Não foi possível salvar complemento!!`
			if (error?.data) {
				toastError(error?.data?.error?.data?.descricao[0] ?? msgError)
			} else {
				toastError(msgError)
			}
		}
	}

	const headerModalTemplate = () => {
		return (
			<div className="flex  w-full justify-content-end h-3rem">
				<h3 className="text-md md:text-2xl my-auto">Complemento</h3>
				<Button
					loading={isLoading}
					label="Cadastrar"
					icon="pi pi-save"
					className={styleActionHeader(`green`, `600`, `800`) + `h-3rem ml-auto mr-2 my-auto `}

					severity={`success`}
					onClick={handleSubmit(handleComplemento)}
				/>
			</div>
		)
	}
	return (
		<Dialog
			header={headerModalTemplate()}
			visible={visible}
			onHide={() =>onClose()}
			style={{ width: `60vw` }}
			draggable={false}
			resizable={false}
			closeOnEscape={true}
			dismissableMask={true}
		>
			<div className="my-3 w-full mt-4">
				<form className="w-full flex flex-column gap-4">
					<span className="p-float-label w-full mt-2">
						<InputText
							className="w-10"
							{...register(`descricao`)}
						/>
						<label htmlFor="">Descrição</label>
					</span>
					{errors.descricao && <Errors message={errors.descricao.message}/>}
				</form>
			</div>

		</Dialog>
	)
}
