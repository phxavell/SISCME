from django.test import TestCase

from common.serializers import ProfissaoSerializer


class ProfissaoSerializerTest(TestCase):
    def setUp(self):
        self.data = {"descricao": "Profissao 1"}

    def test_valid_data(self):
        serializer = ProfissaoSerializer(data=self.data)

        self.assertTrue(serializer.is_valid())

    def test_invalid_data(self):
        data = {"a": "b"}
        serializer = ProfissaoSerializer(data=data)
        self.assertFalse(serializer.is_valid())
