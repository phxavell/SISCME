from django.test import TestCase

from common.serializers import CaixasRecebidasSerializer
from common.tests.factories import EventoFactory, EventoRecebimentoFactory


class CaixasRecebidasSerializerTestCase(TestCase):
    def setUp(self):
        self.evento = EventoFactory()
        self.evento_recebimento = EventoRecebimentoFactory()

    def test_get_status(self):
        serializer = CaixasRecebidasSerializer()
        result = serializer.get_status(self.evento_recebimento)
        self.assertEqual(
            result, self.evento_recebimento.idrecebimento.statusrecebimento
        )

    def test_get_status_abortado(self):
        serializer = CaixasRecebidasSerializer()
        result = serializer.get_status(self.evento)
        self.assertEqual(result, "ABORTADO")

    def test_get_recebimento(self):
        serializer = CaixasRecebidasSerializer()
        result = serializer.get_recebimento(self.evento_recebimento)
        self.assertEqual(
            result, self.evento_recebimento.idrecebimento.idrecebimento
        )

    def test_get_recebimento_none(self):
        serializer = CaixasRecebidasSerializer()
        result = serializer.get_recebimento(self.evento)
        self.assertEqual(result, None)
