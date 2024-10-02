from django.core.exceptions import ObjectDoesNotExist
from django.test import TestCase
from django.urls import reverse

from common.models import Profissao
from common.tests.factories import ProfissaoFactory, UserFactory
from common.views import ProfissaoViewSet
from rest_framework import status
from rest_framework.test import APIRequestFactory, force_authenticate


class ProfissaoViewSetTest(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.user = UserFactory()
        self.user.is_superuser = True
        self.url = reverse("Profissao-list")
        self.profissao = ProfissaoFactory()
        self.request_data = {"descricao": "Descricao profissao"}

    def test_user_not_authenticated(self):
        """Testa o acesso negado para usuários não autenticados."""
        request = self.factory.get(self.url)
        response = ProfissaoViewSet.as_view({"get": "list"})(request)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_create_profissao_success(self):
        """Testa a criação do profissao com sucesso."""
        request = self.factory.post(self.url, self.request_data)
        force_authenticate(request, user=self.user)
        response = ProfissaoViewSet.as_view({"post": "create"})(request)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        profissao_criada = Profissao.objects.get(
            descricao=self.request_data["descricao"]
        )
        self.assertEqual(
            profissao_criada.descricao, self.request_data["descricao"]
        )

    def test_create_profissao_error(self):
        """Testa erro na criação do profissao, com o valor 'descricao' já existente."""
        data = {"descricao": self.profissao.descricao}
        request = self.factory.post(self.url, data)
        force_authenticate(request, user=self.user)
        response = ProfissaoViewSet.as_view({"post": "create"})(request)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        # testa erro ao tentar cadastrar sem a descricao
        request = self.factory.post(self.url, {"a": "b"})
        force_authenticate(request, user=self.user)
        response = ProfissaoViewSet.as_view({"post": "create"})(request)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_list_profissao_success(self):
        """Testa a listagem de profissões com sucesso."""
        request = self.factory.get(self.url)
        force_authenticate(request, user=self.user)
        response = ProfissaoViewSet.as_view({"get": "list"})(request)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_retrieve_profissao_success(self):
        """Testa a conculta de uma profissao com sucesso."""
        detail_url = reverse(
            "Profissao-detail", kwargs={"pk": self.profissao.pk}
        )
        request = self.factory.get(detail_url)
        force_authenticate(request, user=self.user)
        response = ProfissaoViewSet.as_view({"get": "retrieve"})(
            request, pk=self.profissao.pk
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_retrieve_profissao_error(self):
        """Testa erro na conculta de um profissao."""
        detail_url = reverse("Profissao-detail", kwargs={"pk": 1000})
        request = self.factory.get(detail_url)
        force_authenticate(request, user=self.user)
        response = ProfissaoViewSet.as_view({"get": "retrieve"})(
            request, pk=1000
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_search_profissao(self):
        """Testa a busca de um profissao com sucesso."""
        detail_url = f"{self.url}?descricao={self.profissao.descricao}"
        request = self.factory.get(detail_url)
        force_authenticate(request, user=self.user)
        response = ProfissaoViewSet.as_view({"get": "list"})(request)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_profissao_success(self):
        """Testa a atualização de um profissao com sucesso."""
        url_update = reverse(
            "Profissao-detail", kwargs={"pk": self.profissao.pk}
        )
        data = {
            "descricao": "Nova descricao",
        }
        request = self.factory.patch(url_update, data)
        force_authenticate(request, user=self.user)
        response = ProfissaoViewSet.as_view({"patch": "update"})(
            request, pk=self.profissao.pk
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            str(Profissao.objects.get(pk=self.profissao.pk)),
            data["descricao"],
        )

    def test_update_profissao_error(self):
        """Testa erro na atualização de um profissao."""
        url = reverse("Profissao-detail", kwargs={"pk": 1000})
        data = {
            "descricao": "Nova descricao 2",
        }
        request = self.factory.patch(url, data)
        force_authenticate(request, user=self.user)
        response = ProfissaoViewSet.as_view({"patch": "update"})(
            request, pk=1000
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_destroy_profissao_success(self):
        """Testa a exclusão de um profissao com sucesso."""
        detail_url = reverse(
            "Profissao-detail", kwargs={"pk": self.profissao.pk}
        )
        request = self.factory.delete(detail_url)
        force_authenticate(request, user=self.user)
        response = ProfissaoViewSet.as_view({"delete": "destroy"})(
            request, pk=self.profissao.pk
        )
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        with self.assertRaises(ObjectDoesNotExist):
            Profissao.objects.get(pk=self.profissao.pk)

    def test_destroy_profissao_error(self):
        """Testa erro ao excluir um profissao."""
        detail_url = reverse("Profissao-detail", kwargs={"pk": 1000})
        request = self.factory.delete(detail_url)
        force_authenticate(request, user=self.user)
        response = ProfissaoViewSet.as_view({"delete": "destroy"})(
            request, pk=1000
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
