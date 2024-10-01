# pylint: disable=too-many-instance-attributes
from django.urls import reverse

from common.models import Profissional
from common.tests.factories import (
    ClienteFactory,
    ProfissaoFactory,
    ProfissionalFactory,
    UserFactory,
)
from rest_framework import status
from rest_framework.test import APITestCase


class CadastroUsuarioProfissionalViewSetTest(APITestCase):
    def setUp(self):
        self.user = UserFactory()
        self.user_atualizado = UserFactory()
        self.profissional_demitido = ProfissionalFactory(status="DEMITIDO")
        self.user_demitido = UserFactory(
            idprofissional=self.profissional_demitido
        )
        self.user.is_superuser = True
        self.url = reverse("Cadastro-list")
        self.cliente = ClienteFactory()
        self.profissao = ProfissaoFactory()
        self.profissional = ProfissionalFactory(
            cliente=self.cliente,
            dtadmissao="2000-10-10",
            dtcadastro="2000-10-10",
            dtnascimento="2000-10-10",
        )
        self.profissional_2 = ProfissaoFactory()
        self.request_data = {
            "Profissional": {
                "matricula": "123456",
                "cpf": "276.330.291-81",
                "contato": "(57)5440-7623",
                "email": "usuario@example.com",
                "atrelado": "s",
                "coren": "789012",
                "dtadmissao": "2023-01-15",
                "dtcadastro": "2024-04-26",
                "dtdesligamento": None,
                "dtnascimento": "1980-05-20T00:00:00.000Z",
                "nome": "João da Silva",
                "rt": "N",
                "sexo": "M",
                "status": "Ativo",
                "idprofissao": self.profissao.id,
                "cliente": self.cliente.idcli,
            },
            "Usuario": {
                "apelidousu": "joaosilva",
                "ativo": True,
                "username": "tiao",
                # "idprofissional": 1,
                "senhausu": "senha123",
            },
        }

    def test_user_not_authenticated(self):
        """Testa o acesso negado para usuários não autenticados."""
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_create_profissional_success(self):
        """Testa a criação de um profissional com sucesso."""
        self.client.force_authenticate(user=self.user)
        response = self.client.post(
            self.url, data=self.request_data, format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        profissional_criado = Profissional.objects.get(
            nome=self.request_data["Profissional"]["nome"]
        )
        self.assertEqual(
            profissional_criado.nome, self.request_data["Profissional"]["nome"]
        )

    def test_create_profissional_error(self):
        """Testa erro na criação do profissional com dados já cadastrados."""
        data_error = {
            "Profissional": {
                "cpf": self.profissional.cpf,
                "nome": self.profissional.nome,
                "matricula": self.profissional.matricula,
                "coren": self.profissional.coren,
                "dtnascimento": "2000-02-03",
                "dtadmissao": "2024-01-03",
                "email": self.profissional.email,
                "contato": "(56)54451-2541",
                "sexo": "M",
                "idprofissao": self.profissao.pk,
            },
            "Usuario": {
                "apelidousu": "joao@machado.com",
                "ativo": True,
                "senhausu": "joao@machado.com",
            },
        }
        self.client.force_authenticate(user=self.user)
        response = self.client.post(self.url, data=data_error, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_list_profissional_success(self):
        """Testa a listagem de profissionais com sucesso."""
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_retrieve_profissional_success(self):
        """Testa a conculta de um profissional com sucesso."""
        self.client.force_authenticate(user=self.user)
        response = self.client.get(f"{self.url}{self.user.id}/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data["idprofissional"],
            self.user.idprofissional.idprofissional,
        )

    def test_retrieve_profissional_error(self):
        """Testa a erro na consulta de um profissional."""
        self.client.force_authenticate(user=self.user)
        response = self.client.get(f"{self.url}{100}/")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

        # testa erro para o usuário criado sem profissional vinculado
        user = UserFactory(idprofissional=None)
        response = self.client.get(f"{self.url}{user.id}/")
        self.assertEqual(
            response.data["error"]["code"], "usuario_nao_encontrado"
        )

    def test_update_profissional_success(self):
        """Testa a atualização de um profissional com sucesso."""
        data = {
            "cpf": "487.548.545-84",
            "nome": "Joao Machado Ferreira",
            "matricula": "6541",
            "coren": "5126",
            "dtnascimento": "2000-02-03",
            "dtadmissao": "2024-01-03",
            "email": "joao@machado.com",
            "contato": "(56)54451-2541",
            "sexo": "M",
            "idprofissao": 1,
            "grupos": [1, 2, 3],
        }
        self.client.force_authenticate(user=self.user)
        response = self.client.put(
            f"{self.url}{self.user.id}/", data=data, format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_profissional_error(self):
        """Testa erro na atualização de um profissional."""
        profissional = ProfissionalFactory(rt="S")
        data_error = {
            "cpf": self.profissional.cpf,
            "nome": self.profissional.nome,
            "matricula": self.profissional.matricula,
            "coren": self.profissional.coren,
            "rt": profissional.rt,
            "dtnascimento": "2000-02-03",
            "dtadmissao": "2024-01-03",
            "email": self.profissional.email,
            "contato": "(56)254451-2541",
            "sexo": "M",
            "idprofissao": self.profissao.pk,
        }
        self.client.force_authenticate(user=self.user)
        response = self.client.put(
            f"{self.url}{self.user_atualizado.id}/",
            data=data_error,
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        self.assertEqual(
            str(response.data["error"]["data"]["rt"][0]),
            f"Já existe um profissional responsável, {profissional.nome}.",
        )
        response = self.client.put(
            f"{self.url}100/", data=data_error, format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

        response = self.client.put(
            f"{self.url}1/", data=data_error, format="json"
        )
        self.assertEqual(
            response.data["error"]["message"],
            "Este usuário não pode ser editado.",
        )

        response = self.client.put(
            f"{self.url}{self.user_demitido.id}/",
            data=data_error,
            format="json",
        )
        self.assertEqual(
            response.data["error"]["message"],
            "Este profissional está desativado, não pode ser editado.",
        )

    def test_queryset_search(self):
        """Testa a pequisa de um clientes com os parametros:
        nome e cpf."""
        self.client.force_authenticate(user=self.user)
        response = self.client.get(
            f"{self.url}?nome={self.profissional.nome}",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data["data"][0]["nome"], self.profissional.nome
        )

        response = self.client.get(
            f"{self.url}?cpf={self.profissional.cpf}",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data["data"][0]["cpf"], self.profissional.cpf
        )

    def test_desativar_profissional_success(self):
        """Testa a desativação de um profissional com sucesso."""
        self.client.force_authenticate(user=self.user)
        response = self.client.patch(f"{self.url}{self.user.id}/desativar/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data["message"], "Usuário desativado com sucesso."
        )

    def test_desativar_profissional_error(self):
        """Testa erro na desativação de um profissional."""
        self.client.force_authenticate(user=self.user)
        response = self.client.patch(f"{self.url}{100}/desativar/")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(
            response.data["error"]["message"], "Usuario não encontrado."
        )

    def test_ativar_profissional_success(self):
        """Testa a ativação de um profissional com sucesso."""
        self.user.deactivate()
        self.client.force_authenticate(user=self.user)
        response = self.client.patch(f"{self.url}{self.user.id}/ativar/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data["message"], "Usuário ativado com sucesso."
        )

    def test_ativar_profissional_error(self):
        """Testa erro na ativação de um profissional."""
        response = self.client.patch(f"{self.url}{self.user.id}/ativar/")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        self.client.force_authenticate(user=self.user)
        response = self.client.patch(f"{self.url}{self.user.id}/ativar/")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(
            response.data["error"]["message"], "Usuário já está ativo."
        )

        response = self.client.patch(f"{self.url}{100}/ativar/")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(
            response.data["error"]["message"], "Usuario não encontrado."
        )

    def test_resetar_senha_success(self):
        """Testa o reset da senha de um profissional com sucesso."""
        self.client.force_authenticate(user=self.user)
        response = self.client.patch(
            f"{self.url}{self.user.id}/resetar-senha/"
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data["data"]["message"],
            "Senha resetada para valor padrão.",
        )

    def test_resetar_senha_error(self):
        """Testa erro no reset da senha de um profissional."""
        response = self.client.patch(
            f"{self.url}{self.user.id}/resetar-senha/"
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        self.client.force_authenticate(user=self.user)
        response = self.client.patch(f"{self.url}{1000}/resetar-senha/")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(
            response.data["error"]["message"], "Usuário 1000 não encontrado."
        )
