import {EquipamentosAPI} from '@infra/integrations/administrativo/equipamentos.ts'
import {useAuth} from '@/provider/Auth'
import { useForm } from 'react-hook-form'
import { ManutencaoFormSchemaType, newManutencaoFormSchema } from './schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCallback, useEffect, useState } from 'react'
import { Equipamentos } from '@/infra/integrations/administrativo/types-equipamentos'
import moment from 'moment'

export const useModalManutencao = (idequipamento: any, onClose: any) => {
	const {
		control,
		handleSubmit,
		reset,
		setError,
		formState: {errors}
	} = useForm<ManutencaoFormSchemaType>({
		resolver: zodResolver(newManutencaoFormSchema),
	})

	const { user, toastSuccess, toastError } = useAuth()

	const [equipamentos, setEquipamentos] = useState<Equipamentos>()
	const [manutencoesPlanejadas, setManutencoesPlanejadas] = useState([])
	const [tipoManutencao, setTipoManutencao] = useState()
	const [inicioPlanejado, setInicioPlanejado] = useState<any>()

	const planejarManutencao = (data: any) => {
		EquipamentosAPI.planejarManutencoesPorEquipamento(user, data).then(() => {
			toastSuccess(`Manutenção programada.`)
			setTipoManutencao(undefined)
			onClose()
			reset()
		}).catch((e: any) => {
			toastError(e.message, false)
		})
	}

	const iniciarManutencao = (data: ManutencaoFormSchemaType) => {
		if(tipoManutencao !== `CR`) {
			const payload = {
				id: data.id,
				descricao: data.descricao ?? null
			}
			EquipamentosAPI.iniciarManutencoesPorEquipamentoPlanejado(user, payload).then(() => {
				toastSuccess(`Manutenção iniciada.`)
				setTipoManutencao(undefined)
				onClose()
				reset()
			}).catch((e: any) => {
				if(!data.id) {
					setError(`id`, {
            			type: `manual`,
            			message: `Selecione uma manutenção.`,
            		})
				} else {
					toastError(e.message, false)
				}
			})

		} else {
			const payload = {
				equipamento: data.equipamento ?? idequipamento,
				descricao: data.descricao ?? null
			}
			EquipamentosAPI.iniciarManutencoesPorEquipamento(user, payload).then(() => {
				toastSuccess(`Manutenção iniciada.`)
				setTipoManutencao(undefined)
				onClose()
				reset()
			}).catch((e: any) => {
				toastError(e.message, false)
			})

		}

	}

	const handleBuscarManutencoesPlanejadas = useCallback(() => {
		if(tipoManutencao !== `CR`) {
			try {
				EquipamentosAPI.listarManutencoesPlanejadasPorEquipamento(user, idequipamento).then(data => {
					const dados = data?.map((manutencao: any) => {
						const inicioPlanejadoFormatado = moment(manutencao?.inicio_planejado).format(`DD/MM/YY HH:mm`)
						const fimPlanejadoFormatado = moment(manutencao?.fim_planejado).format(`DD/MM/YY HH:mm`)
						return {
							...manutencao,
							labelDropdown: `${manutencao?.tipo} ${inicioPlanejadoFormatado} - ${fimPlanejadoFormatado}`
						}
					})
					setManutencoesPlanejadas(dados)
				})

			} catch (e: any) {
				toastError(e.message ? e.message : `Não foi possível carregar os dados`)
			}

		}
	}, [user, toastError, idequipamento, tipoManutencao])

	const handleBuscarEquipamentos = useCallback(() => {
		try {
			EquipamentosAPI.listar(user).then(data => {
				setEquipamentos(data)
			})

		} catch (e: any) {
			toastError(e.message ? e.message : `Não foi possível carregar os dados`)
		}
	}, [user, toastError])

	useEffect(() => {
		handleBuscarEquipamentos()
		if(idequipamento) {
			handleBuscarManutencoesPlanejadas()
		}
	}, [handleBuscarEquipamentos, handleBuscarManutencoesPlanejadas, idequipamento])

	return {
		control,
		errors,
		handleSubmit,
		reset,
		iniciarManutencao,
		planejarManutencao,
		equipamentos,
		manutencoesPlanejadas,
		inicioPlanejado, setInicioPlanejado,
		tipoManutencao, setTipoManutencao
	}
}
