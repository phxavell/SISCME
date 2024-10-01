from django.test import TestCase
from django.urls import reverse

from common.models import Profissao
from common.serializers import SerializacaoMotorista
from common.tests.factories import (
    ClienteFactory,
    ProfissionalFactory,
    UsuarioFactory,
)
from rest_framework.test import APIRequestFactory
from rest_framework.validators import ValidationError


# TODO: Refatorar serializer de profissional para validar permissão para
# requisição put na view invés de acessar o dict de contexto no serializer.
# - Apos refatorar criar respectivos testes de serializer e views, pois por
# conta do cenario acima não esta sendo possivel testar as duas camadas separadas.
class SerializacaoMotoristaTest(TestCase):
    def setUp(self):
        self.url = reverse("motorista-list")
        self.factory = APIRequestFactory()
        self.profissao = Profissao.objects.get(descricao="MOTORISTA")
        self.profissional = ProfissionalFactory(idprofissao=self.profissao)
        self.usuario = UsuarioFactory(idprofissional=self.profissional)
        self.cliente = ClienteFactory()

    def test_payload_valido(self):
        data: dict = {
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
            "cliente": self.cliente.idcli,
        }

        request = self.factory.post(self.url, data=data)
        serializer = SerializacaoMotorista(
            data=data, context={"request": request}
        )
        self.assertTrue(serializer.is_valid())

    def test_payload_invalido(self):
        # payload sem id profissao
        data: dict = {
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
            "cliente": self.cliente.idcli,
        }

        request = self.factory.post(self.url, data=data)
        serializer = SerializacaoMotorista(
            data=data, context={"request": request}
        )
        self.assertFalse(serializer.is_valid())

    def test_validate_error_message_profissao_fk(self):
        try:
            data: dict = {
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
                "cliente": self.cliente.idcli,
            }

            request = self.factory.post(self.url, data=data)
            serializer = SerializacaoMotorista(
                data=data, context={"request": request}
            )
            serializer.is_valid(raise_exception=True)
        except ValidationError as e:
            self.assertEqual(
                e.detail["idprofissao"][0], "Este campo é obrigatório."
            )
