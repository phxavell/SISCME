from django.core.exceptions import ObjectDoesNotExist
from django.db.transaction import TransactionManagementError
from django.db.utils import IntegrityError
from django.test import TestCase

from common.models import Itemcaixa
from common.tests.factories import ItemCaixaFactory, ItemrecebimentoFactory


class ItemCaixaTestCase(TestCase):
    def setUp(self):
        self.item_caixa = ItemCaixaFactory()
        self.item_recebimento = ItemrecebimentoFactory(
            iditemcaixa=self.item_caixa
        )

    def test_create(self):
        """Testa a criação de uma caixa."""
        self.assertIsNotNone(self.item_caixa)

    def test_create_required_fields(self):
        """Testa se os campos obrigatórios foram preenchidos."""
        self.assertIsNotNone(self.item_caixa.criticidade)
        self.assertIsNotNone(self.item_caixa.quantidade)
        self.assertIsNotNone(self.item_caixa.valor_unitario)
        self.assertIsNotNone(self.item_caixa.caixa)
        self.assertIsNotNone(self.item_caixa.produto)

    def test_error_create_without_required_fields(self):
        """Testa erro se os campos obrigatórios não foram preenchidos."""
        with self.assertRaises(IntegrityError):
            itemcaxa = Itemcaixa(criticidade=None)
            itemcaxa.save()
        with self.assertRaises(TransactionManagementError):
            itemcaxa = Itemcaixa(quantidade=None)
            itemcaxa.save()

        with self.assertRaises(TransactionManagementError):
            itemcaxa = Itemcaixa(valor_unitario=None)
            itemcaxa.save()
        with self.assertRaises(TransactionManagementError):
            itemcaxa = Itemcaixa(caixa=None)
            itemcaxa.save()
        with self.assertRaises(TransactionManagementError):
            itemcaxa = Itemcaixa(produto=None)
            itemcaxa.save()

    def test_association_foreignkeys(self):
        """Testa se os campos FK foi relacionado corretamente aos
        seus respectivos models."""
        self.assertEqual(self.item_caixa.caixa.__class__.__name__, "Caixa")
        self.assertEqual(self.item_caixa.produto.__class__.__name__, "Produto")

    def test_choice_criticidade_value(self):
        """Testa erro ao escolher um valor de criticidade
        dentre os definidos."""
        criticidade = [choice[0] for choice in Itemcaixa.Criticidade.choices]
        self.assertIn(self.item_caixa.criticidade, criticidade)

    def test_delete(self):
        """Testa se é possível excluir."""
        item_caixa_1 = ItemCaixaFactory()
        item_caixa_2 = ItemCaixaFactory()
        item_recebimento = ItemrecebimentoFactory(iditemcaixa=item_caixa_2)
        with self.assertRaises(ObjectDoesNotExist):
            item_caixa_1.delete()
            Itemcaixa.objects.get(id=item_caixa_1.id)
        item_caixa_2.delete()
        with self.assertRaises(ObjectDoesNotExist):
            item_caixa_2.delete()
            item_recebimento.delete()
            Itemcaixa.objects.get(id=item_caixa_2.id)


class ItemcaixaManagerTesCase(TestCase):
    def test_manager_default_queryset(self):
        """Testa se o manager exclui itens marcados como deletados por padrão."""
        deleted_item = ItemCaixaFactory(deleted=True)
        self.assertNotIn(deleted_item, Itemcaixa.objects.all())

    def test_delete_manager(self):
        """Testa se o manager exclui corretamente todos os itens."""
        item_caixa1 = ItemCaixaFactory()
        Itemcaixa.objects.delete()
        with self.assertRaises(Itemcaixa.DoesNotExist):
            Itemcaixa.objects.get(id=item_caixa1.id)
