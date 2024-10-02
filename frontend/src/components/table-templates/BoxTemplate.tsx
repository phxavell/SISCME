import {Solicitacoes} from '@/infra/integrations/tecnico-demandas.ts'
import React from 'react'

export const BoxTemplate = (solicitacao: Solicitacoes) => {
	if (solicitacao?.quantidade) {
		const { quantidade } = solicitacao
		return (
			<div className="flex flex-column">
				{`${quantidade} caixas`}
			</div>
		)
	} else {
		return (
			<div className="flex flex-column">
                0 caixas
			</div>
		)
	}
}
