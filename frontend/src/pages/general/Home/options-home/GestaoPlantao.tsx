import {styleOptionsMainSpace} from "@pages/general/Home/style.ts"
import {useHome} from "@pages/general/Home/useHome.ts"
import {Button} from "primereact/button"
import {RoutersPathName} from "@/routes/schemas"
import {useAuth} from "@/provider/Auth"

export const GestaoPlantao = () => {
	const { user, perfil } = useAuth()

	const {goRouter} = useHome(0)

	const renderButtonPlantao = () => {
		if (perfil == `Técnico`) {
			return (
				<>

					<Button
						outlined
						label="Diário de ocorrências"
						onClick={() => goRouter(RoutersPathName.DiarioDeOcorrencias)}
					/>

				</>
			)
		} else {
			if(user.groups.includes(`SUPERVISAOENFERMAGEM`)) {
				return (
					<>
						<Button
							outlined
							label="Gerenciar Plantões"
							onClick={() => goRouter(RoutersPathName.PlantaoSupervisor)}
						/>
						<Button
							label="Relatórios de Plantões"
							onClick={() => goRouter(RoutersPathName.RelatoriosPlantao)}
						/>
						<Button
							outlined
							label="Diário de ocorrências"
							onClick={() => goRouter(RoutersPathName.DiarioDeOcorrencias)}
						/>
						<Button
							label="Tipo de ocorrências"
							onClick={() => goRouter(RoutersPathName.TipoDeOcorrencia)}
						/>

					</>
				)
			} else {
				return (
					<>
						<Button
							outlined
							label="Plantões"
							onClick={() => goRouter(RoutersPathName.Plantao)}
						/>
						<Button
							outlined
							label="Diário de ocorrências"
							onClick={() => goRouter(RoutersPathName.DiarioDeOcorrencias)}
						/>
						<Button
							outlined
							label="Tipo de ocorrências"
							onClick={() => goRouter(RoutersPathName.TipoDeOcorrencia)}
						/>

					</>

				)
			}

		}
	}

	return (
		<div className={styleOptionsMainSpace}>
			{renderButtonPlantao()}
		</div>
	)
}
GestaoPlantao.label = `Gestão de Plantão`
