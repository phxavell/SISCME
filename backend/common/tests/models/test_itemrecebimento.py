from django.db.transaction import TransactionManagementError
from django.db.utils import IntegrityError
from django.test import TestCase

from common.models import Itemrecebimento
from common.tests.factories import ItemrecebimentoFactory


class ItemrecebimentoTestCase(TestCase):
    def setUp(self):
        self.item_recebimento = ItemrecebimentoFactory()

    def test_create(self):
        """Testa a criação de um item recebimento."""
        self.assertIsNotNone(self.item_recebimento)

    def test_item_recebimento_required_fields(self):
        """Testa erro caso algum campo obrigatório seja nulo."""
        with self.assertRaises(IntegrityError):
            ItemrecebimentoFactory(quantidade=None)
        with self.assertRaises(TransactionManagementError):
            ItemrecebimentoFactory(iditemcaixa=None)
        with self.assertRaises(TransactionManagementError):
            ItemrecebimentoFactory(idsequenciaetiqueta=None)
        with self.assertRaises(TransactionManagementError):
            ItemrecebimentoFactory(idrecebimento=None)

    def test_association_foreignkey_itemcaixa(self):
        """Testa se o campo iditemcaixa foi relacionado corretamente ao
        model ItemCaixa."""
        self.assertEqual(
            self.item_recebimento.iditemcaixa.__class__.__name__, "Itemcaixa"
        )

    def test_association_foreignkey_recebimento(self):
        """Testa se o campo idrecebimento foi relacionado corretamente ao
        model Recebimento."""
        self.assertEqual(
            self.item_recebimento.idrecebimento.__class__.__name__,
            "Recebimento",
        )

    def test_association_foreignkey_sequenciaetiqueta(self):
        """Testa se o campo idsequenciaetiqueta foi relacionado corretamente ao
        model Sequenciaetiqueta."""
        self.assertEqual(
            self.item_recebimento.idsequenciaetiqueta.__class__.__name__,
            "Sequenciaetiqueta",
        )

    def test_delete(self):
        """Testa a exclusão de um itemrecebimento."""
        self.item_recebimento.delete()
        self.assertIsNone(self.item_recebimento.pk)

    def test_class_meta(self):
        """Verificar se os nomes da tabela do banco de dados
        está configurado corretamente."""
        self.assertEqual(Itemrecebimento._meta.db_table, "itemrecebimento")
        self.assertEqual(
            Itemrecebimento._meta.verbose_name, "Item de Recebimento"
        )
        self.assertEqual(
            Itemrecebimento._meta.verbose_name_plural, "Itens de Recebimento"
        )
        self.assertEqual(Itemrecebimento._meta.managed, True)
