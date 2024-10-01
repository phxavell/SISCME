from django.core.exceptions import ObjectDoesNotExist
from django.test import TestCase
from django.urls import reverse

from common.models import Setor
from common.tests.factories import SetorFactory, UserFactory
from common.views import SetorViewSet
from rest_framework import status
from rest_framework.test import APIRequestFactory, force_authenticate


class SetorViewSetTest(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.user = UserFactory()
        self.user.is_superuser = True
        self.url = reverse("setor-list")
        self.setor = SetorFactory()
        self.request_data = {"descricao": "Descricao setor"}

    def test_user_not_authenticated(self):
        """Testa o acesso negado para usuários não autenticados."""
        request = self.factory.get(self.url)
        response = SetorViewSet.as_view({"get": "list"})(request)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_create_setor_success(self):
        """Testa a criação do setor com sucesso."""
        request = self.factory.post(self.url, self.request_data)
        force_authenticate(request, user=self.user)
        response = SetorViewSet.as_view({"post": "create"})(request)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        setor_criado = Setor.objects.get(
            descricao=self.request_data["descricao"]
        )
        self.assertEqual(
            setor_criado.descricao, self.request_data["descricao"]
        )

    def test_create_setor_error(self):
        """Testa erro na criação do setor, com o valor 'descricao' já existente."""
        data = {"descricao": self.setor.descricao}
        request = self.factory.post(self.url, data)
        force_authenticate(request, user=self.user)
        response = SetorViewSet.as_view({"post": "create"})(request)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        # testa erro ao tentar cadastrar sem a descricao
        request = self.factory.post(self.url, {"a": "b"})
        force_authenticate(request, user=self.user)
        response = SetorViewSet.as_view({"post": "create"})(request)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_list_setor_success(self):
        """Testa a listagem de setores com sucesso."""
        request = self.factory.get(self.url)
        force_authenticate(request, user=self.user)
        response = SetorViewSet.as_view({"get": "list"})(request)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_retrieve_setor_success(self):
        """Testa a conculta de um setor com sucesso."""
        detail_url = reverse("setor-detail", kwargs={"pk": self.setor.pk})
        request = self.factory.get(detail_url)
        force_authenticate(request, user=self.user)
        response = SetorViewSet.as_view({"get": "retrieve"})(
            request, pk=self.setor.pk
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_retrieve_setor_error(self):
        """Testa erro na conculta de um setor."""
        detail_url = reverse("setor-detail", kwargs={"pk": 1000})
        request = self.factory.get(detail_url)
        force_authenticate(request, user=self.user)
        response = SetorViewSet.as_view({"get": "retrieve"})(request, pk=1000)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_search_setor(self):
        """Testa a busca de um setor com sucesso."""
        detail_url = f"{self.url}?descricao={self.setor.descricao}"
        request = self.factory.get(detail_url)
        force_authenticate(request, user=self.user)
        response = SetorViewSet.as_view({"get": "list"})(request)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_setor_success(self):
        """Testa a atualização de um setor com sucesso."""
        url_update = reverse("setor-detail", kwargs={"pk": self.setor.pk})
        data = {
            "descricao": "Nova descricao",
        }
        request = self.factory.patch(url_update, data)
        force_authenticate(request, user=self.user)
        response = SetorViewSet.as_view({"patch": "update"})(
            request, pk=self.setor.pk
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            str(Setor.objects.get(pk=self.setor.pk)),
            data["descricao"],
        )

    def test_update_setor_error(self):
        """Testa erro na atualização de um setor."""
        url = reverse("setor-detail", kwargs={"pk": 1000})
        data = {
            "descricao": "Nova descricao 2",
        }
        request = self.factory.patch(url, data)
        force_authenticate(request, user=self.user)
        response = SetorViewSet.as_view({"patch": "update"})(request, pk=1000)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_destroy_setor_success(self):
        """Testa a exclusão de um setor com sucesso."""
        detail_url = reverse("setor-detail", kwargs={"pk": self.setor.pk})
        request = self.factory.delete(detail_url)
        force_authenticate(request, user=self.user)
        response = SetorViewSet.as_view({"delete": "destroy"})(
            request, pk=self.setor.pk
        )
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        with self.assertRaises(ObjectDoesNotExist):
            Setor.objects.get(pk=self.setor.pk)

    def test_destroy_setor_error(self):
        """Testa erro ao excluir um setor."""
        detail_url = reverse("setor-detail", kwargs={"pk": 1000})
        request = self.factory.delete(detail_url)
        force_authenticate(request, user=self.user)
        response = SetorViewSet.as_view({"delete": "destroy"})(
            request, pk=1000
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
