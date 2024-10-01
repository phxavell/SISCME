import { Route, Routes} from 'react-router-dom'
import {NovaCaixa} from '@pages/por-grupo/administrativo/cruds/caixa/nova-caixa'
import {Login} from '@pages/general/Login'
import {Home} from '@pages/general/Home'
import {Layout} from '../layout/Layout.tsx'
import {SubTipoProduto} from '@/pages/por-grupo/administrativo/cruds/subtipo-produto/index.tsx'
import {Product} from '@pages/por-grupo/administrativo/cruds/produto'
import { RequireAuth } from "@/provider/Auth/RequireAuth.tsx"
import {NovoCliente} from '@pages/por-grupo/administrativo/cruds/cliente/novo-cliente'
import {Veiculos} from '@pages/por-grupo/administrativo/cruds/veiculos'
import {NewDriver} from '@pages/por-grupo/administrativo/cruds/motorista/novo-motorista'
import SterizationRequest from '@pages/por-grupo/cliente/criar-solicitacao/sterization-request'
import {InProgressDriver} from '@pages/por-grupo/motorista/entregas-agendadas'
import {DemandasEmProgresso} from '@pages/por-grupo/tecnico-cme/demandas/DemandasEmProgresso'
import {RoutersPathName} from '@/routes/schemas.ts'
import {DemandsDelivered} from '@pages/por-grupo/tecnico-cme/demandas/DemandasEntregues'
import {PendingDemands} from '@pages/por-grupo/tecnico-cme/demandas/DemandasPendentes'
import {Recebimento} from '@pages/por-grupo/tecnico-cme/processos/recebimento/Recebimento.tsx'
import {GerenciarMotoristaColetaEntrega} from '@pages/por-grupo/tecnico-cme/gerencia-motorista'
import {UsuarioCliente} from '@pages/por-grupo/administrativo/cruds/cliente/novo-cliente/UsuarioCliente'
import {DemandasPorClientes} from '@/pages/por-grupo/tecnico-cme/demandas/demandas-por-clientes/index.tsx'
import {EquipamentosPage} from '@/pages/por-grupo/administrativo/cruds/equipamento/index.tsx'
import {AreaAdministrativa} from '@/pages/por-grupo/cliente/area-administrativa/index.tsx'
import {TipoProduto} from '@pages/por-grupo/administrativo/especificoes/tipo-produto'
import {Embalagem} from '@pages/por-grupo/administrativo/especificoes/embalagem'
import {Setor} from '@pages/por-grupo/administrativo/especificoes/setor'
import {TipoCaixa} from '@/pages/por-grupo/administrativo/cruds/tipo-caixa/index.tsx'
import {Profissao} from '@/pages/por-grupo/administrativo/cruds/profissao/index.tsx'
import {GestaoInformacoesPessoais} from '@/pages/por-grupo/administrativo/cruds/gestao-informacoes-pessoais/index.tsx'
import {Conta} from '@/pages/por-grupo/administrativo/cruds/gestao-informacoes-pessoais/conta/index.tsx'
import {AlterarSenha} from '@/pages/por-grupo/administrativo/cruds/gestao-informacoes-pessoais/alterar-senha/index.tsx'
import {
	PesquisarRecebimentos
} from "@/pages/por-grupo/tecnico-cme/processos/recebimento/PesquisarRecebimentos/index.tsx"
import {Termo} from "@/pages/por-grupo/tecnico-cme/processos/termo/index.tsx"
import {Plantao} from '@/pages/por-grupo/enfermagem/plantao/index.tsx'
import {PlantaoSupervisor} from '@/pages/por-grupo/enfermagem/gestor/plantao-supervisor/index.tsx'
import {RelatorioPlantao} from '@/pages/por-grupo/enfermagem/gestor/relatorio-plantao/index.tsx'
import {Etiquetas} from '@/pages/por-grupo/tecnico-cme/cruds/etiquetas/index.tsx'
import {Producao} from '@/pages/por-grupo/tecnico-cme/processos/producao/index.tsx'
import {PesquisarProducoes} from '@/pages/por-grupo/tecnico-cme/processos/producao/PesquisarProducoes/index.tsx'
import {PesquisarTermo} from '@/pages/por-grupo/tecnico-cme/processos/termo/PesquisarTermo/index.tsx'
import {Esterilizacao} from '@/pages/por-grupo/tecnico-cme/processos/esterilizacao/index.tsx'
import {
	PesquisarEsterilizacao
} from '@/pages/por-grupo/tecnico-cme/processos/esterilizacao/PesquisarEsterilizacao/index.tsx'
import {DiarioDeOcorrencias} from "@pages/por-grupo/enfermagem/ocorrencias"
import { Complemento } from '@/pages/por-grupo/tecnico-cme/cruds/complemento/index.tsx'
import { Distribuicao } from '@/pages/por-grupo/tecnico-cme/processos/distribuicao/index.tsx'
import { PesquisarDistribuicao } from '@/pages/por-grupo/tecnico-cme/processos/distribuicao/PesquisarDistribuicao/index.tsx'
import { Seriais } from '@/pages/por-grupo/administrativo/cruds/seriais/index.tsx'
import { Usuario } from '@/pages/por-grupo/administrativo/cruds/usuarios/index.tsx'
import { TipoOcorrencia } from '@/pages/por-grupo/enfermagem/indicadores/index.tsx'
import { RelatorioProcessos } from '@/pages/por-grupo/gerente/relatorio-processos/index.tsx'
import { RelatorioOcorrencias } from '@/pages/por-grupo/gerente/relatorios-ocorrencias/index.tsx'
import { RelatorioEficiencia } from '@/pages/por-grupo/gerente/relatorio-eficiencia/index.tsx'
import { RelatorioMateriais } from '@/pages/por-grupo/gerente/relatorio-materiais/index.tsx'
import { RelatorioManutencoes } from '@/pages/por-grupo/gerente/relatorio-manutencoes/index.tsx'
import { HistoricoSeriais } from '@/pages/por-grupo/administrativo/cruds/seriais/HistoricoSeriais/index.tsx'
import { RelatorioProducaoMensal } from '@/pages/por-grupo/gerente/relatorio-producao-mensal/index.tsx'
import {NotFound} from "@pages/general/NotFound/NotFound.tsx"
import { Indicadores } from '@/pages/por-grupo/administrativo/cruds/indicadores/index.tsx'
import { PesquisarTestes } from '@/pages/por-grupo/tecnico-cme/processos/esterilizacao/PesquisarTestes/index.tsx'

export function Router() {
	return (
		<Routes>
			<Route
				path={RoutersPathName.Login}
				element={<Login/>}
			/>

			<Route
				path="/"
				element={
					<RequireAuth>
						<Layout/>
					</RequireAuth>
				}
			>
				<Route
					path={RoutersPathName.Home}
					element={<Home/>}
				/>

				<Route
					path={RoutersPathName.SolicitacoesEntregaColeta}
					element={<InProgressDriver/>}
				/>
				<Route
					path={RoutersPathName.GerenciarSolicitacoesEntregaColeta}
					element={<GerenciarMotoristaColetaEntrega/>}
				/>
				<Route path="*"  element={<NotFound/>}/>
				<Route
					path={RoutersPathName.DemandasCliente}
					element={<DemandasPorClientes/>}
				/>
				<Route
					path={RoutersPathName.DemandasEmAndamento}
					element={<DemandasEmProgresso/>}
				/>
				<Route
					path={RoutersPathName.NovoCliente}
					element={<NovoCliente/>}
				/>

				<Route
					path={RoutersPathName.NovoUsuarioCliente}
					element={<UsuarioCliente/>}
				/>

				<Route
					path={RoutersPathName.Recebimento}
					element={<Recebimento/>}
				/>
				<Route
					path={RoutersPathName.PesquisarRecebimentos}
					element={<PesquisarRecebimentos/>}
				/>
				<Route
					path={RoutersPathName.Termo}
					element={<Termo/>}
				/>
				<Route
					path={RoutersPathName.Producao}
					element={<Producao/>}
				/>
				<Route
					path={RoutersPathName.PesquisarProducoes}
					element={<PesquisarProducoes/>}
				/>
				<Route
					path={RoutersPathName.Producao}
					element={<Producao/>}
				/>
				<Route
					path={RoutersPathName.PesquisarProducoes}
					element={<PesquisarProducoes/>}
				/>

				<Route
					path={RoutersPathName.Esterilizacao}
					element={<Esterilizacao/>}
				/>
				<Route
					path={RoutersPathName.PesquisarEsterilizacoes}
					element={<PesquisarEsterilizacao/>}
				/>
				<Route
					path={RoutersPathName.PesquisarTestes}
					element={<PesquisarTestes/>}
				/>
				<Route
					path={RoutersPathName.Distribuicao}
					element={<Distribuicao/>}
				/>
				<Route
					path={RoutersPathName.PesquisarDistribuicao}
					element={<PesquisarDistribuicao/>}
				/>
				<Route
					path={RoutersPathName.Caixa}
					element={<NovaCaixa/>}
				/>
				<Route
					path={RoutersPathName.NovoVeiculo}
					element={<Veiculos/>}
				/>
				<Route
					path={RoutersPathName.NovoMotorista}
					element={<NewDriver/>}
				/>
				<Route
					path={RoutersPathName.DemandasPendentes}
					element={<PendingDemands/>}
				/>
				<Route
					path={RoutersPathName.DemandasEntregues}
					element={<DemandsDelivered/>}
				/>

				<Route
					path={RoutersPathName.Solicitacoes}
					element={<SterizationRequest/>}
				/>
				<Route
					path={RoutersPathName.SolicitacoesHome}
					element={<AreaAdministrativa/>}
				/>
				<Route
					path={RoutersPathName.TipoDeProduto}
					element={<TipoProduto/>}
				/>

				<Route
					path={RoutersPathName.Produto}
					element={<Product/>}
				/>

				<Route
					path={RoutersPathName.Indicadores}
					element={<Indicadores />}
				/>

				<Route
					path={RoutersPathName.SubTipoDeProduto}
					element={<SubTipoProduto/>}
				/>

				<Route
					path={RoutersPathName.Embalagens}
					element={<Embalagem/>}
				/>
				<Route
					path={RoutersPathName.Setor}
					element={<Setor/>}
				/>

				<Route
					path={RoutersPathName.Profissao}
					element={<Profissao/>}
				/>

				<Route
					path={RoutersPathName.TipoDeCaixa}
					element={<TipoCaixa/>}
				/>

				<Route
					path={RoutersPathName.Equipamentos}
					element={<EquipamentosPage/>}
				/>

				<Route
					path={RoutersPathName.GestaoInformacoesPessoais}
					element={<GestaoInformacoesPessoais/>}
				/>

				<Route
					path={RoutersPathName.GestaoInformacoesPessoaisConta}
					element={<Conta/>}
				/>
				<Route
					path={RoutersPathName.PesquisarTermos}
					element={<PesquisarTermo/>}
				/>
				<Route
					path={RoutersPathName.GestaoInformacoesPessoaisAlterarSenha}
					element={<AlterarSenha/>}
				/>

				<Route
					path={RoutersPathName.Plantao}
					element={<Plantao/>}
				/>

				<Route
					path={RoutersPathName.PlantaoSupervisor}
					element={<PlantaoSupervisor/>}
				/>

				<Route
					path={RoutersPathName.RelatoriosPlantao}
					element={<RelatorioPlantao/>}
				/>

				<Route
					path={RoutersPathName.Etiquetas}
					element={<Etiquetas/>}
				/>

				<Route
					path={RoutersPathName.Complementos}
					element={<Complemento/>}
				/>

				<Route
					path={RoutersPathName.DiarioDeOcorrencias}
					element={<DiarioDeOcorrencias/>}
				/>
				<Route
					path={RoutersPathName.TipoDeOcorrencia}
					element={<TipoOcorrencia />}
				/>
				<Route
					path={RoutersPathName.Seriais}
					element={<Seriais/>}
				/>
				<Route
					path={RoutersPathName.HistoricoSeriais}
					element={<HistoricoSeriais />}
				/>
				<Route
					path={RoutersPathName.NovoUsuario}
					element={<Usuario/>}
				/>
				<Route
					path={RoutersPathName.RelatorioIndicadoresDeProdutividade}
					element={<RelatorioProcessos />}
				/>
				<Route
					path={RoutersPathName.RelatorioTipoOcorrencia}
					element={<RelatorioOcorrencias />}
				/>
				<Route
					path={RoutersPathName.RelatorioEficiencia}
					element={<RelatorioEficiencia />}
				/>
				<Route
					path={RoutersPathName.RelatorioMateriais}
					element={<RelatorioMateriais />}
				/>

				<Route
				 	path={RoutersPathName.RelatorioManutencao}
					element={<RelatorioManutencoes />}
				/>

				<Route
				 	path={RoutersPathName.RelatorioProducaoMensal}
					element={<RelatorioProducaoMensal />}
				/>

			</Route>
		</Routes>
	)
}
