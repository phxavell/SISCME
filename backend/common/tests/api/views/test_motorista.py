from django.test import TestCase
from django.urls import reverse

from common.models import Profissao, Profissional
from common.tests.factories import (
    MotoristaFactory,
    ProfissionalFactory,
    UserFactory,
    UsuarioFactory,
    VeiculoFactory,
)
from common.views import MotoristaViewSet
from rest_framework import status
from rest_framework.test import APIRequestFactory, force_authenticate


class MotoristaViewSetTestCase(TestCase):
    def setUp(self):
        self.url = reverse("motorista-list")
        self.factory = APIRequestFactory()
        self.motorista = ProfissionalFactory(
            idprofissao=Profissao.objects.get(descricao="MOTORISTA")
        )
        self.usuario = UserFactory(idprofissional=self.motorista)
        self.legado = UsuarioFactory(
            idprofissional=self.motorista, apelidousu=self.usuario.username
        )
        self.usuario.groups.add(1)
        self.usuario.save()
        self.data = {
            "cpf": "132.211.221-33",
            "nome": "Thomas Pimentel",
            "matricula": 445,
            "dtnascimento": "2000-10-10",
            "email": "thomas@pimentel.com",
            "contato": "(56)45645-6454",
            "sexo": "M",
            "atrelado": "S",
            "apelidousu": "thomas@pimentel.com",
            "senhausu": "thomas@pimentel.com",
        }

    def test_nao_autenticado(self):
        """Testa se retorna erro ao não enviar token de autenticação"""
        request = self.factory.get(self.url)
        response = MotoristaViewSet.as_view({"get": "list"})(request)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_list(self):
        """Testa se esta retornando a listagem de motoristas."""
        request = self.factory.get(self.url)
        force_authenticate(request, user=self.usuario)
        response = MotoristaViewSet.as_view({"get": "list"})(request)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["data"][0]["nome"], self.motorista.nome)

    def test_create_motorista_success(self):
        """Testa a cadastro de um motorista com sucesso."""
        request = self.factory.post(self.url, self.data, format="json")
        force_authenticate(request, user=self.usuario)
        response = MotoristaViewSet.as_view({"post": "create"})(request)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        motorista_criado = Profissional.objects.get(
            email=str(self.data["email"])
        )
        self.assertEqual(motorista_criado.email, self.data["email"])

    def test_create_motorista_error(self):
        """Testa erro na criação de um motorista."""
        erro_cpf = self.data
        erro_cpf["cpf"] = self.motorista.cpf
        request = self.factory.post(self.url, erro_cpf, format="json")
        force_authenticate(request, user=self.usuario)
        response = MotoristaViewSet.as_view({"post": "create"})(request)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(
            response.data["error"]["data"]["cpf"][0], "CPF já utilizado."
        )

        erro_matricula = self.data
        erro_matricula["cpf"] = "457.987.887-85"
        erro_matricula["matricula"] = self.motorista.matricula
        request = self.factory.post(self.url, erro_matricula, format="json")
        force_authenticate(request, user=self.usuario)
        response = MotoristaViewSet.as_view({"post": "create"})(request)
        self.assertEqual(response.status_code, status.HTTP_409_CONFLICT)
        self.assertEqual(
            response.data["error"]["message"], "Matricula já cadastrada"
        )

    def test_update_motorista_success(self):
        url_update = reverse(
            "motorista-detail", kwargs={"pk": self.usuario.pk}
        )
        data = {
            "nome": "Novo nome",
        }
        request = self.factory.patch(url_update, data)
        force_authenticate(request, user=self.usuario)
        response = MotoristaViewSet.as_view({"patch": "update"})(
            request, pk=self.usuario.pk
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_upadate_motorista_error(self):
        """Testa erro na atualização de um motorista."""
        url_update = reverse("motorista-detail", kwargs={"pk": 10000})
        data = {
            "nome": "Novo nome 2",
        }
        request = self.factory.patch(url_update, data, format="json")
        force_authenticate(request, user=self.usuario)
        response = MotoristaViewSet.as_view({"patch": "update"})(
            request, pk=10000
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_destroy_motorista_success(self):
        """Testa exclusão do motorista com sucesso"""
        detail_url = reverse(
            "motorista-detail", kwargs={"pk": self.usuario.pk}
        )
        request = self.factory.delete(detail_url)
        force_authenticate(request, user=self.usuario)
        response = MotoristaViewSet.as_view({"delete": "destroy"})(
            request, pk=self.usuario.pk
        )
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_destroy_motorista_error_user_not_exist(self):
        """Testa erro na exclusão do motorista."""
        detail_url = reverse("motorista-detail", kwargs={"pk": 10000})
        request = self.factory.delete(detail_url)
        force_authenticate(request, user=self.usuario)
        response = MotoristaViewSet.as_view({"delete": "destroy"})(
            request, pk=10000
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(
            response.data["error"]["code"], "usuario_nao_encontrado"
        )

    def test_resetar_senha(self):
        user = MotoristaFactory()
        url = f"{self.url}resetar_senha/"
        request = self.factory.put(url)
        force_authenticate(request, user=user)
        response = MotoristaViewSet.as_view({"put": "resetar_senha"})(
            request, pk=self.usuario.id
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data["data"]["message"],
            "Senha resetada para valor padrão.",
        )

    def test_resetar_senha_error_permition(self):
        user = MotoristaFactory()
        url = f"{self.url}resetar_senha/"
        request = self.factory.put(url)
        force_authenticate(request, user=self.usuario)
        response = MotoristaViewSet.as_view({"put": "resetar_senha"})(
            request, pk=user.id
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_resetar_senha_error_not_found(self):
        url = f"{self.url}resetar_senha/"
        request = self.factory.put(url)
        force_authenticate(request, user=self.usuario)
        response = MotoristaViewSet.as_view({"put": "resetar_senha"})(
            request, pk=10000
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_error_excluir_motorista_alocado(self):
        motorista = MotoristaFactory()
        motorista.groups.add(1)
        veiculo = VeiculoFactory(motorista_atual=motorista)
        veiculo.save()
        detail_url = reverse("motorista-detail", kwargs={"pk": motorista.pk})
        request = self.factory.delete(detail_url)
        force_authenticate(request, user=self.usuario)
        response = MotoristaViewSet.as_view({"delete": "destroy"})(
            request, pk=motorista.pk
        )
        self.assertEqual(
            response.data["error"]["message"],
            "Você não pode deletar um motorista que está alocado em um veículo.",
        )
