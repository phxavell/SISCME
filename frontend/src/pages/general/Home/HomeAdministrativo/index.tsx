import React from 'react'
import {Fieldset} from 'primereact/fieldset'
import '../style.css'
import {GerenciamentoDeParceiros} from '@pages/general/Home/options-home/GerenciamentoDeParceiros.tsx'
import {useHome} from '@pages/general/Home/useHome.ts'
import {GerenciamentoPatrimonio} from '@pages/general/Home/options-home/GerenciamentoPatrimonio.tsx'
import {styleMainContent, styleOptionsMainSpace} from '@pages/general/Home/style.ts'
import {Button} from 'primereact/button'
import {RoutersPathName} from '@/routes/schemas.ts'
import {GiTripleNeedle} from 'react-icons/gi'
import {AiFillMedicineBox} from 'react-icons/ai'
import {FaHotel} from 'react-icons/fa'
import {BsPersonWorkspace} from 'react-icons/bs'
import { FieldsetOptionsAdministrativo } from '../enums'
export const HomeAdministrativo = () => {
	const {
		handleMenu,
		optionsCollapsed,
		goRouter
	} = useHome(FieldsetOptionsAdministrativo._Length)

	return (
		<div className={styleMainContent}>
			<Fieldset
				onToggle={e => {
					handleMenu(FieldsetOptionsAdministrativo.GerencimentoDePatrimonio, e.value)
				}}
				collapsed={optionsCollapsed[FieldsetOptionsAdministrativo.GerencimentoDePatrimonio]}
				legend={GerenciamentoPatrimonio.label}
				toggleable
				className='p-0'>
				<GerenciamentoPatrimonio/>
			</Fieldset>
			<Fieldset
				onToggle={e => {
					handleMenu(FieldsetOptionsAdministrativo.GerencimentoDeParceiros, e.value)
				}}
				collapsed={optionsCollapsed[FieldsetOptionsAdministrativo.GerencimentoDeParceiros]}
				legend={GerenciamentoDeParceiros.label}
				toggleable
				className='p-0'>
				<div className={styleOptionsMainSpace}>
					<Button
						outlined
						severity="info"
						onClick={() => goRouter(RoutersPathName.NovoCliente)}
						label="Clientes"
						icon="pi pi-user-plus"
					/>
					<Button
						onClick={() => goRouter(RoutersPathName.NovoMotorista)}
						label="Motoristas"
						icon="pi pi-truck"
					/>
					<Button
						outlined
						onClick={() => goRouter(RoutersPathName.NovoUsuario)}
						label="Usuários"
						icon="pi pi-users"
					/>
				</div>
			</Fieldset>
			<Fieldset
				onToggle={e => {
					handleMenu(FieldsetOptionsAdministrativo.GerenciamentoDeEspecificacoes, e.value)
				}}
				collapsed={optionsCollapsed[FieldsetOptionsAdministrativo.GerenciamentoDeEspecificacoes]}
				legend="Gerenciamento de Especificações"
				toggleable
				className='p-0'>
				<div className={styleOptionsMainSpace}>
					<Button
						outlined
						onClick={() => goRouter(RoutersPathName.SubTipoDeProduto)}
						label="Subtipo de Produto"
						icon="pi pi-server"
					/>
					<Button
						onClick={() => goRouter(RoutersPathName.TipoDeProduto)}
						label="Tipo de Produto"
						icon={<GiTripleNeedle className='mr-2'/>}
					/>
					<Button
						outlined
						onClick={() => goRouter(RoutersPathName.Embalagens)}
						label="Embalagem"
						icon="pi pi-box"
					/>
					<Button
						onClick={() => goRouter(RoutersPathName.Setor)}
						label="Setor"
						icon={<FaHotel className="mr-2"/>}
					/>
					<Button
						outlined
						onClick={() => goRouter(RoutersPathName.Profissao)}
						label="Profissão"
						icon={<BsPersonWorkspace className="mr-2"/>}
					/>
					<Button
						onClick={() => goRouter(RoutersPathName.TipoDeCaixa)}
						label="Tipo"
						icon={<AiFillMedicineBox className='mr-2'/>}
					/>
				</div>
			</Fieldset>
		</div>
	)
}
