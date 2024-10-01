from django.core.exceptions import ObjectDoesNotExist
from django.db.utils import IntegrityError
from django.test import TestCase

from common.models import Complemento
from common.tests.factories import ComplementoFactory


class ComplementoTestCase(TestCase):
    def setUp(self):
        self.complemento = ComplementoFactory()

    def test_create(self):
        """Testa a criação de um complemento."""
        self.assertIsNotNone(self.complemento)

    def test_unique_descricao(self):
        """Testa valor único para descricao."""
        with self.assertRaises(IntegrityError):
            ComplementoFactory(descricao=self.complemento.descricao)

    def test_status_valido(self):
        """Testa valor 'ATIVO' para status."""
        self.assertEqual(self.complemento.status, "ATIVO")

    def test_status_invalido(self):
        """Testa valor 'INATIVO' para status."""
        self.complemento.status = "INATIVO"
        self.assertEqual(self.complemento.status, "INATIVO")

    def test_delete(self):
        """Testa se é possível excluir."""
        complemento = ComplementoFactory()
        complemento.delete()
        with self.assertRaises(ObjectDoesNotExist):
            Complemento.objects.get(id=complemento.id)
