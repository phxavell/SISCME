import {styleOptionsMainSpace} from '@pages/general/Home/style.ts'
import {Button} from 'primereact/button'
import {RoutersPathName} from '@/routes/schemas.ts'
import React from 'react'
import {useHome} from '@pages/general/Home/useHome.ts'

export const GerenciamentoPatrimonio = () => {
	const {goRouter} = useHome(0)
	return  (
		<div className={styleOptionsMainSpace}>
			<Button
				icon='pi pi-star-fill'
				severity="info"
				outlined
				onClick={() => goRouter(RoutersPathName.Produto)}
				label="Produtos"
			/>
			<Button
				onClick={() => goRouter(RoutersPathName.Caixa)}
				label="Caixas"
				icon='pi pi-box'
			/>
			<Button
				outlined
				onClick={() => goRouter(RoutersPathName.Equipamentos)}
				label="Equipamentos"
				icon="pi pi-calculator"
			/>
			<Button
				onClick={() => goRouter(RoutersPathName.Seriais)}
				label="Seriais"
				icon='pi pi-tag'
			/>
			<Button
				outlined
				onClick={() => goRouter(RoutersPathName.NovoVeiculo)}
				label="Veículos"
				icon="pi pi-car"
			/>
			<Button
				onClick={() => goRouter(RoutersPathName.Indicadores)}
				label="Indicadores"
				icon="pi pi-ticket"
				//TODO => REMOVER HIDDEN QUANDO INDICADORES ENTRAR
				className='hidden'
			/>

		</div>
	)
}
GerenciamentoPatrimonio.label = `Gerenciamento de Patrimônio`
