import {ClientAPI} from '@/infra/integrations/client'
import {useAuth} from '@/provider/Auth'
import {useCallback, useEffect, useRef, useState} from 'react'
import {ClienteResponse, Situacoes, StatusCliente} from "@infra/integrations/types-client.ts"

export const useCliente = () => {
	const [loading, setLoading] = useState(true)
	const [clientes, setClientes] = useState<ClienteResponse>()
	const [options, setOptions] = useState<any>()
	const [first, setFirst] = useState(0)
	const [visible, setVisible] = useState(false)
	const [searchClientes, setSearchClientes] = useState(``)
	const [statusClientes, setStatusClientes] = useState(StatusCliente.Ambos)
	const handleBuscarOptionsRef = useRef(false)
	const [hasError, setHasError] = useState(false)

	const [visibleModalDetalhes, setVisibleModalDetalhes] = useState(false)

	const { user, toastSuccess, toastError, toastAlert } = useAuth()

	const onChangeBuscaClientes = (termo: any) => {
		setSearchClientes(termo)
	}

	const handleBuscarOptions = useCallback(async () => {
		try {
			const data = await ClientAPI.optionsCliente(user)
			setOptions(data)
		} catch (e: any) {
			toastError(e, false)
		}
	}, [user, toastError])

	const handleBuscarClientes = useCallback(async () => {
		if (searchClientes !== `` || statusClientes !== StatusCliente.Ambos) {
			try {
				const data = await ClientAPI.buscarCliente(user, searchClientes, statusClientes)
				setClientes(data)
				setLoading(false)
			} catch (e: any) {
				setLoading(false)
				setHasError(true)
				toastError(e, false)

			}
		} else {
			try {
				const data = await ClientAPI.listar(user, first + 1, StatusCliente.Ambos)
				setClientes(data)
				setLoading(false)
			} catch (e: any) {
				setLoading(false)
				setHasError(true)
				toastError(e, false)

			}
		}
	}, [searchClientes, statusClientes, user, toastError, first])

	useEffect(() => {
		handleBuscarClientes()
		if (!handleBuscarOptionsRef.current) {
			handleBuscarOptions()
			handleBuscarOptionsRef.current = true
		}
	}, [handleBuscarClientes, handleBuscarOptions])

	const refreshTable = async (success: boolean) => {
		setVisible(false)
		if (success) {
			setLoading(true)
			if (statusClientes !== `AMBOS`) {
				try {
					const data = await ClientAPI.buscarCliente(user, searchClientes, statusClientes)
					setClientes(data)
					setLoading(false)
				} catch (e: any) {
					setLoading(false)
					setHasError(true)
					toastError(e, false)
				}
			} else {
				try {
					const data = await ClientAPI.listar(user, first + 1, StatusCliente.Ambos)
					setClientes(data)
					setLoading(false)
				} catch (e: any) {
					setLoading(false)
					setHasError(true)
					toastError(e, false)
				}

			}
		}
	}

	const refreshTableDelete = async (success: boolean) => {
		setVisible(false)
		if (success) {
			setLoading(true)
			try {
				const data = await ClientAPI.listar(user, 1)
				setClientes(data)
				setLoading(false)
			} catch (e: any) {
				setLoading(false)
				setHasError(true)
				toastError(e, false)
			}
		}
	}

	const onPageChange = (event: { first: number }) => {
		setFirst(event.first)
	}

	return {
		clientes, setClientes,
		toastError, toastSuccess, toastAlert,
		first, setFirst,
		loading, setLoading,
		visible, setVisible,
		refreshTable,
		onPageChange,
		refreshTableDelete,
		searchClientes, setSearchClientes,
		onChangeBuscaClientes,
		visibleModalDetalhes, setVisibleModalDetalhes,
		situacoes: Situacoes,
		statusClientes, setStatusClientes,
		options,
		hasError
	}
}
