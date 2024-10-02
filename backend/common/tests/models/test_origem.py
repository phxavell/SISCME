from django.core.exceptions import ObjectDoesNotExist
from django.db.utils import IntegrityError
from django.test import TestCase

from common.models import Origem
from common.tests.factories import OrigemFactory


class OrigemTestCase(TestCase):
    def setUp(self):
        self.origem = OrigemFactory()

    def test_create(self):
        """Testa a criação de uma origem."""
        self.assertIsNotNone(self.origem)

    def test_unique_descricao(self):
        """Testa erro se uma origem for cadastrada com uma descrição existente."""
        with self.assertRaises(IntegrityError):
            origem = OrigemFactory(descricao=self.origem.descricao)
            origem.save()

    def test_update(self):
        """Testa se é possível editar o campo descricao."""
        self.origem.descricao = "Descricao de origem"
        self.origem.save()
        self.assertEqual(self.origem.descricao, "Descricao de origem")

    def test_delete(self):
        """Testa se é possível excluir."""
        origem = OrigemFactory()
        origem.delete()
        with self.assertRaises(ObjectDoesNotExist):
            Origem.objects.get(idorigem=origem.idorigem)

    def test_class_meta(self):
        """Verificar se o nome da tabela do banco de dados
        está configurado corretamente."""
        self.assertEqual(Origem._meta.db_table, "origem")
        self.assertEqual(Origem._meta.verbose_name, "Origem")
        self.assertEqual(Origem._meta.verbose_name_plural, "Origens")
        self.assertEqual(Origem._meta.managed, True)
