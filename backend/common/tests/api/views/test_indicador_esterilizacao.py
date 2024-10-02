from django.test import TestCase
from django.urls import reverse

from common.enums import TipoIntegradorEnum
from common.models import IndicadoresEsterilizacao
from common.tests.factories import IndicadoresEsterilizacaoFactory, UserFactory
from common.views import IndicadorViewSet
from rest_framework import status
from rest_framework.test import APIRequestFactory, force_authenticate


class IndicadorViewSetTest(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.user = UserFactory()
        self.user.is_superuser = True
        self.url = reverse("Indicador-list")
        self.indicador = IndicadoresEsterilizacaoFactory()
        self.request_data = {
            "codigo": "ABC123",
            "descricao": "INDICADOR 1",
            "embalagem": "Indicadores",
            "status": "1",
            "situacao": True,
            "fabricante": "Bioplus",
            "saldo": 0,
            "tipo": TipoIntegradorEnum.C5,
        }

    def test_user_not_authenticated(self):
        """Testa o acesso negado para usuários não autenticados."""
        request = self.factory.get(self.url)
        response = IndicadorViewSet.as_view({"get": "list"})(
            request, pk=self.indicador.pk
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_create_indicador_success(self):
        """Testa a criação do indicador com sucesso."""
        request = self.factory.post(self.url, self.request_data)
        force_authenticate(request, user=self.user)
        response = IndicadorViewSet.as_view({"post": "create"})(request)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        indicador_criado = IndicadoresEsterilizacao.objects.get(
            codigo=self.request_data["codigo"]
        )
        self.assertEqual(
            indicador_criado.descricao, self.request_data["descricao"]
        )

    def test_create_indicador_error(self):
        """Testa erro na criação do indicador sem os campos obrigatórios."""
        data = {}
        request = self.factory.post(self.url, data)
        force_authenticate(request, user=self.user)
        response = IndicadorViewSet.as_view({"post": "create"})(request)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_list_indicador_success(self):
        """Testa a listagem de indicador com sucesso."""
        request = self.factory.get(self.url)
        force_authenticate(request, user=self.user)
        response = IndicadorViewSet.as_view({"get": "list"})(request)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data["data"][0]["descricao"], self.indicador.descricao
        )

    def test_retrieve_indicador_success(self):
        """Testa a conculta de um indicador com sucesso."""
        detail_url = reverse(
            "Indicador-detail", kwargs={"pk": self.indicador.pk}
        )
        request = self.factory.get(detail_url)
        force_authenticate(request, user=self.user)
        response = IndicadorViewSet.as_view({"get": "retrieve"})(
            request, pk=self.indicador.pk
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data["data"]["descricao"], self.indicador.descricao
        )

    def test_retrieve_indicador_error(self):
        """Testa erro na conculta de um indicador."""
        detail_url = reverse("Indicador-detail", kwargs={"pk": 1000})
        request = self.factory.get(detail_url)
        force_authenticate(request, user=self.user)
        response = IndicadorViewSet.as_view({"get": "retrieve"})(
            request, pk=1000
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(
            response.data["error"]["code"], "objeto_nao_encontrado"
        )

    def test_update_indicador_success(self):
        """Testa a atualização de um indicador com sucesso."""
        url = reverse("Indicador-detail", kwargs={"pk": self.indicador.pk})
        data = {"descricao": "Nova descricao"}
        request = self.factory.patch(url, data)
        force_authenticate(request, user=self.user)
        response = IndicadorViewSet.as_view({"patch": "partial_update"})(
            request, pk=self.indicador.pk
        )
        indicador_att = IndicadoresEsterilizacao.objects.get(
            pk=self.indicador.pk
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            indicador_att.descricao,
            str(data["descricao"]).upper(),
        )

    def test_update_indicador_error(self):
        """Testa erro na atualização de um indicador: indicador nao encontrado."""
        url = reverse("Indicador-detail", kwargs={"pk": 1000})
        data = {"descricao": "Outra descricao"}
        request = self.factory.patch(url, data)
        force_authenticate(request, user=self.user)
        response = IndicadorViewSet.as_view({"patch": "update"})(
            request, pk=1000
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

        url = reverse("Indicador-detail", kwargs={"pk": self.indicador.pk})
        data = {"descricao": "Nova descricao"}
        request = self.factory.patch(url, data)
        force_authenticate(request, user=self.user)
        response = IndicadorViewSet.as_view({"patch": "update"})(
            request, pk=self.indicador.pk
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_destroy_indicador_success(self):
        """Testa a exclusão de um indicador com sucesso."""
        detail_url = reverse(
            "Indicador-detail", kwargs={"pk": self.indicador.pk}
        )
        request = self.factory.delete(detail_url)
        force_authenticate(request, user=self.user)
        response = IndicadorViewSet.as_view({"delete": "destroy"})(
            request, pk=self.indicador.pk
        )
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_destroy_indicador_error(self):
        """Testa de erro ao excluir um indicador que não existe."""
        detail_url = reverse("Indicador-detail", kwargs={"pk": 100})
        request = self.factory.delete(detail_url)
        force_authenticate(request, user=self.user)
        response = IndicadorViewSet.as_view({"delete": "destroy"})(
            request, pk=100
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
