import { useAuth } from '@/provider/Auth'
import { useEffect, useState } from 'react'
import { EquipamentosFormSchemaType, newEquipamentosFormSchema } from '../schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import moment from 'moment'
import { EquipamentosAPI } from '@infra/integrations/administrativo/equipamentos.ts'
import { defaultValueEquipamento } from '@infra/integrations/__mocks__/administrativo/equipamentos-mock.ts'
import {
	ModalUsuarioEquipamentoProps
} from "@pages/por-grupo/administrativo/cruds/equipamento/ModalEquipamentos/types.ts"
import { defaultValuesEquipamentos } from './types'

export const useModalEquipamentos = (props: ModalUsuarioEquipamentoProps)=> {
	const { onClose, equipamento, setEquipamento, visible} = props
	const [miniModalVisible, setMiniModalVisible] = useState<boolean>(false)
	const [salvando, setSalvando]  = useState(false)
	const { user, toastError, toastSuccess } = useAuth()
	const {
		control,
		getValues,
		handleSubmit,
		setError,
		reset,
		formState: {errors},
		register,
	} = useForm<EquipamentosFormSchemaType>({
		resolver: zodResolver(newEquipamentosFormSchema),
		defaultValues: defaultValuesEquipamentos
	})
	const [opcoes, setOpcoes] = useState<any>([])

	useEffect(() => {
		if(visible){
			EquipamentosAPI.formOptions(user).then(data=> {
				setOpcoes(data)
			}).catch(e=> {
				toastError(e, false)
			})
		}
	}, [visible, user, toastError])

	useEffect(() => {
		if (equipamento) {
			const formatDF = moment(equipamento.data_fabricacao).format(`YYYY-MM-DD`)
			reset({
				...equipamento,
				tipo: equipamento?.tipo?.id ?? ``,
				numero_serie: equipamento?.numero_serie ?? ``,
				data_fabricacao: formatDF ?? ``,
				registro_anvisa: equipamento?.registro_anvisa.length? parseInt(equipamento.registro_anvisa,10) : 0,
				capacidade: parseInt(equipamento?.capacidade,10) ?? 0,
				fabricante: equipamento?.fabricante ?? ``,
				fornecedor: equipamento?.fornecedor ?? ``,
				ativo: equipamento?.ativo ?? ``,
			})
		}
	}, [reset, equipamento])

	const hasFilledFields = () => {
		const formValues = getValues()
		return Object.values(formValues).some((value) => !!value)
	}

	const confirmarFecharModal = () => {
		if (hasFilledFields()) {
			setMiniModalVisible(true)
		} else {
			onClose(false)
		}
	}

	function handleErrorReturnApi(data: any) {
		if (data.error && typeof data.error.data === `object`) {
            type nameItem = `numero_serie` | `descricao` | `registro_anvisa` | `data_fabricacao`
            // @ts-ignore
            Object.keys(data.error.data).map((key: nameItem) => {
            	if (key === `numero_serie` || key == `descricao` || key == `registro_anvisa` || key == `data_fabricacao`) {
            		setError(key, {
            			type: `manual`,
            			message: data.error.data[key][0],
            		})
            	}
            })
		} else {
			toastError(data.error.message, false)
		}
	}

	const handleEquipamentos = (data: EquipamentosFormSchemaType) => {
		setSalvando(true)
		if (equipamento) {
			data.data_fabricacao == `Data inválida` ? data.data_fabricacao = `` : data.data_fabricacao
			EquipamentosAPI.atualizar(user, data).then(() => {
				toastSuccess(`Equipamento atualizado!`)
				setEquipamento(undefined)
				setSalvando(false)
				reset(defaultValueEquipamento)
				onClose(true)
			}).catch((error) => {
				setSalvando(false)
				if (error.data) {
					handleErrorReturnApi(error.data)
				} else {
					toastError(`Não foi possível atualizar equipamento!!`, false)
				}
			})
		} else {
			EquipamentosAPI.save(user, data).then(() => {
				setEquipamento(undefined)
				setSalvando(false)
				reset(defaultValueEquipamento)
				onClose(true)
				toastSuccess(`Equipamento cadastrado!`)
			}).catch((error) => {
				setSalvando(false)
				if (error.data) {
					handleErrorReturnApi(error.data)
				} else {
					toastError(`Não foi possível salvar equipamento!!`, false)
				}
			})
		}
	}

	const handlerMiniModal = () => {
		reset(defaultValueEquipamento)
		setEquipamento(undefined)
	}
	return {
		miniModalVisible, setMiniModalVisible,
		salvando, setSalvando,
		user,
		control,
		getValues,
		handleSubmit,
		reset,errors,
		hasFilledFields,
		confirmarFecharModal,
		handleEquipamentos,
		opcoes,
		handlerMiniModal,
		register

	}
}
