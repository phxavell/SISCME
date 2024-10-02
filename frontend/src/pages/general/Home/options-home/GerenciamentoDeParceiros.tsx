import {styleOptionsMainSpace} from '@pages/general/Home/style.ts'
import {Button} from 'primereact/button'
import {RoutersPathName} from '@/routes/schemas.ts'
import React from 'react'
import {useHome} from '@pages/general/Home/useHome.ts'

export const GerenciamentoDeParceiros = () => {
	const {goRouter} = useHome(0)
	return  (
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
				autoFocus
			/>
			<Button
				outlined
				onClick={() => goRouter(RoutersPathName.NovoVeiculo)}
				label="Veículos"
				icon="pi pi-car"
			/>
		</div>
	)
}
GerenciamentoDeParceiros.label = `Gerenciamento de Parceiros`
