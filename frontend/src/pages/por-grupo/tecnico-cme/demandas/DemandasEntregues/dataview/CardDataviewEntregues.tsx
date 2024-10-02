import {Solicitacoes} from '@/infra/integrations/tecnico-demandas.ts'
import DateFormatter from '@/components/table-templates/formatters/DateFormatter.tsx'
import React from 'react'
import RenderObject from '@/components/RenderObject.tsx'
import {BoxTemplate} from '@/components/table-templates/BoxTemplate.tsx'
import {StatusTemplate} from '@/components/table-templates/StatusTemplate.tsx'
import { styleContentCard, styleInfor, styleTitle } from '@/util/styles'

export const CardDataviewEntregues = (solicitacao: Solicitacoes) => {


	return (
		<div
			className={styleContentCard}
		>
			<div className={styleInfor}>
				<div className={styleTitle}>
                    #
				</div>
				<div>{solicitacao?.id}</div>
			</div>
			<div className={styleInfor}>
				<div className={styleTitle}>
                    Atualizado em:
				</div>
				<div>{DateFormatter(`DD-MM-YYYY`)({date: solicitacao?.data_atualizacao})}</div>
			</div>
			<div className={styleInfor}>
				<div className={styleTitle}>
                    Situação:
				</div>
				<StatusTemplate {...solicitacao}></StatusTemplate>
			</div>
			<div className={styleInfor}>
				<div className={styleTitle}>
                    Quantidade de Caixas:
				</div>
				<BoxTemplate {...solicitacao}></BoxTemplate>
			</div>
			<div className={styleInfor}>
				<div className={styleTitle}>
                    Observações:
				</div>
				<RenderObject {...{
					data: solicitacao,
					keyObject: `observacao`
				}}></RenderObject>
			</div>
		</div>

	)
}
