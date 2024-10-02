import DateFormatter from "@/components/table-templates/formatters/DateTimeFormatter.tsx"
import React from "react"
import {coletasProps} from "@/infra/integrations/solicitacoes_motoristas.ts"
import {
	ClienteTemplate,
	StatusColetarBodyTemplate
} from '@pages/por-grupo/motorista/entregas-agendadas/Coletar/TableColetar'
import {ActionsEntregarTemplate} from '@pages/por-grupo/motorista/entregas-agendadas/Entregar/TableEntregar'
import { styleContentCard, styleInfor, styleTitle } from "@/util/styles"



export const CardDataviewMotoristaEntregar = (mudarStatus: (statusA: string, statusB: string, id: any) => void) =>
	(props: coletasProps) => {
		const { data_criacao, id} = props

		return (
			<div
				className={styleContentCard}
			>
				<div className={styleInfor}>
					<div className={styleTitle}>
                        #
					</div>
					<div>{id}</div>
				</div>
				<div className={styleInfor}>
					<div className={styleTitle}>
                        Data de Criação:
					</div>
					<div>{DateFormatter({date: data_criacao})}</div>
				</div>
				<div className={styleInfor}>
					<div className={styleTitle}>
                        Cliente:
					</div>
					<ClienteTemplate {...props}></ClienteTemplate>
				</div>
				<div className={styleInfor}>
					<div className={styleTitle}>
                        Situação
					</div>
					<StatusColetarBodyTemplate {...props}></StatusColetarBodyTemplate>
				</div>
				<div className={styleInfor}>
					<div className={styleTitle}>
                        Ações
					</div>
					{ActionsEntregarTemplate(mudarStatus)(props)}
				</div>
			</div>

		)
	}
