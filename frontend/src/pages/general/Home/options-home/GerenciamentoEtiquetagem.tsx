import {styleOptionsMainSpace} from '@pages/general/Home/style.ts'
import {Button} from 'primereact/button'
import React from 'react'

export const GerenciamentoEtiquetagem = () => {
	return  (
		<div className={styleOptionsMainSpace}>
			<Button
				severity="warning"
				outlined
				// onClick={() => goRouter(RoutersPathName.NovoSerialEtiqueta)}
				label="Novo sequencial de etiqueta"
			/>
			<Button
				severity="warning"
				// onClick={() => goRouter(RoutersPathName.PesquisarEtiqueta)}
				label="Pesquisar etiqueta"
			/>
		</div>
	)
}
GerenciamentoEtiquetagem.label = `Gerenciamento de Etiquetagem`
