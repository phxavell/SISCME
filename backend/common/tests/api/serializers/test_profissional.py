from django.test import TestCase
from django.urls import reverse

from common.models import Profissional
from common.serializers import SerializacaoProfissional
from common.tests.factories import (
    ClienteFactory,
    ProfissaoFactory,
    ProfissionalFactory,
)
from rest_framework.test import APIRequestFactory


class SerializacaoProfissionalTest(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.url = reverse("Cadastro-list")
        self.cliente = ClienteFactory()
        self.profissao = ProfissaoFactory()
        self.data = {
            "atrelado": "N",
            "contato": "(11)9876-5432",
            "cpf": "123.456.789-01",
            "dtadmissao": "2023-01-01",
            "dtcadastro": "2023-01-01",
            "dtnascimento": "1990-05-15T12:00:00",
            "email": "profissional@email.com",
            "matricula": "1234",
            "nome": "Dr. Ana Silva",
            "rt": "N",
            "sexo": "F",
            "status": "Ativo",
            "idprofissao": self.profissao.pk,
            "cliente": self.cliente.pk,
        }
        self.data_invalid = {
            "atrelado": "N",
            "contato": "(11)ABCD",
            "cpf": "123.456.789ABCD",
            "dtadmissao": "2023-01-01",
            "dtcadastro": "2023-01-01",
            "dtnascimento": "1990-05-15T12:00:00",
            "email": "ABCD",
            "matricula": "ABCD",
            "nome": "Dr. Ana Silva",
            "rt": "S",
            "sexo": "F",
            "status": "Ativo",
            "idprofissao": self.profissao.pk,
        }

    def test_valid_data(self):
        request = self.factory.post(self.url, data=self.data)
        serializer = SerializacaoProfissional(
            data=self.data, context={"request": request}
        )
        self.assertTrue(serializer.is_valid())

    def test_invalid_data(self):
        request = self.factory.post(self.url, data=self.data_invalid)
        serializer = SerializacaoProfissional(
            data=self.data_invalid, context={"request": request}
        )
        self.assertFalse(serializer.is_valid())

        self.assertEqual(
            "CPF deve seguir o formato XXX.XXX.XXX-XX.",
            str(serializer.errors["cpf"][0]),
        )
        self.assertEqual(
            "Digite um endereço de e-mail válido.",
            str(serializer.errors["email"][0]),
        )
        self.assertEqual(
            (
                "Digite um número de telefone válido no formato "
                "(XX)XXXX-XXXX ou (XX)XXXXX-XXXX."
            ),
            str(serializer.errors["contato"][0]),
        )

    def test_validate_matricula(self):
        request = self.factory.post(self.url, data=self.data_invalid)
        serializer = SerializacaoProfissional(
            data=self.data_invalid, context={"request": request}
        )
        self.assertFalse(serializer.is_valid())
        self.assertEqual(
            "A matrícula deve conter apenas números.",
            str(serializer.errors["matricula"][0]),
        )

    def test_create_instance(self):
        request = self.factory.post(self.url, data=self.data)
        serializer = SerializacaoProfissional(
            data=self.data, context={"request": request}
        )
        self.assertTrue(serializer.is_valid())
        instance = serializer.save()
        self.assertIsInstance(instance, Profissional)

    def test_to_representation_method(self):
        profissional_instance = ProfissionalFactory(
            dtadmissao="2000-10-10",
            dtcadastro="2000-10-10",
            dtnascimento="2000-10-10",
        )

        serializer = SerializacaoProfissional(instance=profissional_instance)
        representation = serializer.to_representation(profissional_instance)
        self.assertIn("cliente", representation)
        self.assertIn("profissao", representation)
        self.assertIsNot("idprofissao", representation)
