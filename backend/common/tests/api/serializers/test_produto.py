from django.test import TestCase

from common.models import Produto
from common.serializers import ProdutoSerializer
from common.tests.factories import (
    ProdutoFactory,
    SubtipoprodutoFactory,
    TipopacoteFactory,
)


class ProdutoSerializerTest(TestCase):
    def setUp(self):
        self.subtipo = SubtipoprodutoFactory()
        self.tipo = TipopacoteFactory()
        self.produto = ProdutoFactory()
        self.data = {
            "descricao": "Produto 1",
            "embalagem": "Embalagem 1",
            "status": "ATIVO",
            "idsubtipoproduto": self.tipo.pk,
            "idtipopacote": self.tipo.pk,
        }
        self.subtipo = ProdutoFactory()

    def test_valid_data(self):
        serializer = ProdutoSerializer(data=self.data)
        self.assertTrue(serializer.is_valid())

    def test_invalid_data(self):
        """Testa erro na restrição de unicidade da descrição."""
        data = {"descricao": self.produto.descricao}
        serializer = ProdutoSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertEqual(
            "Já existe produto com essa descrição.",
            str(serializer.errors["descricao"][0]),
        )

    def test_create_instance(self):
        serializer = ProdutoSerializer(data=self.data)
        self.assertTrue(serializer.is_valid())
        instance = serializer.save()
        self.assertIsInstance(instance, Produto)

    def test_to_representation_method(self):
        instance = ProdutoFactory()

        serializer = ProdutoSerializer(instance=instance)

        representation = serializer.to_representation(instance)

        self.assertIn("descricao", representation)
