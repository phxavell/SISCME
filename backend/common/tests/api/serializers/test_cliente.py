from django.test import TestCase

from common.models import Cliente
from common.serializers import ClienteSerializer
from common.tests.factories import ClienteFactory


class ClienteSerializerTest(TestCase):
    def setUp(self):
        self.data = {
            "nomeabreviado": "Empresa 1",
            "nomecli": "Empresa Legal",
            "cnpjcli": "36.357.439/0001-13",
            "cepcli": "69921-286",
            "emailcli": "empresa@email.com",
            "telefonecli": "(92)98763-2221",
            "nomefantasiacli": "Nome fantasia",
            "inscricaoestadualcli": "123",
            "inscricaomunicipalcli": "456",
        }

    def test_valid_data(self):
        serializer = ClienteSerializer(data=self.data)
        self.assertTrue(serializer.is_valid())

    def test_invalid_data(self):
        data = {
            "nomeabreviado": "Empresa 2",
            "nomecli": "Empresa Ilegal 2",
            "cnpjcli": "36.357.439/000113",
            "cepcli": "69921286",
            "emailcli": "empresaemail.com",
            "telefonecli": "(92)987632221",
            "inscricaoestadualcli": "abc",
            "inscricaomunicipalcli": "efg",
        }

        serializer = ClienteSerializer(data=data)

        self.assertFalse(serializer.is_valid())

        self.assertEqual(
            "O CNPJ deve estar no formato XX.XXX.XXX/YYYY-ZZ.",
            str(serializer.errors["cnpjcli"][0]),
        )
        self.assertEqual(
            "O CEP deve estar no formato XXXXX-XXX.",
            str(serializer.errors["cepcli"][0]),
        )
        self.assertEqual(
            "Digite um endereço de e-mail válido.",
            str(serializer.errors["emailcli"][0]),
        )
        self.assertEqual(
            (
                "Digite um número de telefone válido no formato "
                "(XX)XXXX-XXXX ou (XX)XXXXX-XXXX."
            ),
            str(serializer.errors["telefonecli"][0]),
        )
        self.assertEqual(
            "A inscrição estadual deve conter apenas números.",
            str(serializer.errors["inscricaoestadualcli"][0]),
        )
        self.assertEqual(
            "A inscrição municipal deve conter apenas números.",
            str(serializer.errors["inscricaomunicipalcli"][0]),
        )

    def test_create_instance(self):
        serializer = ClienteSerializer(data=self.data)
        self.assertTrue(serializer.is_valid())
        instance = serializer.save()
        self.assertIsInstance(instance, Cliente)

    def test_to_representation_method(self):
        cliente_instance = ClienteFactory(datacadastrocli="2023-10-10")

        serializer = ClienteSerializer(instance=cliente_instance)

        representation = serializer.to_representation(cliente_instance)

        self.assertIn("nomefantasiacli", representation)
