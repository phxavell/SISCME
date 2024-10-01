from django.test import TestCase
from django.urls import reverse

from common.tests.factories import UserFactory
from common.views import RelTiposOcorrenciaAPIView
from rest_framework import status
from rest_framework.test import APIRequestFactory, force_authenticate


class RelTiposOcorrenciaAPITestCase(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.usuario = UserFactory()
        self.url = reverse("relatorio_tipos_ocorrencia")

    def test_nao_autenticado(self):
        """Testa o acesso negado para usuários não autenticados."""
        request = self.factory.get(self.url)
        response = RelTiposOcorrenciaAPIView.as_view()(request)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_sujidade_list(self):
        """Testa a listagem de sujidade com sucesso."""
        request = self.factory.get(self.url)
        force_authenticate(request, user=self.usuario)
        response = RelTiposOcorrenciaAPIView.as_view()(request)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
