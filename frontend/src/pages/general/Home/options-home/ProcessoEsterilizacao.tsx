import { styleOptionsMainSpace } from '@pages/general/Home/style.ts'
import { Button } from 'primereact/button'
import { RoutersPathName } from '@/routes/schemas.ts'
import React from 'react'
import { useHome } from '@pages/general/Home/useHome.ts'

export const ProcessoEsterilizacao = () => {

	const { goRouter } = useHome(0)
	return (
		<div className={styleOptionsMainSpace}>
			<Button
				outlined
				label="Recepção"
				onClick={() => goRouter(RoutersPathName.Recebimento)}
			/>
			<Button
				label="Termodesinfecção"
				onClick={() => goRouter(RoutersPathName.Termo)}
			/>
			<Button
				outlined
				label="Produção"
				onClick={() => goRouter(RoutersPathName.Producao)}
			/>
			<Button

				label="Etiquetas"
				onClick={() => goRouter(RoutersPathName.Etiquetas)}
			/>

			<Button
				outlined
				label="Esterilização"
				onClick={() => goRouter(RoutersPathName.Esterilizacao)}
			/>
			<Button

				label="Distribuição"
				onClick={() => goRouter(RoutersPathName.Distribuicao)}
			/>
		</div>
	)
}
ProcessoEsterilizacao.label = `Processo de Esterilização`
