import {RoutersPathName} from '@/routes/schemas.ts'
import {Tooltip} from 'primereact/tooltip'
import {Link} from 'react-router-dom'
import React from 'react'

type FooterCardProps = (
    pendentes: number,
    andamento: number,
    concluido: number,
    id: number,
    nome: string
) => React.JSX.Element

const classFooterCardLink = (tooltip: string, color: string) => {
	return `
    ${tooltip}
    text-center
    text-white
    py-2
    w-7rem
    border-round-3xl
    ${color}
    cursor-pointer
    font-bold`
}

export const footerCard: FooterCardProps = (
	pendentes,
	andamento,
	concluido,
	id,
	nome
) => (
	<div className="flex justify-content-between pb-3">
		<Tooltip
			target=".pendentes"
			mouseTrack
			mouseTrackLeft={20}
			content="Pendentes"
		/>
		<Link
			to={RoutersPathName.DemandasPendentes}
			state={{id: id, nome: nome}}
			className={classFooterCardLink(`pendentes`, `bg-red-700`)}
		>
            +{pendentes}
		</Link>

		<Tooltip
			target=".andamento"
			mouseTrack
			mouseTrackLeft={20}
			content="Andamento"
		/>
		<Link
			to={RoutersPathName.DemandasEmAndamento}
			state={{id: id, nome: nome}}
			className={classFooterCardLink(`andamento`, `bg-blue-400`)}
		>
            +{andamento}
		</Link>

		<Tooltip
			target=".concluido"
			mouseTrack
			mouseTrackLeft={20}
			content="Concluído"
		/>
		<Link
			to={RoutersPathName.DemandasEntregues}
			state={{id: id, nome: nome}}
			className={classFooterCardLink(`concluido`, `bg-green-700`)}
		>
            +{concluido}
		</Link>
	</div>
)
