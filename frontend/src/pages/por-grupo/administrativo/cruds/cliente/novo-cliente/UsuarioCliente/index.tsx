import {useEffect, useState} from 'react'
import {Button} from 'primereact/button'
import {DataTable} from 'primereact/datatable'
import {Column} from 'primereact/column'
import {useAuth} from '@/provider/Auth'
import {ContainerFlexColumnDiv, backArrowIcon, buttonBack, divButtonBackAndTitle, headerTableStyle, titleStyle} from '@/util/styles'
import { ModalUsuarioCliente } from './ModalUsuarioCliente'
import { UsuarioClienteAPI } from '@/infra/integrations/usuario-cliente/usuario-cliente'
import { UsuarioClienteResponse } from "@/infra/integrations/usuario-cliente/interfaces"
import { useLocation, useNavigate } from 'react-router-dom'
import { InputSwitch } from 'primereact/inputswitch'
import {RoutersPathName} from '@/routes/schemas.ts'
import {rowClassName} from "@/components/RowTemplate.tsx"

export function UsuarioCliente() {

	const [visible, setVisible] = useState(false)
	const [usuariosCliente, setUsuariosCliente] = useState<UsuarioClienteResponse[]>([])
	const [loading, setLoading] = useState(true)
	const { user, toastError, toastSuccess, toastAlert , toast} = useAuth()
	const { state } = useLocation()
	const navigate = useNavigate()

	useEffect(() => {
		let mounted = true;
		(() => {
			if (state == null) {
				navigate(RoutersPathName.NovoCliente)
			}
			if (user) {
				UsuarioClienteAPI.getOptions(user, state.id).then((data) => {
					if (mounted) {
						setUsuariosCliente(data)
						setLoading(false)
					}
				}).catch(() => {
					if (mounted) {
						setLoading(false)
					}
				})
			}

		})()
		return () => {
			mounted = false
		}
	}, [user, navigate, state])

	const isActive = (usuarioCliente: UsuarioClienteResponse) => {
		if (usuarioCliente.ativo) {
			return `Ativo`
		} else {
			return `Inativo`
		}
	}

	const refreshTable = (success: boolean) => {
		setVisible(false)
		if (success) {
			setLoading(true)
			UsuarioClienteAPI
				.getOptions(user, state?.id)
				.then((data) => {
					setUsuariosCliente(data)
					setLoading(false)
				})
		}
	}

	const desativarOuAtivarUsuario = (cliente: UsuarioClienteResponse) => {
		if(cliente.ativo) {
			UsuarioClienteAPI.desativarUsuarioCliente(user, cliente.id).then(() => {
				toast.current?.clear()
				toastAlert(`Usuário desativado!`)
				refreshTable(true)
			}).catch((e) => {
				toastError(e.message, false)
			})
		} else {
			UsuarioClienteAPI.ativarUsuarioCliente(user, cliente.id).then(() => {
				refreshTable(true)
				toastSuccess(`Usuário ativado!`)
			}).catch((e) => {
				toastError(e.message, false)
			})
		}

	}

	const acoesTemplate = (cliente: UsuarioClienteResponse) => {
		return (
			<InputSwitch
				checked={cliente.ativo}
				onChange={() => {desativarOuAtivarUsuario(cliente)}}
			/>
		)
	}

	return (
		<div className={ContainerFlexColumnDiv}>
			<div className={divButtonBackAndTitle}>
				<Button
					icon={backArrowIcon}
					className={buttonBack}
					onClick={() => navigate(-1)}
				/>
				<h1 className={titleStyle}>Usuários de {state?.nome}</h1>
				<div></div>
			</div>
			<Button
				onClick={() => setVisible(true)}
				className="w-3 my-2 hover:bg-blue-600"
				label="Novo Usuário"
			/>
			<ModalUsuarioCliente
				visible={visible}
				onClose={refreshTable}
			/>

			<DataTable
				paginator
				rows={5}
				loading={loading}
				dataKey="id"
				value={usuariosCliente}
				className="w-full"
				scrollHeight="500px"
				style={{ height: 500}}
				paginatorClassName={`p-0 mt-0`}
				emptyMessage='Nenhum resultado encontrado'
				stripedRows
				rowClassName={rowClassName}
				rowHover
			>
				<Column
					field="id"
					header="#"
					headerStyle={headerTableStyle}
				/>
				<Column
					field="profissional.nome"
					header="Nome"
					headerStyle={headerTableStyle}
				/>
				<Column
					field="profissional.matricula"
					header="Matrícula"
					headerStyle={headerTableStyle}
				/>
				<Column
					field="profissional.cpf"
					header="CPF"
					headerStyle={headerTableStyle}
				/>
				<Column
					field="usuario"
					header="Usuário"
					headerStyle={headerTableStyle}
				/>
				<Column
					field="ativo"
					header="Situação"
					body={isActive}
					headerStyle={headerTableStyle}
				/>
				<Column
					header="Ações"
					body={acoesTemplate}
					headerStyle={headerTableStyle}
				/>
			</DataTable>

		</div>

	)
}
