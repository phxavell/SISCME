import {Dialog} from 'primereact/dialog'
import {Controller} from 'react-hook-form'
import {Button} from 'primereact/button'
import {styleForm} from '@/pages/general/Login/style'
import {Errors} from '@/components/Errors'
import {useCallback} from 'react'
import { useModalAssociar } from './useModalAssociar'
import { InputNumber } from 'primereact/inputnumber'
import { ModalLote } from '../ModalLote'
import { DropdownSearch } from '@/components/DropdownSeach/DropdownSearch'
import { ToggleButton } from 'primereact/togglebutton'
import { InputText } from 'primereact/inputtext'
import { styleHeaderModal } from '../../../produto/modal-produto/styles'

export function ModalAssociar(props: any) {
	const {
		visible,
		onClose,
		indicador,
		lote,
	} = props
	const {
		control,
		handleSubmit,
		errors,
		reset,
		handleGerarMovimentacao,
		visibleModalLote, setVisibleModalLote,
		itensParaSelecao,
		loadingOption,
		onFilterItens,
		buscarLotes,
		register,
		checked, setChecked
	} = useModalAssociar(onClose, indicador, lote)

	const headerModal = useCallback(() => {
		if(lote) {
			return (
				<div className={styleHeaderModal}>
					<h4 className='m-0'>Adicionar/Remover unidades de {indicador?.descricao} no lote {lote?.codigo}</h4>
					<div className="flex justify-content-center">
						<Button
							data-testid="botao-associar-lote"
							label='Confirmar'
							className='mr-3'
							severity={`success`}
							icon={`pi pi-save`}
							type='submit'
							onClick={handleSubmit(handleGerarMovimentacao)}
						/>
					</div>
				</div>
			)
		} else {
			return (
				<div className={styleHeaderModal}>
					<h3 className='m-0'>{indicador?.descricao}</h3>
					<div className="flex justify-content-center">
						<Button
							data-testid="botao-associar-lote"
							label='Adicionar'
							className='mr-3'
							severity={`success`}
							icon={`pi pi-save`}
							type='submit'
							onClick={handleSubmit(handleGerarMovimentacao)}
						/>
					</div>
				</div>

			)

		}
	}, [handleSubmit, handleGerarMovimentacao, indicador, lote])

	const handleAdd = useCallback((keyItem: string) => {
		if (`lote` === keyItem) {
			setVisibleModalLote(true)
		}
	}, [setVisibleModalLote])

	const exibirDropdownLotes = useCallback(() => {
		if(lote) {
			return (
				<div className='w-8'>
					<ToggleButton
						onLabel="Entrada"
						offLabel="Saída"
						onIcon="pi pi-check"
						offIcon="pi pi-times"
						checked={checked}
						onChange={(e) => setChecked(e.value)}
						className={`w-full shadow-none ${checked ? `hover:bg-blue-600` : `hover:bg-gray-400`}`}
					/>

					<InputText
						className='hidden'
						value={lote?.id}
						{...register(`lote`)}
					/>

				</div>
			)
		} else {
			return (<div className="text-left w-full">
				<DropdownSearch
					label="Lote"
					keyItem="lote"
					control={control}
					errors={errors}
					filter
					showAdd={true}
					loadingOptions={loadingOption}
					listOptions={itensParaSelecao}
					optionsObject={{optionValue: `id`, optionLabel: `codigo`}}
					onFilter={onFilterItens}
					handleClickAdd={handleAdd}
				/>
			</div>)
		}
	}, [lote, control, errors, loadingOption, itensParaSelecao, onFilterItens, handleAdd, checked, setChecked, register])

	return (
		<>
			<Dialog
				header={headerModal}
				visible={visible}
				data-testid="modal-associar-lote"
				style={{
					width: `50vw`
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
					onSubmit={handleSubmit(handleGerarMovimentacao)}
				>
					<div className='flex gap-2'>
						{exibirDropdownLotes()}
						<div className="text-left w-full">
							<Controller
								control={control}
								name='quantidade'
								render={({field}) => {
									return (
										<span className="p-float-label">
											<InputNumber
												value={field.value}
												className='w-full h-3rem'
												onChange={(e) => field.onChange(e.value)}
											/>
											<label>Quantidade</label>
										</span>
									)
								}}
							/>
							{errors.quantidade && <Errors message={errors?.quantidade?.message}/>}
						</div>

					</div>
				</form>
			</Dialog>

			<ModalLote
				visible={visibleModalLote}
				onClose={() => setVisibleModalLote(false)}
				indicador={indicador}
				buscarLotes={buscarLotes}
			/>
		</>
	)
}
