from django.contrib.auth.models import Group
from django.test import TestCase
from django.urls import reverse
from django.utils import timezone

from common.models import Plantao
from common.tests.factories import PlantaoFactory, UserFactory
from common.views import PlantaoMensalReportView, PlantaoViewSet
from rest_framework import status
from rest_framework.test import APIRequestFactory, force_authenticate


class PlantaoViewSetTestCase(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.usuario = UserFactory()
        self.plantao = PlantaoFactory()
        self.usuario.groups.add(1)

    def test_list(self):
        """Teste para verificar se a viewset está retornando os plantões"""

        # Teste sem autenticação
        url = reverse("plantao-list")
        request = self.factory.get(url)
        response = PlantaoViewSet.as_view({"get": "list"})(request)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # Teste com autenticação
        force_authenticate(request, user=self.usuario)
        response = PlantaoViewSet.as_view({"get": "list"})(request)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Plantao.objects.count(), 1)

        # Envio com data inicial e data final
        url_data_inicial = f'{url}?data_inicial={"2020-01-01"}'
        request = self.factory.get(url_data_inicial)
        force_authenticate(request, user=self.usuario)
        response = PlantaoViewSet.as_view({"get": "list"})(request)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Plantao.objects.count(), 1)

        url_data_final = f"{url}?data_final={timezone.now().date()}"
        request = self.factory.get(url_data_final)
        force_authenticate(request, user=self.usuario)
        response = PlantaoViewSet.as_view({"get": "list"})(request)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Plantao.objects.count(), 1)

        # Envio com situação e profissional
        url_situacao = f'{url}?status={"ABERTO"}'
        request = self.factory.get(url_situacao)
        force_authenticate(request, user=self.usuario)
        response = PlantaoViewSet.as_view({"get": "list"})(request)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Plantao.objects.count(), 1)

        url_profissional = f"{url}?profissional={self.usuario.id}"
        request = self.factory.get(url_profissional)
        force_authenticate(request, user=self.usuario)
        response = PlantaoViewSet.as_view({"get": "list"})(request)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Plantao.objects.count(), 1)

        # Checando se retorna erro ao enviar data inicial maior que data final
        url_data_inicial = (
            f'{url}?data_inicial={"2020-01-01"}&data_final={"2019-01-01"}'
        )
        request = self.factory.get(url_data_inicial)
        force_authenticate(request, user=self.usuario)
        response = PlantaoViewSet.as_view({"get": "list"})(request)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_update(self):
        """Teste para verificar se a view está atualizando o plantão"""

        # Teste com autenticação
        url = reverse("plantao-detail", kwargs={"pk": self.plantao.pk})
        data = {
            "descricaoaberto": "Teste Update",
        }
        request = self.factory.patch(url, data)
        force_authenticate(request, user=self.usuario)
        response = PlantaoViewSet.as_view({"patch": "update"})(
            request, pk=self.plantao.pk
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Teste para saber se o plantão está fechado e não pode ser atualizado
        self.plantao.status = "FECHADO"
        self.plantao.save()
        data = {
            "descricaofechado": "Teste Update",
        }
        request = self.factory.patch(url, data)
        force_authenticate(request, user=self.usuario)
        response = PlantaoViewSet.as_view({"patch": "update"})(
            request, pk=self.plantao.pk
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_fechamento(self):
        """Teste para verificar se a view está fechando o plantão"""

        # Teste sem data
        url = reverse("fechamento", kwargs={"pk": self.plantao.pk})
        request = self.factory.put(url)
        force_authenticate(request, user=self.usuario)
        response = PlantaoViewSet.as_view({"put": "fechamento"})(
            request, pk=self.plantao.pk
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        # Teste com data
        data = {
            "descricaofechamento": "Teste Fechamento 1",
        }
        request = self.factory.put(url, data)
        force_authenticate(request, user=self.usuario)
        response = PlantaoViewSet.as_view({"put": "fechamento"})(
            request, pk=self.plantao.pk
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Teste com plantão fechado
        url = reverse("fechamento", kwargs={"pk": 999})
        request = self.factory.put(url, data)
        force_authenticate(request, user=self.usuario)
        response = PlantaoViewSet.as_view({"put": "fechamento"})(
            request, pk=999
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class PlantaoViewTestCase(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.usuario = UserFactory()
        self.usuario.groups.add(8)
        self.plantao = PlantaoFactory()
        self.plantao_2 = PlantaoFactory()
        url = reverse("fechamento", kwargs={"pk": self.plantao_2.pk})
        data = {
            "descricaofechamento": "Teste Fechamento 2",
        }
        request = self.factory.put(url, data)
        force_authenticate(request, user=self.usuario)
        self.fechamento_plantao = PlantaoViewSet.as_view(
            {"put": "fechamento"}
        )(request, pk=self.plantao_2.pk)

        self.plantao_3 = PlantaoFactory(
            datafechamento="2023-11-27",
            horafechamento="10:10:10",
            descricaofechamento="Teste",
        )

    def test_list(self):
        """Teste para verificar se a view está retornando os plantões"""

        # Teste sem autenticação
        url = reverse("relatorio_mensal_plantoes")
        request = self.factory.get(url)
        force_authenticate(request, user=self.usuario)
        response = PlantaoMensalReportView.as_view({"get": "list"})(request)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        grupos = Group.objects.all()
        # atribuindo ao usuario permissão administrativa
        self.usuario.groups.add(grupos[8])
        url_mes_ano = f'{url}?mes={"01"}&ano={"2020"}'
        request = self.factory.get(url_mes_ano)
        force_authenticate(request, user=self.usuario)
        response = PlantaoMensalReportView.as_view({"get": "list"})(request)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Teste com parametro faltando do Ano
        url_mes_ano = f'{url}?mes={"01"}'
        request = self.factory.get(url_mes_ano)
        force_authenticate(request, user=self.usuario)
        response = PlantaoMensalReportView.as_view({"get": "list"})(request)
        self.assertEqual(
            response.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR
        )

        # Teste com parametro ok
        url_mes_ano = f'{url}?mes={"12"}&ano={"2023"}'
        request = self.factory.get(url_mes_ano)
        force_authenticate(request, user=self.usuario)
        response = PlantaoMensalReportView.as_view({"get": "list"})(request)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Teste com parametro do mes faltando
        url_mes_ano = f'{url}?ano={"2023"}'
        request = self.factory.get(url_mes_ano)
        force_authenticate(request, user=self.usuario)
        response = PlantaoMensalReportView.as_view({"get": "list"})(request)
        self.assertEqual(
            response.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR
        )
