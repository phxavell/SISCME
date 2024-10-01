import {useAuth} from '@/provider/Auth'
import {Button} from 'primereact/button'
import {Menu} from 'primereact/menu'
import {MenuItem} from 'primereact/menuitem'
import React, {useRef} from 'react'
import {ImExit} from 'react-icons/im'
import {HeaderClass, styleHeaderBtn, styleLogoHome} from '../style-home.ts'
import {SeletorDePerfil} from '@/components/SeletorDePerfil'
import {RoutersPathName} from '@/routes/schemas.ts'
import {LogoNameSISCME240, styeleFlexRowCenter} from '@/util/styles'
import {Link, useNavigate} from 'react-router-dom'
import RenderObject from '@/components/RenderObject.tsx'
import {AvatarUser} from '@/layout/header'
import {CiSettings} from 'react-icons/ci'

export function HeaderMotorista() {
	const auth = useAuth()
	const {user} = useAuth()
	const navigation = useNavigate()

	const itemsUser: MenuItem[] = [
		{
			label: `Configurações`,
			icon: <CiSettings size={20} className='mr-2'/>,
			command() {
				navigation(RoutersPathName.GestaoInformacoesPessoais)
			},
		},
		{
			template: () => {
				return (
					<SeletorDePerfil
						openFast={false}
						styleButton='text-gray-100 bg-blue-800 w-full'
						styleIdSubMenu="header-sub-menu"
					/>
				)
			},
		},
		{
			label: `Logout`,
			icon: <ImExit size={20} className='mr-2'/>,
			command() {
				auth.signout()
			},
		},
	]

	const menuUser = useRef(null)
	const itemsMenuUser = [
		{
			label: `Bem-vindo`,
			items: itemsUser
		}
	]

	return (
		<header className={HeaderClass}>
			<Link
				to={RoutersPathName.Home}
				className={styleHeaderBtn}>
				<div className={styeleFlexRowCenter}>
					<img
						src={LogoNameSISCME240}
						className={styleLogoHome}
						alt="nome siscme"/>
				</div>
			</Link>
			<Menu
				model={itemsMenuUser}
				popup
				ref={menuUser}
				id="popup_menu_user"
			/>

			<Button
				className='text-gray-100 font-bold h-2rem hover:bg-blue-800'
				onClick={(event) => {
					//@ts-ignore
					menuUser?.current?.toggle(event)
				}}
				text
				aria-controls="popup_menu_left"
				aria-haspopup
			>
				<RenderObject
					data={user}
					keyObject="user.nome"
				/>
				{AvatarUser}
			</Button>


		</header>
	)
}
