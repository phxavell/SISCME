import {Dialog} from 'primereact/dialog'
import {Controller} from 'react-hook-form'
import {Button} from 'primereact/button'
import {styleForm} from '@/pages/general/Login/style'
import {divSectionForm} from '@/util/styles'
import {Errors} from '@/components/Errors'
import {InputText} from "primereact/inputtext"
import {useCallback} from 'react'
import {
	styleResponsiveForm
} from "@pages/por-grupo/administrativo/cruds/equipamento/ModalEquipamentos/style.ts"
import { useModalLote } from './useModalLote'
import { Calendar } from 'primereact/calendar'
import moment from 'moment'
import { styleHeaderModal } from '../../../produto/modal-produto/styles'

export function ModalLote(props: any) {
	const {
		visible,
		onClose,
		indicador,
		buscarLotes,
		lote
	} = props
	const {
		control,
		handleSubmit,
		errors,
		handleLote,
		reset,
	} = useModalLote(indicador, buscarLotes, onClose, lote)

	const headerModal = useCallback(() => {
		return (
			<div className={styleHeaderModal}>
				<h3 className='m-0'>{lote ? `Atualizar` : `Novo`} Lote</h3>
				<div className="flex justify-content-center">
					<Button
						data-testid="botao-cadastrar-indicador"
						label={lote ? `Atualizar` : `Cadastrar`}
						className='mr-3'
						severity={`success`}
						icon={`pi pi-save`}
						type='submit'
						onClick={handleSubmit(handleLote)}
					/>
				</div>

			</div>

		)
	}, [handleSubmit, handleLote, lote])

	return (
		<Dialog
			header={headerModal}
			visible={visible}
			data-testid="modal-indicador"
			style={{
				width: `60vw`
			}}
			onHide={() => {
				onClose()
				reset()
			}}
			blockScroll={false}
			draggable={false}
			closeOnEscape={true}
			dismissableMask={true}
			resizable={false}
		>
			<form
				className={styleForm}
				onSubmit={handleSubmit(handleLote)}
			>
				<div className={styleResponsiveForm}>
					<div className={divSectionForm}>
						<div className="text-left">
							<Controller
								control={control}
								name='codigo'
								render={({field}) => {
									return (
										<span className="p-float-label">
											<InputText
												maxLength={15}
												id={field.name}
												value={field.value}
												className='w-full'
												onChange={(e) => field.onChange(e.target.value.toUpperCase())}
											/>
											<label>Código</label>
										</span>
									)
								}}
							/>
							{errors.codigo && <Errors message={errors.codigo.message}/>}

						</div>
						<div className="text-left">
							<Controller
								name="fabricacao"
								control={control}
								render={({field}) => (
									<div className="text-left">
										<span className="p-float-label">
											<Calendar
												showOnFocus={false}
												showIcon
												className="w-full"
												id={field.name}
												value={field.value ? moment(field.value).toDate() : null}
												onChange={(e) => field.onChange(e.target.value)}
												maxDate={new Date()}
												dateFormat="dd/mm/yy"
												mask="99/99/9999"
											/>
											<label
												htmlFor=""
												className="text-blue-600">Fabricação
											</label>
										</span>
										{errors.fabricacao && <Errors message={errors.fabricacao.message}/>}

									</div>
								)}
							/>
						</div>
						<div className="text-left">
							<Controller
								name="vencimento"
								control={control}
								render={({field}) => (
									<div className="text-left">
										<span className="p-float-label">
											<Calendar
												showOnFocus={false}
												showIcon
												className="w-full"
												id={field.name}
												value={field.value ? moment(field.value).toDate() : null}
												onChange={(e) => field.onChange(e.target.value)}
												dateFormat="dd/mm/yy"
												mask="99/99/9999"
											/>
											<label
												htmlFor=""
												className="text-blue-600">Vencimento
											</label>
										</span>
										{errors.vencimento && <Errors message={errors.vencimento.message}/>}
									</div>
								)}
							/>
						</div>
					</div>
				</div>
			</form>

		</Dialog>
	)
}
