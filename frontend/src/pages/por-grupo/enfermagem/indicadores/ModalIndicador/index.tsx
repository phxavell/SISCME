import { Errors } from "@/components/Errors"
import { Input } from "@/components/Input"
import { Button } from "primereact/button"
import { Dialog } from "primereact/dialog"
import { useModalIndicador } from "./useModalIndicador"
import { IndicadoresAPI } from "@/infra/integrations/enfermagem/indicadores"
import { useEffect } from "react"
import { Controller } from "react-hook-form"

export function ModalIndicador({ visible, onClose, indicador, setIndicador }: any) {
	const {
		errors,
		handleErrorReturnApi,
		handleSubmit,
		user,
		toastSuccess,
		reset,
		toastError,
		control
	} = useModalIndicador()

	useEffect(() => {

		if (indicador) {
			reset({
				...indicador,
				descricao: indicador.descricao ?? ``,
			})
		}
	}, [reset, indicador])

	function handleIndicador(data: any) {
		if (indicador) {
			IndicadoresAPI.atualizar(user, data, indicador.id).then(() => {
				onClose(true)
				toastSuccess(`Tipo de ocorrência atualizado!`)
				reset()
				setIndicador(undefined)

			}).catch((error: any) => {
				if (error.data) {
					handleErrorReturnApi(error.data)
				} else {
					toastError(`Não foi possível salvar produto!!`, false)
				}

			})
		} else {
			IndicadoresAPI.save(user, data).then(() => {
				toastSuccess(`Tipo de ocorrência salvo!`)
				reset()
				onClose(true)
			}).catch((error: any) => {
				if (error.data) {
					handleErrorReturnApi(error.data)
				} else {
					toastError(`Não foi possível salvar produto!!`, false)
				}

			})
		}
	}

	return (
		<Dialog
			header='Novo Tipo de Ocorrência'
			visible={visible}
			data-testid="modal-indicador"
			blockScroll={false}
			draggable={false}
			dismissableMask={true}
			style={{ width: `50vw` }}
			onHide={() => {
				reset({ descricao: `` })
				setIndicador(undefined)
				onClose(false)
			}}
		>
			<form className="w-full mt-4">
				<div className="w-full flex flex-row gap-2">
					<div className="w-full">
						<div className="mb-4">
							<Controller
								control={control}
								name='descricao'
								render={({ field }) => {
									return (
										<div className="text-left">
											<Input
												id={field.name}
												value={field.value}
												onChange={(e) => field.onChange(e.target.value)}
												placeholder='Descrição'
											/>
											{errors.descricao && <Errors message={errors.descricao.message} />}
										</div>
									)
								}}
							/>

						</div>
					</div>
					<Button
						icon="pi pi-check"
						rounded
						className="-mt-1"
						aria-label="Filter"
						onClick={handleSubmit(handleIndicador)}
					/>
				</div>
			</form>

		</Dialog>
	)
}
