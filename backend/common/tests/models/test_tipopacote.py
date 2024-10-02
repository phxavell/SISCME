from django.db.utils import IntegrityError
from django.test import TestCase

from common.tests.factories import TipopacoteFactory


class TipopacoteTestCase(TestCase):
    def test_criar_tipopacote(self):
        subtipo = TipopacoteFactory()

        atributos = [
            "descricao",
            "dtcadastro",
            "situacao",
        ]

        for atributo in atributos:
            with self.subTest(atributo=atributo):
                self.assertIsNotNone(getattr(subtipo, atributo))

    def test_tipopacote_descricao_unica(self):
        descricao = "Descrição Única"
        TipopacoteFactory(descricao=descricao)

        with self.assertRaises(IntegrityError):
            TipopacoteFactory(descricao=descricao)

    def test_situacao_default_value(self):
        tipopacote = TipopacoteFactory()
        self.assertTrue(tipopacote.situacao)
