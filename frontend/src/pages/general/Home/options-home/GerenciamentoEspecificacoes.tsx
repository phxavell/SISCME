import { styleOptionsMainSpace } from '@pages/general/Home/style.ts'
import { Button } from 'primereact/button'
import { RoutersPathName } from '@/routes/schemas.ts'
import React from 'react'
import { useHome } from '@pages/general/Home/useHome.ts'

export const GerenciamentoEspecificacoes = () => {
	const { goRouter } = useHome(0)
	return (
		<div className={styleOptionsMainSpace}>
			<Button
				severity="warning"
				onClick={() => goRouter(RoutersPathName.TipoDeProduto)}
				label="Tipos de produto"
			/>
			<Button
				severity="info"
				outlined
				onClick={() => goRouter(RoutersPathName.SubTipoDeProduto)}
				label="Subtipos de produto"
			/>
		</div>
	)
}
GerenciamentoEspecificacoes.label = `Gerenciamento de Especificações`
