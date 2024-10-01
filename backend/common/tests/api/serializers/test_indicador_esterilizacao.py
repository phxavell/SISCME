from django.test import TestCase

from common.enums import TipoIntegradorEnum
from common.models import IndicadoresEsterilizacao
from common.serializers import IndicadorEsterilizacaoSerializer
from common.tests.factories import IndicadoresEsterilizacaoFactory


class ProdutoSerializerTest(TestCase):
    def setUp(self):
        self.indicador = IndicadoresEsterilizacaoFactory()
        self.data = {
            "codigo": "ABC123",
            "descricao": "Produto 1",
            "embalagem": "Indicadores",
            "status": "1",
            "situacao": True,
            "fabricante": "Bioplus",
            "saldo": 0,
            "tipo": TipoIntegradorEnum.C5,
        }

    def test_valid_data(self):
        serializer = IndicadorEsterilizacaoSerializer(data=self.data)
        self.assertTrue(serializer.is_valid())

    def test_invalid_data(self):
        """Testa erro na obrigatoriedade de código, descricao e tipo de indicador."""
        data = {
            "descricao": None,
            "codigo": None,
            "tipo": None,
        }
        serializer = IndicadorEsterilizacaoSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        for _ in serializer.errors:
            errors = serializer.errors[_]
            self.assertEqual("Este campo não pode ser nulo.", errors[0])

    def test_create_instance(self):
        serializer = IndicadorEsterilizacaoSerializer(data=self.data)
        self.assertTrue(serializer.is_valid())
        instance = serializer.save()
        self.assertIsInstance(instance, IndicadoresEsterilizacao)
