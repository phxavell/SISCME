import { Menu } from 'primereact/menu'
import { MenuItem } from 'primereact/menuitem'
import { CiSettings } from 'react-icons/ci'
import { FiKey } from 'react-icons/fi'
import { FiUser } from 'react-icons/fi'
import './style.css'
import { useNavigate } from 'react-router-dom'
import { RoutersPathName } from '@/routes/schemas'
export function SubMenu() {
	const navigation = useNavigate()
	const menuItem: MenuItem[] = [
		{
			label: `Dados Pessoais`,
			icon: <FiUser className="mr-2 text-white" size={20} />,
			command: () => { navigation(RoutersPathName.GestaoInformacoesPessoais) },

		},
		{
			label: `Conta`,
			icon: <CiSettings className="mr-2 text-white" size={20} />,
			command: () => { navigation(RoutersPathName.GestaoInformacoesPessoaisConta) },

		},
		{
			label: `Alterar senha`,
			icon: <FiKey className="mr-2 text-white" size={20} />,
			command: () => { navigation(RoutersPathName.GestaoInformacoesPessoaisAlterarSenha) },
		},
	]
	return (
		<div >
			<Menu
				id={`gestao-dados-pessoais`}
				className="bg-gradiente-maximum-compatibility"
				model={menuItem} />
		</div>
	)
}
