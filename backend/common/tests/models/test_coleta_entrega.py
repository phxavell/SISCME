from django.core.exceptions import ValidationError
from django.test import TestCase

from common.enums import ColetaEntregaSituacaoEnum
from common.models import Coleta, ColetaEntregaModel, Entrega
from common.tests.factories import (
    ColetaEntregaFactory,
    ColetaFactory,
    EntregaFactory,
)


class ColetaEntregaModelTestCase(TestCase):
    def setUp(self):
        self.coleta_entrega = ColetaEntregaFactory()

    def test_coleta_entrega_creation(self):
        self.assertIsInstance(self.coleta_entrega, ColetaEntregaModel)

    def test_coleta_entrega_solicitacao_relationship(self):
        self.assertIsNotNone(self.coleta_entrega.solicitacao_esterilizacao)

    def test_coleta_entrega_motorista_relationship(self):
        self.assertIsNotNone(self.coleta_entrega.motorista)

    def test_coleta_entrega_veiculo_relationship(self):
        self.assertIsNotNone(self.coleta_entrega.veiculo)

    def test_default_retorno_value(self):
        self.assertEqual(self.coleta_entrega.retorno, False)

    def test_is_pendente(self):
        self.assertEqual(self.coleta_entrega.is_pendente, True)

    def test_is_iniciado(self):
        self.coleta_entrega.alterar_status(
            ColetaEntregaSituacaoEnum.EM_ANDAMENTO
        )
        self.assertEqual(self.coleta_entrega.is_iniciado, True)

    def test_is_finalizado(self):
        self.coleta_entrega.alterar_status(
            ColetaEntregaSituacaoEnum.FINALIZADO
        )
        self.assertEqual(self.coleta_entrega.is_finalizado, True)

    def test_alterar_status(self):
        with self.assertRaises(ValidationError):
            self.coleta_entrega.alterar_status("OUTRO")

    def test_iniciar(self):
        self.coleta_entrega.alterar_status(
            ColetaEntregaSituacaoEnum.NAO_INICIADO
        )
        self.coleta_entrega.iniciar()
        self.assertEqual(
            self.coleta_entrega.situacao,
            ColetaEntregaSituacaoEnum.EM_ANDAMENTO,
        )
        with self.assertRaises(ValidationError):
            self.coleta_entrega.alterar_status(
                ColetaEntregaSituacaoEnum.FINALIZADO
            )
            self.coleta_entrega.iniciar()

    def test_finalizar(self):
        """Testa o método de finalização de uma coleta_entrega."""
        self.coleta_entrega.alterar_status(
            ColetaEntregaSituacaoEnum.EM_ANDAMENTO
        )
        self.coleta_entrega.finalizar()
        self.assertEqual(
            self.coleta_entrega.situacao, ColetaEntregaSituacaoEnum.FINALIZADO
        )
        with self.assertRaises(ValidationError):
            self.coleta_entrega.finalizar()


class ColetaTestCase(TestCase):
    def setUp(self):
        self.coleta = ColetaFactory()

    def test_coleta_creation(self):
        self.assertIsInstance(self.coleta, Coleta)
        self.assertIsInstance(self.coleta, ColetaEntregaModel)
        self.assertFalse(self.coleta.retorno)


class EntregaTestCase(TestCase):
    def setUp(self):
        self.entrega = EntregaFactory()

    def test_entrega_creation(self):
        self.assertIsInstance(self.entrega, Entrega)
        self.assertIsInstance(self.entrega, ColetaEntregaModel)
        self.assertTrue(self.entrega.retorno)


class ColetaEntregaManagerTestCase(TestCase):
    def setUp(self):
        self.coleta_entrega = ColetaEntregaFactory()

    def test_nao_iniciado(self):
        self.coleta_entrega.alterar_status(
            ColetaEntregaSituacaoEnum.NAO_INICIADO
        )
        self.assertEqual(ColetaEntregaModel.objects.nao_iniciado().count(), 1)

    def test_em_andamento(self):
        self.coleta_entrega.alterar_status(
            ColetaEntregaSituacaoEnum.EM_ANDAMENTO
        )
        self.assertEqual(ColetaEntregaModel.objects.em_andamento().count(), 1)

    def test_finalizado(self):
        self.coleta_entrega.alterar_status(
            ColetaEntregaSituacaoEnum.FINALIZADO
        )
        self.assertEqual(ColetaEntregaModel.objects.finalizado().count(), 1)
