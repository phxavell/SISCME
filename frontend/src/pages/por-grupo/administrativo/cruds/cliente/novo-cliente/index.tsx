import { useCallback, useMemo, useState } from "react"
import { ModalCliente } from "./modais/ModalCliente"
import { Button } from "primereact/button"
import { useAuth } from "@/provider/Auth"
import { ContainerFlexColumnDiv, avatarClassName, divNewAndSearchButton, styleInfor, styleTitle, titleStyle } from "@/util/styles"
import { ClientAPI } from "@/infra/integrations/client"
import { DataView } from "primereact/dataview"
import { Badge } from 'primereact/badge'
import { Avatar } from "primereact/avatar"
import { Link } from "react-router-dom"
import { Tooltip } from "primereact/tooltip"
import { Dialog } from "primereact/dialog"
import { InputSwitch } from "primereact/inputswitch"
import { useCliente } from "./useCliente"
import { InputText } from "primereact/inputtext"
import { ModalDetailsCliente } from "./modais/ModalDetails"
import { defaultValuesCliente } from "@infra/integrations/__mocks__"

import { divCardCliente, divTableGridCliente } from "@pages/por-grupo/administrativo/cruds/cliente/styles-cliente.ts"
import { Dropdown } from "primereact/dropdown"
import { RoutersPathName } from "@/routes/schemas.ts"
import { PaginatorAndFooter } from "@/components/table-templates/Paginator/PaginatorAndFooter"
import GenericError from "@/infra/integrations/error/pages/notFound"
import { ClienteData } from "@infra/integrations/types-client.ts"

export const NovoCliente = () => {
	const [visibleModalDelete, setVisibleModalDelete] = useState(false)
	const [visibleModalDesativar, setVisibleModalDesativar] = useState(false)
	const [cliente, setCliente] = useState<ClienteData>(defaultValuesCliente)
	const { user } = useAuth()
	const [clienteEdit, setClienteEdit] = useState<ClienteData | undefined>()

	const {
		clientes,
		first,
		loading,
		toastError, toastSuccess, toastAlert,
		visible, setVisible,
		refreshTable, refreshTableDelete,
		onPageChange,
		searchClientes,
		onChangeBuscaClientes,
		visibleModalDetalhes, setVisibleModalDetalhes,
		statusClientes, setStatusClientes,
		situacoes,
		options, hasError
	} = useCliente()

	const deleteCnpj = (cliente: ClienteData) => {
		ClientAPI.excluir(user, cliente).then(() => {
			if (clientes?.data.length == 1) {
				refreshTableDelete(true)
			} else {
				refreshTable(true)
			}
			setVisibleModalDelete(false)
			toastSuccess(`Cliente excluído com sucesso!`)
		}).catch((e) => {
			toastError(e, false)
			setVisibleModalDelete(false)
		})
	}

	const ativarCliente = (cliente: ClienteData) => {
		ClientAPI.ativarCliente(user, cliente?.idcli).then(() => {
			toastSuccess(`Cliente ativado!`)
		}).catch((e) => {
			toastError(e, false)
		})
	}

	const desativarCliente = (cliente: ClienteData) => {
		ClientAPI.desativarCliente(user, cliente?.idcli).then(() => {
			refreshTable(true)
			toastAlert(`Cliente desativado!`)
			setVisibleModalDesativar(false)
		}).catch((e: any) => {
			toastError((e.statusText || e.message) ?? `Não foi possível desativar cliente!`, false)
		})
	}

	const editCnpj = (cliente: ClienteData) => {
		setClienteEdit(cliente)
		setTimeout(() => {
			setVisible(true)
		}, 300)
	}

	const badgeFormat = (cliente: ClienteData) => {
		if (cliente?.badge == null) {
			return `0`
		} else {
			return cliente?.badge
		}
	}

	const nomeFormatLimit = (nome: string) => {
		if (nome.length > 22) {
			return `${nome.substring(0, 22)}...`
		} else {
			return nome
		}
	}

	const siglaFormatLimit = (sigla: string) => {
		if (sigla.length > 10) {
			return `${sigla.substring(0, 8)}...`
		} else {
			return sigla
		}
	}

	const buttonUsuarios = useCallback(() => {
		return cliente?.ativo ? `bg-green-700 hover:bg-green-800` : `bg-green-700`
	}, [cliente])

	const styleButtonUsuarios = useMemo(() => `${avatarClassName} ${buttonUsuarios()}`, [buttonUsuarios])

	const gridClientes = (cliente: ClienteData) => {
		return (
			<div className={divTableGridCliente} style={{
				width:`400px`
			}}>
				<div className={`${divCardCliente} ${cliente?.ativo ? `` : `opacity-60`}`}>
					<div className={`${styleInfor} w-full flex justify-content-between mb-3`}>
						<div className={styleTitle}>
							# {cliente?.idcli}
						</div>
						<div className="flex align-items-center gap-2">
							<InputSwitch
								checked={cliente?.ativo}
								data-testid='switch-cliente'
								onChange={() => {
									if (!cliente?.ativo) {
										ativarCliente(cliente)
										setTimeout(() => {
											refreshTable(true)
										}, 100)
									} else {
										setVisibleModalDesativar(true)
									}
									setCliente(cliente)
								}}
							/>
						</div>


					</div>
					<div className={styleInfor}>
						<div className={styleTitle}>
							{options?.nomecli?.label}
						</div>
						<div>
							{nomeFormatLimit(cliente?.nomecli)}
						</div>
					</div>
					<div className={styleInfor}>
						<div className={styleTitle}>
							{options?.nomeabreviado?.label}:
						</div>
						<div>{siglaFormatLimit(cliente?.nomeabreviado)}</div>
					</div>
					<div className={styleInfor}>
						<div className={styleTitle}>
							{options?.cnpjcli?.label}:
						</div>
						<div>{cliente?.cnpjcli}</div>
					</div>
					<div className={styleInfor}>
						<div className={styleTitle}>
							{options?.inscricaoestadualcli?.label}:
						</div>
						<div>{cliente?.inscricaoestadualcli}</div>
					</div>
					<div className="w-full flex justify-content-end gap-1 mt-2">
						<Tooltip
							target=".delete"
							mouseTrack
							mouseTrackLeft={20}
							content="Excluir Cliente"
						/>
						<Tooltip
							target=".edit"
							mouseTrack
							mouseTrackLeft={20}
							content="Editar Cliente"
						/>
						<Tooltip
							target=".eye"
							mouseTrack
							mouseTrackLeft={20}
							content="Detalhes"
						/>
						<Button
							icon='pi pi-eye'
							className="eye bg-yellow-600"
							data-testid='botao-detalhes'
							onClick={() => {
								setVisibleModalDetalhes(true)
								setCliente(cliente)
							}}
							disabled={!cliente?.ativo}
						/>
						<Button
							icon='pi pi-trash'
							className="delete bg-red-800"
							onClick={() => {
								setVisibleModalDelete(true)
								setCliente(cliente)
							}}
							disabled={!cliente?.ativo}
							data-testid='botao-excluir'
						/>
						<Button
							icon='pi pi-pencil'
							className="edit bg-blue-800"
							onClick={() => editCnpj(cliente)}
							disabled={!cliente?.ativo}
						/>
						<Link
							to={RoutersPathName.NovoUsuarioCliente}
							state={{ id: cliente?.idcli, nome: cliente?.nomefantasiacli }}
							className="w-5 text-gray-200"
						>
							<Avatar
								label="Usuários"
								className={styleButtonUsuarios}
							>
								<Badge value={badgeFormat(cliente)} className="bg-blue-500" />
							</Avatar>
						</Link>
					</div>
				</div>
			</div>
		)
	}

	if (hasError) {
		return <GenericError />
	}

	return (
		<div className={ContainerFlexColumnDiv}>

			<h1 className={titleStyle}>Clientes</h1>

			<div className={divNewAndSearchButton}>
				<Button
					onClick={() => setVisible(true)}
					className="hover:bg-blue-600"
					label="Novo Cliente"
					data-testid='botao-novo-cliente' />

				<span className="p-input-icon-left">
					<i className="pi pi-search" />
					<InputText
						placeholder="Pesquisar"
						value={searchClientes}
						onChange={e => onChangeBuscaClientes(e.target.value)} />
				</span>

				<Dropdown
					className="text-left h-3rem w-10rem"
					placeholder="Situação"
					options={situacoes}
					value={statusClientes}
					onChange={(e) => setStatusClientes(e.value)} />


			</div>
			<DataView
				className="w-12"
				value={clientes?.data}
				loading={loading}
				itemTemplate={gridClientes}
				emptyMessage="Nenhum resultado encontrado." />
			<PaginatorAndFooter
				first={first}
				meta={clientes?.meta}
				onPageChange={onPageChange} />

			<Dialog
				header=':"&#40;'
				draggable={false}
				resizable={false}
				closeOnEscape={true}
				blockScroll={true}
				dismissableMask={true}
				onHide={() => setVisibleModalDelete(false)}
				visible={visibleModalDelete}
			>
				<h2 className="m-0 mb-3">Tem certeza que deseja excluir?</h2>

				<div className="flex gap-2">
					<Button label="Não" onClick={() => setVisibleModalDelete(false)} />
					<Button
						label="Sim, tenho certeza"
						onClick={() => deleteCnpj(cliente)}
						data-testid='confirmar-delete' />
				</div>
			</Dialog>
			<ModalDetailsCliente
				onClose={() => setVisibleModalDetalhes(false)}
				visible={visibleModalDetalhes}
				idCliente={cliente?.idcli} />
			<Dialog
				header=':"&#40;'
				draggable={false}
				resizable={false}
				closeOnEscape={true}
				dismissableMask={true}
				onHide={() => setVisibleModalDesativar(false)}
				visible={visibleModalDesativar}
			>
				<h2 className="m-0 mb-3 flex flex-column">
					Tem certeza que deseja desativar o cliente? <i
						className="text-xs">&#40;Ao desativar o cliente, todos os usuários vinculados a ele também serão
						desativados&#41;</i></h2>

				<div className="flex gap-2">
					<Button label="Não" onClick={() => setVisibleModalDesativar(false)} />
					<Button
						label="Sim, tenho certeza"
						onClick={() => {
							desativarCliente(cliente)
						}}
						data-testid='confirmar-switch' />

				</div>
			</Dialog>
			<ModalCliente
				options={options}
				visible={visible}
				onClose={refreshTable}
				cliente={clienteEdit}
				setClientes={setClienteEdit} />
		</div>

	)
}
