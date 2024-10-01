from django.core.exceptions import ObjectDoesNotExist
from django.db.utils import IntegrityError
from django.test import TestCase

from common.models import Profissao
from common.tests.factories import ProfissaoFactory


class ProfissaoTestCase(TestCase):
    def setUp(self):
        self.profissao = ProfissaoFactory()

    def test_create_profissao(self):
        """Testa a criação de uma profissão."""
        self.assertIsNotNone(self.profissao)

    def test_profissao_str_representation(self):
        """Testa a representação em string de uma profissão."""
        profissao = ProfissaoFactory(descricao="teste_descrição")
        self.assertEqual(str(profissao.descricao), "teste_descrição")

    def test_profissao_description_str_atualization(self):
        """Testa a atualização em string de uma profissão."""
        profissao = ProfissaoFactory(descricao="outra_profissao")
        self.assertEqual(str(profissao.descricao), "outra_profissao")

    def test_profissao_description_not_null(self):
        """Testa se a descrição da profissão pode ser nula."""
        with self.assertRaises(IntegrityError):
            ProfissaoFactory(descricao=None)

    def test_profissao_search_by_description(self):
        """Testa a busca de uma profissão pela descrição."""
        self.assertIsNotNone(
            Profissao.objects.get(descricao=self.profissao.descricao)
        )

    def test_profissao_can_be_deleted(self):
        """Testa se uma profissao pode ser excluida."""
        profissao = ProfissaoFactory()
        profissao.delete()
        with self.assertRaises(ObjectDoesNotExist):
            Profissao.objects.get(id=profissao.id)

    def test_str_method(self):
        """Testa o método __str__ da classe Profissao."""
        self.assertEqual(str(self.profissao), self.profissao.descricao)
