from django.test import TestCase

from common.models import Subtipoproduto
from common.serializers import SubTipoProdutoSerializer
from common.tests.factories import SubtipoprodutoFactory


class SubTipoProdutoSerializerTest(TestCase):
    def setUp(self):
        self.data = {"descricao": "SubTipoProduto 1"}
        self.subtipo = SubtipoprodutoFactory()

    def test_valid_data(self):
        serializer = SubTipoProdutoSerializer(data=self.data)
        self.assertTrue(serializer.is_valid())

    def test_invalid_data(self):
        """Testa erro na restrição de unicidade da descrição."""
        data = {"descricao": self.subtipo.descricao}
        serializer = SubTipoProdutoSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertEqual(
            "Já existe subtipo do produto com essa descrição.",
            str(serializer.errors["descricao"][0]),
        )

    def test_create_instance(self):
        serializer = SubTipoProdutoSerializer(data=self.data)
        self.assertTrue(serializer.is_valid())
        instance = serializer.save()
        self.assertIsInstance(instance, Subtipoproduto)

    def test_to_representation_method(self):
        instance = SubtipoprodutoFactory()

        serializer = SubTipoProdutoSerializer(instance=instance)

        representation = serializer.to_representation(instance)

        self.assertIn("descricao", representation)
