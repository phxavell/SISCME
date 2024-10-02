import {Dialog} from 'primereact/dialog'
import {Controller} from 'react-hook-form'
import {Button} from 'primereact/button'
import {styleForm} from '@/pages/general/Login/style'
import {useModalManutencao} from './useModalManutencao'
import { Dropdown } from 'primereact/dropdown'
import { Errors } from '@/components/Errors'
import { Calendar } from 'primereact/calendar'
import { useCallback } from 'react'
import { InputText } from 'primereact/inputtext'
import { styleHeaderModal } from '../../produto/modal-produto/styles'

export const ModalManutencao = (props: any) => {
	const {
		visible,
		onClose,
		equipamento,
		setEquipamento
	} = props

	const {
		control,
		handleSubmit,
		reset,
		planejarManutencao,
		errors,
		iniciarManutencao,
		manutencoesPlanejadas,
		equipamentos,
		tipoManutencao, setTipoManutencao,
		inicioPlanejado, setInicioPlanejado
	} = useModalManutencao(equipamento?.idequipamento, onClose)

	const headerModal = useCallback(() => {
		const buttonSubmit = () => {
			if(equipamento) {
				return (
					<Button
						data-testid="botao-iniciar-manutencao"
						label='Iniciar Manutenção'
						className='mr-3'
						severity={`success`}
						onClick={handleSubmit(iniciarManutencao)}
						type='submit'
					/>
				)
			} else {
				return (
					<Button
						data-testid="botao-planejar-manutencao"
						label='Planejar Manutenção'
						className='mr-3'
						severity={`success`}
						onClick={handleSubmit(planejarManutencao)}
						type='submit'
					/>
				)
			}
		}
		return (
			<div className={styleHeaderModal}>
				<h3 className='m-0 text-lg'>Programar manutenção Preditiva ou Preventiva</h3>
				<div className="flex justify-content-center">
					{buttonSubmit()}
				</div>

			</div>

		)
	}, [equipamento, handleSubmit, iniciarManutencao, planejarManutencao])


	const optionsTipoManutencao = useCallback(() => {
		if(equipamento) {
			return [
				{
					sigla: `PR`,
					valor: `PREVENTIVA`
				},
				{
					sigla: `PD`,
					valor: `PREDITIVA`
				},
				{
					sigla: `CR`,
					valor: `CORRETIVA`
				}
			]
		} else {
			return [
				{
					sigla: `PR`,
					valor: `PREVENTIVA`
				},
				{
					sigla: `PD`,
					valor: `PREDITIVA`
				}
			]
		}
	}, [equipamento])

	const datasPrevistasAndDescricao = useCallback(() => {
		if(equipamento) {
			return (
				<Controller
					control={control}
					name='descricao'
					render={({field}) => {
						return (
							<div className='w-full'>
								<span className="p-float-label mt-4">
									<InputText
										className='w-full'
										value={field.value}
										onChange={(e) => field.onChange(e.target.value)}
									/>
									<label className="text-blue-600">Descrição</label>
								</span>
							</div>
						)
					}}
				/>
			)
		} else {
			return (
				<div className='flex gap-2 mt-4 w-full'>
					<Controller
						control={control}
						name='inicio_planejado'
						render={({field}) => {
							return (
								<div className="text-left w-full">
									<span className="p-float-label">
										<Calendar
											showOnFocus={false}
											showIcon
											showTime
											className="w-full"
											id={field.name}
											value={field.value}
											onChange={(e) => {field.onChange(e.target.value), setInicioPlanejado(e?.target?.value)}}
											minDate={new Date()}
											dateFormat="dd/mm/yy"
											mask="99/99/9999 99:99"
										/>
										<label
											htmlFor=""
											className="text-blue-600">Início
										</label>
									</span>
									{errors.inicio_planejado && <Errors message={errors.inicio_planejado.message}/>}
								</div>
							)
						}}
					/>
					<Controller
						control={control}
						name='fim_planejado'
						render={({field}) => {
							return (
								<div className="text-left w-full">
									<span className="p-float-label">
										<Calendar
											showOnFocus={false}
											showIcon
											showTime
											className="w-full"
											minDate={inicioPlanejado}
											disabled={inicioPlanejado ? false : true}
											id={field.name}
											value={field.value}
											onChange={(e) => field.onChange(e.target.value)}
											dateFormat="dd/mm/yy"
											mask="99/99/9999 99:99"
										/>
										<label
											htmlFor=""
											className="text-blue-600">Fim
										</label>
									</span>
									{errors.fim_planejado && <Errors message={errors.fim_planejado.message}/>}
								</div>
							)
						}}
					/>

				</div>)
		}
	}, [equipamento, control, errors, inicioPlanejado, setInicioPlanejado])

	const manutencoesProgramadasDropdown = useCallback(() => {
		if(equipamento && tipoManutencao === `PR` || equipamento && tipoManutencao === `PD`) {
			const exibirDropdownManutencao = () => {
				if(tipoManutencao === `PR`) {
					return manutencoesPlanejadas?.filter((data: any) => data?.tipo === `Preventiva`)
				}
				return manutencoesPlanejadas?.filter((data: any) => data?.tipo === `Preditiva`)
			}
			return (
				<Controller
					control={control}
					name='id'
					render={({field}) => {
						return (
							<div>
								<span className="p-float-label mt-4">
									<Dropdown
										className='text-left h-3rem w-full'
										options={exibirDropdownManutencao()}
										id={field.name}
										value={field.value}
										emptyMessage='Nenhuma manutenção planejada.'
										onChange={(e) => field.onChange(e.value)}
										data-testid='input-manutencoes-programadas'
										optionLabel='labelDropdown'
										optionValue='id'
									/>
									<label className="text-blue-600">Manutenções programadas</label>
								</span>
								{errors.id && <Errors message={errors.id.message}/>}
							</div>
						)
					}}
				/>
			)
		} else {
			return <></>
		}
	}, [control, errors, equipamento, tipoManutencao, manutencoesPlanejadas])

	const exibirEquipamentoDropdown = useCallback(() => {
		if(!equipamento) {
			return (
				<Controller
					control={control}
					name='equipamento'
					render={({field}) => {
						return (
							<div>
								<span className="p-float-label mt-4">
									<Dropdown
										className='text-left h-3rem w-full'
										options={equipamentos?.data}
										id={field.name}
										value={field.value == null ? `` : field.value}
										onChange={(e) => {field.onChange(e.value)}}
										data-testid='input-equipamentos'
										optionLabel='descricao'
										optionValue='idequipamento'
									/>
									<label className="text-blue-600">Equipamentos</label>
								</span>
								{errors.tipo && <Errors message={errors.tipo.message}/>}
							</div>
						)
					}}
				/>
			)
		} else {
			return <></>
		}
	}, [control, equipamento, errors, equipamentos ])

	return (
		<Dialog
			header={headerModal}
			visible={visible}
			data-testid="modal-manutencao"
			style={{width: `60vw`}}
			onHide={() => {
				onClose(),
				reset(),
				setEquipamento(undefined)
				setTipoManutencao(undefined)
			}}
			blockScroll={false}
			draggable={false}
			closeOnEscape={true}
			resizable={false}
		>
			<form
				className={styleForm}
			>
				<Controller
					control={control}
					name='tipo'
					render={({field}) => {
						return (
							<div>
								<span className="p-float-label mt-2">
									<Dropdown
										className='text-left h-3rem w-full'
										options={optionsTipoManutencao()}
										id={field.name}
										value={field.value}
										onChange={(e) => {field.onChange(e.value), setTipoManutencao(e.value)}}
										data-testid='input-tipo-manutencao'
										optionLabel='valor'
										optionValue='sigla'
									/>
									<label className="text-blue-600">Tipo de manutenção</label>
								</span>
								{errors.tipo && <Errors message={errors.tipo.message}/>}
							</div>
						)
					}}
				/>

				{exibirEquipamentoDropdown()}
				{datasPrevistasAndDescricao()}
				{manutencoesProgramadasDropdown()}
			</form>

		</Dialog>
	)
}
