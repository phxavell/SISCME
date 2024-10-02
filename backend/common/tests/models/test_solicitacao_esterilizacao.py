# pylint: disable=too-many-public-methods
from django.core.exceptions import ValidationError
from django.db.utils import IntegrityError
from django.test import TestCase

from common.models import (
    HistoricoSolicitacaoEsterilizacaoModel,
    SolicitacaoEsterilizacaoModel,
)
from common.tests.factories import (
    RecebimentoFactory,
    SolicitacaoEsterilizacaoFactory,
)


class SolicitacaoEsterilizacaoModelTestCase(TestCase):
    def setUp(self):
        self.solicitacao = SolicitacaoEsterilizacaoFactory()

    def test_criar_solicitacao(self):
        """Teste a instanciação de uma solicitação de esterilização."""
        self.assertIsNotNone(self.solicitacao)

    def test_error_create_without_required_fields(self):
        """Teste erro ao criar uma solicitação de esterilização sem os
        campos obrigatórios."""
        with self.assertRaises(IntegrityError):
            SolicitacaoEsterilizacaoFactory(cliente=None, situacao=None)

    def test_fk_cliente(self):
        """Teste a associação da chave estrangeira para o campo Cliente."""
        self.assertEqual(
            self.solicitacao.cliente.__class__.__name__, "Cliente"
        )

    def test_em_andamento(self):
        """Testa a mudança da situação da solicitação para em_andamento."""
        self.assertEqual(self.solicitacao.em_andamento, True)

    def test_pode_ser_cancelada(self):
        """Testa se a solicitação pode ser cancelada."""
        self.assertEqual(self.solicitacao.pode_ser_cancelada, True)

    def test_cancelar_sucess(self):
        """Testa a mudança da situação da solicitação para 'CANCELADO'."""
        self.solicitacao.cancelar()
        self.assertEqual(self.solicitacao.situacao, "CANCELADO")

    def test_cancelar_error(self):
        """Testa erro ao mudar da situação da solicitação para 'CANCELADO'
        caso a solicitação já esteja cancelada."""
        self.solicitacao.situacao = "CANCELADO"
        with self.assertRaises(ValidationError):
            self.solicitacao.cancelar()

    def test_is_pendente(self):
        """Testa a checagem da solicitação com situação PENDENTE."""
        self.assertEqual(self.solicitacao.is_pendente, True)

    def test_iniciar_transporte(self):
        """Testa o método para iniciar o transporte."""
        self.solicitacao.iniciar_transporte()
        self.solicitacao.save()
        self.assertEqual(self.solicitacao.situacao, "TRANSPORTE")

    def test_iniciar_processamento(self):
        """Testa o método para iniciar o processamento."""
        self.solicitacao.iniciar_processamento()
        self.solicitacao.save()
        self.assertEqual(self.solicitacao.situacao, "PROCESSANDO")

    def test_finalizar_processamento(self):
        """Testa o método para finalizar o processamento."""
        self.solicitacao.finalizar_processamento()
        self.solicitacao.save()
        self.assertEqual(self.solicitacao.situacao, "PRONTO")

    def test_finalizar_entrega(self):
        """Testa o método para iniciar a entrega."""
        self.solicitacao.finalizar_entrega()
        self.solicitacao.save()
        self.assertEqual(self.solicitacao.situacao, "ENTREGUE")

    def test_is_cancelada(self):
        """Testa o método que verifica se a solicitação está cancelada."""
        self.solicitacao.situacao = (
            SolicitacaoEsterilizacaoModel.STATUS_CHOICES[4][0]
        )
        self.assertEqual(self.solicitacao.is_cancelada, True)

    def test_is_processando(self):
        """Testa o método que verifica se a solicitação está PROCESSANDO."""
        self.solicitacao.situacao = (
            SolicitacaoEsterilizacaoModel.STATUS_CHOICES[1][0]
        )
        self.assertEqual(self.solicitacao.is_processando, True)

    def test_em_arsenal(self):
        """Testa o método que verifica se a solicitação está EM_ARSENAL."""
        self.solicitacao.situacao = (
            SolicitacaoEsterilizacaoModel.STATUS_CHOICES[2][0]
        )
        self.assertEqual(self.solicitacao.em_arsenal, True)

    def test_em_transporte(self):
        """Testa o método que verifica se a solicitação está EM_TRANSPORTE."""
        self.solicitacao.situacao = (
            SolicitacaoEsterilizacaoModel.STATUS_CHOICES[5][0]
        )
        self.assertEqual(self.solicitacao.em_transporte, True)

    def test_is_entregue(self):
        """Testa o método que verifica se a solicitação está ENTREGUE."""
        self.solicitacao.situacao = (
            SolicitacaoEsterilizacaoModel.STATUS_CHOICES[3][0]
        )
        self.assertEqual(self.solicitacao.is_entregue, True)

    def test_alterar_status_success(self):
        """Testa a alteração do status com sucesso."""
        novo_status = "PENDENTE"
        self.solicitacao.alterar_status(novo_status)
        self.assertEqual(self.solicitacao.situacao, novo_status)

    def test_alterar_status_error(self):
        """Testa erro ao tentar adicionar uma situação não mapeada."""
        novo_status = "OUTRO"
        with self.assertRaises(ValidationError):
            self.solicitacao.alterar_status(novo_status)

    def test_current_recebimento(self):
        """Crie um recebimento com status 'AGUARDANDO_CONFERENCIA' e
        'EM_CONFERENCIA' e verifique se é retornado corretamente"""
        recebimento_aguardando = RecebimentoFactory(
            solicitacao_esterilizacao_id=self.solicitacao,
            statusrecebimento="AGUARDANDO_CONFERENCIA",
        )
        self.assertEqual(
            self.solicitacao.current_recebimento, recebimento_aguardando
        )
        recebimento_em_conferencia = RecebimentoFactory(
            solicitacao_esterilizacao_id=self.solicitacao,
            statusrecebimento="EM_CONFERENCIA",
        )
        self.assertEqual(
            self.solicitacao.current_recebimento, recebimento_em_conferencia
        )

    def test_create_historico_on_save(self):
        """Salva a solicitação, o que deve acionar a criação do histórico.
        Testa os campos do histórico."""
        self.solicitacao.save()
        historico = HistoricoSolicitacaoEsterilizacaoModel.objects.first()
        self.assertIsNotNone(historico)
        self.assertEqual(historico.solicitacao_esterilizacao, self.solicitacao)
        self.assertEqual(historico.status, self.solicitacao.situacao)
        self.assertEqual(historico.data, self.solicitacao.created_at)
        self.assertEqual(historico.observacao, self.solicitacao.observacao)

    def test_db_table(self):
        """Verificar se o nome da tabela do banco de dados
        está configurado corretamente."""
        self.assertEqual(
            SolicitacaoEsterilizacaoModel._meta.db_table,
            "solicitacao_esterilizacao",
        )

    def test_verbose_name(self):
        """Verificar se o nome verbose está configurado corretamente."""
        self.assertEqual(
            SolicitacaoEsterilizacaoModel._meta.verbose_name,
            "Solicitação de Esterilização",
        )

    def test_verbose_name_plural(self):
        """Verificar se o nome verbose no plural está configurado corretamente."""
        self.assertEqual(
            SolicitacaoEsterilizacaoModel._meta.verbose_name_plural,
            "Solicitações de Esterilização",
        )
