import { RoutersPathName } from '@/routes/schemas.ts'
import { Tooltip } from 'primereact/tooltip'
import { Link } from 'react-router-dom'

const classFooterCardLink = (tooltip: string, color: string) => {
	return `${tooltip} text-center text-white py-2 w-7rem border-round-3xl ${color} cursor-pointer font-bold`
}

export const FooterCard = () => (
	<div className="flex justify-content-between">
		<Tooltip
			target=".pendentes"
			mouseTrack
			mouseTrackLeft={20}
			content="Pendentes"
		/>
		<Link
			to={RoutersPathName.Producao}
			// state={{id: id, nome: nome}}
			className={classFooterCardLink(`pendentes`, `bg-red-700`)}
		>
            +{2}
		</Link>

		<Tooltip
			target=".andamento"
			mouseTrack
			mouseTrackLeft={20}
			content="Andamento"
		/>
		<Link
			to={RoutersPathName.Producao}
			className={classFooterCardLink(`andamento`, `bg-blue-400`)}
		>
            +{5}
		</Link>

		<Tooltip
			target=".concluido"
			mouseTrack
			mouseTrackLeft={20}
			content="Concluído"
		/>
		<Link
			to={RoutersPathName.Producao}
			className={classFooterCardLink(`concluido`, `bg-green-700`)}
		>
            +{0}
		</Link>
	</div>
)
