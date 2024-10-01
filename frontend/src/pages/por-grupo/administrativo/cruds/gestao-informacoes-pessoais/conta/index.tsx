import { ContainerFlexColumnDiv, titleStyle } from '@/util/styles'
import { SubMenu } from '../sub-menu'
import { Card } from 'primereact/card'
import { Divider } from 'primereact/divider'
import { Tag } from 'primereact/tag'
import { useConta } from './useConta'

const styleTag = `p-2 flex justify-content-start text-base bg-gradiente-maximum-compatibility-espelhado`
export function Conta() {
	const { conta } = useConta()
	const Usuario = () => {
		return (
			<div className="flex flex-row gap-2">
				<span className="text-white font-bold">Usuário:</span>
				<span className="text-white ">{conta?.usuario}</span>
			</div>
		)
	}
	const Grupos = () => {
		const listGrupos = conta?.grupos
		return (
			<div className="flex flex-row flex-wrap justify-content-between gap-2 mt-6">
				<span className="text-white font-bold flex justify-content-start">Grupos:</span>
				{listGrupos?.map(grupo => (
					<Tag
						key={grupo}
						className={styleTag}
						rounded
						severity="info"
						value={grupo}
					/>

				))}
			</div>
		)
	}

	const SuperUsuario = () => {
		const superUsuario = conta?.super_usuario
		const staff = conta?.staff
		if (superUsuario && staff) {
			return (
				<div className="flex flex-row justify-content-center align-items-center gap-2 text-white">
					<span className="font-bold">Tipo de conta:</span>
					<div className="flex flex-row gap-2 align-items-start">
						<Tag
							className={styleTag}
							rounded
							severity="info"
							value="Super usuário"
						/>
						<Tag
							className={styleTag}
							rounded
							severity="info"
							value="Staff"
						/>
					</div>
				</div>
			)
		} else if (superUsuario) {
			return (
				<div className="flex flex-column justify-content-start align-items-start gap-2 text-white">
					<span className="font-bold">Tipo de conta:</span>
					<ul className="block align-items-start m-0 pl-6">
						<li>Super usuário</li>
					</ul>
				</div>
			)
		} else if (staff) {
			return (
				<div className="flex flex-column justify-content-start align-items-start gap-2 text-white">
					<span className="font-bold">Tipo de conta:</span>
					<ul className="block align-items-start m-0 pl-6">
						<li>Staff</li>
					</ul>
				</div>
			)
		} else {
			return null
		}
	}
	return (
		<div className={ContainerFlexColumnDiv}>
			<h1 className={titleStyle}>Configurações de conta</h1>
			<Card className={`
			container-dados-pessoais
			bg-gradiente-maximum-compatibility-reverse
			max-w-screen`}>
				<div className="flex flex-row gap-3 w-full ">
					<div className="h-full">
						<SubMenu />
					</div>

					<div className="flex-1 pl-5 border-left-1 border-white border-600">
						<div className="flex flex-column justify-content-start mb-2">
							<strong className="text-left text-white">Conta</strong>
							<Divider />
						</div>
						<div className="flex flex-row gap-6  w-full">
							<div className="flex flex-row justify-content-center align-items-center gap-2 text-white" >
								<Usuario />
							</div>
							<div className="w-full">
								<SuperUsuario />
							</div>
						</div>
						<Grupos />
					</div>

				</div>
			</Card>
		</div>
	)
}
