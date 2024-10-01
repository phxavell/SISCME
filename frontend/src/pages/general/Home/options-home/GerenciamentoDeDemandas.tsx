import {styleOptionsMainSpace} from '@pages/general/Home/style.ts'
import {Button} from 'primereact/button'
import {RoutersPathName} from '@/routes/schemas.ts'
import React from 'react'
import {useHome} from '@pages/general/Home/useHome.ts'

export const GerenciamentoDeDemandas = () => {
	const {goRouter} = useHome(0)
	return  (
		<div className="flex flex-row">
			<div className={styleOptionsMainSpace}>
				<Button
					outlined
					severity="info"
					onClick={() => goRouter(RoutersPathName.DemandasCliente)}
					label="Gestão de Clientes"
				/>
			</div>
			<div className={styleOptionsMainSpace}>
				<Button
					severity="info"
					onClick={() => goRouter(RoutersPathName.GerenciarSolicitacoesEntregaColeta)}
					label="Gestão Logística"
				/>
			</div>
		</div>
	)
}
GerenciamentoDeDemandas.label = `Solicitações de Esterilização`
