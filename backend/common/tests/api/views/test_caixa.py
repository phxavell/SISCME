import json

from django.test import TestCase
from django.urls import reverse

from common.tests.factories import CaixaFactory, UserFactory
from common.views import CaixaViewSet
from common.views.generics import CaixaDetailRetrieve, CaixasRecebidas
from rest_framework import status
from rest_framework.test import APIRequestFactory, force_authenticate


class CaixaViewSetTestCase(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.usuario = UserFactory()
        self.caixa = CaixaFactory()

    def test_nao_autenticado(self):
        """Testa se retorna erro ao não enviar token de autenticação"""
        url = reverse("caixa-list")
        request = self.factory.get(url)
        response = CaixaViewSet.as_view({"get": "list"})(request)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_lista_seriais(self):
        """Testa se retorna lista de seriais"""
        url = reverse("caixa-list")
        url_seriais = f"{url}/{self.caixa.id}/lista-seriais/"
        request = self.factory.get(url_seriais)
        force_authenticate(request, user=self.usuario)
        response = CaixaViewSet.as_view({"get": "lista_seriais"})(
            request, pk=self.caixa.id
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_lista_seriais_exception(self):
        """Testa se retorna erro de exceção"""
        url = reverse("caixa-list")
        url_seriais = f"{url}/9999/lista-seriais/"
        request = self.factory.get(url_seriais)
        force_authenticate(request, user=self.usuario)
        response = CaixaViewSet.as_view({"get": "lista_seriais"})(
            request, pk=9999
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_gerar_seriais(self):
        """Testa se gera seriais"""
        url = reverse("caixa-list")
        url_seriais = f"{url}{self.caixa.id}/gerar-seriais/"
        data = {"quantidade": 1, "serial": self.caixa.codigo_modelo}
        request = self.factory.post(url_seriais, data=data, format="json")
        force_authenticate(request, user=self.usuario)
        response = CaixaViewSet.as_view({"post": "gerar_seriais"})(
            request, pk=self.caixa.id
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_gerar_seriais_quantidade_invalida(self):
        """Testa se retorna erro de quantidade inválida"""
        url = reverse("caixa-list")
        url_seriais = f"{url}{self.caixa.id}/gerar-seriais/"
        data = {"quantidade": None, "serial": self.caixa.codigo_modelo}
        request = self.factory.post(url_seriais, data=data, format="json")
        force_authenticate(request, user=self.usuario)
        response = CaixaViewSet.as_view({"post": "gerar_seriais"})(
            request, pk=self.caixa.id
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_gerar_seriais_com_quantidade_menor_que_0(self):
        """Testa se retorna erro de quantidade menor que 0"""
        url = reverse("caixa-list")
        url_seriais = f"{url}{self.caixa.id}/gerar-seriais/"
        data = {"quantidade": -1, "serial": self.caixa.codigo_modelo}
        request = self.factory.post(url_seriais, data=data, format="json")
        force_authenticate(request, user=self.usuario)
        response = CaixaViewSet.as_view({"post": "gerar_seriais"})(
            request, pk=self.caixa.id
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_gerar_seriais_exception(self):
        """Testa se retorna erro de exceção"""
        url = reverse("caixa-list")
        url_seriais = f"{url}1/gerar-seriais/"
        data = {"quantidade": 1, "serial": self.caixa.codigo_modelo}
        request = self.factory.post(url_seriais, data=data)
        force_authenticate(request, user=self.usuario)
        response = CaixaViewSet.as_view({"post": "gerar_seriais"})(
            request, pk=9999
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class CaixaDetailRetrieveTestCase(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.usuario = UserFactory()
        self.usuario.groups.add(3)
        self.caixa = CaixaFactory()
        self.data = {
            "quantidade": 1,
        }

    def test_caixa_serial(self):
        """Testa se retorna uma caixa de acordo com o serial"""
        url_gerar = reverse("caixa-list")
        url_gerar += f"{self.caixa.id}/gerar-seriais/"
        data = {"quantidade": 1, "serial": self.caixa.codigo_modelo}

        data_json = json.dumps(data)
        request = self.factory.post(
            url_gerar, data=data_json, content_type="application/json"
        )
        force_authenticate(request, user=self.usuario)
        response = CaixaViewSet.as_view({"post": "gerar_seriais"})(
            request, pk=self.caixa.id
        )

        url = reverse(
            "caixa_detail",
            kwargs={"serial": response.data.get("data")[0].get("serial")},
        )
        request = self.factory.get(url)
        force_authenticate(request, user=self.usuario)
        response = CaixaDetailRetrieve.as_view()(
            request, serial=response.data.get("data")[0].get("serial")
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data.get("serial"), response.data.get("serial")
        )


class CaixasRecebidasTestCase(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.usuario = UserFactory()
        self.usuario.groups.add(3)
        self.caixa = CaixaFactory()
        self.data = {
            "quantidade": 1,
        }

    def test_caixa_recebidas(self):
        """Testa se retorna uma caixa de acordo com o serial"""

        url = reverse("caixa_recebidas")
        request = self.factory.get(url)
        force_authenticate(request, user=self.usuario)
        response = CaixasRecebidas.as_view()(request)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
