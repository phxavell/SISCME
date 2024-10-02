from django.test import TestCase
from django.urls import reverse

from common.models import Tipopacote
from common.tests.factories import TipopacoteFactory, UserFactory
from common.views import TipoPacoteViewSet
from rest_framework import status
from rest_framework.test import APIRequestFactory, force_authenticate


class TipoPacoteViewSetTest(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.user = UserFactory()
        self.user.is_superuser = True
        self.url = reverse("Tipopacote-list")
        self.tipopacote = TipopacoteFactory()
        self.request_data = {"descricao": "Tipo pacote 1"}

    def test_user_not_authenticated(self):
        """Testa o acesso negado para usuários não autenticados."""
        request = self.factory.get(self.url)
        response = TipoPacoteViewSet.as_view({"get": "list"})(
            request, pk=self.tipopacote.pk
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_create_tipopacote_success(self):
        """Testa a criação do tipopacote com sucesso."""
        request = self.factory.post(self.url, self.request_data)
        force_authenticate(request, user=self.user)
        response = TipoPacoteViewSet.as_view({"post": "create"})(request)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        tipopacote_criado = Tipopacote.objects.get(
            descricao=self.request_data["descricao"]
        )
        self.assertEqual(
            tipopacote_criado.descricao, self.request_data["descricao"]
        )

    def test_create_tipopacote_error(self):
        """Testa erro na criação do tipopacote com descrição já existente."""
        data = {"descricao": self.tipopacote.descricao}
        request = self.factory.post(self.url, data)
        force_authenticate(request, user=self.user)
        response = TipoPacoteViewSet.as_view({"post": "create"})(request)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_list_tipopacote_success(self):
        """Testa a listagem de tipopacote com sucesso."""
        request = self.factory.get(self.url)
        force_authenticate(request, user=self.user)
        response = TipoPacoteViewSet.as_view({"get": "list"})(request)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_retrieve_tipopacote_success(self):
        """Testa a conculta de um tipopacote com sucesso."""
        detail_url = reverse(
            "Tipopacote-detail", kwargs={"pk": self.tipopacote.pk}
        )
        request = self.factory.get(detail_url)
        force_authenticate(request, user=self.user)
        response = TipoPacoteViewSet.as_view({"get": "retrieve"})(
            request, pk=self.tipopacote.pk
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_retrieve_tipopacote_error(self):
        """Testa erro na conculta de um Tipopacote."""
        detail_url = reverse("Tipopacote-detail", kwargs={"pk": 1000})
        request = self.factory.get(detail_url)
        force_authenticate(request, user=self.user)
        response = TipoPacoteViewSet.as_view({"get": "retrieve"})(
            request, pk=1000
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_update_tipopacote_success(self):
        """Testa a atualização de um tipopacote com sucesso."""
        url = reverse("Tipopacote-detail", kwargs={"pk": self.tipopacote.pk})
        data = {"descricao": "Nova descricao"}
        request = self.factory.patch(url, data)
        force_authenticate(request, user=self.user)
        response = TipoPacoteViewSet.as_view({"patch": "update"})(
            request, pk=self.tipopacote.pk
        )
        tipopacote_att = Tipopacote.objects.get(
            idtipopacote=self.tipopacote.idtipopacote
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            tipopacote_att.descricao,
            data["descricao"],
        )

    def test_update_tipopacote_error(self):
        """Testa erro na atualização de um tipopacote."""
        url = reverse("Tipopacote-detail", kwargs={"pk": 1000})
        data = {"descricao": "Nova descricao"}
        request = self.factory.patch(url, data)
        force_authenticate(request, user=self.user)
        response = TipoPacoteViewSet.as_view({"patch": "update"})(
            request, pk=1000
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_destroy_tipopacote_success(self):
        """Testa a exclusão de um tipopacote com sucesso."""
        detail_url = reverse(
            "Tipopacote-detail", kwargs={"pk": self.tipopacote.pk}
        )
        request = self.factory.delete(detail_url)
        force_authenticate(request, user=self.user)
        response = TipoPacoteViewSet.as_view({"delete": "destroy"})(
            request, pk=self.tipopacote.pk
        )
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_destroy_tipopacote_error(self):
        """Testa de erro ao excluir um tipopacote que não existe."""
        detail_url = reverse("Tipopacote-detail", kwargs={"pk": 100})
        request = self.factory.delete(detail_url)
        force_authenticate(request, user=self.user)
        response = TipoPacoteViewSet.as_view({"delete": "destroy"})(
            request, pk=100
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
