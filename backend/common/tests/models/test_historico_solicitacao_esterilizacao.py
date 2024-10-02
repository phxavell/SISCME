from django.test import TestCase
from django.utils import timezone

from common.models import HistoricoSolicitacaoEsterilizacaoModel
from common.tests.factories import (
    HistoricoSolicitacaoFactory,
    SolicitacaoEsterilizacaoFactory,
)


class HistoricoSolicitacaoModelTestCase(TestCase):
    def setUp(self):
        self.historico = HistoricoSolicitacaoFactory()

    def test_criar_historico(self):
        self.assertIsNotNone(self.historico)

    def test_status_choices(self):
        """Verificar se o status do histórico pertence às
        escolhas definidas no modelo."""
        self.assertIn(
            self.historico.status,
            dict(HistoricoSolicitacaoEsterilizacaoModel.STATUS_CHOICES).keys(),
        )

    def test_status_pendente_por_padrao(self):
        """Verificar se o status padrão é 'PENDENTE'."""
        historico = HistoricoSolicitacaoEsterilizacaoModel.objects.create(
            solicitacao_esterilizacao=SolicitacaoEsterilizacaoFactory(),
            data=timezone.now(),
        )
        self.assertEqual(historico.status, "PENDENTE")

    def test_observacao_pode_ser_nula(self):
        """Verificar se a observação pode ser nula."""
        historico = HistoricoSolicitacaoEsterilizacaoModel.objects.create(
            solicitacao_esterilizacao=SolicitacaoEsterilizacaoFactory(),
            status="PRONTO",
            data=timezone.now(),
            observacao=None,
        )
        self.assertIsNone(historico.observacao)

    def test_db_table(self):
        """Verificar se o nome da tabela do banco de dados
        está configurado corretamente."""
        self.assertEqual(
            HistoricoSolicitacaoEsterilizacaoModel._meta.db_table,
            "historico_solicitacao_esterilizacao",
        )

    def test_verbose_name(self):
        """Verificar se o nome verbose está configurado corretamente."""
        self.assertEqual(
            HistoricoSolicitacaoEsterilizacaoModel._meta.verbose_name,
            "Histórico de Solicitação de Esterilização",
        )

    def test_verbose_name_plural(self):
        """Verificar se o nome verbose no plural está configurado corretamente."""
        self.assertEqual(
            HistoricoSolicitacaoEsterilizacaoModel._meta.verbose_name_plural,
            "Históricos de Solicitação de Esterilização",
        )
