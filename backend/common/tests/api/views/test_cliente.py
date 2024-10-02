# pylint: disable=protected-access
from django.test import TestCase
from django.urls import reverse

from common.models import Cliente
from common.tests.factories import (
    ClienteFactory,
    ProfissionalFactory,
    UserFactory,
)
from common.views import ClienteViewSet
from rest_framework import status
from rest_framework.test import APIRequestFactory, force_authenticate


class ClienteViewSetTest(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.user = UserFactory()
        self.user.is_superuser = True
        self.url = reverse("clientes-list")
        self.cliente = ClienteFactory()
        self.cliente_2 = ClienteFactory()
        self.profissional = ProfissionalFactory(cliente=self.cliente_2)
        self.request_data = {
            "inscricaoestadualcli": "123",
            "inscricaomunicipalcli": "321",
            "cnpjcli": "47.137.095/1545-09",
            "cepcli": "86629-423",
            "emailcli": "user@example.com",
            "telefonecli": "(91)5661-1837",
            "bairrocli": "Centro",
            "cidadecli": "Manaus",
            "codigocli": "123654",
            "contatocli": "(55)11523-6132",
            "nomeabreviado": "EP",
            "nomecli": "Empresa",
            "nomefantasiacli": "Empresa Legal",
            "numerocli": "50",
            "ruacli": "Central",
            "ufcli": "AM",
            "ativo": True,
            "datacadastrocli": "2000-10-10",
            "horacadastrocli": "10:10:10",
        }

    def test_user_not_authenticated(self):
        """Testa o acesso negado para usuários não autenticados."""
        request = self.factory.get(self.url)
        response = ClienteViewSet.as_view({"get": "list"})(
            request, pk=self.cliente.pk
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_create_cliente_success(self):
        """Testa a criação do cliente com sucesso."""
        request = self.factory.post(self.url, self.request_data)
        force_authenticate(request, user=self.user)
        response = ClienteViewSet.as_view({"post": "create"})(request)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        cliente_criado = Cliente.objects.get(
            cnpjcli=self.request_data["cnpjcli"]
        )
        self.assertEqual(cliente_criado.nomecli, self.request_data["nomecli"])

    def test_create_cliente_error(self):
        """Testa erro na criação do cliente."""
        data = {"nomecli": self.cliente.nomecli}
        request = self.factory.post(self.url, data)
        force_authenticate(request, user=self.user)
        response = ClienteViewSet.as_view({"post": "create"})(request)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_list_clientes_success(self):
        """Testa a listagem de clientes com sucesso."""
        request = self.factory.get(self.url)
        force_authenticate(request, user=self.user)
        response = ClienteViewSet.as_view({"get": "list"})(request)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_retrieve_cliente_success(self):
        """Testa a conculta de um cliente com sucesso."""
        detail_url = reverse(
            "clientes-detail", kwargs={"pk": self.cliente.idcli}
        )
        request = self.factory.get(detail_url)
        force_authenticate(request, user=self.user)
        response = ClienteViewSet.as_view({"get": "retrieve"})(
            request, pk=self.cliente.pk
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_retrieve_cliente_error(self):
        """Testa erro na conculta de um cliente."""
        detail_url = reverse("clientes-detail", kwargs={"pk": 1000})
        request = self.factory.get(detail_url)
        force_authenticate(request, user=self.user)
        response = ClienteViewSet.as_view({"get": "retrieve"})(
            request, pk=1000
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_update_cliente_success(self):
        """Testa a atualização de um cliente com sucesso."""
        url = reverse("clientes-detail", kwargs={"pk": self.cliente.pk})
        data = {
            "nomecli": "Teste nomecli",
            "nomeabreviado": "teste nome abreviado",
            "nomefantasiacli": "Teste nome fantasia",
        }
        self.cliente._prefetched_objects_cache = {"nomecli": "Teste nomecli"}
        self.cliente.save()
        request = self.factory.patch(url, data)
        force_authenticate(request, user=self.user)
        response = ClienteViewSet.as_view({"patch": "update"})(
            request, pk=self.cliente.pk
        )
        self.cliente._prefetched_objects_cache = None
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            str(Cliente.objects.get(idcli=self.cliente.idcli)),
            data["nomefantasiacli"],
        )

    def test_update_cliente_error(self):
        """Testa erro na atualização de um cliente."""
        url = reverse("clientes-detail", kwargs={"pk": 1000})
        data = {
            "nomecli": "Teste nomecli 2",
            "nomeabreviado": "teste nome abreviado 2",
            "nomefantasiacli": "Teste nome fantasia 2",
        }
        request = self.factory.patch(url, data)
        force_authenticate(request, user=self.user)
        response = ClienteViewSet.as_view({"patch": "update"})(
            request, pk=1000
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_queryset_search(self):
        """Testa a pequisa de um clientes com os parametros:
        nomecli, nomeabreviado e nomefantasiacli."""
        search_nomecli = f'{self.url}?search={"Teste nomecli"}'
        search_nomeabreviado = f'{self.url}?search={"teste nome abreviado"}'
        search_nomefantasiacli = f'{self.url}?search={"Teste nome fantasia"}'
        request = self.factory.get(search_nomecli)
        force_authenticate(request, user=self.user)
        response = ClienteViewSet.as_view({"get": "list"})(request)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        request = self.factory.get(search_nomeabreviado)
        force_authenticate(request, user=self.user)
        response = ClienteViewSet.as_view({"get": "list"})(request)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        request = self.factory.get(search_nomefantasiacli)
        force_authenticate(request, user=self.user)
        response = ClienteViewSet.as_view({"get": "list"})(request)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_destroy_cliente_success(self):
        """Testa a exclusão de um cliente com sucesso."""
        detail_url = reverse("clientes-detail", kwargs={"pk": self.cliente.pk})
        request = self.factory.delete(detail_url)
        force_authenticate(request, user=self.user)
        response = ClienteViewSet.as_view({"delete": "destroy"})(
            request, pk=self.cliente.pk
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_destroy_cliente_error(self):
        """Testa as duas condições de erro ao excluir um cliente:
        Cliente não existe e cliente tem profissional vinculado."""
        # testando exclusão com cliente vinculado a um profissional
        detail_url = reverse(
            "clientes-detail", kwargs={"pk": self.cliente_2.pk}
        )
        request = self.factory.delete(detail_url)
        force_authenticate(request, user=self.user)
        response = ClienteViewSet.as_view({"delete": "destroy"})(
            request, pk=self.cliente_2.pk
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        # testando exclusão com pk inexistente
        detail_url = reverse("clientes-detail", kwargs={"pk": 100})
        request = self.factory.delete(detail_url)
        force_authenticate(request, user=self.user)
        response = ClienteViewSet.as_view({"delete": "destroy"})(
            request, pk=100
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_desativar_cliente_success(self):
        """Testa a desativação de um cliente desativado."""
        self.cliente.ativar()
        self.cliente.save()
        ativar_url = reverse(
            "cliente_desativar", kwargs={"cliente_id": self.cliente.pk}
        )
        request = self.factory.post(ativar_url)
        force_authenticate(request, user=self.user)
        view = ClienteViewSet.as_view({"post": "desativar"})
        response = view(request, cliente_id=self.cliente.pk)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_desativar_cliente_error(self):
        """Testa erro na desativação de um cliente desativado."""
        cliente = ClienteFactory(ativo=False)
        desativar_url = reverse(
            "cliente_desativar", kwargs={"cliente_id": cliente.pk}
        )
        request = self.factory.post(f"{desativar_url}?status=INATIVO")
        force_authenticate(request, user=self.user)
        view = ClienteViewSet.as_view({"post": "desativar"})
        response = view(request, cliente_id=cliente.pk)
        self.assertEqual(response.status_code, status.HTTP_409_CONFLICT)

        desativar_url = reverse(
            "cliente_desativar", kwargs={"cliente_id": 100}
        )
        request = self.factory.post(desativar_url)
        force_authenticate(request, user=self.user)
        view = ClienteViewSet.as_view({"post": "desativar"})
        response = view(request, cliente_id=100)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_ativar_cliente_success(self):
        """Testa ativação de um cliente desativado."""
        self.cliente.desativar()
        self.cliente.save()
        ativar_url = reverse(
            "cliente_ativar", kwargs={"cliente_id": self.cliente.pk}
        )
        request = self.factory.patch(f"{ativar_url}?status=INATIVO")
        force_authenticate(request, user=self.user)
        view = ClienteViewSet.as_view({"patch": "ativar"})
        response = view(request, cliente_id=self.cliente.pk)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_ativar_cliente_error(self):
        """Testa erro ao ativar um cliente já ativo."""
        self.cliente.ativar()
        self.cliente.save()
        ativar_url = reverse(
            "cliente_ativar", kwargs={"cliente_id": self.cliente.pk}
        )
        request = self.factory.patch(ativar_url)
        force_authenticate(request, user=self.user)
        view = ClienteViewSet.as_view({"patch": "ativar"})
        response = view(request, cliente_id=self.cliente.pk)
        self.assertEqual(response.status_code, status.HTTP_409_CONFLICT)

        ativar_url = reverse("cliente_ativar", kwargs={"cliente_id": 100})
        request = self.factory.patch(ativar_url)
        force_authenticate(request, user=self.user)
        view = ClienteViewSet.as_view({"patch": "ativar"})
        response = view(request, cliente_id=100)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
