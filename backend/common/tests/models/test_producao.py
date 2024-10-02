import re

from django.core.exceptions import ObjectDoesNotExist
from django.db.utils import IntegrityError
from django.test import TestCase

from common.models import Producao
from common.tests.factories import ProducaoFactory, UsuarioFactory


class ProducaoTestCase(TestCase):
    def setUp(self):
        self.producao = ProducaoFactory()

    def test_create_producao(self):
        """Testa a criação de uma producao."""
        self.assertIsNotNone(self.producao)

    def test_create_required_fields(self):
        """Testa se os campos obrigatórios foram preenchidos."""
        self.assertIsNotNone(self.producao.id)
        self.assertIsNotNone(self.producao.dataproducao)
        self.assertIsNotNone(self.producao.datavalidade)
        self.assertIsNotNone(self.producao.statusproducao)
        self.assertIsNotNone(self.producao.idusu)

    def test_error_create_without_required_fields(self):
        """Testa erro se os campos obrigatórios não foram preenchidos."""
        with self.assertRaises(IntegrityError):
            ProducaoFactory(
                id=None,
                dataproducao=None,
                datavalidade=None,
                statusproducao=None,
                idusu=None,
            )

    def test_create_optional_fields(self):
        """Testa se os campos opcionais foram preenchidos."""
        self.producao.datacancelamento = "2023-01-01"
        self.assertIsNotNone(self.producao.cautela)
        self.assertIsNotNone(self.producao.observacao)
        self.assertIsNotNone(self.producao.datacancelamento)

    def test_success_create_without_optional_fields(self):
        """Testa sucesso se os campos opcionais não foram preenchidos."""
        producao = ProducaoFactory(
            cautela=None,
            observacao=None,
            datacancelamento=None,
        )
        self.assertIsNotNone(producao)

    def test_association_foreignkey_usuario(self):
        """Testa se o campo idsu foi relacionado corretamente ao Usuario."""
        self.assertEqual(self.producao.idusu.__class__.__name__, "Usuario")

    def test_format_date(self):
        """Testa o formato correto das datas informadas."""
        self.producao.datacancelamento = "2023-01-01"
        self.assertTrue(
            re.match(r"\d{4}-\d{2}-\d{2}", str(self.producao.dataproducao))
        )
        self.assertTrue(
            re.match(r"\d{4}-\d{2}-\d{2}", str(self.producao.datacancelamento))
        )

    def test_update(self):
        usuario = UsuarioFactory()
        self.producao.cautela = 123
        self.producao.datacancelamento = "2022-02-02"
        self.producao.dataproducao = "2023-03-03"
        self.producao.datavalidade = "2024-04-04"
        self.producao.observacao = "Observação da produção"
        self.producao.statusproducao = "Status da produção"
        self.producao.idusu = usuario

        self.assertEqual(self.producao.cautela, 123)
        self.assertEqual(self.producao.datacancelamento, "2022-02-02")
        self.assertEqual(self.producao.dataproducao, "2023-03-03")
        self.assertEqual(self.producao.datavalidade, "2024-04-04")
        self.assertEqual(self.producao.observacao, "Observação da produção")
        self.assertEqual(self.producao.statusproducao, "Status da produção")
        self.assertEqual(self.producao.idusu, usuario)

    def test_delete(self):
        producao = ProducaoFactory()
        producao.delete()
        with self.assertRaises(ObjectDoesNotExist):
            Producao.objects.get(id=producao.id)
