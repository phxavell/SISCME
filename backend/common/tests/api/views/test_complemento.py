from django.test import TestCase
from django.urls import reverse

from common.tests.factories import ComplementoFactory, UserFactory
from common.views import ComplementoViewSet
from rest_framework import status
from rest_framework.test import APIRequestFactory, force_authenticate


class ComplementoViewSetTestCase(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.usuario = UserFactory()
        self.usuario.groups.add(8)
        self.usuario.save()

        self.complemento = ComplementoFactory()

    def test_nao_autenticado(self):
        """Testa se retorna erro ao não enviar token de autenticação"""
        url = reverse("complementos-list")
        request = self.factory.get(url)
        response = ComplementoViewSet.as_view({"get": "list"})(request)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_list(self):
        """Testa se esta retornando a listagem de complementos"""
        url = reverse("complementos-list")
        request = self.factory.get(url)
        force_authenticate(request, user=self.usuario)
        response = ComplementoViewSet.as_view({"get": "list"})(request)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_list_com_descricao(self):
        """Testa se esta retornando a listagem de complementos por descricao"""
        url = reverse("complementos-list")
        url_descricao = f"{url}?descricao={self.complemento.descricao}"
        request = self.factory.get(url_descricao)
        force_authenticate(request, user=self.usuario)
        response = ComplementoViewSet.as_view({"get": "list"})(request)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_destroy_success(self):
        """Testa se esta deletando complemento com sucesso"""
        url = reverse(
            "complementos-detail", kwargs={"pk": self.complemento.id}
        )
        request = self.factory.delete(url)
        response = ComplementoViewSet.as_view({"delete": "destroy"})(
            request, pk=self.complemento.id
        )
        force_authenticate(request, user=self.usuario)
        response = ComplementoViewSet.as_view({"delete": "destroy"})(
            request, pk=self.complemento.id
        )
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_destroy_error(self):
        """Testa se esta retornando erro ao deletar complemento"""
        url = reverse("complementos-detail", kwargs={"pk": 9999})
        request = self.factory.delete(url)
        force_authenticate(request, user=self.usuario)
        response = ComplementoViewSet.as_view({"delete": "destroy"})(
            request, pk=9999
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
