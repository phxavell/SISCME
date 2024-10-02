from django.test import TestCase
from django.urls import reverse

from common.tests.factories import ComplementoFactory, UserFactory
from common.views import ComplementoViewSet
from rest_framework import status
from rest_framework.test import APIRequestFactory, force_authenticate


class ComplementoSerializerTestCase(TestCase):
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

    def test_create(self):
        """Testa se esta criando complemento com sucesso"""
        url = reverse("complementos-list")
        data = {"descricao": "Teste", "status": "A"}
        request = self.factory.post(url, data)
        force_authenticate(request, user=self.usuario)
        response = ComplementoViewSet.as_view({"post": "create"})(request)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
