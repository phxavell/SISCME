# pylint: disable=too-many-public-methods

from django.core.exceptions import ObjectDoesNotExist, ValidationError
from django.db.utils import IntegrityError
from django.test import TestCase

import factory
from common.models import Cliente
from common.tests.factories import (
    CaixaFactory,
    ClienteFactory,
    ProfissionalFactory,
)


class ClienteTestCase(TestCase):
    def setUp(self):
        self.cliente = ClienteFactory()
        self.profissional = ProfissionalFactory(cliente=self.cliente)
        self.caixa = CaixaFactory(cliente=self.cliente)

    def test_create(self):
        """Testa a criação de um cliente."""
        self.assertIsNotNone(self.cliente)

    def test_create_with_idcli_exist(self):
        """Testa erro ao tentar cadastrar um cliente com id existente."""
        cliente1 = ClienteFactory()
        with self.assertRaises(IntegrityError):
            cliente1.idcli = self.cliente.idcli
            cliente1.save()

    def test_create_required_fields(self):
        """Testa se os campos obrigatórios foram preenchidos."""
        self.assertIsNotNone(self.cliente.datacadastrocli)
        self.assertIsNotNone(self.cliente.horacadastrocli)
        self.assertIsNotNone(self.cliente.nomeabreviado)
        self.assertIsNotNone(self.cliente.nomecli)

    def test_error_create_without_required_fields(self):
        """Testa erro se os campos obrigatórios não foram preenchidos."""
        with self.assertRaises(IntegrityError):
            ClienteFactory(
                datacadastrocli=None,
                horacadastrocli=None,
                nomeabreviado=None,
                nomecli=None,
            )

    def test_successs_create_without_optional_fields(self):
        """Testa a criacao com sucesso se os campos
        obrigatórios não foram preenchidos."""
        cliente = ClienteFactory(
            bairrocli=None,
            cepcli=None,
            cidadecli=None,
            cnpjcli=None,
            codigocli=None,
            contatocli=None,
            emailcli=None,
            inscricaoestadualcli=None,
            inscricaomunicipalcli=None,
            nomefantasiacli=None,
            numerocli=None,
            ruacli=None,
            telefonecli=None,
            ufcli=None,
            ativo=None,
            foto=None,
        )
        self.assertIsNotNone(cliente)

    def test_unique_nomecli_constraint(self):
        """Testa erro ao criar cliente com o mesmo nome."""
        with self.assertRaises(IntegrityError):
            ClienteFactory(nomecli=self.cliente.nomecli)

    def test_unique_nomeabreviado_constraint(self):
        """Testa erro ao criar cliente com o mesmo nome abreviado."""
        with self.assertRaises(IntegrityError):
            ClienteFactory(nomeabreviado=self.cliente.nomeabreviado)

    def test_invalid_format_foto(self):
        """Testa erro ao enviar um arquivo errado para foto."""
        cliente = ClienteFactory(
            foto=factory.Faker("file_name", extension="gif")
        )
        with self.assertRaises(ValidationError):
            cliente.full_clean()

    def test_valid_format_foto(self):
        """Testa sucesso ao enviar um arquivo correto para foto."""
        cliente1 = ClienteFactory(
            foto=factory.Faker("file_name", extension="png")
        )
        cliente2 = ClienteFactory(
            foto=factory.Faker("file_name", extension="jpg")
        )
        cliente3 = ClienteFactory(
            foto=factory.Faker("file_name", extension="jpeg")
        )
        self.assertIsNotNone(cliente1)
        self.assertIsNotNone(cliente2)
        self.assertIsNotNone(cliente3)

    def test_str_representation(self):
        """Testa representação em str da instancia."""
        self.assertEqual(str(self.cliente), self.cliente.nomefantasiacli)

    def test_representation_instance(self):
        """Testa representação da instancia."""
        self.assertEqual(repr(self.cliente), self.cliente.nomefantasiacli)

    def test_nome_exibicao_representation_instance(self):
        """Testa representação da instancia."""
        self.assertEqual(
            self.cliente.nome_exibicao, self.cliente.nomefantasiacli
        )

    def test_usuario_cliente(self):
        """Testa se o usuário foi adicionado corretamente ao cliente."""
        self.assertEqual(self.profissional.cliente, self.cliente)

    def test_desativar_cliente(self):
        """Testa a ação de desativar o cliente."""
        self.cliente.desativar()
        self.assertEqual(self.cliente.ativo, False)

    def test_ativar_cliente(self):
        """Testa a ação de ativar o cliente."""
        self.cliente.ativar()
        self.assertEqual(self.cliente.ativo, True)

    def test_update_cliente(self):
        """Testa a ação de editar o cliente."""
        self.cliente.nomeabreviado = "Hospital CD"
        self.cliente.nomecli = "Hospital Geral Chales Darwin"
        self.cliente.bairrocli = "Chapada"
        self.cliente.cepcli = "98756-123"
        self.cliente.cidadecli = "Manaus"
        self.cliente.cnpjcli = "93.376.819/0001-39"
        self.cliente.codigocli = "123456789"
        self.cliente.contatocli = "(92) 3654-4569"
        self.cliente.email = "charles@darwin.com"
        self.cliente.inscricaoestadualcli = "123654789"
        self.cliente.inscricaomunicipalcli = "987654321"
        self.cliente.nomefantasiacli = "HGCD"
        self.cliente.numerocli = "98745"
        self.cliente.ruacli = "Central"
        self.cliente.telefonecli = "(92) 98789-9887"
        self.cliente.ufcli = "AM"
        self.cliente.foto = factory.Faker("file_name", extension="png")

        self.assertIsNotNone(self.cliente)

    def test_caixas_relation(self):
        """Testa a relação de caixa com cliente."""
        self.assertEqual(self.caixa.cliente, self.cliente)

    def test_delete(self):
        """Testa se é possível excluir um cliente."""
        cliente = ClienteFactory()
        cliente.delete()
        with self.assertRaises(ObjectDoesNotExist):
            Cliente.objects.get(idcli=cliente.idcli)

    def test_caixas_relation_cliente(self):
        """Testa a função de Sequencia de etiquetas de caixa na modal Cliente."""
        self.assertEqual(self.cliente.caixas.count(), 0)

    def test_modelo_caixa_relation_cliente(self):
        """Testa a relação de caixa com cliente na modal Cliente."""
        self.assertEqual(self.cliente.modelos_caixa.count(), 1)
