import { Button } from 'primereact/button'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Dialog } from 'primereact/dialog'
import { Dropdown, DropdownFilterEvent } from 'primereact/dropdown'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { PendingAPI } from '@/infra/integrations/pending.ts'
import { useAuth } from '@/provider/Auth'
import { pendingFormSchema, PendingFormType } from '@pages/por-grupo/tecnico-cme/demandas/componentes/ModalPendingInProgress/schemas.ts'
import { Toast } from 'primereact/toast'
import moment from 'moment'
import 'moment/locale/pt-br'
import { Solicitacoes } from '@/infra/integrations/tecnico-demandas.ts'
import { ResultVehicle } from '@/infra/integrations/vehicles.ts'
import { DropdownSearch } from '@/components/DropdownSeach/DropdownSearch'
import { IOptionToSelect } from '@/infra/integrations/caixa/types'
import { DriverAPI } from '@/infra/integrations/motorista'

interface ModalPendingInProgressProps {
    retorno: boolean
    visible: boolean
    onClose: (prop: boolean) => void
    selectedSE: Solicitacoes | undefined | null
    optionsVehicles: ResultVehicle[] | undefined
    optionsDrivers: any[] | undefined
}

export function ModalPendingInProgress(props: ModalPendingInProgressProps) {
	const {
		retorno,
		visible,
		onClose,
		selectedSE,
		optionsVehicles
	} = props

	const [itensParaSelecao, setItensParaSelecao] = useState<IOptionToSelect[]>([])
	const [loadingOption, setLoadingOption] = useState<boolean>(true)

	const toast = useRef<Toast>(null)
	const showToast = () => {
		toast.current?.show({
			severity: `success`,
			summary: `Sucesso!`,
			detail: `Transporte iniciado`
		})
	}
	const showToastAtualizar = () => {
		toast.current?.show({
			severity: `info`,
			summary: `Atualizado!`,
			detail: `Transporte/Motorista atualizado`
		})
	}
	const showToastError = (message: string) => {
		toast.current?.show({
			severity: `error`,
			summary: `Erro!`,
			detail: message
		})
	}

	const [salvando, setSalvando] = useState(false)

	const { user } = useAuth()

	const {
		control,
		handleSubmit,
		formState: {errors},
		reset
	} = useForm<PendingFormType>({
		resolver: zodResolver(pendingFormSchema),
	})

	useEffect(()=>{
		reset({
			veiculo: selectedSE?.coleta?.veiculo.id,
			motorista: selectedSE?.coleta?.motorista.id
		})
	}, [selectedSE, reset])

	const handlePending = (data: PendingFormType) => {
		if(selectedSE?.coleta?.veiculo.id === data.veiculo &&
            selectedSE?.coleta?.motorista.id ===  data.motorista
		) {
			toast.current?.show({
				severity: `info`,
				detail: `Opções sem alteração.`
			})
			return
		}

		if (
			!salvando &&
            selectedSE &&
            selectedSE?.situacao === `Atribuido ao Motorista` ||
            selectedSE?.situacao === `Em Transporte`
		) {

			if (!selectedSE?.coleta?.idcoleta) return

			const payload = {
				...data,
				retorno: retorno,
				solicitacao_esterilizacao: selectedSE?.id,
				idcoleta: selectedSE?.coleta?.idcoleta
			}

			setSalvando(true)
			PendingAPI.atualizar(user, payload).then(() => {
				reset()
				showToastAtualizar()
				setSalvando(false)
				onClose(true)
			}).catch(error => {
				setSalvando(false)
				console.log(error)
				showToastError(error.statusText)
			})
		} else {
			PendingAPI.save(user, {
				...data,
				retorno: retorno,
				solicitacao_esterilizacao: selectedSE?.id
			}).then(() => {
				setSalvando(false)
				reset()
				showToast()
				onClose(true)
			}).catch(error => {
				setSalvando(false)
				console.log(error)
				showToastError(error.statusText)
			})
		}
	}

	const dataFormated = (solicitacao: Solicitacoes | undefined | null) => {
		if (solicitacao) {
			const { data_criacao } = solicitacao
			const now = moment()
			const dataAlvo = moment(data_criacao)

			const diffHoras = now.diff(dataAlvo, `hours`)
			const diffMinutos = now.diff(dataAlvo, `minutes`)
			if (diffHoras > 1) {
				return `Há ${diffHoras} horas`

			} else if (diffHoras == 1) {
				return `Há ${diffHoras} hora`
			}
			else if (diffMinutos == 1) {
				return `Há ${diffMinutos} minuto`
			} else {
				return `Há ${diffMinutos} minutos`
			}
		} else {
			return `--/--/----`
		}
	}

	useEffect(() => {
		let mounted = true
		DriverAPI.buscarMotoristas(user, ``).then(r => {
			if (mounted) {
				if (r.length) {
					setItensParaSelecao(r)
				}
				setLoadingOption(false)
			}

		}).catch(() => {
			if (mounted) {
				setLoadingOption(false)
			}
		})
		return () => {
			mounted = false
		}
	}, [user])

	const headerMemo = useMemo(() => {

		return `SE ${selectedSE?.id}: Contém ${selectedSE?.quantidade} caixas, solicitada ${dataFormated(selectedSE)}`
	}, [selectedSE])

	const onFilterItens = useCallback((event: DropdownFilterEvent) => {
		if (event.filter) {
			setLoadingOption(true)
			DriverAPI.buscarMotoristas(user, event.filter).then(r => {
				if (r.length) {
					setItensParaSelecao(r)
				}
				setLoadingOption(false)
			}).catch(() => {
				setLoadingOption(false)
			})
		}
	}, [user])

	return (
		<>
			<Dialog
				header={headerMemo}
				visible={visible}
				style={{ width: `50vw` }}

				onHide={() => {
					onClose(false)
					reset()
				}}
				dismissableMask={true}
				closeOnEscape={true}
				resizable={false}
				draggable={false}
			>
				<form onSubmit={handleSubmit(handlePending)}>
					<div className="flex gap-3 mt-4">
						<DropdownSearch
							label="Motoristas"
							keyItem="motorista"
							control={control}
							errors={errors}
							filter
							showAdd={false}
							loadingOptions={loadingOption}
							listOptions={itensParaSelecao}
							optionsObject={{optionValue: `id`, optionLabel: `valor`}}
							onFilter={onFilterItens}
						/>

						<Controller
							control={control}
							name='veiculo'
							render={({ field }) => {
								return (
									<span className="p-float-label w-full">
										<Dropdown
											className='w-full'
											id={field.name}
											value={field.value}
											options={optionsVehicles}
											optionLabel="placa"
											optionValue="id"


											onChange={(e) => field.onChange(e.value)}
											filter
										/>
										<label htmlFor="">
                                            Veículos
										</label>
									</span>
								)
							}}
						/>
					</div>
					<div className="mt-6 w-full flex gap-3 justify-content-end">
						<Button
							label="Cancelar"
							type="reset"
							icon="pi pi-times"
							onClick={() => {
								onClose(false)
								reset()
							}}
							className="p-button-text text-white"
						/>
						<Button
							loading={salvando}
							label="Solicitar Coleta"
							type="submit"
							icon="pi pi-check"
							autoFocus
						/>
					</div>
				</form>
			</Dialog>
		</>
	)
}
