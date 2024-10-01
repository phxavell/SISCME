import {Controller} from 'react-hook-form'
import {Errors} from '@/components/Errors.tsx'
import {Input} from '@/components/Input.tsx'
import {ProductInputs} from '../schemas.ts'
import {InputFile} from '@/components/input-file/InputFile.tsx'
import {Button} from 'primereact/button'
import {ProgressSpinner} from 'primereact/progressspinner'
import {Dialog} from 'primereact/dialog'
import {Dropdown} from 'primereact/dropdown'
import {HiOutlinePlusSmall} from 'react-icons/hi2'
import {ModalTipoProduto} from '@pages/por-grupo/administrativo/cruds/produto/tipo-produto/ModalTipoProduto.tsx'
import {useTipoProduto} from '@pages/por-grupo/administrativo/cruds/produto/tipo-produto/useTipoProduto.ts'
import {useSubTipoProduto} from '@pages/por-grupo/administrativo/cruds/produto/sub-tipo-produto/useSubTipoProduto.ts'
import {useModalProduto} from './useModalProduto.ts'
import {
	ModalSubTipoProduto
} from '@pages/por-grupo/administrativo/cruds/produto/sub-tipo-produto/ModalSubTipoProduto.tsx'
import {ProductAPI} from '@infra/integrations/produto.ts'
import {useCallback, useEffect} from 'react'
import {getFileFromUrl} from "@pages/por-grupo/administrativo/cruds/veiculos/ModalNovoVeiculo"
import {defaultValuesProduto} from '../style.ts'
import { useProdutoFormOptions } from '../useProdutoForm.ts'
import { ModalProdutoProps } from './types.ts'
import { useAuth } from '@/provider/Auth/index.tsx'
import { styleHeaderModal, styleSizeDialog } from './styles.ts'

export function ModalProduto({onClose, visible, produto, setProduto}: ModalProdutoProps) {
	const {onFilterSubTiProduto, loadingOptionDropdown} = useSubTipoProduto()
	const {onFilterTiProduto, loadingOption} = useTipoProduto()
	const { user, toastSuccess, toastError } = useAuth()
	const {formOptions, formOptionsData} = useProdutoFormOptions()
	const {
		control,
		modalTipovisible,
		modalSubTipovisible,
		errors,
		handleSubmit,
		register, watch, setValue, getValues, trigger,
		handleClearFileVehicle,
		reset,
		handleErrorReturnApi,
		handleModalTipoProduto,
		handleModalSubTipoProduto
	} = useModalProduto()
	useEffect(() => {
		if (produto) {
			if (produto.foto) {
				const name = produto.foto.split(`media/produtos/`)[1]
				getFileFromUrl(produto.foto, name).then((imgFile) => {
					setValue(`foto`, [
						{
							//@ts-ignore
							files: [imgFile]
						}
					])
				})
			}
			reset({
				...produto,
				descricao: produto.descricao ?? ``,
				embalagem: produto.embalagem ?? ``,
				idtipopacote: produto.idtipopacote.id ?? ``,
				idsubtipoproduto: produto.idsubtipoproduto.id ?? ``,
				foto: [],
				idproduto: produto.idproduto,
				situacao: produto.situacao,
				status: 1
			})
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [reset, produto])

	const handleProduto = useCallback((dataProps: ProductInputs) => {
		dataProps.idproduto = produto?.id
		if (produto) {
			ProductAPI.atualizar(user, dataProps).then(() => {
				toastSuccess(`Produto atualizado!`)

				reset(defaultValuesProduto)
				handleClearFileVehicle()
				setProduto(undefined)
				onClose(true)

			})
		} else {
			ProductAPI.onSave(user, dataProps).then(() => {
				toastSuccess(`Produto salvo!`)
				reset(defaultValuesProduto)
				handleClearFileVehicle()
			}).catch((error: any) => {
				if (error.data) {
					handleErrorReturnApi(error.data)
				} else {
					toastError(`Não foi possível salvar produto!!`)
				}

			})
		}
	},[produto, setProduto, handleClearFileVehicle, reset, toastSuccess, toastError, handleErrorReturnApi, onClose, user])

	const handleCloseModal = () => {

		handleClearFileVehicle()
		reset(defaultValuesProduto)
		setProduto(undefined)
		onClose(true)
	}
	const FilterMessage = (loading: boolean, message: string, handleChamarModal: () => void) => {
		if (loading) {
			return (<ProgressSpinner className='flex justify-content-center w-4rem h-2rem'/>)
		} else {
			return (
				<div className='flex justify-content-center'>
					<Button
						label={message}
						className='flex justify-content-end align-items-center h-2rem'
						onClick={handleChamarModal}
					/>
				</div>
			)
		}

	}
	const handleFecharEAtualizarModalTipoProduto = (data: any) => {
		 formOptionsData()
		setValue(`idtipopacote`, data?.id)
		handleModalTipoProduto()
	}
	const handleFecharEAtualizarModalSubTipoProduto = async (data: any) => {
		formOptionsData()
		setValue(`idsubtipoproduto`, data?.id)
		handleModalSubTipoProduto()
	}

	const headerModal = useCallback(() => {
		return (
			<div className={styleHeaderModal}>
				<h3 className='m-0'>Cadastro de Produto</h3>
				<Button
					label={produto ? `Atualizar` : `Cadastrar`}
					className='w-8rem mr-3'
					severity={`success`}

					icon={`pi pi-save`}
					type='submit'
					onClick={() => {
						trigger([
							`descricao`,
							`idproduto`,
							`idsubtipoproduto`,
							`embalagem`,
							`status`,
							`situacao`
						]).then(r => {
							if (r) {
								handleProduto(getValues())
							}
						})
					}}
				/>
			</div>

		)
	}, [getValues, handleProduto, produto, trigger])

	return (
		<>
			<Dialog
				header={headerModal}
				visible={visible}
				position='top'
				modal={true}
				dismissableMask={true}
				closeOnEscape={true}
				focusOnShow={false}
				blockScroll={false}
				resizable={false}
				draggable={false}
				style={styleSizeDialog}
				onHide={handleCloseModal}
			>
				<form
					className="flex flex-row gap-2"
					onSubmit={handleSubmit(handleProduto)}
				>
					<div className="grid p-fluid w-full mt-3">
						<div className="col-9">
							<div className='col-12'>
								<Controller
									control={control}
									name='descricao'
									render={({field}) => {
										return (
											<div className="text-left">
												<Input
													placeholder="Nome"
													id={field.name}
													value={field.value}
													onChange={(e) => field.onChange(e.target.value)}
												/>
												{errors.descricao && <Errors message={errors.descricao.message}/>}
											</div>
										)
									}}
								/>
							</div>
							<div className="col-12">
								<Controller
									control={control}
									name='embalagem'
									render={({field}) => {

										return (
											<Dropdown
												className='w-full text-left'
												placeholder='Barreira Estéril'
												id={field.name}
												options={formOptions?.embalagens}
												value={field.value}
												onChange={(e) => field.onChange(e.value)}
												optionLabel="valor"
												optionValue="valor"
											/>
										)
									}}
								/>
								{errors.embalagem && <Errors message={errors.embalagem.message}/>}
							</div>
							<div className="col-12">
								<div className="flex flex-row gap-2">
									<Controller
										control={control}
										name='idtipopacote'
										render={({ field }) => {
											return (
												<Dropdown
													className='w-full text-left'
													placeholder='Tipo'
													id={field.name}
													options={formOptions?.tipos}
													value={field.value}
													onChange={(e) => field.onChange(e.value)}
													optionLabel="descricao"
													optionValue="id"
													filter
													resetFilterOnHide
													emptyFilterMessage={FilterMessage(loadingOption, `Adicionar novo Tipo Produto?`, handleModalTipoProduto)}
													onFilter={onFilterTiProduto}
												/>
											)
										}}
									/>

									<div className="flex align-items-center">
										<Button
											type="button"
											className="bg-green-500"
											onClick={handleModalTipoProduto}
										>
											<HiOutlinePlusSmall size={24} className="bg-green-500"/>
										</Button>
										<ModalTipoProduto
											modalTipoVisible={modalTipovisible}
											onClose={() => {
												handleModalTipoProduto()
												setValue(`idtipopacote`, 0)
											}}
											onRetornoData={handleFecharEAtualizarModalTipoProduto}
											titulo="Cadastrar Tipo Produto"
										/>
									</div>
								</div>
								{errors.idtipopacote && <Errors message={errors.idtipopacote.message}/>}
							</div>
							<div className="col-12">
								<div className="flex flex-row gap-2 justify-content-center align-content-center">
									<Controller
										control={control}
										name='idsubtipoproduto'
										render={({field}) => {
											return (
												<Dropdown
													className='w-full text-left'
													placeholder='Subtipo'
													id={field.name}
													options={formOptions?.subtipos}
													value={field.value}
													onChange={(e) => field.onChange(e.value)}
													optionLabel="descricao"
													optionValue="id"
													filter
													resetFilterOnHide
													emptyFilterMessage={FilterMessage(loadingOptionDropdown, `Adicionar novo Sub Tipo?`, handleModalSubTipoProduto)}
													onFilter={onFilterSubTiProduto}
												/>
											)
										}}
									/>
									<div className="flex align-items-center">
										<Button
											type="button"
											className="bg-green-500"
											onClick={() => {
												handleModalSubTipoProduto()
												setValue(`idsubtipoproduto`, 0)
											}}
										>
											<HiOutlinePlusSmall size={24} className="bg-green-500"/>
										</Button>
										<ModalSubTipoProduto
											modalTipoVisible={modalSubTipovisible}
											titulo="Cadastrar Sub Tipo Produto"
											onClose={handleModalSubTipoProduto}
											onRetornoData={handleFecharEAtualizarModalSubTipoProduto}
										/>
									</div>
								</div>
								{errors.idsubtipoproduto && <Errors message={errors.idsubtipoproduto.message}/>}
							</div>
						</div>
						<div className="col-3">
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
