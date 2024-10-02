from django.core.exceptions import ObjectDoesNotExist
from django.db.utils import IntegrityError
from django.test import TestCase

from common.models import Tipocaixa
from common.tests.factories import TipoCaixaFactory


class TipocaixaTestCase(TestCase):
    def setUp(self):
        self.tipo_caixa = TipoCaixaFactory()

    def test_create(self):
        """Testa a criação de um caixa valor."""
        self.assertIsNotNone(self.tipo_caixa)

    def test_create_required_fields(self):
        """Testa se os campos obrigatórios foram preenchidos."""
        self.assertIsNotNone(self.tipo_caixa.descricao)

    def test_error_create_without_required_fields(self):
        """Testa erro se os campos obrigatórios não foram preenchidos."""
        with self.assertRaises(IntegrityError):
            TipoCaixaFactory(descricao=None)

    def test_update(self):
        """Testa se é possível editar os campos."""
        caixa = TipoCaixaFactory()
        caixa.descricao = "Descricao do tipo da caixa"

        self.assertEqual(caixa.descricao, "Descricao do tipo da caixa")

    def test_error_create_with_descricao_repeated(self):
        """Testa erro se o campo descricao com valor único for repetido."""
        with self.assertRaises(IntegrityError):
            TipoCaixaFactory(descricao=self.tipo_caixa.descricao)

    def test_delete(self):
        """Testa se é possível excluir."""
        caixa = TipoCaixaFactory()
        caixa.delete()
        with self.assertRaises(ObjectDoesNotExist):
            Tipocaixa.objects.get(id=caixa.id)

    def test_str_method(self):
        """Testa o método __str__ da classe TipoCaixa."""
        tipo_caixa = TipoCaixaFactory()
        assert str(tipo_caixa) == tipo_caixa.descricao
