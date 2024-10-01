import { useCallback, useEffect, useMemo, useState } from 'react'
import { vehicleFormSchema, VehicleFormSchemaType } from '../schemas.ts'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { divSectionForm } from '@/util/styles'
import { VeiculoAPI } from '@infra/integrations/vehicles.ts'
import { useAuth } from '@/provider/Auth'
import { Errors } from '@/components/Errors.tsx'
import { Input } from '@/components/Input.tsx'
import { InputFile } from '@/components/input-file/InputFile.tsx'
import { MiniModal } from '@/components/MiniModal'
import { styleHeaderModal } from '../../produto/modal-produto/styles.ts'

interface ModalVeiculosProps {
    veiculoEditando: any
    visible: boolean
    onClose: (prop: boolean) => void
}
type TGetFile = (url: string, name: string, defaultType?: string) => Promise<File>
// eslint-disable-next-line react-refresh/only-export-components
export const getFileFromUrl: TGetFile = async (url, name, defaultType) => {
	const response = await fetch(url)
	const data = await response.blob()
	return new File([data], name, {
		type: data.type || defaultType || `image/jpeg`,
	})
}
export const ModalNovoVeiculo: React.FC<ModalVeiculosProps> = (props) => {
	const { veiculoEditando, visible, onClose } = props
	const [miniModalVisible, setMiniModalVisible] = useState<boolean>(false)
	const { user , toastSuccess, toastError} = useAuth()
	const {
		control,
		register,
		handleSubmit,
		reset,
		setError,
		watch,
		trigger,
		setValue,
		getValues,
		formState: { errors, isDirty }
	} = useForm<VehicleFormSchemaType>(
		{
			mode: `all`,
			resolver: zodResolver(vehicleFormSchema),
		}
	)


	const { fields, update } = useFieldArray({
		control,
		// @ts-ignore
		name: `foto`
	})
	const watchFieldArray = watch(`foto`)
	const controlledFields = fields?.map((field, index) => {
		if (watchFieldArray && watchFieldArray[index]) {
			return {
				...field,
				...watchFieldArray[index]
			}
		} else {
			return {
				...field,

			}
		}

	})

	useEffect(() => {
		const validando = async () => {
			if (veiculoEditando) {
				if (veiculoEditando.foto) {

					const name = veiculoEditando.foto.split(`media/veiculos/`)[1]
					getFileFromUrl(veiculoEditando.foto, name).then((imgFile) => {

						setValue(`foto`, [
                            {
                            	files: [imgFile]
                            } as unknown as FileList
						])
					})
				}

				reset({
					id: veiculoEditando?.id ?? 0,
					descricao: veiculoEditando?.descricao,
					placa: veiculoEditando?.placa,
					marca: veiculoEditando?.marca,
					modelo: veiculoEditando?.modelo,
					foto: []
					// foto: [
					//     {
					//         // @ts-ignore
					//         ...fileBaixado
					//     }
					// ]
				})
			} else {
				reset()
			}
		}
		validando()
		return () => { }
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [veiculoEditando])

	const handleErrorReturnApi = (data: any) => {

		if (data.error && typeof data.error.data === `object`) {
            type nameItem = `marca` | `modelo` | `placa` | `descricao` | `foto`
            // @ts-ignore
            Object.keys(data.error.data).map((key: nameItem) => {
            	if (key === `marca` || key === `modelo` || key == `descricao` || key == `foto` || key == `placa`) {
            		setError(key, {
            			type: `manual`,
            			message: data.error.data[key][0],
            		})
            	}
            })
		} else {
			toastError(data.error.message)

		}
	}

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const handleFormVeiculo = (dataProps: VehicleFormSchemaType) => {
		const data = {
			id: dataProps.id,
			descricao: dataProps.descricao,
			placa: dataProps.placa,
			marca: dataProps.marca,
			modelo: dataProps.modelo,
			//@ts-ignore
			foto: dataProps.foto[0]?.files
		}
		if (veiculoEditando) {
			dataProps.id = veiculoEditando.id
			VeiculoAPI.editar(user, data).then(() => {
				toastSuccess(`Veículo salvo`)
				handleClearFileVehicle()
				reset(
					{
						modelo: ``,
						foto: [],
						placa: ``,
						marca: ``,
						descricao: ``,
						id: 0
					}
				)
				onClose(true)
			}).catch((error) => {
				if (error.data) {
					handleErrorReturnApi(error.data)
				} else {
					toastError(`Não foi possível editar veículo!!`)

				}
			})
		} else {
			VeiculoAPI.save(user, data).then(() => {
				toastSuccess(`Veículo salvo`)
				reset(
					{
						modelo: ``,
						foto: [],
						placa: ``,
						marca: ``,
						descricao: ``,
						id: 0
					}
				)
				handleClearFileVehicle()
				onClose(true)

			}).catch((error) => {
				// console.log('tentou sakvar',data)
				// console.log('error ao salvar',error)
				if (error.data) {
					handleErrorReturnApi(error.data)
				} else {
					toastError(`Não foi possível editar veículo!!`)
				}
			})

		}
	}

	const showErrorMarca = useMemo(() => {
		return errors.marca && <Errors message={errors.marca.message} />
	}, [errors.marca])

	const showErrorModelo = useMemo(() => {
		return errors.modelo && <Errors message={errors.modelo.message} />
	}, [errors.modelo])

	const showErrorPlaca = useMemo(() => {
		return errors.placa && <Errors message={errors.placa?.message} />
	}, [errors.placa])

	const showErrorUpload = useMemo(() => {
		//@ts-ignore
		if (errors?.foto?.message === `input not instance of filelist`) {
			return ``
		}
		return errors.foto && <Errors message={errors?.foto?.message ?? ``} />
	}, [errors.foto])

	const showErrorDescricao = useMemo(() => {
		return errors.descricao && <Errors message={errors.descricao?.message} />
	}, [errors.descricao])

	const handleClearFileVehicle = useCallback(() => {

		update(0,
			{
				...controlledFields[0],
				files: []
			})

	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [controlledFields])

	const fecharModal = useCallback(() => {
		reset(
			{
				modelo: ``,
				foto: [],
				placa: ``,
				marca: ``,
				descricao: ``,
				id: 0
			}
		)
		handleClearFileVehicle()
		onClose(false)
	}, [reset, handleClearFileVehicle, onClose])

	const confirmarFecharModal = () => {
		if (isDirty) {
			setMiniModalVisible(true)
		} else {
			fecharModal()
		}
	}


	const headerModal = useCallback(() => {
		return (
			<div className={styleHeaderModal}>
				<h3 className='m-0'>{veiculoEditando ? `Edição` : `Cadastro`} de Veículo</h3>
				<Button
					label={veiculoEditando ? `Atualizar` : `Cadastrar`}
					className='w-8rem mr-3'
					severity={`success`}

					icon={`pi pi-save`}
					type='submit'
					onClick={() => {
						trigger([
							`marca`,
							`descricao`,
							`modelo`,
							`placa`
						]).then(r => {
							//console.log(r, getValues())
							if (r) {
								handleFormVeiculo(getValues())
							}
						})
					}}
				/>
			</div>

		)
	}, [getValues, handleFormVeiculo, trigger, veiculoEditando])


	return (<div>
		<MiniModal
			miniModalVisible={miniModalVisible}
			setMiniModalVisible={setMiniModalVisible}
			reset={reset}
			onClose={() => {
				fecharModal()
			}}
		/>
		<Dialog
			draggable={false}
			resizable={false}
			blockScroll={false}
			focusOnShow={false}
			dismissableMask
			position={`top`}
			header={headerModal}
			visible={visible}
			className='w-5'
			onHide={() => confirmarFecharModal()}
		>

			<form onSubmit={handleSubmit(handleFormVeiculo)}>
				<div>
					<div className="flex justify-content-center gap-5 my-4">
						<div className={divSectionForm}>
							<Controller
								name="marca"
								control={control}
								render={({ field }) => (
									<div className="text-left">
										<Input
											{...register(`marca`)}
											type="text"
											placeholder="Marca do veículo"
											autoFocus
											id={field.name}
											value={field.value}
											onChange={(e) => field.onChange(e.target.value)}
										/>
										{showErrorMarca}
									</div>
								)}
							/>

							<Controller
								name="modelo"
								control={control}
								render={({ field }) => (
									<div className="text-left">
										<Input
											{...register(`modelo`)}
											type="text"
											placeholder="Modelo do veículo"
											id={field.name}
											value={field.value}
											onChange={(e) => field.onChange(e.target.value)}
										/>
										{showErrorModelo}
									</div>
								)}
							/>

							<Controller
								name="placa"
								control={control}
								render={({ field }) => (
									<div className="text-left">
										<Input
											{...register(`placa`)}
											type="text"
											placeholder="Placa do veículo"
											id={field.name}
											value={field.value}
											onChange={(e) => field.onChange(e.target.value)}
										/>
										{showErrorPlaca}
									</div>
								)}
							/>

							<Controller
								name="descricao"
								control={control}
								render={({ field }) => (
									<div className="text-left">
										<Input
											{...register(`descricao`)}
											type="text"
											placeholder="Descrição"
											id={field.name}
											value={field.value}
											onChange={(e) => field.onChange(e.target.value)}
										/>
										{showErrorDescricao}
									</div>
								)} />
						</div>

						<div className='p-5 w-full'>
							<InputFile
								watch={watch}
								control={control}
								register={register}
								id={`foto`}
								type="image/*"
								name='foto'
							/>
							{showErrorUpload}
						</div>

					</div>
				</div>
			</form>
		</Dialog>
	</div>)
}
