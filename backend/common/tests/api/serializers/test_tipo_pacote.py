from django.test import TestCase

from common.models import Tipopacote
from common.serializers import TipoPacoteSerializer
from common.tests.factories import TipopacoteFactory


class TipoPacoteSerializerTest(TestCase):
    def setUp(self):
        self.data = {"descricao": "Tipopacote 1"}
        self.tipopacote = TipopacoteFactory()

    def test_valid_data(self):
        serializer = TipoPacoteSerializer(data=self.data)

        self.assertTrue(serializer.is_valid())

    def test_invalid_data(self):
        """Testa erro na restrição de unicidade da descrição."""
        data = {"descricao": self.tipopacote.descricao}
        serializer = TipoPacoteSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertEqual(
            "Já existe um tipo de pacote com essa descrição.",
            str(serializer.errors["descricao"][0]),
        )

    def test_create_instance(self):
        serializer = TipoPacoteSerializer(data=self.data)
        self.assertTrue(serializer.is_valid())
        instance = serializer.save()
        self.assertIsInstance(instance, Tipopacote)

    def test_to_representation_method(self):
        instance = TipopacoteFactory()

        serializer = TipoPacoteSerializer(instance=instance)

        representation = serializer.to_representation(instance)

        self.assertIn("descricao", representation)
