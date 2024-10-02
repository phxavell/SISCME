import { Errors } from "@/components/Errors.tsx"
import { Input } from "@/components/Input.tsx"
import { Button } from "primereact/button"
import { Dialog } from "primereact/dialog"
import { useModalEdicaoSetor } from "./useModalEdicaoSetor.ts"
import { buttonCheck } from "@/util/styles/buttonAction.ts"

export function ModalEdicaoSetor(){
	const { register,
		handleSubmit,
		handleEditarSetor,
		errors,
		reset,
		closeModalEditar, visibleModalEditar
	} = useModalEdicaoSetor()

	return (
		<Dialog
			header='Editar Setor'
			visible={visibleModalEditar}
			data-testid="edicao-setor"
			style={{ width: `50vw` }}
			draggable={false}
			resizable={false}
			onHide={() => {
				closeModalEditar()
				reset()
			}}
		>

			<form
				onSubmit={handleSubmit(handleEditarSetor)}
				className="w-full mt-4">
				<div className="w-full flex flex-row gap-2">
					<div className="w-full">
						<div className="mb-4">
							<Input
								autoFocus
								type="text"
								placeholder='Descrição:'
								{...register(`descricao`)}
							/>
							{errors.descricao && <Errors message={errors.descricao.message} />}
						</div>
					</div>
					<Button
						icon={buttonCheck.icon}
						className={buttonCheck.color}
						rounded
						aria-label="Filter"
						type="submit"
					/>
				</div>
			</form>

		</Dialog>
	)
}
