from django.core.exceptions import ObjectDoesNotExist
from django.db.utils import IntegrityError
from django.test import TestCase

from common.models import Lote
from common.tests.factories import LoteFactory


class LoteTestCase(TestCase):
    def setUp(self):
        self.lote = LoteFactory()

    def test_create_lote(self):
        """Testa a criação de um Lote."""
        self.lote = LoteFactory()
        self.assertIsNotNone(self.lote)

    def test_lote_str_representation(self):
        """Testa a representação em string de um lote."""
        lote = LoteFactory(codigo="teste_codigo")
        self.assertEqual(str(lote.codigo), "teste_codigo")

    def test_lote_desciption_str_atualization(self):
        """Testa a representação em string de um lote."""
        lote = LoteFactory(codigo="outro_codigo")
        self.assertEqual(str(lote.codigo), "outro_codigo")

    def test_lote_description_not_null(self):
        """Testa se a descrição do lote pode ser nulo."""
        with self.assertRaises(IntegrityError):
            LoteFactory(codigo=None)

    def test_lote_search_by_description(self):
        """Testa a busca de um lote pela descrição."""
        self.assertIsNotNone(Lote.objects.get(codigo=self.lote.codigo))

    def test_lote_can_be_deleted(self):
        """Testa se um lote pode ser excluído."""
        lote = LoteFactory()
        lote.delete()
        with self.assertRaises(ObjectDoesNotExist):
            Lote.objects.get(id=lote.id)
