from django.db.utils import IntegrityError
from django.test import TestCase

from common.tests.factories import SubtipoprodutoFactory


class SubtipoprodutoTestCase(TestCase):
    def test_criar_subtipo(self):
        subtipo = SubtipoprodutoFactory()

        atributos = [
            "descricao",
            "dtcadastro",
            "situacao",
        ]

        for atributo in atributos:
            with self.subTest(atributo=atributo):
                self.assertIsNotNone(getattr(subtipo, atributo))

    def test_subtipoproduto_descricao_unica(self):
        descricao = "Descrição Única"
        SubtipoprodutoFactory(descricao=descricao)

        with self.assertRaises(IntegrityError):
            SubtipoprodutoFactory(descricao=descricao)

    def test_dtcadastro_nao_nulo(self):
        with self.assertRaises(Exception):
            SubtipoprodutoFactory(dtcadastro=None)
