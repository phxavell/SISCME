from django.test import TestCase

from common.serializers import SerializacaoUser
from common.tests.factories import ProfissionalFactory, UserFactory


class ProdutoSerializerTest(TestCase):
    def setUp(self):
        self.profissional = ProfissionalFactory()
        self.data = {
            "email": "user@email.com",
            "is_staff": False,
            "is_active": True,
            "username": "username",
            "idprofissional": self.profissional.pk,
            "password": "123",
        }

    def test_valid_data(self):
        serializer = SerializacaoUser(data=self.data)
        self.assertTrue(serializer.is_valid())

    def test_to_representation_method(self):
        instance = UserFactory()
        serializer = SerializacaoUser(instance=instance)
        representation = serializer.to_representation(instance)
        self.assertIn("email", representation)
