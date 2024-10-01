from django.test import TestCase

from common.models import Usuario
from common.serializers import SerializacaoUsuario
from common.tests.factories import ProfissionalFactory


class ProfissaoSerializerTest(TestCase):
    def setUp(self):
        self.profissional = ProfissionalFactory()
        self.data = {
            "idusu": 10,
            "apelidousu": "usuario",
            "ativo": True,
            "idprofissional": self.profissional.pk,
            "senhausu": "password",
        }

    def test_valid_data(self):
        serializer = SerializacaoUsuario(data=self.data)
        self.assertTrue(serializer.is_valid())

    def test_invalid_data(self):
        data = {"a": "b"}
        serializer = SerializacaoUsuario(data=data)

        self.assertFalse(serializer.is_valid())
        self.assertEqual(
            serializer.errors["apelidousu"][0], "Este campo é obrigatório."
        )
        self.assertEqual(
            serializer.errors["ativo"][0], "Este campo é obrigatório."
        )
        self.assertEqual(
            serializer.errors["idprofissional"][0], "Este campo é obrigatório."
        )
        self.assertEqual(
            serializer.errors["senhausu"][0], "Este campo é obrigatório."
        )

    def test_create(self):
        serializer = SerializacaoUsuario(data=self.data)
        self.assertTrue(serializer.is_valid())
        instance = serializer.save()
        self.assertIsInstance(instance, Usuario)
