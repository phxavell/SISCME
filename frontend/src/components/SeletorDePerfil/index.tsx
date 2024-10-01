import { MenuItem } from 'primereact/menuitem'
import { Menu } from 'primereact/menu'
import { MdSupervisorAccount } from 'react-icons/md'
import { IoIosAnalytics } from 'react-icons/io'
import { GiHealthCapsule, GiSyringe } from 'react-icons/gi'
import { ImPieChart, ImTruck } from 'react-icons/im'
import { Button } from 'primereact/button'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Perfis } from '@/infra/integrations/login.ts'
import { useAuth } from '@/provider/Auth'
import { TbNurse } from 'react-icons/all'
import { useNavigate } from 'react-router-dom'
import { RoutersPathName } from '@/routes/schemas.ts'

export enum Descricoes {
    Administrador = `Gerenciar equipamentos e acesso de usuários.`,
    Cliente = `Perfil de solicitante de serviços.`,
    Tecnico = `Atua na área de recebimento a distribuição e também logística.`,
    Transportador = `Profissional encarregado de logística e transporte.`,
    Enfermagem = `Responsável pela gestão de plantão.`,
	Gerente = `Responsável pelo gerenciamento de relatórios.`,
    None = ``,
}

// @ts-ignore
export function SeletorDePerfil({ styleButton, styleIdSubMenu, openFast }) {

	const { selecionarPerfil: setPerfil, perfil } = useAuth()
	const menuPerfil = useRef(null)
	const { user } = useAuth()
	const [icon, setIcon] = useState(<GiSyringe className='mr-2' size={20} />)
	const navigation = useNavigate()
	const changePerfil = useCallback((label: string, icon: any) => {
		if (navigation) {
			setPerfil(label)
			setIcon(icon)
			navigation(RoutersPathName.Home)
		}
	}, [navigation, setPerfil])

	const itemsMenuPerfil = useMemo(() => {
		const items: MenuItem[] = [
			{
				label: Perfis.Administrador,
				icon: <MdSupervisorAccount size={20} className='mr-2' />,
				command() {
					if (this.label != null) {
						changePerfil(this.label, this.icon)
					}
				},
				className: Perfis.Administrador === perfil ? `bg-blue-200` : ``
			},
			{
				label: Perfis.Cliente,
				icon: <IoIosAnalytics size={20} className='mr-2' />,
				command() {
					if (this.label != null) {
						changePerfil(this.label, this.icon)
					}
				},
				className: Perfis.Cliente === perfil ? `bg-blue-200` : ``
			},
			{
				label: Perfis.Enfermagem,
				icon: user.groups.includes(`SUPERVISAOENFERMAGEM`) ? `pi pi-star text-gray-800` : <TbNurse size={20} className='mr-2' />,
				command() {
					if (this.label != null) {
						changePerfil(this.label, this.icon)
					}
				},
				className: Perfis.Enfermagem === perfil ? `bg-blue-200` : ``
			},
			{
				label: Perfis.Tecnico,
				icon: <GiHealthCapsule size={20} className='mr-2' />,
				command() {
					if (this.label != null) {
						changePerfil(this.label, this.icon)
					}
				},
				className: Perfis.Tecnico === perfil ? `bg-blue-200` : ``

			},
			{
				label: Perfis.Transportador,
				icon: <ImTruck size={20} className='mr-2' />,
				command() {
					if (this.label != null) {
						changePerfil(this.label, this.icon)
					}
				},
				className: Perfis.Transportador === perfil ? `bg-blue-200` : ``
			},
			{
				label: Perfis.Gerente,
				icon: <ImPieChart size={20} className='mr-2' />,
				command() {
					if (this.label != null) {
						changePerfil(this.label, this.icon)
					}
				},
				className: Perfis.Gerente === perfil ? `bg-blue-200` : ``
			}
		]
		let itensFiltred = items
		if (user?.groups.length) {
			itensFiltred = itensFiltred.filter(item => !!item.label && user?.groups.includes(item.label))
		}
		return [
			{
				label: `A mudança de perfil muda as opções em tela`,
				items: itensFiltred
			}
		]
	}, [changePerfil, user, perfil])

	useEffect(() => {

		if (openFast && itemsMenuPerfil[0]?.items.length === 1) {
			const optionZero = itemsMenuPerfil[0].items[0]
			if (optionZero.label != null) {
				// @ts-ignore
				changePerfil(optionZero.label, optionZero.icon)
			}
		}
	}, [itemsMenuPerfil, openFast, changePerfil])

	const getStyleButton = useMemo(() => {
		if (!styleButton) {
			return `text-gray-100 hover:bg-blue-800`
		}
		return ``
	}, [styleButton])

	return (
		<>
			<Menu
				model={itemsMenuPerfil}
				popup
				ref={menuPerfil}
				id="popup_menu_perfil"
			/>
			<Button
				id={styleIdSubMenu}
				outlined
				icon={icon}
				className={getStyleButton}
				onClick={(event) => {
					// @ts-ignorec 0

					menuPerfil?.current?.toggle(event)
				}}
				text
				aria-controls="popup_menu_perfil"
				aria-haspopup
			>
                Selecionar Perfil
			</Button>
		</>
	)
}
