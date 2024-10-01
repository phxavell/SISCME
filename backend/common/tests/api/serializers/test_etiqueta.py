# pylint: disable=too-many-instance-attributes
import datetime

from django.test import TestCase
from django.urls import reverse

from common.models.legacy import Etiqueta
from common.serializers import EtiquetaSerializer
from common.tests.factories import (
    AutoclavagemFactory,
    ClienteFactory,
    ComplementoFactory,
    EquipamentoFactory,
    ProdutoFactory,
    TermodesinfeccaoFactory,
    UserFactory,
)
from common.views import EtiquetaViewSet
from rest_framework import status
from rest_framework.test import APIRequestFactory


# TODO: Refatorar serializer de etiqueta para passar idprofissional do usuario loagado
# na view invés de acessar o contexto da requisição no serializer.
# - Após refatorar criar respectivos testes de serializer e views, pois por
# conta do cenario acima não esta sendo possivel testar as duas camadas separadas.
class EtiquetaSerializerTestCase(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.usuario = UserFactory()
        self.cliente = ClienteFactory()
        self.complemento = ComplementoFactory()
        self.produto = ProdutoFactory()
        self.autoclave = AutoclavagemFactory()
        self.termodesinfeccao = TermodesinfeccaoFactory()
        self.seladora = EquipamentoFactory()

    def test_nao_autenticado(self):
        """Testa se retorna erro ao não enviar token de autenticação"""
        url = reverse("etiqueta-list")
        request = self.factory.get(url)
        response = EtiquetaViewSet.as_view({"get": "list"})(request)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_payload_valido(self):
        data: dict = {
            "autoclave": self.autoclave.id,
            "biologico": "Nao",
            "datavalidade": datetime.date(2024, 3, 28),
            "termodesinfectora": self.termodesinfeccao.id,
            "qtd": 1,
            "qtdimpressao": 1,
            "seladora": self.seladora.idequipamento,
            "servico": "NÃO",
            "status": "VALIDO",
            "temperatura": 134,
            "tipoetiqueta": "INSUMO",
            "idcli": self.cliente.idcli,
            "idcomplemento": self.complemento.id,
            "idproduto": self.produto.id,
        }

        request = self.factory.post(reverse("etiqueta-list"), data=data)
        request.user = self.usuario
        serializer = EtiquetaSerializer(
            data=data, context={"request": request}
        )
        self.assertTrue(serializer.is_valid(raise_exception=True))

    def test_payload_invalido(self):
        # payload sem id de cliente e produto
        data: dict = {
            "autoclave": self.autoclave.id,
            "biologico": "Nao",
            "datavalidade": datetime.date(2024, 3, 28),
            "termodesinfectora": self.termodesinfeccao.id,
            "qtd": 1,
            "qtdimpressao": 1,
            "seladora": self.seladora.idequipamento,
            "servico": "NÃO",
            "status": "VALIDO",
            "temperatura": 134,
            "tipoetiqueta": "INSUMO",
            "idcomplemento": self.complemento.id,
        }

        request = self.factory.post(reverse("etiqueta-list"), data=data)
        request.user = self.usuario
        serializer = EtiquetaSerializer(
            data=data, context={"request": request}
        )
        self.assertFalse(serializer.is_valid())

    def test_create_etiqueta_instance(self):
        data: dict = {
            "autoclave": self.autoclave.id,
            "biologico": "Nao",
            "datavalidade": datetime.date(2024, 3, 28),
            "termodesinfectora": self.termodesinfeccao.id,
            "qtd": 1,
            "qtdimpressao": 1,
            "seladora": self.seladora.idequipamento,
            "servico": "NÃO",
            "status": "VALIDO",
            "temperatura": 134,
            "tipoetiqueta": "INSUMO",
            "idcli": self.cliente.idcli,
            "idcomplemento": self.complemento.id,
            "idproduto": self.produto.id,
        }

        request = self.factory.post(reverse("etiqueta-list"), data=data)
        request.user = self.usuario
        serializer = EtiquetaSerializer(
            data=data, context={"request": request}
        )
        self.assertTrue(serializer.is_valid(raise_exception=True))
        instance = serializer.save()
        self.assertIsInstance(instance, Etiqueta)
