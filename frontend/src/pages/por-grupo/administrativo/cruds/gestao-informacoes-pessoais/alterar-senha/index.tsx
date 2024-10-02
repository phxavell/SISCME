import { ContainerFlexColumnDiv, titleStyle } from '@/util/styles'
import { SubMenu } from '../sub-menu'
import { Card } from 'primereact/card'
import { Divider } from 'primereact/divider'
import { InputText } from 'primereact/inputtext'
import { useAlterarSenha } from './useAlterarSenha'
import { Button } from 'primereact/button'


export function AlterarSenha() {
	const { register, handleSubmit, handleSubmitAlterarSenha, errors } = useAlterarSenha()
	return (
		<div className={ContainerFlexColumnDiv}>
			<h1 className={titleStyle}>Configurações de conta</h1>
			<Card className="container-dados-pessoais bg-gradiente-maximum-compatibility-reverse">
				<div className="flex flex-row gap-3 w-full">
					<div className="h-full">
						<SubMenu />
					</div>

					<div className="flex-1 pl-5 border-left-1 border-white border-600">
						<div className="flex flex-column justify-content-start mb-2">
							<strong className="text-left text-white">Alterar senha</strong>
							<Divider />
						</div>
						<form onSubmit={handleSubmit(handleSubmitAlterarSenha)} className="grid p-fluid w-18rem" >
							<div className="col-12 md:col-12">
								<label className="flex justify-content-start text-white">Senha atual:</label>
								<InputText
									type="password"
									placeholder="Senha atual"
									{...register(`novaAtual`)}
								/>
								{errors.novaAtual &&
                                    <span className="text-red-600 flex justify-content-start">{errors.novaAtual.message} </span>
								}
							</div>
							<div className="col-12 md:col-12">
								<label className="flex justify-content-start text-white">Nova senha:</label>
								<InputText
									type="password"
									placeholder="Nova senha"
									className="w-full"
									{...register(`novaSenha`)}
								/>
								{errors.novaSenha &&
                                    <span className="text-red-600 flex justify-content-start">{errors.novaSenha.message} </span>
								}
							</div>
							<div className="col-12 md:col-12">
								<label className="flex justify-content-start text-white">Confirmar senha:</label>
								<InputText
									type="password"
									placeholder="Confirmar senha"
									{...register(`confirmarSenha`)}
								/>
								{errors.confirmarSenha &&
                                    <span className="text-red-600 flex justify-content-start">{errors.confirmarSenha.message} </span>
								}
							</div>

							<div className="mt-4">
								<Button type="submit" severity="success" label="Salvar" />
							</div>
						</form>
					</div>

				</div>
			</Card>
		</div>
	)
}
