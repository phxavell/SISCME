# pylint: disable=too-many-instance-attributes
from django.test import TestCase
from django.urls import reverse

from common.tests.factories import (
    ClienteFactory,
    ProfissionalFactory,
    UserFactory,
)
from common.views import UsuarioClienteViewSet
from rest_framework import status
from rest_framework.test import APIRequestFactory, force_authenticate
from users.models import User


class UsuarioClienteViewSetTest(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.profissional = ProfissionalFactory()
        self.cliente = ClienteFactory()
        self.user = UserFactory()
        self.url = reverse("usuarios_cliente", kwargs={"pk": self.cliente.pk})
        self.user.is_superuser = True
        self.data = {
            "cpf": "564.844.545-16",
            "nome": "Andreza Mourão",
            "matricula": "564154165416",
            "dtnascimento": "2000-10-10",
            "email": "andreza@mourao.com",
            "contato": "(54)31656-3151",
            "sexo": "F",
            "apelidousu": "andreza@mourao.com",
            "senhausu": "andreza@mourao.com",
            "cliente": self.cliente.idcli,
        }
        self.profissional_cliente = ProfissionalFactory(cliente=self.cliente)
        self.user_cliente = UserFactory(
            idprofissional=self.profissional_cliente
        )
        self.user_cliente.groups.add(2)

        self.user_cliente.save()

    def test_user_not_authenticated(self):
        """Testa o acesso negado para usuários não autenticados."""
        request = self.factory.get(self.url)
        response = UsuarioClienteViewSet.as_view({"get": "retrieve"})(
            request, pk=self.cliente.pk
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_retrieve_success(self):
        """Testa a consulta dos usuários do cliente."""
        request = self.factory.get(self.url)
        force_authenticate(request, user=self.user)
        response = UsuarioClienteViewSet.as_view({"get": "retrieve"})(
            request, pk=self.cliente.pk
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["data"][0]["id"], self.user_cliente.pk)

    def test_retrieve_error(self):
        """Testa erro na consulta dos usuários do cliente."""
        url = reverse("usuarios_cliente", kwargs={"pk": 100})
        request = self.factory.get(url)
        force_authenticate(request, user=self.user)
        response = UsuarioClienteViewSet.as_view({"get": "retrieve"})(
            request, pk=100
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data["detail"], "Cliente não encontrado.")

    def test_create_usuario_cliente_success(self):
        """Testa a criação de um usuario com sucesso."""
        request = self.factory.post(self.url, data=self.data, format="json")
        force_authenticate(request, user=self.user)
        response = UsuarioClienteViewSet.as_view({"post": "create"})(
            request, pk=self.cliente.pk
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        user_criado = User.objects.get(email=self.data["email"])
        self.assertEqual(user_criado.email, self.data["email"])

    def test_create_usuario_error(self):
        """Testa erro na criação de um usuario do cliente."""
        data_error = {
            "cpf": self.profissional.cpf,
            "nome": "Andreza Mourão",
            "matricula": "564154165416",
            "dtnascimento": "2000-10-10",
            "email": "andreza@mourao.com",
            "contato": "(54)31656-3151",
            "sexo": "F",
            "apelidousu": "andreza",
            "senhausu": "andreza@mourao.com",
            "cliente": self.cliente.idcli,
        }

        request = self.factory.post(self.url, data_error, format="json")
        force_authenticate(request, user=self.user)
        response = UsuarioClienteViewSet.as_view({"post": "create"})(
            request, pk=self.cliente.pk
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(
            response.data["error"]["data"]["cpf"][0], "CPF já utilizado."
        )

        url = reverse("usuarios_cliente", kwargs={"pk": 100})
        request = self.factory.post(url, data_error, format="json")
        force_authenticate(request, user=self.user)
        response = UsuarioClienteViewSet.as_view({"post": "create"})(
            request, 100
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(
            response.data["error"]["message"], "Cliente não encontrado."
        )

        self.cliente.desativar()
        request = self.factory.post(self.url, data=self.data, format="json")
        force_authenticate(request, user=self.user)
        response = UsuarioClienteViewSet.as_view({"post": "create"})(
            request, pk=self.cliente.pk
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(
            response.data["error"]["message"],
            "Não é possível criar usuário para um cliente desativado.",
        )
