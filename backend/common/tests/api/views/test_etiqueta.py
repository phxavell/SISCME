from django.test import TestCase
from django.urls import reverse

from common.models import Etiqueta
from common.tests.factories import EtiquetaFactory, UserFactory
from common.views import EtiquetaViewSet
from rest_framework import status
from rest_framework.test import APIRequestFactory, force_authenticate


class EtiquetaViewSetTestCase(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.usuario = UserFactory()
        self.etiqueta = EtiquetaFactory()

    def test_nao_autenticado(self):
        """Testa se retorna erro ao não enviar token de autenticação"""
        url = reverse("etiqueta-list")
        request = self.factory.get(url)
        response = EtiquetaViewSet.as_view({"get": "list"})(request)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_list(self):
        url = reverse("etiqueta-list")
        request = self.factory.get(url)
        force_authenticate(request, user=self.usuario)
        response = EtiquetaViewSet.as_view({"get": "list"})(request)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_list_data_maior(self):
        """Testa se retorna erro ao enviar data_inicial maior que data_final"""
        url = reverse("etiqueta-list")
        url_data_inicial_maior = (
            f'{url}?data_inicial={"2020-01-01"}&data_final={"2019-01-01"}'
        )
        request = self.factory.get(url_data_inicial_maior)
        force_authenticate(request, user=self.usuario)
        response = EtiquetaViewSet.as_view({"get": "list"})(request)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_list_codigo(self):
        """Testa se esta retornando a listagem de etiquetas por codigo"""
        url = reverse("etiqueta-list")
        url_codigo = f"{url}?codigo={self.etiqueta.id}"
        request = self.factory.get(url_codigo)
        force_authenticate(request, user=self.usuario)
        response = EtiquetaViewSet.as_view({"get": "list"})(request)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_destroy_success(self):
        """Testa se esta deletando etiqueta com sucesso"""
        url = reverse("etiqueta-detail", kwargs={"pk": self.etiqueta.id})
        request = self.factory.delete(url)
        response = EtiquetaViewSet.as_view({"delete": "destroy"})(
            request, pk=self.etiqueta.id
        )
        force_authenticate(request, user=self.usuario)
        response = EtiquetaViewSet.as_view({"delete": "destroy"})(
            request, pk=self.etiqueta.id
        )
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Etiqueta.objects.count(), 0)

    def test_destroy_fail(self):
        """Testa se esta retornando erro ao tentar deletar etiqueta inexistente"""
        url = reverse("etiqueta-detail", kwargs={"pk": 999})
        request = self.factory.delete(url)
        force_authenticate(request, user=self.usuario)
        response = EtiquetaViewSet.as_view({"delete": "destroy"})(
            request, pk=999
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(Etiqueta.objects.count(), 1)
