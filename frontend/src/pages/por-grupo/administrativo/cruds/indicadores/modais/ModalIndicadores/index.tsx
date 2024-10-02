import {Dialog} from 'primereact/dialog'
import {Controller} from 'react-hook-form'
import {Button} from 'primereact/button'
import {Input} from '@/components/Input'
import {styleForm} from '@/pages/general/Login/style'
import {divSectionForm} from '@/util/styles'
import {Errors} from '@/components/Errors'
import {InputText} from "primereact/inputtext"
import {useCallback, useMemo} from 'react'
import {
	styleBlocoFormBorderR,
	styleResponsiveForm
} from "@pages/por-grupo/administrativo/cruds/equipamento/ModalEquipamentos/style.ts"
import { useModalIndicadores } from './useModalIndicadores'
import { InputFile } from '@/components/input-file/InputFile'
import { Dropdown } from 'primereact/dropdown'
import { styleHeaderModal } from '../../../produto/modal-produto/styles'
import { MiniModal } from '@/components/MiniModal'

export function ModalIndicadores(props: any) {
	const {
		visible,
		onClose,
		indicador,
		listarIndicadores
	} = props
	const {
		control,
		handleSubmit,
		errors,
		reset,
		register,
		watch,
		handleClearFile,
		handleIndicador,
		dropdownTipoOptions,
		miniModalVisible, setMiniModalVisible,
		confirmarFecharModal
	} = useModalIndicadores(listarIndicadores, onClose, indicador)

	const labelBotaoSubmit = useMemo(() => {
		if (indicador) {
			return {
				label: `Atualizar`,
				titulo: `Editar Indicador`
			}
		}else {
			return {
				label: `Cadastrar`,
				titulo: `Cadastrar Indicador`
			}
		}
	}, [indicador])

	const headerModal = useCallback(() => {
		return (
			<div className={styleHeaderModal}>
				<h3 className='m-0'>{labelBotaoSubmit.titulo}</h3>
				<div className="flex justify-content-center">
					<Button
						data-testid="botao-cadastrar-indicador"
						label={labelBotaoSubmit.label}
						className='mr-3'
						severity={`success`}
						icon={`pi pi-save`}
						type='submit'
						onClick={handleSubmit(handleIndicador)}
					/>
				</div>
			</div>
		)
	}, [handleSubmit, labelBotaoSubmit, handleIndicador])

	const handlerMiniModal = () => {
		onClose()
		handleClearFile()
		reset({
			codigo: ``,
			descricao: ``,
			foto: [],
			tipo: ``,
			fabricante: ``
		})
	}


	return (
		<>
			<MiniModal
				miniModalVisible={miniModalVisible}
				setMiniModalVisible={setMiniModalVisible}
				reset={handlerMiniModal}
				onClose={() => onClose(false)}
			/>
			<Dialog
				header={headerModal}
				visible={visible}
				data-testid="modal-indicador"
				style={{
					width: `50vw`
				}}
				onHide={() => {
					confirmarFecharModal()
				}}
				blockScroll={false}
				draggable={false}
				closeOnEscape={true}
				dismissableMask={true}
				resizable={false}
			>
				<form
					className={styleForm}
					onSubmit={handleSubmit(handleIndicador)}>
					<div className={styleResponsiveForm}>
						<div className={styleBlocoFormBorderR}>
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
									control={control}
									name='descricao'
									render={({field}) => {
										return (
											<Input
												placeholder="Descrição"
												id={field.name}
												value={field.value}
												onChange={(e) => field.onChange(e.target.value)}
											/>
										)
									}}
								/>
								{errors.descricao && <Errors message={errors.descricao.message}/>}

							</div>

							<div className="text-left">
								<Controller
									control={control}
									name='tipo'
									render={({field}) => {
										return (
											<span className="p-float-label">
												<Dropdown
													emptyMessage='Nenhum resultado encontrado.'
													className='text-left h-3rem w-full'
													options={dropdownTipoOptions}
													id={field.name}
													value={field.value}
													optionValue='tipo'
													optionLabel='descricao'
													onChange={(e) => field.onChange(e.value)}
												/>
												<label className="text-blue-600">Tipo</label>
											</span>
										)
									}}
								/>
								{errors.tipo && <Errors message={errors.tipo.message}/>}
							</div>
							<div className="text-left">
								<Controller
									name="fabricante"
									control={control}
									render={({field}) => (
										<div className="text-left">
											<Input
												placeholder="Fabricante"
												id={field.name}
												value={field.value}
												onChange={(e) => field.onChange(e.target.value)}
											/>
										</div>
									)}
								/>
							</div>

						</div>
						<div className={divSectionForm}>
							<InputFile
								id="foto"
								type="image/*"
								name='foto'
								register={register}
								control={control}
								watch={watch}
							/>
						</div>
					</div>
				</form>

			</Dialog>
		</>
	)
}
