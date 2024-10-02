from django.test import TestCase
from django.urls import reverse

# from common.models import Usuario
from common.tests.factories import ProfissionalFactory, UserFactory
from common.views import UsuarioViewSet
from rest_framework import status
from rest_framework.test import APIRequestFactory, force_authenticate


class UsuarioViewSetTest(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.profissional = ProfissionalFactory(coren="12345")
        self.user_sem_profissional = UserFactory(idprofissional=None)
        self.user = UserFactory(
            idprofissional=self.profissional,
            email=self.profissional.email,
            password="123",
        )
        self.user.groups.add(8)
        self.user.is_superuser = True
        self.user.set_password("123")
        self.user.save()

        self.url = reverse("retrieve")

    def test_user_not_authenticated(self):
        """Testa o acesso negado para usuários não autenticados."""
        request = self.factory.get(self.url)
        response = UsuarioViewSet.as_view({"get": "retrieve"})(request)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_retrieve_usuario_success(self):
        """Testa a consulta de um usuario com sucesso."""
        request = self.factory.get(self.url)
        force_authenticate(request, user=self.user)
        response = UsuarioViewSet.as_view({"get": "retrieve"})(request)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data["data"]["infos"]["email"], self.user.email
        )
        self.assertEqual(
            response.data["data"]["conta"]["usuario"], self.user.username
        )

    def test_retrieve_usuario_error(self):
        """Testa erro na consulta de um usuario."""
        request = self.factory.get(self.url)
        force_authenticate(request, user=self.user_sem_profissional)
        response = UsuarioViewSet.as_view({"get": "retrieve"})(request)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(
            response.data["error"]["message"], "Usuário não encontrado."
        )

    def test_update_success(self):
        data = {
            "nome": "Novo nome",
            "contato": "(92)99874-5663",
            "email": "novo@email.com.br",
            "sexo": "M",
            "dtnascimento": "2023-12-08",
            "coren": "12345",
        }
        request = self.factory.put(reverse("update"), data)
        force_authenticate(request, user=self.user)
        response = UsuarioViewSet.as_view({"put": "update"})(request)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data["message"], "Usuário atualizado com sucesso."
        )

    def test_update_error(self):
        data = {
            "contato": "111",
            "coren": "abc",
            "email": "a.com.br",
            "sexo": "M",
            "dtnascimento": "2023-12-08",
        }
        request = self.factory.put(reverse("update"), data)
        force_authenticate(request, user=self.user)
        response = UsuarioViewSet.as_view({"put": "update"})(request)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(
            response.data["message"]["contato"][0],
            (
                "Digite um número de telefone válido no "
                "formato (XX)XXXX-XXXX ou (XX)XXXXX-XXXX."
            ),
        )
        self.assertEqual(
            response.data["message"]["email"][0],
            "Digite um endereço de e-mail válido.",
        )

    def test_alterar_senha_success(self):
        data = {
            "senha_atual": "123",
            "nova_senha": "321",
        }
        request = self.factory.patch(reverse("alterar_senha"), data)
        force_authenticate(request, user=self.user)
        response = UsuarioViewSet.as_view({"patch": "alterar_senha"})(request)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data["data"]["message"], "Senha alterada com sucesso."
        )

    def test_alterar_senha_error(self):
        data = {
            "senha_atual": "abc",
            "nova_senha": "321",
        }
        request = self.factory.patch(reverse("alterar_senha"), data)
        force_authenticate(request, user=self.user)
        response = UsuarioViewSet.as_view({"patch": "alterar_senha"})(request)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(
            response.data["error"]["message"], "Senha atual inválida."
        )

        # erro de nova senha não informada
        data = {"senha_atual": "123"}
        request = self.factory.patch(reverse("alterar_senha"), data)
        force_authenticate(request, user=self.user)
        response = UsuarioViewSet.as_view({"patch": "alterar_senha"})(request)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(
            response.data["error"]["message"], "Informe a nova senha"
        )
