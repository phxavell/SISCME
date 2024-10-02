from django.test import TestCase
from django.urls import reverse

from common.models import Subtipoproduto
from common.tests.factories import SubtipoprodutoFactory, UserFactory
from common.views import SubTipoProdutoViewSet
from rest_framework import status
from rest_framework.test import APIRequestFactory, force_authenticate


class SubTipoProdutoViewSetTest(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.user = UserFactory()
        self.user.is_superuser = True
        self.url = reverse("Subtipoproduto-list")
        self.subtipoproduto = SubtipoprodutoFactory()
        self.request_data = {"descricao": "Subtipo 1"}

    def test_user_not_authenticated(self):
        """Testa o acesso negado para usuários não autenticados."""
        request = self.factory.get(self.url)
        response = SubTipoProdutoViewSet.as_view({"get": "list"})(
            request, pk=self.subtipoproduto.pk
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_create_subtipoproduto_success(self):
        """Testa a criação do subtipoproduto com sucesso."""
        request = self.factory.post(self.url, self.request_data)
        force_authenticate(request, user=self.user)
        response = SubTipoProdutoViewSet.as_view({"post": "create"})(request)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        subtipoproduto_criado = Subtipoproduto.objects.get(
            descricao=self.request_data["descricao"]
        )
        self.assertEqual(
            subtipoproduto_criado.descricao, self.request_data["descricao"]
        )

    def test_create_subtipoproduto_error(self):
        """Testa erro na criação do subtipoproduto com descrição já existente."""
        data = {"descricao": self.subtipoproduto.descricao}
        request = self.factory.post(self.url, data)
        force_authenticate(request, user=self.user)
        response = SubTipoProdutoViewSet.as_view({"post": "create"})(request)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_list_subtipoproduto_success(self):
        """Testa a listagem de subtipoproduto com sucesso."""
        request = self.factory.get(self.url)
        force_authenticate(request, user=self.user)
        response = SubTipoProdutoViewSet.as_view({"get": "list"})(request)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_retrieve_subtipoproduto_success(self):
        """Testa a conculta de um subtipoproduto com sucesso."""
        detail_url = reverse(
            "Subtipoproduto-detail", kwargs={"pk": self.subtipoproduto.pk}
        )
        request = self.factory.get(detail_url)
        force_authenticate(request, user=self.user)
        response = SubTipoProdutoViewSet.as_view({"get": "retrieve"})(
            request, pk=self.subtipoproduto.pk
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_retrieve_subtipoproduto_error(self):
        """Testa erro na conculta de um subtipoproduto."""
        detail_url = reverse("Subtipoproduto-detail", kwargs={"pk": 1000})
        request = self.factory.get(detail_url)
        force_authenticate(request, user=self.user)
        response = SubTipoProdutoViewSet.as_view({"get": "retrieve"})(
            request, pk=1000
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_update_subtipoproduto_success(self):
        """Testa a atualização de um subtipoproduto com sucesso."""
        url = reverse(
            "Subtipoproduto-detail", kwargs={"pk": self.subtipoproduto.pk}
        )
        data = {"descricao": "Nova descricao"}
        request = self.factory.patch(url, data)
        force_authenticate(request, user=self.user)
        response = SubTipoProdutoViewSet.as_view({"patch": "update"})(
            request, pk=self.subtipoproduto.pk
        )
        subtipoproduto_att = Subtipoproduto.objects.get(
            idsubtipoproduto=self.subtipoproduto.idsubtipoproduto
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            subtipoproduto_att.descricao,
            data["descricao"],
        )

    def test_update_subtipoproduto_error(self):
        """Testa erro na atualização de um subtipoproduto."""
        url = reverse("Subtipoproduto-detail", kwargs={"pk": 1000})
        data = {"descricao": "Nova descricao"}
        request = self.factory.patch(url, data)
        force_authenticate(request, user=self.user)
        response = SubTipoProdutoViewSet.as_view({"patch": "update"})(
            request, pk=1000
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_destroy_subtipoproduto_success(self):
        """Testa a exclusão de um subtipoproduto com sucesso."""
        detail_url = reverse(
            "Subtipoproduto-detail", kwargs={"pk": self.subtipoproduto.pk}
        )
        request = self.factory.delete(detail_url)
        force_authenticate(request, user=self.user)
        response = SubTipoProdutoViewSet.as_view({"delete": "destroy"})(
            request, pk=self.subtipoproduto.pk
        )
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_destroy_subtipoproduto_error(self):
        """Testa de erro ao excluir um subtipoproduto que não existe."""
        detail_url = reverse("Subtipoproduto-detail", kwargs={"pk": 100})
        request = self.factory.delete(detail_url)
        force_authenticate(request, user=self.user)
        response = SubTipoProdutoViewSet.as_view({"delete": "destroy"})(
            request, pk=100
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
