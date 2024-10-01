from django.core.exceptions import ObjectDoesNotExist
from django.db.utils import IntegrityError
from django.test import TestCase

from common.models import Caixavalor
from common.tests.factories import CaixaValorFactory


class CaixaValorTestCase(TestCase):
    def setUp(self):
        self.caixa_valor = CaixaValorFactory()

    def test_create_profissional(self):
        """Testa a criação de um caixa valor."""
        self.assertIsNotNone(self.caixa_valor)

    def test_create_required_fields(self):
        """Testa se os campos obrigatórios foram preenchidos."""
        self.assertIsNotNone(self.caixa_valor.descricao)
        self.assertIsNotNone(self.caixa_valor.valorcaixa)

    def test_error_create_without_required_fields(self):
        """Testa erro se os campos obrigatórios não foram preenchidos."""
        with self.assertRaises(IntegrityError):
            CaixaValorFactory(
                descricao=None,
                valorcaixa=None,
            )

    def test_update(self):
        """Testa se é possível editar os campos"""
        caixa = CaixaValorFactory()
        caixa.descricao = "Descricao do valor da caixa"
        caixa.valorcaixa = 10.123

        self.assertEqual(caixa.descricao, "Descricao do valor da caixa")
        self.assertEqual(caixa.valorcaixa, 10.123)

    def test_delete(self):
        """Teste se é possível excluir"""
        caixa = CaixaValorFactory()
        caixa.delete()
        with self.assertRaises(ObjectDoesNotExist):
            Caixavalor.objects.get(id=caixa.id)

    def test_str_representation(self):
        """Testa a representação em string."""
        self.assertEqual(str(self.caixa_valor), self.caixa_valor.descricao)
