from django.test import TestCase

from common.serializers import LoteIndicadorEsterilizacaoSerializer
from common.tests.factories import IndicadoresEsterilizacaoFactory


class LoteIndicadorEsterilizacaoSerializerTest(TestCase):
    def setUp(self):
        self.indicador = IndicadoresEsterilizacaoFactory()
        self.data = {
            "codigo": "Lote 1",
            "saldo": 0,
            "fabricacao": "2024-03-10",
            "vencimento": "2025-03-10",
            "indicador": self.indicador.pk,
        }

    def test_valid_data(self):
        serializer = LoteIndicadorEsterilizacaoSerializer(data=self.data)
        self.assertTrue(serializer.is_valid())

    def test_invalid_data(self):
        data = {"a": "b"}
        serializer = LoteIndicadorEsterilizacaoSerializer(data=data)
        self.assertFalse(serializer.is_valid())
