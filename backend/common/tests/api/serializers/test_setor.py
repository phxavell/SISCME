from django.test import TestCase

from common.serializers import SetorSerializer


class SetorSerializerTest(TestCase):
    def setUp(self):
        self.data = {"descricao": "Setor 1"}

    def test_valid_data(self):
        serializer = SetorSerializer(data=self.data)

        self.assertTrue(serializer.is_valid())

    def test_invalid_data(self):
        data = {"a": "b"}
        serializer = SetorSerializer(data=data)
        self.assertFalse(serializer.is_valid())
