from django.test import TestCase
from django.urls import reverse

from common.models import Produto
from common.tests.factories import (
    ProdutoFactory,
    SubtipoprodutoFactory,
    TipopacoteFactory,
    UserFactory,
)
from common.views import ProdutoViewSet
from rest_framework import status
from rest_framework.test import APIRequestFactory, force_authenticate


class ProdutoViewSetTest(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.user = UserFactory()
        self.user.is_superuser = True
        self.url = reverse("Produto-list")
        self.subtipoproduto = SubtipoprodutoFactory()
        self.tipopacote = TipopacoteFactory()
        self.produto = ProdutoFactory(
            idsubtipoproduto=self.subtipoproduto, idtipopacote=self.tipopacote
        )
        self.request_data = {
            "descricao": "Produto 1",
            "dtcadastro": "2000-01-01",
            "embalagem": "A",
            "status": "ATIVO",
            "idsubtipoproduto": self.subtipoproduto.pk,
            "idtipopacote": self.tipopacote.pk,
        }

    def test_user_not_authenticated(self):
        """Testa o acesso negado para usuários não autenticados."""
        request = self.factory.get(self.url)
        response = ProdutoViewSet.as_view({"get": "list"})(
            request, pk=self.produto.pk
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_create_produto_success(self):
        """Testa a criação do produto com sucesso."""
        request = self.factory.post(self.url, self.request_data)
        force_authenticate(request, user=self.user)
        response = ProdutoViewSet.as_view({"post": "create"})(request)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        produto_criado = Produto.objects.get(
            descricao=str(self.request_data["descricao"]).upper()
        )
        self.assertEqual(produto_criado.descricao, "PRODUTO 1")

    def test_create_produto_error(self):
        """Testa erro na criação do produto com descrição já existente."""
        data = {"descricao": self.produto.descricao}
        request = self.factory.post(self.url, data)
        force_authenticate(request, user=self.user)
        response = ProdutoViewSet.as_view({"post": "create"})(request)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_list_produto_success(self):
        """Testa a listagem de produto com sucesso."""
        request = self.factory.get(self.url)
        force_authenticate(request, user=self.user)
        response = ProdutoViewSet.as_view({"get": "list"})(request)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_retrieve_produto_success(self):
        """Testa a conculta de um produto com sucesso."""
        detail_url = reverse("Produto-detail", kwargs={"pk": self.produto.pk})
        request = self.factory.get(detail_url)
        force_authenticate(request, user=self.user)
        response = ProdutoViewSet.as_view({"get": "retrieve"})(
            request, pk=self.produto.pk
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_retrieve_produto_error(self):
        """Testa erro na conculta de um produto."""
        detail_url = reverse("Produto-detail", kwargs={"pk": 1000})
        request = self.factory.get(detail_url)
        force_authenticate(request, user=self.user)
        response = ProdutoViewSet.as_view({"get": "retrieve"})(
            request, pk=1000
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_update_produto_success(self):
        """Testa a atualização de um produto com sucesso."""
        url = reverse("Produto-detail", kwargs={"pk": self.produto.pk})
        data = {"descricao": "Nova descricao"}
        request = self.factory.patch(url, data)
        force_authenticate(request, user=self.user)
        response = ProdutoViewSet.as_view({"patch": "partial_update"})(
            request, pk=self.produto.pk
        )
        produto_att = Produto.objects.get(pk=self.produto.pk)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            produto_att.descricao,
            str(data["descricao"]).upper(),
        )

    def test_update_produto_error(self):
        """Testa erro na atualização de um produto: produto nao encontrado."""
        url = reverse("Produto-detail", kwargs={"pk": 1000})
        data = {"descricao": "Outra descricao"}
        request = self.factory.patch(url, data)
        force_authenticate(request, user=self.user)
        response = ProdutoViewSet.as_view({"patch": "update"})(
            request, pk=1000
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

        # testa erro de descricao unica
        url = reverse("Produto-detail", kwargs={"pk": self.produto.pk})
        data = {"descricao": "Nova descricao"}
        request = self.factory.patch(url, data)
        force_authenticate(request, user=self.user)
        response = ProdutoViewSet.as_view({"patch": "update"})(
            request, pk=self.produto.pk
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_destroy_produto_success(self):
        """Testa a exclusão de um produto com sucesso."""
        detail_url = reverse("Produto-detail", kwargs={"pk": self.produto.pk})
        request = self.factory.delete(detail_url)
        force_authenticate(request, user=self.user)
        response = ProdutoViewSet.as_view({"delete": "destroy"})(
            request, pk=self.produto.pk
        )
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_destroy_produto_error(self):
        """Testa de erro ao excluir um produto que não existe."""
        detail_url = reverse("Produto-detail", kwargs={"pk": 100})
        request = self.factory.delete(detail_url)
        force_authenticate(request, user=self.user)
        response = ProdutoViewSet.as_view({"delete": "destroy"})(
            request, pk=100
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_search_filter(self):
        """Testa a pesquisa de um produto por descricao, embalagem,
        subtipo e tipo."""

        filter_descricao = f"{self.url}?descricao={self.produto.descricao}"
        filter_embalagem = f"{self.url}?embalagem={self.produto.embalagem}"
        filter_subtipo = f"{self.url}?subtipo={self.subtipoproduto.descricao}"
        filter_tipo = f"{self.url}?tipo={self.tipopacote.descricao}"

        request = self.factory.get(filter_descricao)
        force_authenticate(request, user=self.user)
        response = ProdutoViewSet.as_view({"get": "list"})(request)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data["data"][0]["descricao"], self.produto.descricao
        )

        request = self.factory.get(filter_embalagem)
        force_authenticate(request, user=self.user)
        response = ProdutoViewSet.as_view({"get": "list"})(request)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data["data"][0]["embalagem"], self.produto.embalagem
        )

        request = self.factory.get(filter_subtipo)
        force_authenticate(request, user=self.user)
        response = ProdutoViewSet.as_view({"get": "list"})(request)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data["data"][0]["idsubtipoproduto"]["descricao"],
            self.subtipoproduto.descricao,
        )

        request = self.factory.get(filter_tipo)
        force_authenticate(request, user=self.user)
        response = ProdutoViewSet.as_view({"get": "list"})(request)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data["data"][0]["idtipopacote"]["descricao"],
            self.tipopacote.descricao,
        )
