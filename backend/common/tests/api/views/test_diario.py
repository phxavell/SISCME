from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase
from django.urls import reverse

from common.models.legacy import Diario
from common.tests.factories import DiarioFactory, SetorFactory, UserFactory
from common.views import DiarioViewSet
from rest_framework import status
from rest_framework.test import APIRequestFactory, force_authenticate


class DiarioViewSetTestCase(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.usuario = UserFactory()
        self.diario = DiarioFactory()
        self.setor = SetorFactory()
        self.url = reverse("diario-list")

    def test_no_authenticate(self):
        """Teste para verificar se a viewset está retornando os diarios"""
        request = self.factory.get(self.url)
        response = DiarioViewSet.as_view({"get": "list"})(request)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_list(self):
        """Teste para verificar se a viewset está retornando os diarios"""
        request = self.factory.get(self.url)
        force_authenticate(request, user=self.usuario)
        response = DiarioViewSet.as_view({"get": "list"})(request)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Diario.objects.count(), 1)

    def test_fechamento_sem_descricao(self):
        """Teste para verificar se a viewset está fechando o diário"""
        url_fechamento = f"{self.url}fechamento/"
        request = self.factory.post(url_fechamento)
        force_authenticate(request, user=self.usuario)
        response = DiarioViewSet.as_view({"post": "fechamento"})(
            request, pk=self.diario.pk
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_fechamento_nao_existe(self):
        """Teste para verificar se a viewset está fechando o diário"""
        url_fechamento = f"{self.url}fechamento/"
        request = self.factory.post(url_fechamento)
        force_authenticate(request, user=self.usuario)
        response = DiarioViewSet.as_view({"post": "fechamento"})(
            request, pk=999
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_fechamento(self):
        """Teste para verificar se a viewset está fechando o diário"""
        url_fechamento = f"{self.url}fechamento/"
        data = {"acao": "Teste"}
        request = self.factory.post(url_fechamento, data=data)
        force_authenticate(request, user=self.usuario)
        response = DiarioViewSet.as_view({"post": "fechamento"})(
            request, pk=self.diario.pk
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_inserir_arquivo(self):
        """Teste para verificar se a viewset está inserindo o arquivo"""
        url_inserir_arquivo = f"{self.url}inserir_arquivo/"
        data = {"arquivo": SimpleUploadedFile("teste.txt", b"teste")}
        request = self.factory.post(url_inserir_arquivo, data=data)
        force_authenticate(request, user=self.usuario)
        response = DiarioViewSet.as_view({"post": "inserir_arquivo"})(
            request, pk=self.diario.pk
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_inserir_arquivo_sem_arquivo(self):
        """Teste para verificar se a viewset está inserindo o arquivo"""
        url_inserir_arquivo = f"{self.url}inserir_arquivo/"
        data = {}
        request = self.factory.post(url_inserir_arquivo, data=data)
        force_authenticate(request, user=self.usuario)
        response = DiarioViewSet.as_view({"post": "inserir_arquivo"})(
            request, pk=self.diario.pk
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_inserir_arquivo_arquivo_existe(self):
        """Teste para verificar se a viewset está inserindo o arquivo"""
        url_inserir_arquivo = f"{self.url}inserir_arquivo/"
        data = {"arquivo": SimpleUploadedFile("teste.txt", b"teste")}
        request = self.factory.post(url_inserir_arquivo, data=data)
        force_authenticate(request, user=self.usuario)
        response = DiarioViewSet.as_view({"post": "inserir_arquivo"})(
            request, pk=self.diario.pk
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        response = DiarioViewSet.as_view({"post": "inserir_arquivo"})(
            request, pk=self.diario.pk
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_insert_arquivo_id_invalido(self):
        """Teste para verificar se a viewset está inserindo o arquivo"""
        url_inserir_arquivo = f"{self.url}inserir_arquivo/"
        data = {"arquivo": SimpleUploadedFile("teste.txt", b"teste")}
        request = self.factory.post(url_inserir_arquivo, data=data)
        force_authenticate(request, user=self.usuario)
        response = DiarioViewSet.as_view({"post": "inserir_arquivo"})(
            request, pk=999
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_remover_arquivo(self):
        """Teste para verificar se a viewset está removendo o arquivo"""
        url_inserir_arquivo = f"{self.url}inserir_arquivo/"
        data = {"arquivo": SimpleUploadedFile("teste.txt", b"teste")}
        request = self.factory.post(url_inserir_arquivo, data=data)
        force_authenticate(request, user=self.usuario)
        response = DiarioViewSet.as_view({"post": "inserir_arquivo"})(
            request, pk=self.diario.pk
        )

        url_remover_arquivo = f"{self.url}remover_arquivo/"
        data = {"arquivo": SimpleUploadedFile("teste.txt", b"teste")}
        request = self.factory.delete(url_remover_arquivo, data=data)
        force_authenticate(request, user=self.usuario)
        response = DiarioViewSet.as_view({"delete": "remover_arquivo"})(
            request, pk=self.diario.pk
        )
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_remover_arquivo_id_invalido(self):
        """Teste para verificar se a viewset está removendo o arquivo"""
        url_remover_arquivo = f"{self.url}remover_arquivo/"
        data = {"arquivo": SimpleUploadedFile("teste.txt", b"teste")}
        request = self.factory.delete(url_remover_arquivo, data=data)
        force_authenticate(request, user=self.usuario)
        response = DiarioViewSet.as_view({"delete": "remover_arquivo"})(
            request, pk=999
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_update_diario(self):
        """Teste para verificar se a viewset está atualizando o diário"""
        url_update_diario = f"{self.url}{self.diario.pk}/"
        data = {"descricao": "Teste"}
        request = self.factory.put(url_update_diario, data=data)
        force_authenticate(request, user=self.usuario)
        response = DiarioViewSet.as_view({"put": "partial_update"})(
            request, pk=self.diario.pk
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
