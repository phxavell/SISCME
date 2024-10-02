import { styleOptionsMainSpace } from '@pages/general/Home/style.ts'
import { Button } from 'primereact/button'
import { RoutersPathName } from '@/routes/schemas.ts'
import { useHome } from '@pages/general/Home/useHome.ts'

export const GerenciamentoRelatorios = () => {

	const { goRouter } = useHome(0)
	return (
		<div className={styleOptionsMainSpace}>
			<Button
				outlined
				label="Indicadores de Produtividade"
				onClick={() => goRouter(RoutersPathName.RelatorioIndicadoresDeProdutividade)}
			/>
			<Button
				label="Ocorrências"
				onClick={() => goRouter(RoutersPathName.RelatorioTipoOcorrencia)}
			/>
			<Button
				outlined
				label="Eficiência"
				onClick={() => goRouter(RoutersPathName.RelatorioEficiencia)}
			/>
			<Button
				label="Materiais"
				onClick={() => goRouter(RoutersPathName.RelatorioMateriais)}
			/>
			<Button
				outlined
				label="Manutenções"
				onClick={() => goRouter(RoutersPathName.RelatorioManutencao)}
			/>
			<Button
				label="Produção Mensal"
				onClick={() => goRouter(RoutersPathName.RelatorioProducaoMensal)}
			/>
		</div>
	)
}
GerenciamentoRelatorios.label = `Gerenciamentos de Relatórios`
