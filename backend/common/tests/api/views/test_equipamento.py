from django.test import TestCase
from django.urls import reverse

from common.enums import TipoEquipamentoEnum
from common.models.legacy import Equipamento
from common.tests.factories import EquipamentoFactory, UserFactory
from common.views import EquipamentoViewSet
from rest_framework import status
from rest_framework.test import APIRequestFactory, force_authenticate


class EquipamentoViewSetTestCase(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.usuario = UserFactory()
        self.usuario.groups.add(12)

    def test_list(self):
        """Teste para verificar se a viewset está retornando os equipamentos"""

        # Teste sem autenticação
        url = reverse("Equipamento-list")
        request = self.factory.get(url)
        response = EquipamentoViewSet.as_view({"get": "list"})(request)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # Teste com autenticação
        force_authenticate(request, user=self.usuario)
        response = EquipamentoViewSet.as_view({"get": "list"})(request)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Equipamento.objects.count(), 0)

        equipamento = EquipamentoFactory()
        equipamento.save()
        response = EquipamentoViewSet.as_view({"get": "list"})(request)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Equipamento.objects.count(), 1)

    def test_create(self):
        """Teste para verificar se a viewset está criando os equipamentos"""

        # Teste sem autenticação
        url = reverse("Equipamento-list")
        request = self.factory.post(url)
        response = EquipamentoViewSet.as_view({"post": "create"})(request)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # Teste com autenticação e sem data
        force_authenticate(request, user=self.usuario)
        response = EquipamentoViewSet.as_view({"post": "create"})(request)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        # Teste com autenticação e com data
        data = {
            "descricao": "teste",
            "numero_serie": "teste",
            "tipo": TipoEquipamentoEnum.TERMODESINFECTORA,
        }
        request = self.factory.post(url, data=data)
        force_authenticate(request, user=self.usuario)
        response = EquipamentoViewSet.as_view({"post": "create"})(request)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Teste com erro de integridade
        data = {
            "descricao": "teste",
            "numero_serie": "teste",
            "tipo": TipoEquipamentoEnum.TERMODESINFECTORA,
        }

        request = self.factory.post(url, data=data)
        force_authenticate(request, user=self.usuario)
        response = EquipamentoViewSet.as_view({"post": "create"})(request)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        data = {
            "descricao": "teste 3",
            "numero_serie": "teste 3",
            "tipo": TipoEquipamentoEnum.TERMODESINFECTORA,
            "registro_anvisa": "dsa",
        }

        request = self.factory.post(url, data=data)
        force_authenticate(request, user=self.usuario)
        response = EquipamentoViewSet.as_view({"post": "create"})(request)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        data = {
            "descricao": "teste 3",
            "numero_serie": "teste 3",
            "tipo": TipoEquipamentoEnum.TERMODESINFECTORA,
            "registro_anvisa": "5",
        }

        request = self.factory.post(url, data=data)
        force_authenticate(request, user=self.usuario)
        response = EquipamentoViewSet.as_view({"post": "create"})(request)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_retrieve(self):
        """Teste para verificar se a viewset está retornando os equipamentos"""

        # Teste sem autenticação
        url = reverse("Equipamento-detail", args=[1])
        request = self.factory.get(url)
        response = EquipamentoViewSet.as_view({"get": "retrieve"})(
            request, pk=1
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # Teste com autenticação
        force_authenticate(request, user=self.usuario)
        response = EquipamentoViewSet.as_view({"get": "retrieve"})(
            request, pk=1
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

        equipamento = EquipamentoFactory()
        equipamento.save()
        response = EquipamentoViewSet.as_view({"get": "retrieve"})(
            request, pk=1
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Equipamento.objects.count(), 1)

    def test_update(self):
        """Teste para verificar se a viewset está atualizando os equipamentos"""
        # Teste sem autenticação
        url = reverse("Equipamento-detail", args=[1])
        request = self.factory.put(url)
        response = EquipamentoViewSet.as_view({"put": "update"})(request, pk=1)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # Teste com autenticação e sem data
        equipamento = EquipamentoFactory()
        force_authenticate(request, user=self.usuario)
        response = EquipamentoViewSet.as_view({"put": "partial_update"})(
            request, pk=equipamento.pk
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Teste com autenticação e com data
        data = {
            "descricao": "teste",
            "numero_serie": "teste",
            "tipo": TipoEquipamentoEnum.TERMODESINFECTORA,
        }
        request = self.factory.put(url, data=data)
        force_authenticate(request, user=self.usuario)
        response = EquipamentoViewSet.as_view({"put": "partial_update"})(
            request, pk=1
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Equipamento.objects.count(), 1)

    def test_destroy(self):
        """Teste para verificar se a viewset está deletando os equipamentos"""

        # Teste sem autenticação
        url = reverse("Equipamento-detail", args=[1])
        request = self.factory.delete(url)
        response = EquipamentoViewSet.as_view({"delete": "destroy"})(
            request, pk=1
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # Teste com autenticação
        force_authenticate(request, user=self.usuario)
        response = EquipamentoViewSet.as_view({"delete": "destroy"})(
            request, pk=1
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

        equipamento = EquipamentoFactory()
        equipamento.save()
        response = EquipamentoViewSet.as_view({"delete": "destroy"})(
            request, pk=1
        )
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Equipamento.objects.count(), 0)
